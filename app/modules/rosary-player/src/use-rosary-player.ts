import { useSyncExternalStore } from 'react';

import { getPlayerStore } from './rosary-player';
import type { RosaryPlayerState } from './rosary-player.types';

export function useRosaryPlayer(): RosaryPlayerState {
  const store = getPlayerStore();
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

/**
 * Subscribes to one slice of the player state. A component re-renders only when that
 * slice changes, so screens that need the status are not redrawn on every progress tick.
 */
export function useRosaryPlayerSelector<T>(selector: (state: RosaryPlayerState) => T): T {
  const store = getPlayerStore();
  const select = () => selector(store.getSnapshot());
  return useSyncExternalStore(store.subscribe, select, select);
}
