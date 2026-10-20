import type { AuxiliumSection, Locale } from '@sanctamaria/content';
import { useEffect, useRef, useState } from 'react';

import {
  addRosaryPlayerListener,
  load,
  play,
  skipTo,
  toggle,
  unload,
  useRosaryPlayerSelector,
  type RosaryPlaybackStatus,
} from '../../../modules/rosary-player';

import { auxiliumPacks } from '@/domains/audio/packs.gen';
import { packFor, silence, uriOf } from '@/domains/audio/use-rosary-audio';

import { buildAuxiliumQueue, type AuxiliumManifest } from './queue';

type AuxiliumPack = { manifest: AuxiliumManifest; files: Record<string, number> };

function auxiliumPackFor(locale: Locale): AuxiliumPack | null {
  const language = locale === 'la' ? 'la' : locale === 'en-US' ? 'en' : 'es';
  const packs = auxiliumPacks as unknown as Partial<Record<'es' | 'en' | 'la', AuxiliumPack>>;
  return packs[language] ?? null;
}

export function hasAuxiliumAudio(locale: Locale): boolean {
  return auxiliumPackFor(locale) !== null && packFor(locale) !== null;
}

export type AuxiliumAudio = {
  availability: 'unavailable' | 'idle' | 'loading' | 'ready';
  status: RosaryPlaybackStatus;
  /** Section the voice is on, while it plays. */
  index: number | null;
  toggle: () => void;
  skipTo: (index: number) => void;
};

type Options = {
  sections: readonly AuxiliumSection[];
  locale: Locale;
  pauseSeconds: number;
  rate: number;
  nowPlaying: { album: string; artist: string; titles: (section: AuxiliumSection) => string };
};

/**
 * Reads the day's prayers aloud through the native player, which keeps going with the
 * screen locked. Nothing loads until the person asks to listen; leaving the screen stops it.
 */
export function useAuxiliumAudio(options: Options): AuxiliumAudio {
  const { sections, locale, pauseSeconds, rate } = options;
  const available = hasAuxiliumAudio(locale);
  const [availability, setAvailability] = useState<AuxiliumAudio['availability']>(
    available ? 'idle' : 'unavailable',
  );
  const [index, setIndex] = useState<number | null>(null);
  const status = useRosaryPlayerSelector((state) => state.status);
  const pending = useRef<number>(0);
  const latest = useRef(options);
  latest.current = options;

  useEffect(() => {
    setAvailability(available ? 'idle' : 'unavailable');
    setIndex(null);
    const subscription = addRosaryPlayerListener('onStepChange', (event) => setIndex(event.index));
    return () => {
      subscription.remove();
      void unload();
    };
  }, [available, locale]);

  async function start(at: number) {
    const pack = auxiliumPackFor(locale);
    const rosary = packFor(locale);
    if (pack === null || rosary === null) {
      setAvailability('unavailable');
      return;
    }
    const queue = buildAuxiliumQueue(sections, pack.manifest, rosary.manifest, {
      pauseMs: pauseSeconds * 1000,
      responseGapMs: 450,
      afterAnnounceMs: 0,
    });
    if (queue === null) {
      setAvailability('unavailable');
      return;
    }
    const run = ++pending.current;
    setAvailability('loading');
    try {
      const silenceUri = await uriOf(silence);
      const steps = await Promise.all(
        queue.map(async (step, position) => ({
          id: step.id,
          title: latest.current.nowPlaying.titles(sections[position] as AuxiliumSection),
          parts: await Promise.all(
            step.parts.map(async (part) => ({
              uri:
                part.file === null
                  ? silenceUri
                  : await uriOf(pack.files[part.file] ?? rosary.files[part.file] ?? silence),
              gapAfterMs: part.gapAfterMs,
              durationMs: part.durationMs,
            })),
          ),
        })),
      );
      if (run !== pending.current) {
        return;
      }
      await load(steps, {
        startIndex: at,
        rate,
        nowPlaying: { album: latest.current.nowPlaying.album, artist: latest.current.nowPlaying.artist },
        silenceUri,
      });
      setIndex(at);
      setAvailability('ready');
      await play();
    } catch (error: unknown) {
      console.error('Auxilium audio failed to load', error);
      setAvailability('unavailable');
    }
  }

  return {
    availability,
    status,
    index: availability === 'ready' ? index : null,
    toggle: () => {
      if (availability === 'ready') {
        void toggle();
      } else if (availability === 'idle') {
        void start(0);
      }
    },
    skipTo: (target) => {
      if (availability === 'ready') {
        void skipTo(target);
      } else if (availability === 'idle') {
        void start(target);
      }
    },
  };
}
