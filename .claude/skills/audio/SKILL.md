---
name: audio
description:
  Produce y empaqueta el audio del Rosario - grabar o sintetizar, cortar por oración y por
  mitad, generar las marcas de tiempo del resaltado, y armar el paquete offline de un
  idioma. Usar al añadir una voz o un idioma, al rehacer una pista o al preparar el audio
  reducido del reloj.
---

# Audio

El audio decide si la app sirve para correr, manejar y rezar a oscuras. Es el trabajo más
caro del proyecto, así que el proceso está escrito para no repetirlo.

## Antes de grabar nada

- La decisión de voces (humanas o sintetizadas, y quién graba) está en
  `docs/DECISIONES.md`. Mientras esté abierta, cualquier audio sintetizado es andamio de
  desarrollo y **no se publica**.
- El texto que se va a grabar ya tiene que estar en `packages/content`, partido en líneas
  y en mitades. Se graba contra ese texto, no contra un documento aparte.

## Estructura del audio

- **Una pista por mitad de oración** (la parte del guía y la parte de la respuesta), no
  por oración completa: así se puede intercalar el silencio sin cortar la voz.
- Nombres derivados del identificador de la oración, el idioma, la variante y la voz.
  Estables: no se renombran nunca.
- Un manifiesto por idioma: qué pistas hay, qué duración, qué voz, qué versión del texto.

## Marcas de tiempo

- Se generan por alineación automática contra el texto y **se revisan a mano en las
  oraciones cortas**, que son las que se repiten cincuenta veces.
- Formato simple y versionado, junto al audio.
- Si faltan, la app muestra el texto sin resaltado. Nunca es un error fatal.

## Silencio de respuesta

No es un número fijo: se calcula del largo de la parte que el usuario tiene que decir, en
ese idioma. Se verifica rezando en voz alta, sin prisa, con alguien mayor.

## Empaquetado

- Paquete por idioma y voz, con su tamaño declarado antes de descargar y borrable.
- El paquete del reloj es un subconjunto: un idioma, una voz. Va dentro de la app del
  reloj, no se transfiere desde el teléfono.

## Verificación antes de dar por hecho

1. Rezar el Rosario entero con ese audio, en voz alta, siguiendo las respuestas.
2. Con auriculares Bluetooth: sin cortes entre pistas.
3. Con la pantalla apagada y la app en segundo plano.
4. A velocidad distinta de la normal: el resaltado sigue cuadrado.
5. Con una llamada entrante a mitad de una decena.
