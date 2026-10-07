import type { Step } from '@sanctamaria/rosary';

/** [first character, character after the last, start in ms] of a word within the track's text. */
export type WordMark = [number, number, number];

export type ManifestTrack = { file: string; durationMs: number; words?: WordMark[] };

export type AudioManifest = {
  version: 1;
  locale: string;
  tracks: Record<string, ManifestTrack>;
  litanyResponses: string[];
};

export type QueuePart = {
  file: string | null;
  gapAfterMs: number;
  durationMs: number;
  /** Which half of a prayer this is, so its words map onto the right lines. */
  role: 'leader' | 'response' | 'other';
  words: WordMark[];
};

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

function part(track: ManifestTrack, role: QueuePart['role'], gapAfterMs: number): QueuePart {
  return { file: track.file, gapAfterMs, durationMs: track.durationMs, role, words: track.words ?? [] };
}

function prayerParts(manifest: AudioManifest, id: string, timing: QueueTiming): QueuePart[] | null {
  const leader = manifest.tracks[`${id}.leader`];
  if (leader === undefined) {
    return null;
  }
  const response = manifest.tracks[`${id}.response`];
  if (response === undefined) {
    return [part(leader, 'leader', timing.pauseMs)];
  }
  return [part(leader, 'leader', timing.responseGapMs), part(response, 'response', timing.pauseMs)];
}

function litanyParts(manifest: AudioManifest, timing: QueueTiming): QueuePart[] | null {
  const parts: QueuePart[] = [];
  const pairs = manifest.litanyResponses;
  for (const [index, responseKey] of pairs.entries()) {
    const call = manifest.tracks[`litany.${index}.call`];
    const response = manifest.tracks[responseKey];
    if (call === undefined || response === undefined) {
      return null;
    }
    const last = index === pairs.length - 1;
    parts.push(part(call, 'other', 250), part(response, 'other', last ? timing.pauseMs : 400));
  }
  return parts;
}

/**
 * Turns the steps of a session into what the player plays: one entry per step so the
 * player and the screen always share the same index. A Gospel passage is read aloud
 * when its recording exists; otherwise it becomes silence long enough to read it.
 */
export function buildQueue(
  steps: readonly Step[],
  manifest: AudioManifest,
  timing: QueueTiming,
  passageText: (ref: string) => string,
  readingTrack: (ref: string) => ManifestTrack | undefined = () => undefined,
): QueueStep[] | null {
  const queue: QueueStep[] = [];
  for (const step of steps) {
    let parts: QueuePart[] | null;
    if (step.kind === 'announce') {
      const track = manifest.tracks[`announce.${step.mystery.id}`];
      parts =
        track === undefined ? null : [part(track, 'other', Math.max(timing.afterAnnounceMs, timing.pauseMs))];
    } else if (step.kind === 'reading') {
      const track = readingTrack(step.reading.ref);
      parts =
        track === undefined
          ? [
              {
                file: null,
                gapAfterMs: readingSilenceMs(passageText(step.reading.ref)),
                durationMs: 0,
                role: 'other',
                words: [],
              },
            ]
          : [part(track, 'leader', Math.max(timing.pauseMs, 1500))];
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

export type Spoken = { role: 'leader' | 'response'; chars: number };

/**
 * How much of a prayer the voice has said at `positionMs` into its step: the half being
 * spoken and how many characters of that half's text are already out. A half whose
 * audio has finished counts as fully said.
 */
export function spokenAt(parts: readonly QueuePart[], positionMs: number): Spoken | null {
  let start = 0;
  let current: Spoken | null = null;
  for (const part of parts) {
    if (part.role === 'other') {
      return null;
    }
    if (positionMs < start) {
      break;
    }
    const local = positionMs - start;
    const said = part.words.filter((word) => word[2] <= local);
    const chars = local >= part.durationMs ? Number.POSITIVE_INFINITY : (said.at(-1)?.[1] ?? 0);
    current = { role: part.role, chars };
    const end = start + part.durationMs + part.gapAfterMs;
    if (positionMs < end) {
      break;
    }
    start = end;
  }
  return current;
}
