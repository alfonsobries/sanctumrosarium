# Proyecto

SanctaMaria: app móvil y sitio web para rezar el Santo Rosario. Multiidioma (español,
inglés y latín), con audio, Apple Watch y una progresión que ayuda a la constancia sin
gamificar la oración. Fidelidad total a lo que la Iglesia católica enseña. Dominio:
sanctamaria.app.

Monorepo con pnpm:

- `app/` - app móvil con Expo y React Native (incluye el target de watchOS cuando exista)
- `site/` - sitio en Astro
- `packages/content` - todo lo que se reza: oraciones, misterios, formas regionales, con
  su fuente
- `packages/engine` - el motor del Rosario: lógica pura que produce la secuencia de pasos

## Antes de tocar contenido litúrgico, leer la fuente

`docs/referencias/rosario-doctrina.md` es la fuente de verdad de todo lo que se reza y de
cómo se reza: magisterio, estructura, variantes regionales, textos completos en latín,
español e inglés, indulgencias y sus condiciones. **Ningún texto se escribe de memoria.**
Si no está ahí ni en una fuente citable, no entra.

## When to read what

- Antes de diseñar progresión, rachas, logros o cualquier métrica: `docs/gamificacion.md`
  y `docs/referencias/ripperger-y-gamificacion.md`. Este producto tiene reglas duras al
  respecto.
- Antes de decidir en qué superficie vive una feature: `.agents/superficies.md`.
- Antes de escribir cualquier texto que un usuario vaya a leer: `docs/voz.md` y el skill
  `voz`.
- Antes de tocar el reloj, el audio o el stack: `docs/referencias/tecnica/`, que trae lo
  verificado y lo que puede no funcionar.
- Antes de implementar una task: leerla completa en `docs/tasks/` y auditar su alcance
  contra el código actual.
- Stack y versiones: `.agents/stack.md`. Comandos: `.agents/commands.md`.
- Lo que falta decidir (identidad, modelo económico, voces): `docs/DECISIONES.md`.
- Para retomar el proyecto: `docs/propuesta.md` (estado, huecos, criterio y orden).

## Plan de producto

`docs/PLAN.md` (visión y principios), `docs/FEATURES.md` (mapa), `docs/ROADMAP.md` (orden
y tasks), `docs/tasks/` (specs). El ciclo que cierra una feature es el skill
`ciclo-completo`.

`competencia/` tiene el análisis del mercado: qué hace cada app, qué le reprochan sus
usuarios, y dónde están los huecos.
