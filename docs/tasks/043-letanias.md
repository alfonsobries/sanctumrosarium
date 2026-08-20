# Task 043 - Letanías

## Objetivo

Las letanías lauretanas como acto propio: rezadas y cantadas, con su contador, sin
mezclarse con el Rosario.

## Dependencias

- Task 002, 008, 021

## Contexto

El Directorio (DPPL 203) corrige la idea de que las letanías son apéndice del Rosario:
"son un acto de culto por sí mismas". León XIII las pidió al final del Rosario en octubre;
por eso mucha gente las reza ahí. Las dos cosas son verdad: se pueden rezar al final (ya
son un paso opcional del motor) y se pueden rezar solas.

Los textos con las adiciones de 1980, 1995 y 2020 ya están en el paquete.

## Qué construir

### 1. Devoción propia

Una entrada "Letanías lauretanas", con su secuencia y su registro en el diario, distinto
del Rosario.

### 2. Rezadas y cantadas

Audio hablado y, cuando exista grabación, canto. El canto es otro paquete de audio, no un
filtro.

### 3. Al final del Rosario

Siguen siendo el ajuste que ya hay. Encenderlas al final no las registra otra vez como
devoción aparte.

## Criterios de éxito

1. Se rezan solas, de principio a fin, con las invocaciones de 2020 en su sitio.
2. El diario no suma una letanía como un Rosario.
3. El texto no dice que sean parte esencial del Rosario.
4. Tests cubren: orden de 2020, devoción aparte, y que el cierre del Rosario no duplica el
   registro.

## Decisiones tomadas (primera pasada, agosto 2026)

- **Devoción propia**: entrada "Letanías lauretanas" desde el inicio, con su registro en
  el diario como acto aparte (`kind: 'litany'`, migración v4). Las vistas del Rosario
  (Regla, fidelidad, rosas) solo ven rosarios; probado que una letanía no suma como
  rosario.
- **Al final del Rosario**: interruptor en Ajustes (v8) que enciende el paso `litany` del
  motor; el interruptor de la oración tras las letanías solo aparece con la letanía
  encendida. Cerrar el Rosario con letanías no la registra dos veces (el paso es parte del
  rosario, no un acto aparte).
- **Rezando en latín**, cada invocación lleva su lengua compañera debajo, con las
  respuestas en cursiva; los datos ya venían alineados por invocación.
- El orden con las adiciones de 1980, 1995 y 2020 lo garantiza el paquete de contenido con
  su test.
- **Pendiente con razón**: audio hablado y cantado (paquetes propios, cuando la voz deje
  de ser andamio), y la página del sitio que las distinga (con la escuela, 034).

## Ciclo completo

- [x] Definir qué aplica
- [x] Contenido y motor - contenido ya existía; el diario distingue el acto
- [x] App
- [ ] Reloj - cuando haya audio (task 017)
- [ ] Audio - pendiente con la voz definitiva
- [x] Accesibilidad - texto corrido con roles normales; recorrido en aparato pendiente
- [ ] Sitio - página propia con la 034

## Fuentes

- DPPL 203; vatican.va letanías ES/EN; dossier C.4.12
