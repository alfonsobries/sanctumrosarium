package expo.modules.rosaryplayer

import android.content.ComponentName
import android.content.Context
import android.net.Uri
import android.os.Handler
import android.os.Looper
import androidx.annotation.OptIn
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.common.ForwardingPlayer
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import androidx.media3.common.PlaybackException
import androidx.media3.common.PlaybackParameters
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.common.util.Util
import androidx.media3.datasource.DefaultDataSource
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.source.ConcatenatingMediaSource2
import androidx.media3.exoplayer.source.MediaSource
import androidx.media3.exoplayer.source.ProgressiveMediaSource
import androidx.media3.exoplayer.source.SilenceMediaSource
import androidx.media3.session.MediaController
import androidx.media3.session.SessionToken
import com.google.common.util.concurrent.ListenableFuture

data class RosaryPart(val uri: String, val gapAfterMs: Long, val durationMs: Long = 0)

data class RosaryStep(val id: String, val title: String, val subtitle: String?, val parts: List<RosaryPart>)

data class RosaryNowPlaying(val album: String, val artist: String, val artworkUri: String?)

data class RosaryPlaybackState(val index: Int, val status: String, val positionMs: Long, val durationMs: Long)

interface RosaryPlayerListener {
  fun onStepChange(index: Int, id: String)
  fun onStatusChange(status: String, reason: String?)
  fun onProgress(index: Int, positionMs: Long, durationMs: Long)
  fun onError(message: String)
}

// Process-wide owner of the ExoPlayer. The playback service and the JS bridge
// both talk to it, so tearing down the activity or the JS runtime never stops
// playback. Every method must run on the main thread.
@OptIn(UnstableApi::class)
object RosaryPlayerEngine {
  const val MIN_RATE = 0.5f
  const val MAX_RATE = 2f
  private const val PROGRESS_INTERVAL_MS = 250L
  private const val UNKNOWN_PART_MS = 1_000L

  var listener: RosaryPlayerListener? = null

  var progressEnabled = false
    set(value) {
      field = value
      updateProgressTicker()
    }

  private var player: ExoPlayer? = null
  private var sessionPlayer: Player? = null
  private var steps: List<RosaryStep> = emptyList()
  private var status = "idle"
  private var pendingReason: String? = null
  private var hasBeenReady = false
  private var lastStepIndex = -1
  private var controllerFuture: ListenableFuture<MediaController>? = null
  private val handler = Handler(Looper.getMainLooper())

  private val progressTicker = object : Runnable {
    override fun run() {
      val current = player ?: return
      if (!progressEnabled || !current.isPlaying) {
        return
      }
      listener?.onProgress(current.currentMediaItemIndex, current.currentPosition, durationOf(current))
      handler.postDelayed(this, PROGRESS_INTERVAL_MS)
    }
  }

  private val playerListener = object : Player.Listener {
    override fun onPlayWhenReadyChanged(playWhenReady: Boolean, reason: Int) {
      when (reason) {
        Player.PLAY_WHEN_READY_CHANGE_REASON_AUDIO_FOCUS_LOSS -> pendingReason = "interruption"
        Player.PLAY_WHEN_READY_CHANGE_REASON_AUDIO_BECOMING_NOISY -> pendingReason = "route"
        Player.PLAY_WHEN_READY_CHANGE_REASON_END_OF_MEDIA_ITEM -> pendingReason = "ended"
        Player.PLAY_WHEN_READY_CHANGE_REASON_REMOTE -> pendingReason = "remote"
        else -> Unit
      }
    }

    override fun onPlaybackSuppressionReasonChanged(playbackSuppressionReason: Int) {
      pendingReason = "interruption"
    }

    override fun onPlaybackStateChanged(playbackState: Int) {
      if (playbackState == Player.STATE_READY) {
        hasBeenReady = true
      }
      if (playbackState == Player.STATE_ENDED) {
        pendingReason = "ended"
      }
    }

    override fun onMediaItemTransition(mediaItem: MediaItem?, reason: Int) {
      emitStepChangeIfNeeded()
    }

    override fun onIsPlayingChanged(isPlaying: Boolean) {
      updateProgressTicker()
    }

    override fun onPlayerError(error: PlaybackException) {
      pendingReason = "error"
      listener?.onError(error.message ?: error.errorCodeName)
    }

    override fun onEvents(player: Player, events: Player.Events) {
      updateStatus()
    }
  }

