import type {
  RosaryLoadOptions,
  RosaryNativeLoadOptions,
  RosaryStep,
} from './rosary-player.types';

export const MIN_RATE = 0.5;
export const MAX_RATE = 2;

export function clampRate(rate: number): number {
  if (!Number.isFinite(rate)) {
    return 1;
  }
  return Math.min(MAX_RATE, Math.max(MIN_RATE, rate));
}

export function normalizeLoad(
  steps: readonly RosaryStep[],
  options: RosaryLoadOptions,
): { steps: RosaryStep[]; options: RosaryNativeLoadOptions } {
  if (steps.length === 0) {
    throw new Error('RosaryPlayer.load needs at least one step');
  }

  const normalized = steps.map((step) => {
    if (step.parts.length === 0) {
      throw new Error(`Step "${step.id}" has no parts`);
    }
    return {
      ...step,
      parts: step.parts.map((part) => {
        if (part.uri.length === 0) {
          throw new Error(`Step "${step.id}" has a part without uri`);
        }
        if (!Number.isFinite(part.gapAfterMs) || part.gapAfterMs < 0) {
          throw new Error(`Step "${step.id}" has an invalid gapAfterMs: ${part.gapAfterMs}`);
        }
        return { uri: part.uri, gapAfterMs: Math.round(part.gapAfterMs) };
      }),
    };
  });

  const startIndex = options.startIndex ?? 0;
  if (!Number.isInteger(startIndex) || startIndex < 0 || startIndex >= steps.length) {
    throw new RangeError(`startIndex ${startIndex} is outside the queue of ${steps.length} steps`);
  }

  return {
    steps: normalized,
    options: {
      startIndex,
      rate: clampRate(options.rate ?? 1),
      nowPlaying: options.nowPlaying,
    },
  };
}
