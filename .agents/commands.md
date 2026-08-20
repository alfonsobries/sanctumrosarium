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
- `pnpm app:test` - pruebas de la app (vitest)

## Builds e instalación

- `pnpm ios:build` / `pnpm android:build` - dev client local (EAS local) → `app/build/`
- `pnpm ios:install` / `pnpm android:install` - instala ese build en el aparato por USB
- `pnpm ios:release` / `pnpm android:release` - build de tienda local + envío (`:build` y
  `:submit` por separado)

## Herramientas

- `pnpm icons:generate` - regenera todos los iconos y splash desde `assets/icon.svg`
- `pnpm dark` / `pnpm light` - cambia la apariencia del simulador/emulador corriendo

## Sitio

- `pnpm site` - servidor de desarrollo de Astro
- `pnpm site:build` - compilar
- `pnpm site:check` - revisión de Astro

## Paquetes

- `pnpm --filter @rosario/content test` - pruebas del contenido litúrgico
- `pnpm --filter @rosario/engine test` - pruebas del motor
- Una sola prueba: agregar `-- -t "nombre"`
