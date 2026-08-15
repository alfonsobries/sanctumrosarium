# Task 017 - Audio independiente en el reloj

## Objetivo

Que el reloj rece en voz alta a los auriculares, sin el teléfono: la promesa que ninguna
app del nicho cumple hoy.

## Dependencias

- Task 016, 008 (el audio ya cortado y empaquetado)

## Contexto

Lo verificado está en
[`../referencias/tecnica/apple-watch.md`](../referencias/tecnica/apple-watch.md). Los tres
hechos que condicionan el diseño:

- El audio largo en el reloj **exige una ruta Bluetooth**. Si no hay auriculares
  conectados, el sistema pide elegir salida y, si el usuario cancela, la reproducción
  falla. Hay que tratar ese caso como estado de primera clase, no como error.
- Transferir archivos desde el teléfono es lento, se limita por energía y no funciona en
  el simulador. El audio del reloj tiene que **venir dentro de la app del reloj**.
- El sistema mantiene la app viva mientras hay sesión de audio o de ejercicio; fuera de
  eso, se suspende.

Consecuencia de producto: el audio del reloj es un paquete reducido (un idioma, una voz)
que se elige desde el teléfono. No caben cuatro idiomas.

## Qué construir

### 1. Reproducción en el reloj

Sesión de audio de larga duración, con la categoría de voz hablada, encadenando las pistas
del Rosario con sus silencios de respuesta.

### 2. Salida de audio

Detectar si hay ruta Bluetooth. Si no la hay, decirlo con una frase clara ("conecta tus
auriculares") y ofrecer rezar sin audio, con háptica.

### 3. Paquete de audio del reloj

Un idioma y una voz, elegidos desde el teléfono, incluidos en la app del reloj. Con su
tamaño declarado.

### 4. Continuar

Si el reloj se queda sin batería o la app muere, al volver retoma la cuenta.

## Criterios de éxito

1. Con el teléfono apagado y unos auriculares conectados al reloj, se reza el Rosario
   entero con voz.
2. Sin ruta de audio, la app lo dice y ofrece la alternativa, sin fallar en silencio.
3. La reproducción continúa con la muñeca baja durante toda la sesión.
4. El tamaño del paquete de audio del reloj está medido y documentado.
5. Verificado en reloj y auriculares reales.

## Decisiones abiertas

- Qué hacer en los relojes con altavoz cuando no hay auriculares: el sistema lo permite en
  versiones recientes y no cargando. Recomendación: permitirlo, avisando que se oirá por
  el altavoz.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] ~~Contenido y motor - n/a~~
- [ ] App - elegir el idioma y la voz del reloj
- [ ] Reloj
- [ ] Audio
- [ ] Accesibilidad - el aviso de "conecta tus auriculares" se anuncia con lector de
      pantalla
- [ ] ~~Sitio - n/a~~
