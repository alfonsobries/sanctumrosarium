# Sanctum Rosarium

App para rezar el Santo Rosario, católica y de código abierto. Qué es y para quién:
`docs/producto.md`.

## Estructura

- `app/` - Expo (iOS, Android) y el reloj (`app/targets/watch`, Swift)
- `site/` - sitio en Astro (sanctumrosarium.app), español e inglés; el texto litúrgico sale de `content/`
- `packages/rosary` - el motor: secuencia de pasos, calendario, rotación de evangelios
- `content/` - oraciones, misterios y pasajes, cada uno con su fuente

## Reglas del producto

- **Ningún texto que se reza se escribe de memoria.** Sale de `content/` con su fuente.
- Lo esencial del Rosario (misterio, Padrenuestro, diez Avemarías, Gloria) no se puede
  apagar.
- La app funciona completa sin conexión y sin cuentas: no hay servidor. El diario vive
  solo en el dispositivo; el reloj lo comparte con el teléfono por WatchConnectivity.
- Se cuentan actos (rosarios, decenas, días). Sin rachas que se pierden, sin comparar
  con otros, sin promesas de efectos espirituales.
- Nada interrumpe el rezo: ni diálogos, ni permisos, ni avisos.
- Las skins cambian la apariencia, nunca el texto ni la estructura.

## Código

- Código, comentarios y commits en inglés; documentación y copy en español e inglés.
- El diario guarda la fecha local de quien reza, no UTC.
- Estilos con NativeWind y tokens por rol (`bg-background`, `text-muted`); cada skin
  define sus valores en `app/src/shared/theme/skins.ts`.

## Comandos

- `pnpm test` - motor; `pnpm --filter app test` - lógica de la app
- `pnpm --filter app typecheck`
- `pnpm play` - Metro en la red local para el dev client de un celular (`pnpm play 192.168.X.X` fija la IP)
- `cd app && npx expo run:ios` - compilar el dev client
- `pnpm site` / `pnpm site:test` - sitio en desarrollo / compila y prueba contraste, enlaces y metadatos
- `pnpm --filter site og` - regenera las imágenes para redes de `site/public/og`
- `pnpm update:preview` / `pnpm update:production` - publicar JavaScript y assets por OTA al canal

## Actualizaciones OTA

Una actualización OTA solo llega a los binarios con el mismo `runtimeVersion` de
`app/app.json`. Súbelo (+1) cuando cambie la capa nativa: un módulo nativo, un config
plugin, un permiso, el reloj (`app/targets/watch`) o el SDK de Expo; eso pide un build
nuevo en la tienda. Los cambios solo de JavaScript, textos o imágenes van por OTA sin
tocarlo.
