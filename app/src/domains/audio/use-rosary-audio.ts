import { passage, type Locale } from '@sanctamaria/content';
import type { Step } from '@sanctamaria/rosary';
import { Asset } from 'expo-asset';
import { useEffect, useRef, useState } from 'react';

import {
  addRosaryPlayerListener,
  load,
  play,
  setRate,
  skipTo,
  toggle,
  unload,
  useRosaryPlayer,
  type RosaryPlaybackStatus,
} from '../../../modules/rosary-player';

import { audioPacks } from './packs.gen';
import { buildQueue, type AudioManifest } from './queue';

const silence = require('@/assets/audio/silence.mp3') as number;

type Pack = { manifest: AudioManifest; files: Record<string, number> };

function packFor(locale: Locale): Pack | null {
  const packs = audioPacks as unknown as Partial<Record<Locale, Pack>>;
  return packs[locale] ?? null;
}

export function hasAudio(locale: Locale): boolean {
  return packFor(locale) !== null;
}

async function uriOf(module: number): Promise<string> {
  const asset = Asset.fromModule(module);
  if (asset.localUri === null) {
    await asset.downloadAsync();
  }
  return asset.localUri ?? asset.uri;
}

export type RosaryAudio = {
  availability: 'unavailable' | 'loading' | 'ready';
  status: RosaryPlaybackStatus;
  /** How far through the current step the voice is, 0 to 1. */
  progress: number;
  toggle: () => void;
  skipTo: (index: number) => void;
};

type Options = {
  enabled: boolean;
  sessionId: string | null;
  steps: readonly Step[];
  locale: Locale;
  position: number;
  rate: number;
  pauseSeconds: number;
  nowPlaying: { album: string; artist: string; titles: (step: Step) => string };
  onStep: (index: number) => void;
};

/**
 * Drives the native player for a session: loads the queue once, follows the player as it
 * moves on by itself (including from the lock screen and headphones), and hands taps on
 * screen back to it. Playback lives in the native player, not in this component; leaving
 * the session unloads it.
 */
export function useRosaryAudio(options: Options): RosaryAudio {
  const { enabled, sessionId, steps, locale, rate, pauseSeconds } = options;
  const [availability, setAvailability] = useState<RosaryAudio['availability']>('loading');
  const player = useRosaryPlayer();
  const latest = useRef(options);
  latest.current = options;

  useEffect(() => {
    if (!enabled || sessionId === null) {
      return;
    }
    const pack = packFor(locale);
    const queue =
      pack === null
        ? null
        : buildQueue(
            steps,
            pack.manifest,
            { pauseMs: pauseSeconds * 1000, responseGapMs: 450, afterAnnounceMs: 4000 },
            (ref) => passage(ref, locale)?.text ?? '',
          );
    if (pack === null || queue === null) {
      setAvailability('unavailable');
      return;
    }

    let cancelled = false;
    setAvailability('loading');
    void (async () => {
      const silenceUri = await uriOf(silence);
      const resolved = await Promise.all(
        queue.map(async (entry, index) => {
          const step = steps[index];
          return {
            id: entry.id,
            title: step === undefined ? '' : latest.current.nowPlaying.titles(step),
            parts: await Promise.all(
              entry.parts.map(async (part) => ({
                uri: part.file === null ? silenceUri : await uriOf(pack.files[part.file] ?? silence),
                gapAfterMs: part.gapAfterMs,
              })),
            ),
          };
        }),
      );
      if (cancelled) {
        return;
      }
      await load(resolved, {
        startIndex: latest.current.position,
        rate,
        nowPlaying: { album: latest.current.nowPlaying.album, artist: latest.current.nowPlaying.artist },
      });
      setAvailability('ready');
      await play();
    })();

    const subscription = addRosaryPlayerListener('onStepChange', (event) => {
      latest.current.onStep(event.index);
    });

    return () => {
      cancelled = true;
      subscription.remove();
      void unload();
    };
    // Reload only for a new session, language or pacing; rate changes apply live.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, sessionId, locale, pauseSeconds]);

  useEffect(() => {
    if (availability === 'ready') {
      void setRate(rate);
    }
  }, [availability, rate]);

  return {
    availability: enabled ? availability : 'unavailable',
    status: player.status,
    progress: player.durationMs > 0 ? Math.min(1, player.positionMs / player.durationMs) : 0,
    toggle: () => void toggle(),
    skipTo: (index) => void skipTo(index),
  };
}
