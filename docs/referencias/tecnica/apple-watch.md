# Apple Watch companion para una app Expo (rosario con audio mientras corres)

Consulta: 2026-08-15. Fuentes verificadas directamente (GitHub API, npm registry, JSON de
docs de Apple). Lo no verificado está marcado como **PENDIENTE**.

## 1. Opciones del lado Expo/RN

### (a) `@bacons/apple-targets` (Evan Bacon) - recomendado

- Versión 5.0.0 (2026-07-17). Repo 1,372 stars, 70 issues abiertos.
  <https://github.com/EvanBacon/expo-apple-targets>
- Requisitos: CocoaPods 1.16.2, Xcode 16 / macOS 15, Expo SDK 53+. En 5.0
  `generated.entitlements` se escribe en `ios/.targets/<name>/`.
- Tipos: incluye `watch` ("Watch App (with companion iOS App)") y `watch-widget` ("Watch
  Face Complication"). El README advierte: _"I haven't tested all of these and they may
  not work"_.
- Flujo: `npx create-target watch` genera `targets/watch/` con `expo-target.config.js`,
  Swift/SwiftUI puro. Tras `npx expo prebuild -p ios --clean` el target aparece en Xcode
  bajo `expo:targets/watch`, se edita ahí y sobrevive a prebuild. **La app de watch se
  escribe 100% en SwiftUI**: RN no corre en watchOS.
- **App Groups no cruzan iPhone <-> Watch** (el contenedor es por dispositivo).
  `ExtensionStorage` sirve para iPhone <-> widget iOS, o watch app <-> `watch-widget`.
  Para iPhone <-> Watch se usa WatchConnectivity
  (<https://developer.apple.com/documentation/watchconnectivity>).
- El repo trae un skill de agente con `watch.md`:
  `npx skills add EvanBacon/expo-apple-targets`.
- No es paquete oficial de Expo; la solución oficial nueva `expo-widgets` (SDK 56) no
  cubre watchOS.
- Issues abiertos a vigilar: #175 (2026-02, prebuild genera mal el wiring del target
  watch, reporter usa `patch-package`; fixes parciales #178/#179), #171 (sin opción de
  frameworks en target watchOS), #147/#148 (rechazo App Store por `CFBundleVersion`
  mismatch iOS/watch), #207 (2026-08-06, icono Liquid Glass en target watch), #99 (App
  Groups + Watch), #6/#16 (`watch-widget` poco probado).
- Ejemplos: `mpiannucci/eas-widget-watchos-example`; artículos de Chethiya Kusal (Medium)
  y keiver.dev (comunicación bidireccional con Local Expo Module + WCSession).
  **PENDIENTE** leer completos.

### (b) `react-native-watch-connectivity`

- v2.0.0 (2026-03-20), RN 0.76+, New Arch via codegen. Solo comunica; watch app sigue
  siendo Swift.
- Riesgo: issue #134 (abierto) - 2.0.0 falla al compilar
  (`WatchConnectivity/WCSession.h not found`, colisión de nombre de pod). Otros: #130,
  #127, #132.
- Veredicto: frágil. Mejor un **Expo Module local en Swift (~100 líneas)** que envuelva
  `WCSession` (`sendMessage` / `updateApplicationContext` / `transferFile`) y exponga
  eventos a JS.

### (c) Watch app 100% Swift en el workspace de prebuild

- Sin plugin, un target agregado a mano en `ios/` se pierde con `prebuild --clean`.
  Opciones: (1) apple-targets (recomendado), (2) commitear `ios/` y abandonar CNG, (3)
  config plugin propio.
- Canales iPhone <-> Watch (`WCSession` con delegate en ambos lados):
  - `sendMessage`: en vivo, requiere `isReachable`.
  - `updateApplicationContext(_:)`: dict "último estado", llega aunque el otro no esté
    reachable.
  - `transferUserInfo`: cola FIFO en background.
  - `transferFile(_:metadata:)`: background, throttled por energía; **no funciona en
    Simulator**.
  - CloudKit: independiente del iPhone (necesita red del reloj); útil para progreso, no
    para audio.
- Descargar audio directo en el reloj: `URLSession` background +
  `WKURLSessionRefreshBackgroundTask` (máx 4 tareas/hora con complicación activa). **Lo
  robusto: embeber los AAC en el bundle del target watch.**

### (d) Otras

- `expo-widgets` (estable SDK 56): widgets iOS + Live Activities; no genera targets
  watchOS. **PENDIENTE** si soporta `supplementalActivityFamilies(.small)`.
- `@expo/ui`: iOS/tvOS, no watchOS. Nada permite UI RN en watchOS.

### Recomendación

`@bacons/apple-targets@5` con `type: "watch"` (+ `watch-widget` para la complicación) +
watch app SwiftUI + audio embebido en el target watch + Expo Module local para WCSession
en iOS (solo configuración/estadísticas, no audio) + `HKWorkoutSession` con background
modes `workout-processing` + `audio`. Vigilar #175/#147 en cada bump del plugin.

## 2. Docs de Apple

### 2.1 Audio en watchOS sin iPhone

