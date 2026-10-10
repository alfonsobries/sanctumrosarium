<p align="center">
  <img src="site/public/icon.png" alt="" width="112" height="112" />
</p>

<h1 align="center">Sanctum Rosarium</h1>

<p align="center">
  Pray the Holy Rosary on iPhone, Apple Watch and Android.<br />
  Catholic, free, with no account and no ads.
</p>

<p align="center">
  <a href="https://sanctumrosarium.app">sanctumrosarium.app</a> ·
  <a href="https://apps.apple.com/app/id6803640796">App Store</a> ·
  <a href="https://play.google.com/store/apps/details?id=app.sanctamaria">Google Play</a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" /></a>
</p>

---

## What it does

- **Pray.** Today's mystery is ready in one tap. Pray with two voices, a leader and a
  response, as in a community, or move on at your own pace with a tap or a swipe. The
  audio keeps going with the screen off, comes back by itself after a notification or a
  workout cue, and answers headphones and the lock screen.
- **On the wrist.** The Apple Watch prays the whole Rosary with its own audio, shows the
  words to read along and taps on every bead. The crown sets the volume; double tap moves
  on.
- **The Gospel.** Before each decade, the passage that tells the mystery. When several
  evangelists tell the same event, each Rosary reads a different one.
- **Learn.** How to pray it in five short steps, the twenty mysteries and every prayer,
  each with its source.
- **A quiet journal.** It counts rosaries and decades, never streaks.
- **Nine styles,** from plain to an illuminated manuscript, the old masters, Our Lady of
  Guadalupe and a large print edition, each in light and dark.
- **Four languages:** Spanish (Mexico and Spain), English and Latin, with a voice in all
  four.

Nothing leaves the device. There are no accounts, no server and no analytics; the watch
receives the journal straight from the phone.

## Content

Every prayer, mystery and Gospel passage comes from a published source (the Holy See,
the Mexican bishops' _Desde la fe_, the USCCB) and is stored with it. See
[`content/README.md`](content/README.md).

## Repository

| Path                 | What it is                                                               |
| -------------------- | ------------------------------------------------------------------------ |
| `app/`               | The Expo app (SDK 57) for iOS and Android                                |
| `app/targets/watch/` | The Apple Watch app, in SwiftUI                                          |
| `app/modules/`       | Native modules: the Rosary audio player and the phone to watch bridge    |
| `packages/rosary/`   | The engine: the sequence of steps, the weekday calendar, Gospel rotation |
| `content/`           | Prayers, mysteries, Gospel passages and lessons, each with its source    |
| `site/`              | The website, in Astro, in Spanish and English                            |
| `scripts/`           | Audio generation, icons, watch content, builds and releases              |

The app, the watch and the website pray from the same `content/` and `packages/rosary/`,
so a text fixed once is fixed everywhere.

## Development

Requirements: Node 22, pnpm 11, Xcode 26 for iOS and the watch, Android Studio for
Android.

```sh
pnpm install

pnpm test                # engine and content
pnpm --filter app test   # app logic
pnpm site:test           # website: contrast, links and metadata

cd app && npx expo run:ios      # iPhone simulator
cd app && npx expo run:android  # Android emulator
pnpm play                       # Metro on the local network, for a dev client on a phone
pnpm site                       # the website at localhost:4321
```

Builds run on this machine with EAS:

```sh
pnpm ios:build && pnpm ios:install   # development client on a connected iPhone
pnpm ios:preview                     # standalone build, no dev server
pnpm ios:release                     # App Store build and TestFlight upload
pnpm update:production               # JavaScript and assets over the air
```

An over-the-air update only reaches binaries with the same `runtimeVersion` in
`app/app.json`; raise it whenever the native layer or the watch changes.

The audio is regenerated with `pnpm audio:generate` (needs an ElevenLabs API key) and the
icons with `pnpm icons:generate`.

## Contributing

Issues and pull requests are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md). Ways to help
without code are on the [help page](https://sanctumrosarium.app/help/). This project
follows the [Code of Conduct](CODE_OF_CONDUCT.md). To report a vulnerability, see
[SECURITY.md](SECURITY.md).

## License

The code is under the [MIT License](LICENSE). The Bible translations and prayer texts
belong to their publishers and are not covered by it;
[`content/README.md`](content/README.md) lists each source and its terms.
