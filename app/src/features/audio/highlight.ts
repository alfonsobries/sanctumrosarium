import type { LineMark } from './types';

/**
 * Which line is being said at a playback position. The highlight never runs ahead:
 * nothing lights up before the first line, and between lines the previous one holds,
 * so the eye is never pushed (RVM 12: a tranquil rhythm).
 *
 * Marks live in track time, so a different playback rate needs no correction.
 */
export function activeLineAt(
  lines: readonly LineMark[] | undefined,
  positionMs: number,
): number | undefined {
  if (lines === undefined || lines.length === 0) {
    return undefined;
  }
  if (positionMs < lines[0].startMs) {
    return undefined;
  }
  let active = 0;
  for (let index = 1; index < lines.length; index += 1) {
    if (positionMs >= lines[index].startMs) {
      active = index;
    }
  }
  return active;
}
