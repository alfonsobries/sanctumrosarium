# Contributing

Thanks for helping. Bug reports, text corrections, translations and code are all welcome.

## Reporting

- **A mistake in a prayer, mystery or passage:** open an issue with the text as it
  appears and the source it should match. Every text in `content/` comes from a published
  source; a correction needs one too.
- **A bug:** open an issue with the device, OS version, app version and steps to
  reproduce.
- **An idea:** open an issue describing the problem it solves before writing code.

## Development

See [Development](README.md#development) for setup and commands. Before opening a pull
request:

```sh
pnpm typecheck
pnpm test
pnpm --filter app test
```

If you change anything under `content/` or the watch, regenerate its data with
`pnpm watch:content` and commit the result.

## Pull requests

- One change per pull request, with a title in the
  [Conventional Commits](https://www.conventionalcommits.org) format (`feat:`, `fix:`,
  `docs:`...).
- Code, comments and commits in English. User-facing copy goes through i18n, in every
  locale.
- Prayer texts are never written from memory: add or change them in `content/` with their
  source.
- Native changes (a native module, config plugin, permission, the watch or the Expo SDK)
  raise `runtimeVersion` in `app/app.json`.

By contributing you agree that your contributions are licensed under the
[MIT License](LICENSE) and that you follow the [Code of Conduct](CODE_OF_CONDUCT.md).
