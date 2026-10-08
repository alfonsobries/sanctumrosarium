export type RosaryPlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'interrupted' | 'ended';

export type RosaryStatusReason = 'interruption' | 'route' | 'remote' | 'user' | 'error' | 'ended';

export type RosaryStepPart = {
  uri: string;
  gapAfterMs: number;
  /** Length of the recording when known; Android needs it to queue the file before reading it. */
  durationMs?: number;
};

export type RosaryStep = {
  id: string;
  title: string;
  subtitle?: string;
  parts: RosaryStepPart[];
};

export type RosaryNowPlaying = {
  album: string;
  artist: string;
  artworkUri?: string;
};

export type RosaryLoadOptions = {
  startIndex?: number;
  rate?: number;
  nowPlaying: RosaryNowPlaying;
};

export type RosaryNativeLoadOptions = {
  startIndex: number;
  rate: number;
  nowPlaying: RosaryNowPlaying;
};

export type RosaryPlayerState = {
  index: number;
  status: RosaryPlaybackStatus;
  positionMs: number;
  durationMs: number;
};

export type RosaryStepChangeEvent = {
  index: number;
  id: string;
};

export type RosaryStatusChangeEvent = {
  status: RosaryPlaybackStatus;
  reason?: RosaryStatusReason;
};

export type RosaryProgressEvent = {
  index: number;
  positionMs: number;
  durationMs: number;
};

export type RosaryErrorEvent = {
  message: string;
};

export type RosaryPlayerEvents = {
  onStepChange: (event: RosaryStepChangeEvent) => void;
  onStatusChange: (event: RosaryStatusChangeEvent) => void;
  onProgress: (event: RosaryProgressEvent) => void;
  onError: (event: RosaryErrorEvent) => void;
};

export type RosaryPlayerSubscription = {
  remove: () => void;
};

export type RosaryPlayerNative = {
  load: (steps: RosaryStep[], options: RosaryNativeLoadOptions) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  toggle: () => Promise<void>;
  skipTo: (index: number) => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  setRate: (rate: number) => Promise<void>;
  unload: () => Promise<void>;
  getState: () => Promise<RosaryPlayerState>;
  addListener: <EventName extends keyof RosaryPlayerEvents>(
    eventName: EventName,
    listener: RosaryPlayerEvents[EventName],
  ) => RosaryPlayerSubscription;
};
