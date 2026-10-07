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
  useRosaryPlayerSelector,
  type RosaryPlaybackStatus,
} from '../../../modules/rosary-player';

import { audioPacks } from './packs.gen';
import { buildQueue, spokenAt, type AudioManifest, type QueueStep, type Spoken } from './queue';

const silence = require('@/assets/audio/silence.mp3') as number;

type Pack = { manifest: AudioManifest; files: Record<string, number> };

function packFor(locale: Locale): Pack | null {
  const packs = audioPacks as unknown as Partial<Record<Locale, Pack>>;
  return packs[locale] ?? null;
}

export function hasAudio(locale: Locale): boolean {
  return packFor(locale) !== null;
}

const resolved = new Map<number, Promise<string>>();

/** Local file URI of a bundled asset, resolved once per app run. */
function uriOf(module: number): Promise<string> {
  let uri = resolved.get(module);
  if (uri === undefined) {
    uri = (async () => {
      const asset = Asset.fromModule(module);
      if (asset.localUri === null) {
        await asset.downloadAsync();
      }
      return asset.localUri ?? asset.uri;
    })();
    resolved.set(module, uri);
  }
  return uri;
}

/** Resolves every file of a pack ahead of time, so starting to pray never waits on it. */
export async function prepareAudio(locale: Locale): Promise<void> {
  const pack = packFor(locale);
  if (pack === null) {
    return;
  }
  await uriOf(silence);
  for (const module of Object.values(pack.files)) {
    await uriOf(module);
  }
}

/** How much of the current prayer the voice has said; only the component that asks redraws. */
export function useSpoken(queue: QueueStep[] | null): Spoken | null {
  // A string snapshot keeps the subscription stable: equal values never trigger a redraw.
  const key = useRosaryPlayerSelector((state) => {
    const entry = queue?.[state.index];
    const spoken = entry === undefined ? null : spokenAt(entry.parts, state.positionMs);
    return spoken === null ? '' : `${spoken.role}:${spoken.chars}`;
  });
  if (key === '') {
    return null;
  }
  const [role, chars] = key.split(':');
  return { role: role === 'response' ? 'response' : 'leader', chars: Number(chars) };
}

/** How far through the current step the voice is, in tenths, or null when not playing. */
export function useStepProgress(enabled: boolean): number | null {
  return useRosaryPlayerSelector((state) =>
    !enabled || state.status !== 'playing' || state.durationMs <= 0
      ? null
      : Math.round((state.positionMs / state.durationMs) * 10) / 10,
  );
}

export type RosaryAudio = {
  availability: 'unavailable' | 'loading' | 'ready';
  status: RosaryPlaybackStatus;
  /** The steps as the player holds them; leaf components read progress against it. */
  queue: QueueStep[] | null;
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
 * the session unloads it. The screen using it redraws on status changes only.
 */
export function useRosaryAudio(options: Options): RosaryAudio {
  const { enabled, sessionId, steps, locale, rate, pauseSeconds } = options;
  const [availability, setAvailability] = useState<RosaryAudio['availability']>('loading');
  const status = useRosaryPlayerSelector((state) => state.status);
  const [queue, setQueue] = useState<QueueStep[] | null>(null);
  const latest = useRef(options);
  latest.current = options;

  useEffect(() => {
    if (!enabled || sessionId === null) {
      return;
    }
    const pack = packFor(locale);
    const built =
      pack === null
        ? null
        : buildQueue(
            steps,
            pack.manifest,
            { pauseMs: pauseSeconds * 1000, responseGapMs: 450, afterAnnounceMs: 4000 },
            (ref) => passage(ref, locale)?.text ?? '',
          );
    if (pack === null || built === null) {
      setAvailability('unavailable');
      return;
    }
    setQueue(built);

    let cancelled = false;
    setAvailability('loading');
    void (async () => {
      await prepareAudio(locale);
      const silenceUri = await uriOf(silence);
      const entries = await Promise.all(
        built.map(async (entry, index) => {
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
      await load(entries, {
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
    status,
    queue,
    toggle: () => void toggle(),
    skipTo: (index) => void skipTo(index),
  };
}
