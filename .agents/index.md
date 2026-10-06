# SanctaMaria

App para rezar el Santo Rosario, católica y de código abierto. Qué es y para quién:
`docs/producto.md`.

## Estructura

- `app/` - Expo (iOS, Android) y el reloj (`app/targets/watch`, Swift)
- `api/` - Laravel 13: cuentas opcionales (Apple, Google) y sincronización del diario
- `packages/rosary` - el motor: secuencia de pasos, calendario, rotación de evangelios
- `content/` - oraciones, misterios y pasajes, cada uno con su fuente

## Reglas del producto

- **Ningún texto que se reza se escribe de memoria.** Sale de `content/` con su fuente.
- Lo esencial del Rosario (misterio, Padrenuestro, diez Avemarías, Gloria) no se puede
  apagar.
- La app funciona completa sin cuenta y sin conexión. El diario vive en el dispositivo y
  se sincroniza cuando hay cuenta.
- Se cuentan actos (rosarios, decenas, días). Sin rachas que se pierden, sin comparar
  con otros, sin promesas de efectos espirituales.
- Nada interrumpe el rezo: ni diálogos, ni permisos, ni avisos.
- Las skins cambian la apariencia, nunca el texto ni la estructura.

## Código

- Código, comentarios y commits en inglés; documentación y copy en español e inglés.
- El diario guarda la fecha local de quien reza, no UTC.
- Estilos con NativeWind y tokens por rol (`bg-background`, `text-muted`); cada skin
  define sus valores en `app/src/shared/theme/skins.ts`.
- Tipos y rutas de la API se generan: `cd api && composer types`.

## Comandos

- `pnpm test` - motor; `pnpm --filter app test` - lógica de la app
- `pnpm --filter app typecheck`
- `pnpm api:check` - Pint, Larastan y Pest
- `pnpm app` - Expo; `cd app && npx expo run:ios`
