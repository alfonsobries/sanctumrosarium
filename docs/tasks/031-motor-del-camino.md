# Task 031 - Motor del Camino

## Objetivo

Las ocho etapas existen como recorrido, se avanzan rezando de esa forma, y no dan puntos.

## Dependencias

- Task 005, 025

## Contexto

La progresión de verdad no es acumular: es aprender a rezar mejor. El diseño está en
[`../gamificacion.md`](../gamificacion.md), sección 3. Waking Up es la referencia secular:
se avanza recorriendo, no desbloqueando.

Las ocho etapas:

1. La estructura
2. Meditar
3. Las cláusulas
4. Responder
5. Latín
6. Cantar
7. En familia
8. El Rosario completo

Cada una tiene contenido real. Se puede saltar a la que se quiera. Completarla no tira
confeti: hay una frase de lo que ahora sabes hacer.

## Qué construir

### 1. El modelo

Etapa, estado (no empezada, en curso, recorrida), cuántas veces se rezó de esa forma.
Lógica pura, en el motor o en un paquete junto a él.

### 2. Avance

Una etapa se recorre rezando así unas cuantas veces, no aprobando un examen. El número se
fija en la task al implementar y se puede cambiar. La app nunca exige un orden.

### 3. Apagado

Si la progresión está apagada, el Camino no aparece y el Rosario sigue completo.

## Criterios de éxito

1. Las ocho etapas existen y se pueden abrir en cualquier orden.
2. No hay XP, nivel ni insignia.
3. Apagar el Camino no quita ninguna forma de rezar.
4. La pantalla pasa las cinco preguntas de `docs/gamificacion.md`.
5. Tests cubren: avance por uso, salto, apagado, y que nada suba una etapa sola.

## Decisiones tomadas (primera pasada, agosto 2026)

- **Modelo en el motor** (`packages/engine/src/camino.ts`): ocho etapas con umbral
  `timesToWalk: 3` (ajustable ahí), estados `not-started / walking / walked`, y
  `waysOfSession` que lee de la sesión cómo se rezó. Sin puntos ni insignias: el tipo de
  etapa ni siquiera tiene dónde ponerlos (un test lo guarda).
- **El diario guarda el cómo** (migración v5): columna `ways` por rosario. Las etapas
  detectables cuentan actos del diario; los veinte misterios cuentan días cuyos rosarios
  suman veinte decenas.
- **Cantar y en familia no se detectan y no se adivinan**: la persona lo dice ("Hoy recé
  así"), un día a la vez (`camino_marks`, única por etapa y día). Sin micrófono.
- Al descartar una sesión a medias solo cuenta lo que sus propias opciones prueban
  (idioma, cláusulas), nunca pausa ni papel.
- **Los rosarios anteriores a esta task no traen `ways`**: el Camino cuenta desde que
  existe. Se decidió no reconstruir el pasado: sería adivinar.
- Apagador en Ajustes (v13 `caminoEnabled`); apagado, la entrada del inicio desaparece y
  nada más cambia.
- Tras la revisión doctrinal: una sesión descartada no camina ninguna etapa (sus decenas
  sueltas siguen contando para la Regla); los veinte misterios cuentan días con los cuatro
  grupos distintos (el diario guarda el grupo, migración v6), no veinte decenas; los
  conteos llevan unidad ("2 de 3 rosarios", "1 de 3 días"); y la marca de hoy se puede
  quitar, por quien se equivoca y por quien se escrupuliza.
- **Pendiente**: la página del sitio (con la escuela, 034) y el contenido formativo
  extenso de cada etapa (032/034); hoy cada etapa lleva su enseñanza en dos líneas y el
  gesto concreto para rezar así.

## Ciclo completo

- [x] Definir qué aplica
- [x] Contenido y motor
- [x] App
- [x] ~~Reloj - n/a: el Camino se lee y se configura en el teléfono~~
- [x] ~~Audio - n/a~~
- [x] Accesibilidad - filas nativas, estados con texto, sin información solo por color
- [ ] Sitio - el Camino se explica en una página, sin venderlo como curso (con la 034)

## Fuentes

- [`../gamificacion.md`](../gamificacion.md), sección 3; RVM 5 (el Rosario como escuela)
