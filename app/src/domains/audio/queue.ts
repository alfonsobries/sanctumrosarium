import type { Step } from '@sanctamaria/rosary';

export type AudioManifest = {
  version: 1;
  locale: string;
  tracks: Record<string, { file: string; durationMs: number }>;
  litanyResponses: string[];
};

export type QueuePart = { file: string | null; gapAfterMs: number };
export type QueueStep = { id: string; parts: QueuePart[] };

export type QueueTiming = {
  /** Silence after each prayer, chosen by the person. */
  pauseMs: number;
  /** Breath between the leader's half and the response. */
  responseGapMs: number;
  /** Silence after the mystery is announced (RVM 31). */
  afterAnnounceMs: number;
};

/** Time a passage stays on screen in listen mode, read silently: about 14 characters a second. */
export function readingSilenceMs(text: string): number {
  return Math.min(90_000, Math.max(8_000, Math.round((text.length / 14) * 1000)));
}

function prayerParts(manifest: AudioManifest, id: string, timing: QueueTiming): QueuePart[] | null {
  const leader = manifest.tracks[`${id}.leader`];
  if (leader === undefined) {
    return null;
  }
  const response = manifest.tracks[`${id}.response`];
  if (response === undefined) {
    return [{ file: leader.file, gapAfterMs: timing.pauseMs }];
  }
  return [
    { file: leader.file, gapAfterMs: timing.responseGapMs },
    { file: response.file, gapAfterMs: timing.pauseMs },
  ];
}

function litanyParts(manifest: AudioManifest, timing: QueueTiming): QueuePart[] | null {
  const parts: QueuePart[] = [];
  for (const [index, responseKey] of manifest.litanyResponses.entries()) {
    const call = manifest.tracks[`litany.${index}.call`];
    const response = manifest.tracks[responseKey];
    if (call === undefined || response === undefined) {
      return null;
    }
    parts.push({ file: call.file, gapAfterMs: 250 }, { file: response.file, gapAfterMs: 400 });
  }
  const last = parts.at(-1);
  if (last !== undefined) {
    last.gapAfterMs = timing.pauseMs;
  }
  return parts;
}

/**
 * Turns the steps of a session into what the player plays: one entry per step so the
 * player and the screen always share the same index. A step without a recording (a
 * Gospel passage) becomes silence long enough to read it.
 */
export function buildQueue(
  steps: readonly Step[],
  manifest: AudioManifest,
  timing: QueueTiming,
  passageText: (ref: string) => string,
): QueueStep[] | null {
  const queue: QueueStep[] = [];
  for (const step of steps) {
    let parts: QueuePart[] | null;
    if (step.kind === 'announce') {
      const track = manifest.tracks[`announce.${step.mystery.id}`];
      parts = track === undefined ? null : [{ file: track.file, gapAfterMs: Math.max(timing.afterAnnounceMs, timing.pauseMs) }];
    } else if (step.kind === 'reading') {
      parts = [{ file: null, gapAfterMs: readingSilenceMs(passageText(step.reading.ref)) }];
    } else if (step.prayer === 'litany-of-loreto') {
      parts = litanyParts(manifest, timing);
    } else {
      parts = prayerParts(manifest, step.prayer, timing);
    }
    if (parts === null) {
      return null;
    }
    queue.push({ id: step.id, parts });
  }
  return queue;
}
