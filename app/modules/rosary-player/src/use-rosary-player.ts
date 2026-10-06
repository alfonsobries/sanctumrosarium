import { useSyncExternalStore } from 'react';

import { getPlayerStore } from './rosary-player';
import type { RosaryPlayerState } from './rosary-player.types';

export function useRosaryPlayer(): RosaryPlayerState {
  const store = getPlayerStore();
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