- **Playing Background Audio**
  (<https://developer.apple.com/documentation/watchkit/playing-background-audio>):
  Background Mode "Audio" (`UIBackgroundModes` = `audio` en el Info.plist del target
  watch), `setCategory(.playback, mode: .default, policy: .longFormAudio)`,
  `activate(options:completionHandler:)`, luego `AVAudioPlayer.play()`. "watchOS requires
  a Bluetooth audio route for long-form audio. If necessary, the system presents an audio
  route picker... If no applicable Bluetooth route is selected, the system passes an
  error".
- `activate(options:)`: "On supported Apple Watch models running watchOS 11.0 or later,
  the built-in speaker also satisfies this routing requirement... long-form audio can't
  play through the built-in speaker while the watch is charging."
- `RouteSharingPolicy.longFormAudio`: permite audio en background si activa ruta elegible;
  recomienda MediaPlayer (Now Playing / remote control).
- Con política longForm solo `.playback` y modos `.default`, `.moviePlayback`,
  `.spokenAudio` (spokenAudio encaja para el rosario).
- `allowBluetoothA2DP`: no necesaria con `.playback`.
- Solo un modo de extended runtime a la vez, combinable con `workout-processing`.
- Clips cortos en workout (**Running workout sessions**): "If your app plays audio or
  provides haptic feedback during the workout session, you must also add the Audio
  background mode... In order to play an audio clip, an active workout session must be
  running". Para el rosario completo usa long-form; clips cortos también funcionan bajo
  workout.
- AirPods sin iPhone: sí, el reloj se conecta directo. Sin audífonos BT: solo watchOS 11+
  en modelos con speaker, no cargando.

### 2.2 Mantener la app activa mientras corres + heart rate

- **HKWorkoutSession**: "All workout sessions generate high-frequency heart rate samples";
  solo una sesión a la vez en el reloj. `HKWorkoutConfiguration(.running, .outdoor)`,
  `HKLiveWorkoutBuilder`, autorización HealthKit **en el reloj** con usage descriptions en
  el target watch, background mode `workout-processing`.
- **WKExtendedRuntimeSession** (watchOS 6+): alternativa para rezar sin correr (tipo
  `mindfulness`); "can continue to communicate with Bluetooth devices, process data, or
  play sounds or haptics, even after the watch's screen turns off". Solo un tipo por app,
  combinable con workout.

### 2.3 Complicaciones, Smart Stack, Digital Crown, haptics

- Complicaciones: WidgetKit desde watchOS 9 (accessoryCircular/Rectangular/Inline/Corner);
  en apple-targets: `watch-widget`.
- **RelevanceKit** (watchOS 26): pistas contextuales para el Smart Stack (hora, lugar,
  inicio de workout). <https://developer.apple.com/documentation/relevancekit>
- Digital Crown: `.digitalCrownRotation(_:)` (vista `.focusable()`) - avanzar cuentas.
- Haptics: `WKInterfaceDevice.current().play(_:)`, tipos `WKHapticType` (click, start,
  stop, success, directionUp...). Sin efecto en background **salvo con workout session
  activa**; mínimo 100 ms entre llamadas; "Do not call this method while gathering heart
  rate data using HealthKit. When you engage the haptic engine, HealthKit stops gathering
  heart rate data until after the haptic engine finishes" (un tic por Ave María es
  aceptable; no haptics continuos).

### 2.4 Always-On

- `isLuminanceReduced` (watchOS 8+); `WKSupportsAlwaysOnDisplay`.
- Apps con sesión en background (workout o audio) "remain onscreen as long as the session
  is active"; frontmost sin sesión máx. 1 h; usar `TimelineView`, sin actualizaciones
  sub-segundo; no disponible en SE / Series 4 y anteriores.

### 2.5 Live Activities en el reloj (watchOS 11+)

- Las Live Activities de la app iOS aparecen en el Smart Stack del reloj; layout propio
  con `supplementalActivityFamilies([.small])` + `@Environment(\.activityFamily)`. Máx 8
  h. **Solo cuando el iPhone va contigo.**

### 2.6 watchOS 26

- Release notes:
  <https://developer.apple.com/documentation/watchos-release-notes/watchos-26-release-notes>.
  RelevanceKit es lo relevante. Liquid Glass afecta iconos (#207). **PENDIENTE**: Control
  Center widgets / Workout Buddy en watchOS 26 y novedades de watchOS 27 (beta).

## 3. Riesgos concretos

1. Prebuild rompe el target watch (#175). Mitigación: patch-package; verificar cada bump
   con `xcodebuild` local.
2. Rechazo App Store por CFBundleVersion mismatch iOS vs watch (#147/#148). Sincronizar
   versiones del target con `app.json`.
3. App Groups no cruzan iPhone <-> Watch. Usar WCSession o CloudKit.
4. Audio long-form exige ruta Bluetooth (o speaker watchOS 11+ no cargando); manejar el
   error con "conecta tus AirPods".
5. `sendMessage` solo llega si la app RN está viva; nunca depender de ella para el flujo
   de rezo.
6. `transferFile` no corre en Simulator y se throttlea; audio embebido en el target.
7. Cada haptic pausa la captura de HR; sin workout activo, haptics en background no
   suenan.
8. HealthKit se autoriza en el reloj; el Simulator no da HR real.
9. react-native-watch-connectivity 2.0.0 puede no compilar (#134). Módulo Expo propio.
10. Sin sesión (workout/audio) la app se suspende ~2 min tras bajar la muñeca; el rosario
    corre siempre bajo `HKWorkoutSession` (corriendo) o `WKExtendedRuntimeSession`
    `.mindfulness` (rezo estático).
11. Xcode 26 / Liquid Glass: iconos del target watch con problemas (#207).
12. Complicación `watch-widget` poco probada en el plugin; depurar a mano en Xcode.
