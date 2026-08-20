# Task 016 - El Rosario en el reloj

## Objetivo

Rezar el Rosario entero desde el reloj: misterio, cuenta, avance con la corona y con el
toque.

## Dependencias

- Task 015

## Contexto

En una pantalla de cuatro centímetros no cabe el texto de un Ave con letra grande, y no
hace falta: en el reloj no se lee, se reza. Lo que la pantalla tiene que decir es **dónde
vas** y **qué misterio es**.

La competencia más cercana (una app que sí usa la corona) recibe reseñas pidiendo háptica
más fuerte, distinguir el Padrenuestro, y ver la imagen del misterio. Son el pliego de
requisitos.

## Qué construir

### 1. Pantalla de rezo

Misterio arriba, cuenta en el centro, progreso de la decena alrededor. Legible de un
vistazo, sin enfocar.

### 2. Corona digital

Girar pasa cuentas, con detente. Es el gesto natural y el que la gente pide.

### 3. Toque

Tocar avanza. La pantalla entera es el objetivo.

### 4. Pantalla siempre activa

Con la muñeca baja, la información esencial se mantiene legible y atenuada, sin apagarse a
mitad del Rosario.

### 5. Empezar y retomar

Abrir la app y empezar cuesta un gesto. Si hay una sesión a medias, ofrece retomarla.

### 6. Sin teléfono

Todo lo anterior funciona con el teléfono apagado o lejos.

## Criterios de éxito

1. Se reza el Rosario completo desde el reloj, sin teléfono, sin audio.
2. La corona pasa cuentas con detente y sin saltarse ninguna.
3. Con la muñeca baja durante una decena entera, al levantarla la app sigue donde estaba.
4. El misterio actual es identificable de un vistazo.
5. Lo rezado en el reloj aparece en el diario del teléfono.
6. Se verificó en un reloj real, no solo en el simulador.

## Decisiones tomadas (primera pasada, agosto 2026)

- Cinco decenas con el misterio a la vista, corona digital con detente (0 = Padrenuestro,
  1-10 = Ave, 10 = Gloria) y toque. El texto del Ave no cabe y no se muestra. Al terminar,
  el reloj envía las cinco decenas al diario del teléfono (mensaje si está cerca,
  `transferUserInfo` si no). Los títulos llegan del teléfono en el contexto.
- Always-on: el estado se conserva al bajar la muñeca. Actualizar el fotograma atenuado
  durante el rezo pide la sesión de ejercicio de la 018.
- Verificación en reloj real: pendiente.

## Ciclo completo

- [x] Definir qué aplica
- [x] ~~Contenido y motor - n/a~~
- [x] App - el diario recibe lo rezado en el reloj
- [x] Reloj - cinco decenas con corona
- [x] ~~Audio - n/a: task 017~~
- [x] Accesibilidad - etiqueta, valor y toque; recorrido con VoiceOver en aparato
      pendiente
- [x] ~~Sitio - n/a~~
