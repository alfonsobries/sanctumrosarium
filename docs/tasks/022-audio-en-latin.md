# Task 022 - Audio en latín

## Objetivo

Rezar el Rosario en latín con voz, pronunciación eclesiástica, y el mismo hueco para
responder que ya tiene el audio en español y en inglés.

## Dependencias

- Task 021, 008

## Contexto

El latín con audio digno es el hueco más claro del mercado: solo Ascension lo ofrece bien,
y no como algo que se pueda aprender. Esta task es el audio; el aprendizaje es la 024.

La decisión 5 manda voz humana para producción. La síntesis con voz italiana y texto
respeelado sirve de andamio interno, nunca de pista publicada sin decirlo. El detalle está
en [`../referencias/tecnica/voces.md`](../referencias/tecnica/voces.md).

El latín eclesiástico no es el latín de un sintetizador: `ae`/`oe` se leen e, `ti` + vocal
es tsi, `h` de _mihi_ es k, y el acento no es el italiano. Quien grabe tiene que saberlo.

## Qué construir

### 1. Pistas

Las mismas unidades que la 008: llamada y respuesta por oración, más el anuncio de cada
misterio en latín. Un juego, no una pista por misterio de Ave.

### 2. Pronunciación

Eclesiástica, no restaurada. Se anota la convención en Acerca de, en una línea.

### 3. Empaquetado

Mismo formato y misma descarga offline que el resto de idiomas. El latín se puede bajar
aparte: no viaja dentro del binario si el español o el inglés ya lo ocupan.

### 4. Andamio

Si hace falta generar pistas para desarrollar, se marcan como síntesis y no se publican.

## Criterios de éxito

1. Se reza el Rosario entero en latín con audio, sin conexión, con espacio para responder.
2. Alguien que sepa latín eclesiástico escuchó las pistas y anotó lo que suena mal.
3. Las marcas de tiempo de la 009 existen también para el latín.
4. La app no presenta síntesis como voz humana.

## Decisiones abiertas

- Quién graba. Recomendación: un sacerdote o seminarista, con cesión perpetua por escrito,
  aunque el trabajo sea donado. Un locutor comercial casi seguro no sabe el latín
  litúrgico.

## Decisiones tomadas (primera pasada, agosto 2026)

- **Andamio sintetizado** con la voz española del catálogo (más cercana al latín
  eclesiástico que una inglesa), marcado `provisional: true` como el resto: nunca se
  presenta como voz humana ni se publica (criterio 4 por construcción).
- Mismas unidades que la 008 (llamada/respuesta por oración) y **marcas de tiempo de la
  009 incluidas** (criterio 3): el resaltado funciona en latín.
- Verificado en simulador: el guía latino reza y avanza solo, con el hueco para responder;
  convive con el texto bilingüe y con las cláusulas.
- **Pendiente**: el oído de alguien que sepa latín eclesiástico (criterio 2), la nota de
  pronunciación en "Acerca de" (cuando la voz sea real y la pronunciación garantizada), la
  descarga aparte del paquete (misma razón que la 008: falta hosting), y el anuncio del
  misterio con voz.

## Ciclo completo

- [x] Definir qué aplica
- [ ] ~~Contenido y motor - n/a: los textos son la 021~~
- [ ] App - el idioma de rezo puede ser latín con la interfaz en español o inglés
- [ ] Reloj - si el audio del reloj (017) ya existe, este idioma entra o queda pendiente
      con su razón
- [ ] Audio
- [ ] Accesibilidad - el lector no pelea con el audio latino
- [ ] Sitio - la guía del latín menciona que hay audio

## Fuentes

- Dossier, C.4 (textos) y
  [`../referencias/tecnica/voces.md`](../referencias/tecnica/voces.md)
