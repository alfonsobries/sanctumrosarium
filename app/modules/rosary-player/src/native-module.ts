import { NativeModule, requireNativeModule } from 'expo';

import type {
  RosaryNativeLoadOptions,
  RosaryPlayerEvents,
  RosaryPlayerState,
  RosaryStep,
} from './rosary-player.types';

declare class RosaryPlayerNativeModule extends NativeModule<RosaryPlayerEvents> {
  load(steps: RosaryStep[], options: RosaryNativeLoadOptions): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  toggle(): Promise<void>;
  skipTo(index: number): Promise<void>;
  next(): Promise<void>;
  previous(): Promise<void>;
  setRate(rate: number): Promise<void>;
  unload(): Promise<void>;
  getState(): Promise<RosaryPlayerState>;
}

export const nativeRosaryPlayer = requireNativeModule<RosaryPlayerNativeModule>('RosaryPlayer');
