# Comandos

## Raíz

- `pnpm check` - lo que corre antes de subir: lint, tipos y pruebas
- `pnpm test` - pruebas de los paquetes de contenido y motor
- `pnpm typecheck` - tipos de todo el monorepo
- `pnpm format` - formato

## App

- `pnpm app` - servidor de desarrollo de Expo
- `pnpm app:ios` / `pnpm app:android` - compilar y correr en dispositivo o simulador
- `pnpm app:check` - tipos, lint y formato de la app

## Sitio

- `pnpm site` - servidor de desarrollo de Astro
- `pnpm site:build` - compilar
- `pnpm site:check` - revisión de Astro

## Paquetes

- `pnpm --filter @rosario/content test` - pruebas del contenido litúrgico
- `pnpm --filter @rosario/engine test` - pruebas del motor
- Una sola prueba: agregar `-- -t "nombre"`
