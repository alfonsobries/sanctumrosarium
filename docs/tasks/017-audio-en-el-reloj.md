# Task 017 - Audio independiente en el reloj

## Objetivo

Que el reloj rece en voz alta a los auriculares, sin el teléfono: la promesa que ninguna
app del nicho cumple hoy.

## Dependencias

- Task 016, 008 (el audio ya cortado y empaquetado)

## Decisiones tomadas (primera pasada, agosto 2026)

- Sesión `playback` + `spokenAudio` + `longFormAudio`. Sin ruta Bluetooth (ni altavoz
  reciente), la pantalla dice "Conecta los auriculares, o reza con la háptica." No falla
  en silencio.
- El paquete reducido de un idioma **no se embebe todavía**: transferir desde el teléfono
  no funciona en simulador y el tamaño hay que medirlo. El andamio de la 008 vive en el
  teléfono. Siguiente pasada: un idioma AAC en `targets/watch/assets/`, tamaño anotado.
- Verificación en reloj y AirPods reales: pendiente.

## Ciclo completo

- [x] Definir qué aplica
- [x] ~~Contenido y motor - n/a~~
- [ ] App - elegir el idioma y la voz del reloj
- [x] Reloj - sesión de audio y estado sin auriculares
- [ ] Audio - paquete reducido embebido
- [x] Accesibilidad - el aviso se lee; la háptica cubre el avance
- [x] ~~Sitio - n/a~~
