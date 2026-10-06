import type {
  RosaryPlayerNative,
  RosaryPlayerState,
  RosaryPlayerSubscription,
} from './rosary-player.types';

export type RosaryPlayerStore = {
  getSnapshot: () => RosaryPlayerState;
  subscribe: (listener: () => void) => () => void;
  refresh: () => Promise<RosaryPlayerState>;
};

export const initialPlayerState: RosaryPlayerState = {
  index: 0,
  status: 'idle',
  positionMs: 0,
  durationMs: 0,
};

// Mirrors native state for rendering only. Commands never read it: the native
// side is the source of truth, and `refresh` re-reads it whenever it may have
// drifted (foreground, step change, load).
export function createPlayerStore(native: RosaryPlayerNative): RosaryPlayerStore {
  let snapshot = initialPlayerState;
  let progressSubscription: RosaryPlayerSubscription | null = null;
  let refreshId = 0;
  const listeners = new Set<() => void>();

  function update(next: Partial<RosaryPlayerState>): void {
    const merged = { ...snapshot, ...next };
    if (
      merged.index === snapshot.index &&
      merged.status === snapshot.status &&
      merged.positionMs === snapshot.positionMs &&
      merged.durationMs === snapshot.durationMs
    ) {
      return;
    }
    snapshot = merged;
    listeners.forEach((listener) => listener());
  }

  async function refresh(): Promise<RosaryPlayerState> {
    const id = ++refreshId;
    const state = await native.getState();
    if (id === refreshId) {
      update(state);
    }
    return state;
  }

  native.addListener('onStepChange', ({ index }) => {
    refreshId++;
    update({ index, positionMs: 0 });
    void refresh();
  });
  native.addListener('onStatusChange', ({ status }) => {
    refreshId++;
    update({ status });
  });

  // Progress events only flow while something renders the state, so the
  // native side stops its timer when no screen is listening.
  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    if (progressSubscription === null) {
      progressSubscription = native.addListener('onProgress', ({ index, positionMs, durationMs }) => {
        update({ index, positionMs, durationMs });
      });
    }
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0 && progressSubscription !== null) {
        progressSubscription.remove();
        progressSubscription = null;
      }
    };
  }

  return {
    getSnapshot: () => snapshot,
    subscribe,
    refresh,
  };
}
