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

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor
- [ ] App
- [ ] ~~Reloj - n/a: el Camino se lee y se configura en el teléfono~~
- [ ] ~~Audio - n/a~~
- [ ] Accesibilidad
- [ ] Sitio - el Camino se explica en una página, sin venderlo como curso

## Fuentes

- [`../gamificacion.md`](../gamificacion.md), sección 3; RVM 5 (el Rosario como escuela)
