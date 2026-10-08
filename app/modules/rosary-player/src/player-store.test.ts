import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createPlayerStore, initialPlayerState } from './player-store';
import type { RosaryPlayerEvents, RosaryPlayerNative, RosaryPlayerState } from './rosary-player.types';

type Listeners = { [EventName in keyof RosaryPlayerEvents]: Set<RosaryPlayerEvents[EventName]> };

function createFakeNative(initial: RosaryPlayerState = initialPlayerState) {
  let nativeState = initial;
  const listeners: Listeners = {
    onStepChange: new Set(),
    onStatusChange: new Set(),
    onProgress: new Set(),
    onError: new Set(),
  };

  const native: RosaryPlayerNative = {
    load: vi.fn(async () => {}),
    play: vi.fn(async () => {}),
    pause: vi.fn(async () => {}),
    toggle: vi.fn(async () => {}),
    skipTo: vi.fn(async () => {}),
    next: vi.fn(async () => {}),
    previous: vi.fn(async () => {}),
    setRate: vi.fn(async () => {}),
    unload: vi.fn(async () => {}),
    getState: vi.fn(async () => nativeState),
    addListener: (eventName, listener) => {
      const set = listeners[eventName] as Set<typeof listener>;
      set.add(listener);
      return { remove: () => set.delete(listener) };
    },
  };

  return {
    native,
    listeners,
    setNativeState: (state: RosaryPlayerState) => {
      nativeState = state;
    },
    emit: <EventName extends keyof RosaryPlayerEvents>(
      eventName: EventName,
      payload: Parameters<RosaryPlayerEvents[EventName]>[0],
    ) => {
      (listeners[eventName] as Set<(event: typeof payload) => void>).forEach((listener) => listener(payload));
    },
  };
}

describe('createPlayerStore', () => {
  let fake: ReturnType<typeof createFakeNative>;

  beforeEach(() => {
    fake = createFakeNative();
  });

  it('starts idle', () => {
    const store = createPlayerStore(fake.native);

    expect(store.getSnapshot()).toEqual(initialPlayerState);
  });

  it('follows status changes and notifies subscribers', () => {
    const store = createPlayerStore(fake.native);
    const listener = vi.fn();
    store.subscribe(listener);

    fake.emit('onStatusChange', { status: 'interrupted', reason: 'interruption' });

    expect(store.getSnapshot().status).toBe('interrupted');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('keeps the snapshot identity when nothing changed', () => {
    const store = createPlayerStore(fake.native);
    fake.emit('onStatusChange', { status: 'playing' });
    const before = store.getSnapshot();

    fake.emit('onStatusChange', { status: 'playing' });

    expect(store.getSnapshot()).toBe(before);
  });

  it('only listens to progress while someone is subscribed', () => {
    const store = createPlayerStore(fake.native);
    expect(fake.listeners.onProgress.size).toBe(0);

    const unsubscribeA = store.subscribe(() => {});
    const unsubscribeB = store.subscribe(() => {});
    expect(fake.listeners.onProgress.size).toBe(1);

    unsubscribeA();
    expect(fake.listeners.onProgress.size).toBe(1);
    unsubscribeB();
    expect(fake.listeners.onProgress.size).toBe(0);
  });

  it('applies progress to the snapshot', () => {
    const store = createPlayerStore(fake.native);
    store.subscribe(() => {});

    fake.emit('onProgress', { index: 3, positionMs: 1250, durationMs: 9000 });

    expect(store.getSnapshot()).toMatchObject({ index: 3, positionMs: 1250, durationMs: 9000 });
  });

  it('resets the position and re-reads native state on a step change', async () => {
    const store = createPlayerStore(fake.native);
    store.subscribe(() => {});
    fake.emit('onProgress', { index: 0, positionMs: 8000, durationMs: 9000 });
    fake.setNativeState({ index: 1, status: 'playing', positionMs: 40, durationMs: 7000 });

    fake.emit('onStepChange', { index: 1, id: 'step-1' });
    expect(store.getSnapshot()).toMatchObject({ index: 1, positionMs: 0 });

    await vi.waitFor(() => expect(store.getSnapshot().durationMs).toBe(7000));
  });

  it('refresh replaces stale state with the native truth', async () => {
    const store = createPlayerStore(fake.native);
    fake.emit('onStatusChange', { status: 'playing' });
    fake.setNativeState({ index: 2, status: 'paused', positionMs: 300, durationMs: 4000 });

    const state = await store.refresh();

    expect(state.status).toBe('paused');
    expect(store.getSnapshot()).toEqual({ index: 2, status: 'paused', positionMs: 300, durationMs: 4000 });
  });

  it('drops a refresh that resolves after a newer event', async () => {
    const store = createPlayerStore(fake.native);
    let resolve: (state: RosaryPlayerState) => void = () => {};
    vi.mocked(fake.native.getState).mockImplementationOnce(
      () =>
        new Promise<RosaryPlayerState>((done) => {
          resolve = done;
        }),
    );

    const pending = store.refresh();
    fake.emit('onStatusChange', { status: 'playing' });
    resolve({ ...initialPlayerState, status: 'paused' });
    await pending;

    expect(store.getSnapshot().status).toBe('playing');
  });
});
