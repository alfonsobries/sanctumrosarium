import { NativeModule, registerWebModule } from 'expo';

import type { RosaryPlayerEvents, RosaryPlayerState } from './rosary-player.types';

const idle: RosaryPlayerState = { index: 0, status: 'idle', positionMs: 0, durationMs: 0 };

class RosaryPlayerWebModule extends NativeModule<RosaryPlayerEvents> {
  async load(): Promise<void> {
    throw new Error('RosaryPlayer is not available on the web');
  }
  async play(): Promise<void> {}
  async pause(): Promise<void> {}
  async toggle(): Promise<void> {}
  async skipTo(): Promise<void> {}
  async next(): Promise<void> {}
  async previous(): Promise<void> {}
  async setRate(): Promise<void> {}
  async unload(): Promise<void> {}
  async getState(): Promise<RosaryPlayerState> {
    return idle;
  }
}

export const nativeRosaryPlayer = registerWebModule(RosaryPlayerWebModule, 'RosaryPlayer');
