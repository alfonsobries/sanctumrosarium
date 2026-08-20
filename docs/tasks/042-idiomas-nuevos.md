# Task 042 - Idiomas nuevos

## Objetivo

Italiano, portugués, francés, polaco y alemán, cada uno con su forma real de rezar y su
audio.

## Dependencias

- Task 001, 002, 005, 008

## Contexto

El principio del producto: multiidioma como contenido, no como traducción. El alemán mete
el misterio como cláusula dentro del Ave y no lo anuncia aparte. El polaco reza siempre la
oración de Fátima. Francia cambió el Padrenuestro en 2017; Italia, en 2020. Portugal y
Brasil dicen "terço".

Los textos oficiales están apuntados en el dossier C.4.13. Ninguno se escribe de memoria.

## Qué construir

### 1. Formas

Una `RosaryForm` por región que lo pida. La alemana tiene `announce: false` y cláusulas
obligatorias. La polaca tiene Fátima encendida por defecto.

### 2. Textos

Del Compendio y de la conferencia episcopal de cada lengua. Fuente en el dato.

### 3. Audio

Una voz por lengua, con el mismo corte de llamada y respuesta.

## Criterios de éxito

1. Cada idioma nuevo reza el Rosario entero con su forma, no con la romana traducida.
2. El Padrenuestro francés e italiano usan el texto vigente de su conferencia.
3. El validador falla si falta fuente.
4. Tests cubren: cada forma nueva, Fátima por defecto en polaco, cláusulas obligatorias en
   alemán.

## Decisiones abiertas

- Orden de llegada. Recomendación: portugués (Fátima original), italiano, francés, polaco,
  alemán. El alemán es el más distinto y el que más prueba el motor.

## Bloqueo (agosto 2026)

Ningún texto de italiano, portugués, francés, polaco o alemán entra sin la redacción de la
conferencia episcopal o del Compendio en esa lengua, con fuente en el dato. El dossier
apunta dónde están; no los transcribe. Sin transcripción verificada, esta task no arranca.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor
- [ ] App
- [ ] Reloj - hereda el idioma elegido en el teléfono
- [ ] Audio
- [ ] Accesibilidad
- [ ] Sitio - cada lengua del sitio que esté activa

## Fuentes

- Dossier C.2 (tabla regional) y C.4.13
