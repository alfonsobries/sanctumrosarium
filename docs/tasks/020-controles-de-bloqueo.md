# Task 020 - Controles de bloqueo y auriculares

## Objetivo

Llevar el Rosario entero sin desbloquear el teléfono: desde la pantalla de bloqueo, desde
los auriculares y desde el coche.

## Dependencias

- Task 008

## Contexto

Se reza manejando y corriendo. Sacar el teléfono para pasar de decena es exactamente lo
que la app viene a evitar.

## Qué construir

### 1. Información en la pantalla de bloqueo

Qué misterio y qué oración suena, con la imagen del misterio como carátula.

### 2. Controles

Reproducir y pausar, avanzar y retroceder de cuenta o de decena (lo que resulte más útil
probando en la calle, no en el escritorio).

### 3. Auriculares

Los botones de los auriculares hacen lo mismo, incluido el doble toque.

### 4. Coche

Aparece en la pantalla del coche con lo mínimo: qué misterio, y pausa.

## Criterios de éxito

1. Se reza el Rosario entero sin desbloquear el teléfono.
2. La pantalla de bloqueo dice siempre el misterio y la oración actual.
3. Los controles de auriculares funcionan con el teléfono en el bolsillo.
4. En el coche, la información se lee de un vistazo y no invita a mirar.

## Decisiones tomadas (primera pasada, agosto 2026)

- **"Siguiente" salta de decena**, no de cuenta: el audio ya avanza las Avemarías. La
  cuenta atrás desde la primera decena vuelve al inicio; adelante desde la quinta, al
  cierre. El motor lo hace (`skipDecade`).
- **Now Playing nativo de expo-audio** (`setActiveForLockScreen`,
  `interruptionMode: doNotMix`). El recorte de Android a los tres minutos sin esto está
  documentado en `docs/referencias/tecnica/audio.md`. La barra de progreso del clip se
  oculta (`isLiveStream`): no invita a mirar ni a buscar en una Avemaría.
- Play/pausa en bloqueo y auriculares van por expo-audio. El doble toque (pista
  siguiente/anterior) no lo cubre expo-audio: un módulo local iOS
  (`modules/lock-screen-remote`) registra `nextTrackCommand` / `previousTrackCommand`. En
  Android esa pista siguiente sigue pendiente: Media3 lo posee expo-audio.
- **CarPlay / Android Auto como app propia, no.** expo-audio no los cubre y
  react-native-track-player pasó a licencia comercial. El Now Playing del sistema sí
  aparece en el coche: misterio, oración, pausa. Una app CarPlay queda fuera de esta
  pasada.
- La carátula del misterio espera a la task 036. Hasta entonces, sin imagen: el texto
  basta.

## Ciclo completo

- [x] Definir qué aplica
- [x] Contenido y motor - `skipDecade`
- [x] App - Now Playing y salto de decena
- [x] ~~Reloj - n/a: el reloj tiene sus propios controles~~
- [x] Audio - el mismo guía, ahora con bloqueo
- [x] Accesibilidad - es la vía principal de uso sin manos (play/pausa y salto de decena
      sin mirar)
- [x] ~~Sitio - n/a~~
