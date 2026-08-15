# Stack de la app

Verificado en agosto de 2026 contra npm, la documentación de Expo y el código fuente.

## Base

Expo SDK 57.0.13, React Native 0.86.2, React 19.2.3. **La nueva arquitectura es
obligatoria desde SDK 55 y no se puede desactivar**: cualquier librería que no la soporte
está fuera.

`expo-router@57` **ya no depende de React Navigation** (se separó en SDK 56). Las pestañas
nativas siguen marcadas como inestables. Rutas tipadas y compilador de React vienen
activados por defecto en un proyecto nuevo.

## Monorepo con pnpm: menos configuración de la que parece

Documentación actualizada el 30 de junio de 2026, el mismo día del SDK 57:

1. **`node-linker=hoisted` ya no hace falta**: "From SDK 54, Expo supports isolated
   dependencies and isolated installations".
2. **El `metro.config.js` manual sobra**: "You don't have to manually configure Metro when
   using monorepos", y dice explícitamente qué borrar (`watchFolders`, `nodeModulesPath`,
   `extraNodeModules`, `disableHierarchicalLookup`).
3. **`unstable_enablePackageExports` está activo por defecto** → los paquetes del
   workspace necesitan su mapa `exports` con la condición `types` primero.
4. No hace falta transpilar los paquetes del workspace: se envía TypeScript crudo.
5. **React y React Native duplicados provocan errores en tiempo de ejecución.**
   Diagnóstico: `pnpm why --depth=10 react-native`.

Los tres primeros puntos se verificaron en este proyecto: se quitó `.npmrc` y el
`metro.config.js` manual y el empaquetado sigue funcionando.

## Estilos: StyleSheet con tokens propios

El ecosistema de Tailwind para React Native está partido: NativeWind 4 estable pero atado
a Tailwind 3; **NativeWind 5 lleva once meses en preview** y su documentación dice "not
intended for production use"; Unistyles 3.3 es estable pero pide plugin de Babel y
recompilación nativa; Uniwind tiene sus mejores piezas en versión de pago.

La postura oficial de Expo, en su propia guía de Tailwind (archivada bajo la sección
"Web"): "Tailwind does not support Android and iOS platforms". Lo único de primera parte
es `StyleSheet` y `@expo/ui`.

**Para una app pequeña con paleta propia: `StyleSheet` con una capa de tokens.** Cero
dependencias, cero magia de compilación, cero riesgo en cada actualización.

## Datos locales

`expo-sqlite@57` es el único que corre en Expo Go, y trae más de lo que parece: plantillas
con escapado automático, escucha de cambios, cifrado, y **`expo-sqlite/kv-store` con API
síncrona** (reemplazo directo de AsyncStorage sin dependencia extra). Lo único que le
falta son migraciones.

Para migraciones, **Drizzle** (`drizzle-orm@0.45.2` con `driver: 'expo'`). Ojo: **Drizzle
1.0 no ha salido estable** pero sus documentos ya recomiendan la versión candidata.

Descartados: WatermelonDB (soporte de nueva arquitectura abierto desde hace tiempo),
Legend-State v3 (dos años en beta), PowerSync (requiere servicio), react-native-mmkv
(innecesario).

**Si el diario son unos contadores y una lista, `kv-store` con JSON basta.** No adelantar
SQLite.

## Internacionalización: el hallazgo crítico

**Hermes sigue sin `Intl.PluralRules` en 2026.** Verificado de tres formas en el código de
Hermes. Y desde i18next v24 **no hay respaldo**: "Since i18next v24 there is no fallback".

→ **Sin el polyfill, los plurales de todo idioma que no sea inglés fallan en silencio.**

```jsonc
{
  "expo-localization": "57.0.1",
  "i18next": "26.3.6",
  "react-i18next": "17.0.11",
  "@formatjs/intl-locale": "5.3.10", // obligatorio, es dependencia del siguiente
  "@formatjs/intl-pluralrules": "6.3.13", // obligatorio
}
```

Se importan en ese orden. No hace falta `i18next-icu` para español, inglés ni portugués.

## Notificaciones locales

`expo-notifications@57`. Las locales **funcionan en Expo Go** (solo las push están
bloqueadas en Android). Detalles que muerden:

- El permiso de Android **no se pide hasta que existe un canal**: hay que crear el canal
  primero.
- **No pedir alarmas exactas.** La librería degrada sola, no declara el permiso, y en
  Android 14 solo lo pueden publicar apps de calendario o despertador: **una app
  devocional no califica y arriesga rechazo**. Un recordatorio tolera diez minutos de
  margen.
- El repetido diario es fiable y se re-arma tras reiniciar.
- El texto se congela al programar: **hay que reprogramar cuando cambia el idioma**.

## Widgets y actividades en vivo

**`expo-widgets@57.0.10` es oficial** (está en los módulos nativos empaquetados del SDK).
Se escriben en TSX con `@expo/ui`, sin Swift. `expo-live-activity` de Software Mansion
está deprecado y remite a este.

