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

## Decisiones tomadas (primera pasada, agosto 2026)

- **Tres modos por oración** en "Aprender el latín" (Ajustes, sección de latín): escuchar
  las dos mitades, responder leyendo (el default de siempre) y responder de memoria.
  Guardado por oración (v15 `latinLearn`); ausente significa leer.
- **Escuchar** manda en el audio: la guía dice las dos mitades seguidas, con el resaltado
  siguiendo la segunda. Los otros dos modos no tocan el audio, así que el papel de la 039
  (tú guías / la voz responde) sigue valiendo tal cual.
- **De memoria** atenúa la mitad de la respuesta (y su lengua compañera) y pone encima la
  línea "Respondes tú, de memoria.": esa línea es la señal que no depende de la vista y la
  lee el lector de pantalla. Un toque en Siguiente avanza igual.
- La lista solo ofrece oraciones con corte de llamada/respuesta y audio en latín; las que
  se dicen enteras no tienen qué aprender por mitades.
- **Quedarse en blanco tiene salida sin salir del rezo**: en modo de memoria, el primer
  toque sobre el paso muestra el texto y solo el siguiente avanza; el botón Siguiente
  avanza siempre con un toque (criterio 2). No se registra cuántas veces se mostró:
  contarlo sería una nota. (El toque no vive en la propia marca: un Pressable anidado en
  el área de avance no recibe el toque en este árbol.)
- Sin estado de "dominada", sin conteo, sin subir el modo solo: cambiarlo es siempre un
  acto de la persona y no reinicia la sesión.
- **Mientras la voz en latín sea provisional, la pantalla lo dice**: se aprende de oído, y
  ese oído merece saber que la pronunciación aún no está garantizada (misma condición de
  publicación que la 022).
- **Pendiente**: detección de voz por energía (se queda esperando, como recomienda la
  spec) y la página corta del sitio (con la 034).

## Ciclo completo

- [x] Definir qué aplica
- [x] Contenido y motor - n/a: el estado vive en ajustes, el corte ya estaba
- [x] App
- [x] ~~Reloj - n/a: aprender se lee, y en el reloj no se lee~~
- [x] Audio - usa las pistas de la 022
- [x] Accesibilidad - la línea "Respondes tú, de memoria." acompaña al atenuado
- [ ] Sitio - una página corta de cómo se aprende (con la 034)

## Fuentes

- Dossier, C.4 y C.5.12; decisión 7 de [`../DECISIONES.md`](../DECISIONES.md)
