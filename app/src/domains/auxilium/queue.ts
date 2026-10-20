import type { AuxiliumSection } from '@sanctamaria/content';

import {
  part,
  prayerParts,
  type AudioManifest,
  type ManifestTrack,
  type QueuePart,
  type QueueStep,
  type QueueTiming,
} from '@/domains/audio/queue';

export type AuxiliumManifest = { tracks: Record<string, ManifestTrack> };

/** Breath between a litany call and its answer, and between one answered call and the next. */
const callGapMs = 250;
const lineGapMs = 400;

function blockParts(
  section: AuxiliumSection,
  index: number,
  manifest: AuxiliumManifest,
  rosary: AudioManifest,
  timing: QueueTiming,
): QueuePart[] | null {
  const block = section.blocks[index];
  const at = `${section.id}.${index}`;
  const track = (key: string) => manifest.tracks[key];
  if (block === undefined) {
    return null;
  }
  if (block.kind === 'prayer') {
    return prayerParts(rosary, block.prayer, timing);
  }
  if (block.kind === 'versicle') {
    const call = track(`${at}.call`);
    const response = track(`${at}.response`);
    return call === undefined || response === undefined
      ? null
      : [part(call, timing.responseGapMs), part(response, timing.pauseMs)];
  }
  if (block.kind === 'text') {
    const text = track(`${at}.text`);
    if (text === undefined) {
      return null;
    }
    if (block.response === undefined) {
      return [part(text, block.lead === true ? timing.responseGapMs : timing.pauseMs)];
    }
    const response = track(`${at}.response`);
    return response === undefined ? null : [part(text, timing.responseGapMs), part(response, timing.pauseMs)];
  }
  const parts: QueuePart[] = [];
  for (const [line, item] of block.items.entries()) {
    const last = line === block.items.length - 1;
    const call = track(`${at}.${line}.call`);
    if (call === undefined) {
      return null;
    }
    if (item.response === undefined) {
      parts.push(part(call, last ? timing.pauseMs : lineGapMs));
      continue;
    }
    const response = track(`${at}.${line}.response`);
    if (response === undefined) {
      return null;
    }
    parts.push(part(call, callGapMs), part(response, last ? timing.pauseMs : lineGapMs));
  }
  return parts;
}

/**
 * The day's prayers as the player plays them: one step per section, so the screen can
 * follow along and jump to a section. The Our Father, Hail Mary and Glory Be come from
 * the Rosary's own recordings. Null when any recording is missing.
 */
export function buildAuxiliumQueue(
  sections: readonly AuxiliumSection[],
  manifest: AuxiliumManifest,
  rosary: AudioManifest,
  timing: QueueTiming,
): QueueStep[] | null {
  const queue: QueueStep[] = [];
  for (const section of sections) {
    const parts: QueuePart[] = [];
    for (let index = 0; index < section.blocks.length; index++) {
      const found = blockParts(section, index, manifest, rosary, timing);
      if (found === null) {
        return null;
      }
      parts.push(...found);
    }
    queue.push({ id: `auxilium.${section.id}`, parts });
  }
  return queue;
}
