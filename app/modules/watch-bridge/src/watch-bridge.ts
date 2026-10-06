import { NativeModule, requireOptionalNativeModule } from 'expo';

import type {
  WatchBridgeEvents,
  WatchBridgeSubscription,
  WatchAudioPackOffer,
  WatchSessionPayload,
  WatchSettings,
  WatchToday,
} from './watch-bridge.types';

declare class WatchBridgeNativeModule extends NativeModule<WatchBridgeEvents> {
  isSupported(): boolean;
  sendSettings(settings: WatchSettings): void;
  sendToday(today: WatchToday): void;
  setAudioPack(pack: WatchAudioPackOffer): void;
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

/** What was prayed today, so the watch can show it and continue with the next decade. */
export function sendToday(today: WatchToday): void {
  native?.sendToday(today);
}

/**
 * The audio pack the watch should hold. The phone sends only the files the watch is
 * missing; without a version the watch prays that language without audio.
 */
export function setWatchAudioPack(pack: WatchAudioPackOffer): void {
  native?.setAudioPack(pack);
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
