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

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor
- [ ] App
- [ ] Reloj - el silencio y el anuncio sí; la lectura larga no
- [ ] Audio - si hay voz, lee el pasaje o deja el silencio
- [ ] Accesibilidad
- [ ] Sitio - la guía del método cita RVM 29-31

## Fuentes

- RVM 29-31; dossier C.3 y C.5.2
