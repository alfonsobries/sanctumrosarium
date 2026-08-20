export type AudioTrackEntry = {
  readonly file: string;
  readonly durationMs: number;
};

export type AudioManifestTrack = {
  readonly leader: AudioTrackEntry;
  readonly response?: AudioTrackEntry;
};

export type AudioManifest = {
  readonly version: 1;
  readonly locale: string;
  readonly voice: string;
  /** Synthesized scaffolding while the voice decision is open. Never ships as final. */
  readonly provisional: boolean;
  readonly tracks: Readonly<Record<string, AudioManifestTrack>>;
};

export type AudioPack = {
  readonly manifest: AudioManifest;
  /** Bundled asset per track file name, as Metro resolves require(). */
  readonly sources: Readonly<Record<string, number>>;
};