  fun ensurePlayer(context: Context): ExoPlayer {
    player?.let { return it }
    val audioAttributes = AudioAttributes.Builder()
      .setUsage(C.USAGE_MEDIA)
      .setContentType(C.AUDIO_CONTENT_TYPE_SPEECH)
      .build()
    val created = ExoPlayer.Builder(context.applicationContext)
      .setAudioAttributes(audioAttributes, true)
      .setHandleAudioBecomingNoisy(true)
      .setWakeMode(C.WAKE_MODE_LOCAL)
      .build()
    created.addListener(playerListener)
    player = created
    return created
  }

  // What the media session exposes: transport commands from the notification,
  // lock screen and headphones go through the same paths as the app, and
  // previous/next always move a whole step.
  fun sessionPlayer(context: Context): Player {
    sessionPlayer?.let { return it }
    val wrapped = object : ForwardingPlayer(ensurePlayer(context)) {
      override fun play() = this@RosaryPlayerEngine.play("remote")
      override fun pause() = this@RosaryPlayerEngine.pause("remote")
      override fun seekToNext() = this@RosaryPlayerEngine.next("remote")
      override fun seekToNextMediaItem() = this@RosaryPlayerEngine.next("remote")
      override fun seekToPrevious() = this@RosaryPlayerEngine.previous("remote")
      override fun seekToPreviousMediaItem() = this@RosaryPlayerEngine.previous("remote")
    }
    sessionPlayer = wrapped
    return wrapped
  }

  fun load(context: Context, newSteps: List<RosaryStep>, startIndex: Int, rate: Float, nowPlaying: RosaryNowPlaying) {
    require(newSteps.isNotEmpty()) { "The queue has no steps" }
    newSteps.firstOrNull { it.parts.isEmpty() }?.let { throw IllegalArgumentException("Step ${it.id} has no parts") }

    val current = ensurePlayer(context)
    connectService(context)

    steps = newSteps
    hasBeenReady = false
    lastStepIndex = -1
    pendingReason = null
    status = "idle"

    val factory = ProgressiveMediaSource.Factory(DefaultDataSource.Factory(context.applicationContext))
    val sources = newSteps.map { buildStepSource(it, nowPlaying, factory) }
    val start = startIndex.coerceIn(0, newSteps.size - 1)

    current.playWhenReady = false
    current.setMediaSources(sources, start, 0)
    current.playbackParameters = PlaybackParameters(clampRate(rate))
    current.prepare()
    emitStepChangeIfNeeded()
    updateStatus()
  }

  fun play(reason: String = "user") {
    val current = player ?: return
    if (current.mediaItemCount == 0) {
      return
    }
    pendingReason = reason
    when (current.playbackState) {
      Player.STATE_IDLE -> current.prepare()
      Player.STATE_ENDED -> current.seekTo(current.currentMediaItemIndex, 0)
      else -> Unit
    }
    // Still flagged to play but suppressed by a focus loss: dropping and
    // re-raising the flag makes ExoPlayer request audio focus again.
    if (current.playWhenReady && current.playbackSuppressionReason != Player.PLAYBACK_SUPPRESSION_REASON_NONE) {
      current.pause()
    }
    current.play()
    updateStatus()
  }

  fun pause(reason: String = "user") {
    val current = player ?: return
    pendingReason = reason
    current.pause()
    updateStatus()
  }

  // Decides from the player itself, never from the bridge's last known state.
  fun toggle(reason: String = "user") {
    val current = player ?: return
    val audible = current.isPlaying ||
      (current.playWhenReady &&
        current.playbackSuppressionReason == Player.PLAYBACK_SUPPRESSION_REASON_NONE &&
        current.playbackState == Player.STATE_BUFFERING)
    if (audible) {
      pause(reason)
    } else {
      play(reason)
    }
  }

  fun skipTo(index: Int, reason: String = "user") {
    val current = player ?: return
    if (index !in 0 until current.mediaItemCount) {
      return
    }
    pendingReason = reason
    current.seekTo(index, 0)
    emitStepChangeIfNeeded()
  }

  fun next(reason: String = "user") {
    val current = player ?: return
    if (current.hasNextMediaItem()) {
      skipTo(current.nextMediaItemIndex, reason)
    }
  }

  fun previous(reason: String = "user") {
    val current = player ?: return
    skipTo(if (current.hasPreviousMediaItem()) current.previousMediaItemIndex else current.currentMediaItemIndex, reason)
  }

  fun setRate(rate: Float) {
    player?.playbackParameters = PlaybackParameters(clampRate(rate))
  }

