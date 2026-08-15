# Stack

Fuente única de verdad del stack. Se actualiza en el mismo cambio que la dependencia.

| Área              | Elección                                    | Nota                                          |
| ----------------- | ------------------------------------------- | --------------------------------------------- |
| Monorepo          | pnpm workspaces                             | `app`, `site`, `packages/*`                   |
| App móvil         | Expo SDK 57, React Native 0.86, React 19    | Nueva arquitectura                            |
| Navegación        | expo-router                                 | Rutas tipadas                                 |
| Sitio             | Astro 7                                     | Estático, multiidioma                         |
| Lenguaje          | TypeScript estricto                         | Sin `any`                                     |
| Pruebas de lógica | vitest                                      | Contenido y motor                             |
| Formato y lint    | prettier, eslint (config de Expo)           |                                               |
| Reloj             | Target watchOS en Swift dentro del proyecto | Ver `docs/referencias/tecnica/apple-watch.md` |

## Pendiente de decidir

Estas piezas se cierran con lo que devuelva la investigación técnica en
`docs/referencias/tecnica/`:

- Sistema de estilos de la app
- Reproducción de audio y controles de bloqueo
- Almacenamiento local del diario
- Internacionalización de la app
- Salud (frecuencia cardiaca y atención plena)
- Donativos dentro de la app y en el sitio
