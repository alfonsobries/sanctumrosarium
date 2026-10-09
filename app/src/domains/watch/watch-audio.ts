import { passage, type Locale } from '@sanctamaria/content';
import { Asset } from 'expo-asset';

import { audioPacks, scripturePacks } from '@/domains/audio/packs.gen';
import type { AudioManifest, ManifestTrack } from '@/domains/audio/queue';

import type { WatchAudioPackOffer } from '../../../modules/watch-bridge';

import { watchAudioPack, watchSilenceFile, type WatchReadings } from './watch-pack';

const silence = require('@/assets/audio/silence.mp3') as number;

type Pack = { manifest: AudioManifest; files: Record<string, number> };
type ScripturePack = { manifest: { tracks: Record<string, ManifestTrack> }; files: Record<string, number> };

/** The Gospel read aloud, one pack per translation: both Spanish locales share it. */
function scripturePackFor(locale: Locale): ScripturePack | null {
  const language = locale === 'la' ? 'la' : locale === 'en-US' ? 'en' : 'es';
  return (scripturePacks as unknown as Partial<Record<'es' | 'en' | 'la', ScripturePack>>)[language] ?? null;
}

async function pathOf(module: number): Promise<string | null> {
  const asset = Asset.fromModule(module);
  if (asset.localUri === null) {
    await asset.downloadAsync();
  }
  const uri = asset.localUri;
  return uri === null || !uri.startsWith('file://') ? null : decodeURI(uri.slice('file://'.length));
}

/**
 * The pack the watch should hold for `locale`: the playback plan and the recordings on
 * this phone, with the passage each mystery reads next when `readings` is given. Without
 * a complete pack on the phone, an offer with no version, so the watch prays that
 * language without audio.
 */
export async function watchAudioPackOffer(
  locale: Locale,
  readings: WatchReadings | null,
): Promise<WatchAudioPackOffer> {
  const pack = (audioPacks as unknown as Partial<Record<Locale, Pack>>)[locale];
  const scripture = scripturePackFor(locale);
  const plan =
    pack === undefined
      ? null
      : watchAudioPack(
          locale,
          pack.manifest,
          readings === null
            ? null
            : {
                readings,
                track: (ref) => scripture?.manifest.tracks[ref],
                text: (ref) => passage(ref, locale)?.text ?? '',
              },
        );
  if (pack === undefined || plan === null) {
    return { locale, files: [] };
  }
  const files: { name: string; path: string }[] = [];
  for (const name of plan.files) {
    const module = name === watchSilenceFile ? silence : (pack.files[name] ?? scripture?.files[name]);
    const path = module === undefined ? null : await pathOf(module);
    if (path === null) {
      return { locale, files: [] };
    }
    files.push({ name, path });
  }
  return { locale, version: plan.version, parts: JSON.stringify(plan.parts), files };
}
