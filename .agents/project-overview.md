# Vista general

## Qué es

SanctaMaria: una app para rezar el Santo Rosario, en español, inglés y latín, con audio,
Apple Watch y una progresión pensada para la constancia, no para el enganche. Y un sitio
que enseña a rezarlo. Dominio: sanctamaria.app.

## Estado

Hay investigación, plan (47 tasks) y una primera capa de producto: contenido y motor
probados, andamio de rezo en la app, sitio con misterios. Ninguna task está cerrada. El
orden para retomar está en `docs/propuesta.md`.

## Piezas

| Pieza              | Qué hace                                                                     |
| ------------------ | ---------------------------------------------------------------------------- |
| `packages/content` | Oraciones, misterios, formas regionales y calendario, con su fuente          |
| `packages/engine`  | Convierte todo eso en la secuencia de pasos de un Rosario, y lleva el estado |
| `app/`             | La app: pantalla de rezo, audio, diario, ajustes, y el reloj                 |
| `site/`            | Sitio: cómo se reza, los misterios, la app, donar                            |

## Dominio, en corto

- Un **Rosario** son cinco decenas de un **ciclo de misterios** (gozosos, luminosos,
  dolorosos, gloriosos), más lo que abre y lo que cierra, que **cambia por región**.
- Una **decena** es: anuncio del misterio, Padrenuestro, diez Avemarías, Gloria, y
  opcionalmente una jaculatoria.
- El **misterio del día** depende del día de la semana y del tiempo litúrgico.
- La **Regla** es a lo que el usuario se compromete. No obliga bajo pecado y se puede
  bajar siempre.
- El **diario** es el registro local de lo rezado. De él salen la fidelidad del mes y las
  rosas.

Todo el detalle doctrinal está en `docs/referencias/rosario-doctrina.md`.
