# Vista general

## Qué es

Una app para rezar el Santo Rosario, en español, inglés y latín, con audio, Apple Watch y
una progresión pensada para la constancia, no para el enganche. Y un sitio que enseña a
rezarlo.

## Estado

Proyecto recién creado. Existe la estructura del monorepo, la investigación (doctrina,
competencia, técnica) y el plan completo. Todavía no hay producto: la primera task es el
paquete de contenido.

El **nombre del producto no está decidido**; los documentos hablan de "la app" y "el
sitio". Ver `docs/DECISIONES.md`.

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
