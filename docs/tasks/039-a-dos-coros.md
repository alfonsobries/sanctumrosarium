# Task 039 - A dos coros

## Objetivo

Rezar en voz alta con la app: ella hace de guía o de respuesta.

## Dependencias

- Task 008, 002

## Contexto

Montfort llama al rezo público a dos coros "the most glorious to God" (Rosa 46). Es
también cómo se reza en familia y en parroquia. El audio de la 008 ya corta en llamada y
respuesta; esta task elige quién dice qué.

La decisión 7: tiempo y tacto, no reconocimiento de palabras.

## Qué construir

### 1. Dos papeles

- La app guía, tú respondes.
- Tú guías, la app responde.

### 2. Volumen

La parte que no te toca se oye; la que te toca, silencio o muy baja, para no taparte.

### 3. Familia

El modo en voz alta es el mismo aparato en el centro de la mesa. No hace falta una cuenta
ni una red.

## Criterios de éxito

1. Se reza un Rosario entero en cada papel.
2. El silencio de respuesta alcanza para decir la parte en voz alta, en los tres idiomas
   de la 008.
3. Cambiar de papel no reinicia el Rosario.
4. No se pide el micrófono.

## Decisiones tomadas (primera pasada, agosto 2026)

- **Dos papeles en Ajustes ("A dos coros")**: la voz guía y tú respondes (lo de siempre),
  o tú guías y la voz responde. En el segundo, la app calla el tiempo de tu llamada
  (duración de esa mitad por el mismo factor de respiro del ritmo) y luego dice su parte.
- **El volumen es silencio**: la parte que te toca no suena en absoluto; no hay pista a
  volumen bajo que te tape. Una oración sin corte de respuesta es toda tuya y la guía solo
  lleva el tiempo.
- **El piso del Avemaría se conserva** en los dos papeles: nada premia ir más rápido.
- Cambiar de papel es un ajuste: la sesión no se toca (criterio 3). Sin micrófono, por
  decisión 7 (criterio 4).
- El resaltado en el papel de respuesta cae sobre las líneas de la respuesta
  (`responseFrom` como offset); durante tu llamada no se resalta nada: esa parte es tuya.
- **Pendiente**: el papel en el reloj (cuando exista su audio, task 017) y la mención en
  la guía de rezar en familia del sitio (con la 034/040).

## Ciclo completo

- [x] Definir qué aplica
- [x] Contenido y motor - los cortes `lead`/`response` ya estaban
- [x] App
- [ ] Reloj - un papel simple, si el audio del reloj existe
- [x] Audio - reusa las mitades de la 008 en los tres idiomas
- [x] Accesibilidad - filas nativas con estado seleccionado; recorrido en aparato
      pendiente
- [ ] Sitio - la guía de rezar en familia lo menciona

## Fuentes

- Montfort Rosa 46; RVM 41-42; MC 52-54; decisión 7
