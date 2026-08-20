# Task 032 - Meditar

## Objetivo

Antes de cada decena: enunciar el misterio, oír la Palabra, callar un momento.

## Dependencias

- Task 031, 003, 005

## Contexto

Es el método de RVM 29-31, y es lo que distingue rezar el Rosario de recitarlo. El motor
ya tiene los pasos `reading` y `silence`. Esta task los enciende de verdad: con el texto
bíblico (cuando la decisión 10 lo permita) y con un silencio que el usuario mide.

Juan XXIII añade tres momentos por misterio: contemplar, reflexionar, pedir. Sirven de
plantilla de pantalla, no de examen.

## Qué construir

### 1. Lectura

El pasaje de cada misterio, con su referencia y su traducción. Mientras la decisión 10
esté abierta, se muestra la referencia y no se inventa el versículo.

### 2. Silencio

Configurable en segundos. Cero es válido. Un toque lo corta. El valor por defecto es corto
(unos diez segundos), no una meditación de quince minutos.

### 3. La etapa del Camino

Rezar así unas veces recorre la etapa 2. Se puede usar el modo sin haber abierto el
Camino: es un ajuste del rezo.

## Criterios de éxito

1. Cada decena puede abrir con anuncio, lectura y silencio, en ese orden.
2. Sin licencia bíblica, la app no rellena el pasaje con redacción propia.
3. El silencio no bloquea: un toque sigue.
4. Tests cubren: el orden RVM, silencio cero, y que el motor no lea un texto vacío como si
   fuera un versículo.

## Decisiones abiertas

- Traducción bíblica por idioma (decisión 10). Esta task no cierra la decisión: la
  consume.

## Decisiones tomadas (primera pasada, agosto 2026)

- **Sección "Meditar" en Ajustes** (v16): leer la Palabra antes de la decena y el silencio
  en 0, 10, 30 o 60 segundos. El motor ya traía ambos pasos con sus tests; el orden es el
  de RVM: anuncio, lectura, silencio.
- **Apagado por defecto, a diferencia de la spec** ("valor por defecto unos diez
  segundos"): encender un silencio que el usuario no pidió contradice la regla de que la
  app no sube nada sola, y cambiaría el rezo de quien ya usa la app. El primer valor al
  encenderlo son los diez segundos de la spec.
- **La lectura muestra la cita, no el pasaje** (decisión 10 abierta): "Mt 3,13-17" con
  "Lee el pasaje y escucha." No existe siquiera campo de texto del pasaje en el contenido:
  no hay forma de inventarlo (criterio 2 por construcción).
- El silencio no bloquea: el paso avanza con un toque como cualquier otro, y con la voz el
  silencio dura exactamente lo elegido. En la lectura, la guía sostiene veinte segundos de
  quietud (`READING_MS`) porque no hay voz que lea el pasaje todavía.
- **La etapa Meditar del Camino** cuenta la sesión cuando hubo lectura, silencio o pausa
  larga del misterio: cualquier freno deliberado del método.
- **Pendiente**: el pasaje impreso y su voz cuando la decisión 10 cierre; el reloj
  (silencio y anuncio sí, lectura larga no, con el bloque del reloj); la guía del método
  en el sitio (034).

## Ciclo completo

- [x] Definir qué aplica
- [x] Contenido y motor - ya existían los pasos; la cita viene del contenido
- [x] App
- [ ] Reloj - el silencio y el anuncio sí; la lectura larga no (bloque del reloj)
- [ ] Audio - cuando la decisión 10 permita leer el pasaje con voz
- [x] Accesibilidad - pasos con texto plano; el silencio anuncia su etiqueta
- [ ] Sitio - la guía del método cita RVM 29-31 (con la 034)

## Fuentes

- RVM 29-31; dossier C.3 y C.5.2
