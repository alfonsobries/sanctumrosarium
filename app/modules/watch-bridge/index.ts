import { requireOptionalNativeModule } from 'expo';

type NativeModule = {
  updateContext(payload: Record<string, string>): void;
};

const native = requireOptionalNativeModule<NativeModule>('WatchBridge');

/** Last-known settings for the watch: arrives even if the watch is asleep. */
export function pushWatchContext(payload: Record<string, string>): void {
  native?.updateContext(payload);
}
