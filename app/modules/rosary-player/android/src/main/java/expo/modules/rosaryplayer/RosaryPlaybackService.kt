package expo.modules.rosaryplayer

import android.app.PendingIntent
import android.content.Intent
import androidx.annotation.OptIn
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService

@OptIn(UnstableApi::class)
class RosaryPlaybackService : MediaSessionService() {
  private var session: MediaSession? = null

  override fun onCreate() {
    super.onCreate()
    val builder = MediaSession.Builder(this, RosaryPlayerEngine.sessionPlayer(this))
      .setCallback(SessionCallback)
    launchIntent()?.let { builder.setSessionActivity(it) }
    session = builder.build()
  }

  override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaSession? = session

  // The engine owns the player and keeps it for the next session.
  override fun onDestroy() {
    session?.release()
    session = null
    super.onDestroy()
  }

  private fun launchIntent(): PendingIntent? {
    val intent = packageManager.getLaunchIntentForPackage(packageName) ?: return null
    intent.flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
    return PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
  }

  // Steps are not seekable from outside the app: only play, pause and
  // previous/next step reach the player.
  private object SessionCallback : MediaSession.Callback {
    override fun onConnect(session: MediaSession, controller: MediaSession.ControllerInfo): MediaSession.ConnectionResult {
      val commands = MediaSession.ConnectionResult.DEFAULT_PLAYER_COMMANDS.buildUpon()
        .remove(Player.COMMAND_SEEK_IN_CURRENT_MEDIA_ITEM)
        .remove(Player.COMMAND_SEEK_BACK)
        .remove(Player.COMMAND_SEEK_FORWARD)
        .remove(Player.COMMAND_SET_SPEED_AND_PITCH)
        .remove(Player.COMMAND_SET_SHUFFLE_MODE)
        .remove(Player.COMMAND_SET_REPEAT_MODE)
        .build()
      return MediaSession.ConnectionResult.AcceptedResultBuilder(session, controller)
        .setAvailablePlayerCommands(commands)
        .build()
    }
  }
}
