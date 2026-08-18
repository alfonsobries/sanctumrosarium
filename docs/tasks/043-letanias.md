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

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor
- [ ] App
- [ ] Reloj - se pueden rezar solas si ya hay audio
- [ ] Audio
- [ ] Accesibilidad
- [ ] Sitio - una página que las distingue del Rosario (DPPL 203)

## Fuentes

- DPPL 203; vatican.va letanías ES/EN; dossier C.4.12