  fun unload(context: Context) {
    player?.let {
      it.stop()
      it.clearMediaItems()
    }
    steps = emptyList()
    hasBeenReady = false
    lastStepIndex = -1
    pendingReason = null
    controllerFuture?.let { MediaController.releaseFuture(it) }
    controllerFuture = null
    context.stopService(android.content.Intent(context, RosaryPlaybackService::class.java))
    updateStatus()
  }

  fun state(): RosaryPlaybackState {
    val current = player ?: return RosaryPlaybackState(0, status, 0, 0)
    return RosaryPlaybackState(
      index = current.currentMediaItemIndex,
      status = status,
      positionMs = current.currentPosition,
      durationMs = durationOf(current)
    )
  }

  private fun isSuppressedByFocusLoss(current: Player): Boolean {
    return current.playWhenReady &&
      current.playbackSuppressionReason == Player.PLAYBACK_SUPPRESSION_REASON_TRANSIENT_AUDIO_FOCUS_LOSS
  }

  // A bound controller creates the service; Media3 then promotes it to the
  // foreground while the player plays.
  private fun connectService(context: Context) {
    if (controllerFuture != null) {
      return
    }
    val token = SessionToken(context, ComponentName(context, RosaryPlaybackService::class.java))
    controllerFuture = MediaController.Builder(context.applicationContext, token).buildAsync()
  }

  private fun buildStepSource(step: RosaryStep, nowPlaying: RosaryNowPlaying, factory: ProgressiveMediaSource.Factory): MediaSource {
    val metadata = MediaMetadata.Builder()
      .setTitle(step.title)
      .setSubtitle(step.subtitle)
      .setArtist(nowPlaying.artist)
      .setAlbumTitle(nowPlaying.album)
      .setArtworkUri(nowPlaying.artworkUri?.let(::parseUri))
      .setMediaType(MediaMetadata.MEDIA_TYPE_MUSIC)
      .build()
    val item = MediaItem.Builder()
      .setMediaId(step.id)
      .setMediaMetadata(metadata)
      .build()
    val builder = ConcatenatingMediaSource2.Builder().setMediaItem(item)
    for (part in step.parts) {
      // A concatenated progressive source must say how long it is before it is read; the
      // manifest's duration is exact, and a short guess is corrected once the file loads.
      val placeholderMs = if (part.durationMs > 0) part.durationMs else UNKNOWN_PART_MS
      builder.add(factory.createMediaSource(MediaItem.fromUri(parseUri(part.uri))), placeholderMs)
      if (part.gapAfterMs > 0) {
        builder.add(SilenceMediaSource(Util.msToUs(part.gapAfterMs)), part.gapAfterMs)
      }
    }
    return builder.build()
  }

  private fun updateStatus() {
    val next = computeStatus()
    if (next == status) {
      return
    }
    status = next
    val reason = pendingReason
    pendingReason = null
    listener?.onStatusChange(next, reason)
  }

  private fun computeStatus(): String {
    val current = player ?: return "idle"
    if (current.mediaItemCount == 0 || steps.isEmpty()) {
      return "idle"
    }
    return when {
      current.playbackState == Player.STATE_ENDED -> "ended"
      current.isPlaying -> "playing"
      isSuppressedByFocusLoss(current) -> "interrupted"
      current.playbackState == Player.STATE_BUFFERING && (current.playWhenReady || !hasBeenReady) -> "loading"
      current.playbackState == Player.STATE_IDLE && !hasBeenReady && current.playerError == null -> "loading"
      else -> "paused"
    }
  }

  private fun emitStepChangeIfNeeded() {
    val current = player ?: return
    val index = current.currentMediaItemIndex
    if (index == lastStepIndex || index !in steps.indices) {
      return
    }
    lastStepIndex = index
    listener?.onStepChange(index, steps[index].id)
  }

  private fun updateProgressTicker() {
    handler.removeCallbacks(progressTicker)
    if (progressEnabled && player?.isPlaying == true) {
      handler.post(progressTicker)
    }
  }

  private fun durationOf(current: Player): Long {
    val duration = current.duration
    return if (duration == C.TIME_UNSET) 0 else duration
  }

  private fun clampRate(rate: Float): Float {
    if (!rate.isFinite()) {
      return 1f
    }
    return rate.coerceIn(MIN_RATE, MAX_RATE)
  }

  private fun parseUri(value: String): Uri {
    return if (value.startsWith("/")) Uri.fromFile(java.io.File(value)) else Uri.parse(value)
  }
}
