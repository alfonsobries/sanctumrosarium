import type { Step } from '@rosario/engine';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

import { activeLineAt } from './highlight';
import { defaultAudioSettings, planForStep, type AudioSettings } from './schedule';
import type { AudioPack, LineMark } from './types';

type UseAudioGuideOptions = {
  readonly steps: readonly Step[];
  readonly stepIndex: number;
  readonly pack: AudioPack | undefined;
  readonly settings?: AudioSettings;
  /** Called when the guide finishes a step and its response silence. */
  readonly onAdvance: () => void;
};

type AudioGuide = {
  readonly available: boolean;
  readonly playing: boolean;
  /** Line of the current prayer being said, when the track carries marks. */
  readonly activeLine: number | undefined;
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
  settings = defaultAudioSettings,
  onAdvance,
}: UseAudioGuideOptions): AudioGuide {
  const [playing, setPlaying] = useState(false);
  const [spokenLine, setSpokenLine] = useState<{
    step: number;
    line: number | undefined;
  } | null>(null);
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

    const plan = planForStep(step, pack.manifest, settings);
    const source = plan.kind === 'track' ? pack.sources[plan.file] : undefined;
    let beforeTimer: ReturnType<typeof setTimeout> | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let subscription: { remove: () => void } | null = null;

    const scheduleAdvance = () => {
      timer = setTimeout(() => onAdvanceRef.current(), plan.silenceAfterMs);
    };

    if (source === undefined || plan.kind !== 'track') {
      scheduleAdvance();
    } else {
      const player = playerRef.current ?? createAudioPlayer();
      playerRef.current = player;
      let half: { lines?: readonly LineMark[]; lineOffset: number; last: boolean } = {
        ...(plan.lines === undefined ? {} : { lines: plan.lines }),
        lineOffset: plan.lineOffset ?? 0,
        last: plan.follow === undefined,
      };
      subscription = player.addListener('playbackStatusUpdate', (status) => {
        if (half.lines !== undefined) {
          const line = activeLineAt(half.lines, status.currentTime * 1000);
          const shown = line === undefined ? undefined : line + half.lineOffset;
          setSpokenLine((current) =>
            current?.step === stepIndex && current.line === shown
              ? current
              : { step: stepIndex, line: shown },
          );
        }
        if (status.didJustFinish) {
          if (half.last || plan.follow === undefined) {
            subscription?.remove();
            subscription = null;
            scheduleAdvance();
            return;
          }
          const followSource = pack.sources[plan.follow.file];
          if (followSource === undefined) {
            subscription?.remove();
            subscription = null;
            scheduleAdvance();
            return;
          }
          half = {
            ...(plan.follow.lines === undefined ? {} : { lines: plan.follow.lines }),
            lineOffset: plan.follow.lineOffset ?? 0,
            last: true,
          };
          player.replace(followSource);
          player.setPlaybackRate(settings.rate, 'high');
          player.play();
        }
      });
      const startPlayback = () => {
        player.replace(source);
        player.setPlaybackRate(settings.rate, 'high');
        player.play();
      };
      if (plan.silenceBeforeMs > 0) {
        beforeTimer = setTimeout(startPlayback, plan.silenceBeforeMs);
      } else {
        startPlayback();
      }
    }

    return () => {
      if (beforeTimer !== null) {
        clearTimeout(beforeTimer);
      }
      if (timer !== null) {
        clearTimeout(timer);
      }
      subscription?.remove();
      playerRef.current?.pause();
    };
  }, [playing, stepIndex, steps, pack, settings]);

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

  return {
    available: pack !== undefined,
    playing,
    activeLine:
      playing && spokenLine !== null && spokenLine.step === stepIndex
        ? spokenLine.line
        : undefined,
    toggle,
  };
}