`@bacons/apple-targets` sigue haciendo falta para lo demás (unos 45 tipos de target,
incluido el del reloj, y SwiftUI libre).

## Salud y medición

- **`@kingstinct/react-native-healthkit@14`** (Nitro, nueva arquitectura, plugin propio).
  `react-native-health` está **roto por construcción**: sin un commit desde octubre de
  2024 y con el fallo de compilación en RN 0.86 abierto.
- **`react-native-health-connect@4.1.3`** para Android. **Su sesión de atención plena
  sigue siendo experimental**: hay que envolverla en try/catch y no condicionar nada a que
  funcione.
- Escribir una sesión de atención plena **no requiere sesión de ejercicio** ni Apple
  Watch.
- **Asimetría de permisos, citando a Apple:** "your app cannot determine whether or not a
  user has granted permission to read data". Nunca mostrar "no tienes permiso de lectura":
  tratar cero resultados como el caso normal.
- **`HKStateOfMind`** (iOS 17+) tiene la asociación `spirituality` y etiquetas como
  `peaceful` o `grateful`. Es autorreporte explícito, cero inferencia: la forma más
  honesta de registrar cómo fue el rezo.
- **Frecuencia cardiaca y variabilidad en iPhone sin reloj: imposible.** El iPhone no
  tiene sensor cardiaco; HealthKit almacena, no mide. Presentar una estimación por cámara
  como "tu frecuencia cardiaca al rezar" sería exactamente la pseudociencia que este
  producto evita.
- **Headspace, Calm e Insight Timer escriben duración de sesión y nada más.** Ninguna
  afirma medir atención. Ese es el listón.

## Detección de la respuesta hablada

**Ningún motor reconoce latín.** Whisper lo lista en su tokenizador pero su artículo no lo
menciona ni una vez; el único dato real es un ajuste fino con ~20% de error por carácter.

**No hace falta saber qué dijo el usuario, solo que terminó.** En latín el texto es fijo y
conocido. Un detector de actividad de voz de 1 MB resuelve mejor que un modelo de
reconocimiento de 140 MB.

- `expo-speech-recognition@56.0.1` da el nivel de volumen aunque el idioma no se
  reconozca, y permite activar **la cancelación de eco del sistema**, que expo-audio no
  activa. **No tiene versión para SDK 57** y tiene abierto el fallo "stops recognising
  after expo-audio finish playing", que es exactamente nuestro flujo.
- Parámetros prácticos: calibrar el ruido ambiente los primeros 300-500 ms de cada sesión
  (en una iglesia el piso de ruido sube), esperar de 900 a 1200 ms de silencio antes de
  avanzar, y descartar sonidos de menos de 200 ms.

## Pruebas

- Lógica pura: **vitest**, en pruebas que no importen react-native.
- Componentes: `jest-expo@57`. `@testing-library/react-native@14` es **fuertemente
  incompatible con la versión anterior** (todo devuelve promesas).
- De punta a punta: **Maestro**. Detox declara compatibilidad hasta RN 0.84 y el SDK 57 es
  0.86.

## Actualizaciones

`runtimeVersion` con política **`fingerprint`**, que ya no es experimental: elimina la
clase entera de fallo de "mandé JavaScript que el binario no puede ejecutar". El
diferencial de paquetes está activo por defecto desde SDK 56 (unos 75% menos de descarga).

## Donativos dentro de la app

**Se puede, si se llama propina.** Guideline 3.1.1: "Apps may use in-app purchase
currencies to enable customers to tip the developer".

Lo que **no** se puede: 3.2.2(iv) prohíbe "collecting funds within the app for charities
and fundraisers" salvo a organizaciones sin fines de lucro aprobadas, que un desarrollador
individual no puede ser.

**El riesgo real es el copy, no el mecanismo.** En una app de Rosario, un botón "Donar"
invita al revisor a leerlo como recaudación para causa religiosa. "Apoya el desarrollo" o
"invítame un café" es inequívocamente una propina. **Y la propina no puede desbloquear
nada.**

- **Inscribirse al programa de pequeñas empresas antes de publicar** (15%, con unos quince
  días de latencia; si se publica antes, las primeras ventas van al 30%).
- **RevenueCat** (`react-native-purchases@10`): gratis hasta 2.500 dólares mensuales. El
  consumible **no** va dentro de un derecho desbloqueable.
- Enlazar al sitio desde la app: **permitido hoy en Estados Unidos sin comisión**, pero el
  Tribunal Supremo escucha el caso este período. No construir el único modelo de ingresos
  sobre eso.
- Google tiene una excepción explícita para propinas que Apple no tiene.
- **Ninguna de las apps comparables (Hallow, Laudate, iBreviary, iRosary) usa el patrón de
  donación.** Hallow, la más grande y con equipo legal, se queda estrictamente en compras
  dentro de la app.
