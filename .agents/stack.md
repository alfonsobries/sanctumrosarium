# Stack

Fuente única de verdad del stack. Se actualiza en el mismo cambio que la dependencia. Lo
verificado y sus advertencias están en
[`../docs/referencias/tecnica/`](../docs/referencias/tecnica/).

| Área                     | Elección                                       | Nota                                                    |
| ------------------------ | ---------------------------------------------- | ------------------------------------------------------- |
| Monorepo                 | pnpm workspaces                                | Sin `node-linker` ni metro.config: Expo ya no lo pide   |
| App móvil                | Expo SDK 57, React Native 0.86, React 19       | Nueva arquitectura, obligatoria desde SDK 55            |
| Navegación               | expo-router 57                                 | Rutas tipadas; ya no depende de React Navigation        |
| Estilos                  | StyleSheet con tokens propios                  | NativeWind 5 lleva once meses en preview                |
| Sitio                    | Astro 7                                        | Estático, con enrutado de idioma nativo                 |
| Lenguaje                 | TypeScript estricto                            | Sin `any`                                               |
| Pruebas de lógica        | vitest                                         | Contenido y motor                                       |
| Pruebas de punta a punta | Maestro                                        | Detox no cubre RN 0.86                                  |
| Formato y lint           | prettier, eslint (config de Expo)              |                                                         |
| Audio                    | expo-audio 57                                  | expo-av está eliminado desde SDK 55                     |
| Datos locales            | expo-sqlite (kv-store primero, tablas después) | Drizzle solo cuando hagan falta migraciones             |
| Idiomas de la app        | i18next + expo-localization                    | **Con `@formatjs/intl-pluralrules`**: Hermes no lo trae |
| Salud                    | @kingstinct/react-native-healthkit             | react-native-health está roto en RN 0.86                |
| Widgets                  | expo-widgets 57                                | Oficial; se escriben en TSX                             |
| Reloj                    | @bacons/apple-targets con target watchOS       | La app del reloj se escribe en Swift                    |
| Propinas                 | RevenueCat                                     | Consumibles fuera de derechos desbloqueables            |
| Errores                  | Sentry                                         | Expo fija la 7.11; npm va en la 8                       |
| Actualizaciones          | EAS Update con `runtimeVersion: fingerprint`   | Evita enviar JS que el binario no puede ejecutar        |

## Reglas que salen del stack

- **Los plurales fallan en silencio sin el polyfill.** Va desde el primer día, no cuando
  se note.
- **En Android, sin controles de pantalla bloqueada el audio se corta a los tres
  minutos.**
- **No pedir alarmas exactas**: una app devocional no califica y arriesga rechazo en Play.
- Los paquetes del workspace exportan TypeScript crudo con su mapa `exports`.

## Pendiente de decidir

- CarPlay y Android Auto: expo-audio no los cubre y la alternativa cuesta 999 EUR al año.
  Se decide antes de construir el audio, no después.
- Backend: hoy no hay ninguno y la decisión 4 dice que empiece así.
