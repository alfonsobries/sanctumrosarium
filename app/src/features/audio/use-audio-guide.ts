import type { Step } from '@rosario/engine';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

import { defaultAudioSettings, planForStep } from './schedule';
import type { AudioPack } from './types';

type UseAudioGuideOptions = {
  readonly steps: readonly Step[];
  readonly stepIndex: number;
  readonly pack: AudioPack | undefined;
  /** Called when the guide finishes a step and its response silence. */
  readonly onAdvance: () => void;
};

type AudioGuide = {
  readonly available: boolean;
  readonly playing: boolean;
  readonly toggle: () => void;
};

/**
 * The voice of the guide: says its half of the step, holds the silence where the person
 * answers, and only then moves on. Pausing keeps the bead; the session state owns the
 * position, so an interruption never loses the count.
 */
export function useAudioGuide({
  steps,
  stepIndex,
  pack,
  onAdvance,
}: UseAudioGuideOptions): AudioGuide {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<AudioPlayer | null>(null);
  const onAdvanceRef = useRef(onAdvance);

  useEffect(() => {
    onAdvanceRef.current = onAdvance;
  }, [onAdvance]);

  useEffect(() => {
    if (!playing || pack === undefined) {
      return;
    }
    const step = steps[stepIndex];
    if (step === undefined) {
      return;
    }

    const plan = planForStep(step, pack.manifest, defaultAudioSettings);
    const source = plan.kind === 'track' ? pack.sources[plan.file] : undefined;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let subscription: { remove: () => void } | null = null;

    const scheduleAdvance = () => {
      timer = setTimeout(() => onAdvanceRef.current(), plan.silenceAfterMs);
    };

    if (source === undefined) {
      scheduleAdvance();
    } else {
      const player = playerRef.current ?? createAudioPlayer();
      playerRef.current = player;
      subscription = player.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish) {
          subscription?.remove();
          subscription = null;
          scheduleAdvance();
        }
      });
      player.replace(source);
      player.play();
    }

    return () => {
      if (timer !== null) {
        clearTimeout(timer);
      }
      subscription?.remove();
      playerRef.current?.pause();
    };
  }, [playing, stepIndex, steps, pack]);

  useEffect(
    () => () => {
      playerRef.current?.release();
      playerRef.current = null;
    },
    [],
  );

  const toggle = useCallback(() => {
    setPlaying((current) => {
      if (!current) {
        void setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionMode: 'doNotMix',
        });
      }
      return !current;
    });
  }, []);

  return { available: pack !== undefined, playing, toggle };
}
