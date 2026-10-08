import type { Locale } from '@sanctamaria/content';
import { Asset } from 'expo-asset';

import { audioPacks } from '@/domains/audio/packs.gen';
import type { AudioManifest } from '@/domains/audio/queue';

import type { WatchAudioPackOffer } from '../../../modules/watch-bridge';

import { watchAudioPack, watchSilenceFile } from './watch-pack';

const silence = require('@/assets/audio/silence.mp3') as number;

type Pack = { manifest: AudioManifest; files: Record<string, number> };

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
 * this phone. Without a complete pack on the phone, an offer with no version, so the
 * watch prays that language without audio.
 */
export async function watchAudioPackOffer(locale: Locale): Promise<WatchAudioPackOffer> {
  const pack = (audioPacks as unknown as Partial<Record<Locale, Pack>>)[locale];
  const plan = pack === undefined ? null : watchAudioPack(locale, pack.manifest);
  if (pack === undefined || plan === null) {
    return { locale, files: [] };
  }
  const files: { name: string; path: string }[] = [];
  for (const name of plan.files) {
    const module = name === watchSilenceFile ? silence : pack.files[name];
    const path = module === undefined ? null : await pathOf(module);
    if (path === null) {
      return { locale, files: [] };
    }
    files.push({ name, path });
  }
  return { locale, version: plan.version, parts: JSON.stringify(plan.parts), files };
}
