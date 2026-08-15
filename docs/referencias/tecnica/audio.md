# Audio en la app

Verificado en agosto de 2026 contra fuentes primarias (npm, docs.expo.dev, código fuente
en GitHub, docs de Apple). Lo no verificado va marcado como PENDIENTE.

Línea base: Expo SDK 57.0.13 (30 jun 2026), React Native 0.86.2, React 19.2.3. iOS mínimo
16.4, Android `targetSdk` 36.

## expo-av está muerto; se usa expo-audio

Deprecado en SDK 53, última versión con soporte en SDK 54, **eliminado en SDK 55**:
"expo-av is no longer receiving patches and may not continue working in your apps"
([changelog SDK 55](https://expo.dev/changelog/sdk-55)). Su página de documentación
da 404.

**`expo-audio@57.0.3`** (22 jul 2026). Lo relevante: `useAudioPlayer`, `useAudioPlaylist`
(con reproducción encadenada sin huecos), `preload()`, `setAudioModeAsync`, y en el
reproductor `playbackRate`, `shouldCorrectPitch`, `volume`, `seekTo`,
`setActiveForLockScreen`.

## Segundo plano

```json
["expo-audio", { "enableBackgroundPlayback": true, "enableBackgroundRecording": false }]
```

Genera `UIBackgroundModes: [audio]` en iOS, y en Android el servicio de primer plano
`AudioControlsService` sobre Media3.

```ts
await setAudioModeAsync({
  shouldPlayInBackground: true,
  playsInSilentMode: true,
  interruptionMode: 'doNotMix',
});
```

**Trampa documentada de Android: sin `setActiveForLockScreen()` el audio se corta a los
tres minutos.** Un Rosario dura veinte: los controles de pantalla bloqueada no son
opcionales.

## Los controles de pantalla bloqueada ya son nativos

Cambio de 2026 que **anula la recomendación clásica de usar react-native-track-player**.
Verificado en el código: `MediaController.swift` usa `MPNowPlayingInfoCenter` y
`MPRemoteCommandCenter` (play, pause, posición, saltos de 10 s, pista anterior y
siguiente); Android usa Media3. Llegó en SDK 55 y **el soporte con listas de reproducción
llegó en 57.0.0**, que es justo nuestro caso y tiene semanas de vida: hay que esperar
bordes ásperos.

**react-native-track-player pasó a licencia comercial** en su versión 5 (may 2026):
"commercial use requires a paid license", 99 EUR/mes o 999 EUR/año
([rntp.dev/pricing](https://rntp.dev/pricing)). La versión vieja (Apache-2.0) tiene fallos
abiertos con la nueva arquitectura, que es obligatoria en RN 0.86.

**Solo se justifica pagarla si queremos CarPlay o Android Auto**, que expo-audio no cubre.
Como rezar manejando es un caso de uso real, la decisión hay que tomarla antes de
construir, no después.

## Formato y tamaño

**AAC-LC mono en `.m4a` a 48 kbps.** Es el único códec de primera clase en iOS y Android a
la vez. Opus ahorra un 30% pero iOS no lo reproduce de disco de forma fiable (PENDIENTE) y
obligaría a mantener dos juegos de archivos.

**MP3 tiene un problema específico aquí:** cada archivo lleva silencio de codificación al
principio y al final, y con decenas de clips encadenados eso se acumula de forma audible.
El `.m4a` lleva metadata para encadenar sin huecos.

| Calidad     | ~40 min  |
| ----------- | -------- |
| 32 kbps AAC | ~9,4 MB  |
| 48 kbps AAC | ~14,1 MB |
| 64 kbps AAC | ~18,8 MB |

## Encadenar los clips

`AudioPlaylist` usa `AVQueuePlayer` en iOS, elegido explícitamente por su reproducción sin
huecos ([expo/expo#43600](https://github.com/expo/expo/issues/43600)), y Media3 en
Android.

**PENDIENTE crítico: no hay ninguna cifra publicada de latencia entre clips.** Hay que
medirla en dispositivo. Menos de 20 ms es imperceptible; más de 80 ms se oye como
tartamudeo en una letanía.

**Recomendación: pre-concatenar por unidad litúrgica**, no por clip. Un archivo por decena
completa (Padrenuestro, diez Avemarías, Gloria) más las piezas sueltas: de cincuenta y
tres clips a diez o doce archivos. El encadenado perfecto donde importa queda garantizado
por construcción, y las transiciones que quedan caen en pausas naturales. Cuesta un paso
de compilación con `ffmpeg`.

## Velocidad, mezcla y silencios

- `player.setPlaybackRate(0.8, 'high')` con `shouldCorrectPitch`. Útil de verdad: 0.8x
  para rezar con niños o con gente mayor.
- **Dos reproductores a la vez sí funcionan** (verificado en el código). La música de
  fondo se baja a mano (volumen 0.15); no hace falta atenuación automática porque sabemos
  cuándo hay voz.
- `interruptionMode: 'doNotMix'` es lo que exige la pantalla bloqueada, así que **el
  Rosario en segundo plano no puede convivir con Spotify**. Es correcto para el caso de
  uso, pero hay que decirlo.

## Offline

`expo-file-system@57.0.4`, API de clases `File`/`Directory`. `Paths.document` es
persistente; `Paths.cache` lo puede borrar el sistema, así que ahí no van los cuarenta
minutos. El `downloadFirst` de expo-audio baja al directorio temporal: sirve para
latencia, no para offline garantizado.

**Estrategia: embeber un idioma en el binario** (unos 14 MB, funciona sin red desde el
primer arranque) y descargar los demás bajo demanda.

## Sincronización del texto con el audio

El hallazgo que reordena el problema: **nosotros generamos el audio, así que la
sincronización no es alineación forzada, es elegir un proveedor que devuelva las marcas de
tiempo de fábrica.**

| Estrategia                                      | Precisión               | Coste         | Latín                         |
| ----------------------------------------------- | ----------------------- | ------------- | ----------------------------- |
| Marcas del propio sintetizador                  | Exacta por construcción | Cero extra    | Funciona                      |
| Sintetizar fragmento por fragmento y concatenar | Exacta por construcción | Cero extra    | Funciona                      |
| Alineación forzada sobre audio ya grabado       | 20 a 50 ms              | CPU o $0.22/h | Solo con algunas herramientas |

- **Azure** (`WordBoundary`): devuelve para cada palabra el desplazamiento en el audio, la
  duración y **el rango de caracteres en el texto de entrada**, además de distinguir
  palabra, puntuación y frase. Es lo mejor del mercado para esto y no hay que hacer
  emparejado de cadenas.
  ([docs](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-speech-synthesis))
- **Google**: marcas SSML `<mark>` con `enableTimePointing: SSML_MARK`, solo en `v1beta1`.
  Perfecto para resaltado por línea.
- **ElevenLabs**: endpoint `/with-timestamps` con tiempos por carácter, y una **API de
  alineación forzada** aparte a 0.22 USD por hora, o sea unos 15 centavos por idioma.
- **OpenAI**: no da marcas de tiempo ni SSML. Descartado para esto.

Si el audio es humano, la alineación forzada la resuelve **Echogarden** (MIT, TypeScript,
sin Python, alineación por comparación contra síntesis con eSpeak, que **sí tiene
latín**). Alternativas: aeneas (funciona, pero su última versión es de 2017), o Montreal
Forced Aligner con el modelo italiano y un léxico latino escrito a mano, que es viable
porque el latín eclesiástico es fonéticamente italiano.

**Recomendación: resaltado por línea, no por palabra.** Es mucho más robusto y en una
oración pausada se ve mejor; palabra por palabra se siente nervioso.

## Formato de las marcas

Un JSON de cues por clip, no SRT ni WebVTT (que obligan a parsear texto en tiempo de
ejecución y no tienen dónde poner lo que este producto necesita). Milisegundos enteros,
rango de caracteres por palabra, y el papel de cada línea (guía o respuesta) como dato, no
como código.

## Riesgos

1. **Latencia real entre clips**: sin cifra publicada. Es lo único que puede invalidar el
   enfoque de lista de reproducción.
2. **Reproducir y escuchar a la vez** (el modo a dos voces): expo-audio no activa la
   cancelación de eco del sistema, así que el audio de la oración puede colarse por el
   micrófono. Es el riesgo número uno del proyecto y hay que prototiparlo el primer día.
3. Los controles de pantalla bloqueada con listas tienen semanas de vida.
4. Sin CarPlay ni Android Auto en expo-audio.
