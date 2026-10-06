package expo.modules.rosaryplayer

import android.content.Context
import androidx.annotation.OptIn
import androidx.media3.common.util.UnstableApi
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class PartRecord : Record {
  @Field val uri: String = ""
  @Field val gapAfterMs: Double = 0.0
}

class StepRecord : Record {
  @Field val id: String = ""
  @Field val title: String = ""
  @Field val subtitle: String? = null
  @Field val parts: List<PartRecord> = emptyList()
}

class NowPlayingRecord : Record {
  @Field val album: String = ""
  @Field val artist: String = ""
  @Field val artworkUri: String? = null
}

class LoadOptionsRecord : Record {
  @Field val startIndex: Int = 0
  @Field val rate: Double = 1.0
  @Field val nowPlaying: NowPlayingRecord = NowPlayingRecord()
}

private class InvalidQueueException(message: String) : CodedException(message)

@OptIn(UnstableApi::class)
class RosaryPlayerModule : Module() {
  private val context: Context
    get() = appContext.reactContext?.applicationContext ?: throw CodedException("React context is not available")

  private val bridge = object : RosaryPlayerListener {
    override fun onStepChange(index: Int, id: String) {
      sendEvent("onStepChange", mapOf("index" to index, "id" to id))
    }

    override fun onStatusChange(status: String, reason: String?) {
      val payload = mutableMapOf<String, Any>("status" to status)
      reason?.let { payload["reason"] = it }
      sendEvent("onStatusChange", payload)
    }

    override fun onProgress(index: Int, positionMs: Long, durationMs: Long) {
      sendEvent("onProgress", mapOf("index" to index, "positionMs" to positionMs.toDouble(), "durationMs" to durationMs.toDouble()))
    }

    override fun onError(message: String) {
      sendEvent("onError", mapOf("message" to message))
    }
  }

  override fun definition() = ModuleDefinition {
    Name("RosaryPlayer")

    Events("onStepChange", "onStatusChange", "onProgress", "onError")

    OnCreate {
      RosaryPlayerEngine.listener = bridge
    }

    OnDestroy {
      if (RosaryPlayerEngine.listener === bridge) {
        RosaryPlayerEngine.listener = null
        RosaryPlayerEngine.progressEnabled = false
      }
    }

    OnStartObserving("onProgress") {
      RosaryPlayerEngine.progressEnabled = true
    }

    OnStopObserving("onProgress") {
      RosaryPlayerEngine.progressEnabled = false
    }

    AsyncFunction("load") { records: List<StepRecord>, options: LoadOptionsRecord, promise: Promise ->
      val steps = records.map { record ->
        RosaryStep(
          id = record.id,
          title = record.title,
          subtitle = record.subtitle,
          parts = record.parts.map { RosaryPart(it.uri, it.gapAfterMs.toLong().coerceAtLeast(0)) }
        )
      }
      val nowPlaying = RosaryNowPlaying(
        album = options.nowPlaying.album,
        artist = options.nowPlaying.artist,
        artworkUri = options.nowPlaying.artworkUri
      )
      try {
        RosaryPlayerEngine.load(context, steps, options.startIndex, options.rate.toFloat(), nowPlaying)
        promise.resolve(null)
      } catch (error: IllegalArgumentException) {
        promise.reject(InvalidQueueException(error.message ?: "Invalid queue"))
      }
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("play") {
      RosaryPlayerEngine.play()
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("pause") {
      RosaryPlayerEngine.pause()
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("toggle") {
      RosaryPlayerEngine.toggle()
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("skipTo") { index: Int ->
      RosaryPlayerEngine.skipTo(index)
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("next") {
      RosaryPlayerEngine.next()
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("previous") {
      RosaryPlayerEngine.previous()
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("setRate") { rate: Double ->
      RosaryPlayerEngine.setRate(rate.toFloat())
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("unload") {
      RosaryPlayerEngine.unload(context)
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("getState") {
      val state = RosaryPlayerEngine.state()
      mapOf(
        "index" to state.index,
        "status" to state.status,
        "positionMs" to state.positionMs.toDouble(),
        "durationMs" to state.durationMs.toDouble()
      )
    }.runOnQueue(Queues.MAIN)
  }
}
