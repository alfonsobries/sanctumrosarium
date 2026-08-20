import { requireOptionalNativeModule } from 'expo';

type WatchPrayedEvent = {
  decades?: string | number;
  set?: string;
};

type NativeModule = {
  updateContext(payload: Record<string, string>): void;
  addListener(
    event: 'onWatchPrayed',
    listener: (event: WatchPrayedEvent) => void,
  ): { remove: () => void };
};

const native = requireOptionalNativeModule<NativeModule>('WatchBridge');

/** Last-known settings for the watch: arrives even if the watch is asleep. */
export function pushWatchContext(payload: Record<string, string>): void {
  native?.updateContext(payload);
}

/** A finished decade or Rosary from the watch, to land in the phone journal. */
export function addWatchPrayedListener(
  listener: (event: { decades: number; set?: string }) => void,
): () => void {
  if (native === null) {
    return () => {};
  }
  const subscription = native.addListener('onWatchPrayed', (event) => {
    const decades = Number(event.decades);
    if (!Number.isFinite(decades) || decades < 1) {
      return;
    }
    listener({
      decades: Math.min(20, Math.floor(decades)),
      ...(typeof event.set === 'string' ? { set: event.set } : {}),
    });
  });
  return () => {
    subscription.remove();
  };
}
