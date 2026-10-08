import { AppState } from 'react-native';

import { nativeRosaryPlayer } from './native-module';
import { clampRate, normalizeLoad } from './normalize-load';
import { createPlayerStore, type RosaryPlayerStore } from './player-store';
import type {
  RosaryLoadOptions,
  RosaryPlayerEvents,
  RosaryPlayerState,
  RosaryPlayerSubscription,
  RosaryStep,
} from './rosary-player.types';

let store: RosaryPlayerStore | null = null;

export function getPlayerStore(): RosaryPlayerStore {
  if (store === null) {
    const created = createPlayerStore(nativeRosaryPlayer);
    AppState.addEventListener('change', (appState) => {
      if (appState === 'active') {
        void created.refresh();
      }
    });
    void created.refresh();
    store = created;
  }
  return store;
}

export async function load(steps: readonly RosaryStep[], options: RosaryLoadOptions): Promise<void> {
  const normalized = normalizeLoad(steps, options);
  await nativeRosaryPlayer.load(normalized.steps, normalized.options);
  await getPlayerStore().refresh();
}

export function play(): Promise<void> {
  return nativeRosaryPlayer.play();
}

export function pause(): Promise<void> {
  return nativeRosaryPlayer.pause();
}

export function toggle(): Promise<void> {
  return nativeRosaryPlayer.toggle();
}

export function skipTo(index: number): Promise<void> {
  return nativeRosaryPlayer.skipTo(index);
}

export function next(): Promise<void> {
  return nativeRosaryPlayer.next();
}

export function previous(): Promise<void> {
  return nativeRosaryPlayer.previous();
}

export function setRate(rate: number): Promise<void> {
  return nativeRosaryPlayer.setRate(clampRate(rate));
}

export async function unload(): Promise<void> {
  await nativeRosaryPlayer.unload();
  await getPlayerStore().refresh();
}

export function getState(): RosaryPlayerState {
  return getPlayerStore().getSnapshot();
}

export function fetchState(): Promise<RosaryPlayerState> {
  return getPlayerStore().refresh();
}

export function addRosaryPlayerListener<EventName extends keyof RosaryPlayerEvents>(
  eventName: EventName,
  listener: RosaryPlayerEvents[EventName],
): RosaryPlayerSubscription {
  return nativeRosaryPlayer.addListener(eventName, listener);
}
