# Task 024 - Aprender el latín

## Objetivo

Pasar de escuchar el latín a responderlo de memoria, oración por oración, sin examen y sin
puntaje.

## Dependencias

- Task 023, 022

## Contexto

Es el diferenciador que nadie tiene. El Camino (task 031) lo nombra como etapa; esta task
es la mecánica, y puede usarse sin haber abierto el Camino.

La decisión 7 manda tiempo y tacto en la primera versión, no reconocimiento de palabras.
El latín no lo cubre ningún motor de voz.

## Qué construir

### 1. Tres modos por oración

- Escuchar: la guía dice las dos mitades.
- Responder leyendo: la guía dice la primera, el texto de la segunda está a la vista.
- Responder de memoria: la guía dice la primera, el texto de la segunda se atenúa.

El usuario elige el modo. La app no lo sube sola.

### 2. Por oración, no por Rosario

Se puede saber el Ave de memoria y seguir leyendo la Salve. El estado se guarda por
oración.

### 3. Mezcla

Lo que ya pide la 021: unas oraciones en latín y otras en la lengua propia, en el mismo
Rosario.

## Criterios de éxito

1. Las tres fases existen y se cambian sin perder el sitio.
2. Atenuar el texto no impide avanzar: un toque basta.
3. No hay nota, porcentaje ni "oración dominada".
4. La pantalla pasa las cinco preguntas de `docs/gamificacion.md`.

## Decisiones abiertas

- Si la detección de voz por energía entra aquí o espera. Recomendación: espera. Tiempo y
  tacto bastan para aprender.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor
- [ ] App
- [ ] ~~Reloj - n/a: aprender se lee, y en el reloj no se lee~~
- [ ] Audio - usa las pistas de la 022
- [ ] Accesibilidad - atenuar no es la única señal de que toca responder
- [ ] Sitio - una página corta de cómo se aprende

## Fuentes

- Dossier, C.4 y C.5.12; decisión 7 de [`../DECISIONES.md`](../DECISIONES.md)
