import { NativeModule, requireOptionalNativeModule } from 'expo';

import type {
  WatchBridgeEvents,
  WatchBridgeSubscription,
  WatchSessionPayload,
  WatchSettings,
} from './watch-bridge.types';

declare class WatchBridgeNativeModule extends NativeModule<WatchBridgeEvents> {
  isSupported(): boolean;
  sendSettings(settings: WatchSettings): void;
  pendingSessions(): WatchSessionPayload[];
  acknowledgeSession(id: string): void;
}

// Only iOS has the native side; elsewhere every call does nothing.
const native = requireOptionalNativeModule<WatchBridgeNativeModule>('WatchBridge');

export function isWatchSupported(): boolean {
  return native?.isSupported() ?? false;
}

/** Hands the watch the latest settings; it keeps them for when the phone is away. */
export function sendSettings(settings: WatchSettings): void {
  native?.sendSettings(settings);
}

/** Sessions received from the watch that have not been acknowledged yet. */
export function pendingWatchSessions(): WatchSessionPayload[] {
  return native?.pendingSessions() ?? [];
}

/** Marks a received session as stored, so it is not delivered again. */
export function acknowledgeWatchSession(id: string): void {
  native?.acknowledgeSession(id);
}

export function addWatchSessionListener(
  listener: (entry: WatchSessionPayload) => void,
): WatchBridgeSubscription {
  if (native === null) {
    return { remove: () => {} };
  }
  return native.addListener('onWatchSession', listener);
}
