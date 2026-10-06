# SanctaMaria

Una app para rezar el Santo Rosario: iPhone, Android y Apple Watch. Católica, gratis y
de código abierto.

- **Rezar** el misterio del día en un toque, con audio o avanzando a tu ritmo.
- **Aprender** cómo se reza, cada misterio con su pasaje del Evangelio y cada oración con
  su fuente.
- **Diario** de los días rezados, en el dispositivo; con cuenta opcional, sincronizado.
- **Skins**, de lo sencillo a un manuscrito iluminado.

Todo lo que se reza sale de fuentes oficiales citadas en [`content/`](content/README.md).

## Estructura

| Carpeta            | Qué es                                                      |
| ------------------ | ----------------------------------------------------------- |
| `app/`             | Expo (SDK 57): la app y el reloj (`app/targets/watch`)      |
| `api/`             | Laravel 13: cuentas con Apple o Google y sincronización     |
| `packages/rosary`  | El motor: secuencia de pasos, calendario, rotación de lecturas |
| `content/`         | Oraciones, misterios y pasajes, con su fuente               |
| `scripts/`         | Generación del audio (ElevenLabs) y del contenido del reloj |

## Desarrollo

```sh
pnpm install
pnpm play                 # API en la red local + Metro, la app ya apunta a la API
pnpm test                 # motor y contenido
pnpm --filter app test    # lógica de la app
cd app && npx expo run:ios

cd api && composer install && cp .env.example .env && php artisan key:generate
php artisan migrate && php artisan serve
```

La app se conecta a la API cuando `EXPO_PUBLIC_API_URL` está definida (por ejemplo en
`app/.env.local`). Sin ella, funciona completa sin cuenta.

El audio se regenera con `pnpm audio:generate` (requiere `ELEVENLABS_API_KEY`).

## Licencia

El código es de código abierto. Los textos bíblicos y algunas oraciones tienen derechos de
sus editores; ver [`content/README.md`](content/README.md).
