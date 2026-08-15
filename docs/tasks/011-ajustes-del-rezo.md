# Task 011 - Ajustes del rezo

## Objetivo

Que cada quien rece como reza: su idioma, su región, sus oraciones opcionales, su ritmo,
su voz.

## Dependencias

- Task 005, 007, 008

## Contexto

El Rosario tiene un núcleo fijo y un marco que cambia por región y por costumbre personal
(RVM 37: "son usos igualmente legítimos"). Cablear una forma es el error que se le
reprocha a media competencia, y es también una falta de respeto a la tradición del otro.

Lo esencial (misterio, Padrenuestro, diez Avemarías, Gloria) **no** es configurable.

## Qué construir

### 1. Idioma y región

Idioma del rezo y variante regional, separados del idioma de la interfaz. Cambiarlos no
pierde la sesión en curso.

### 2. Oraciones opcionales

Cada una con su interruptor y una línea que dice de dónde viene:

- Oración de Fátima tras cada decena (tradición de Fátima, no parte esencial)
- Tres Avemarías iniciales
- Credo al inicio, o "Dios mío, ven en mi auxilio"
- Salve al final
- Letanías lauretanas
- Oración final "Oh Dios, cuyo Unigénito"
- Oración por las intenciones del Papa
- San Miguel
- Ofrecimiento y acto de contrición (formas hispanas)

### 3. Ritmo

Velocidad del audio, largo del silencio para responder, pausa entre decenas.

### 4. Voz

Elegir voz cuando haya más de una por idioma. Música de fondo y su volumen.

### 5. Presets por forma

Elegir "forma mexicana" o "forma romana" acomoda todos los interruptores de golpe, y luego
se puede tocar lo que sea.

## Criterios de éxito

1. Cada oración opcional se puede encender y apagar, y la secuencia cambia de verdad.
2. Elegir una forma regional acomoda los interruptores y se puede ajustar después.
3. Ninguna combinación de ajustes produce un Rosario que no sea un Rosario: lo esencial
   siempre está.
4. Cada opción explica en una línea qué es y de dónde viene, sin sermón.
5. Los ajustes sobreviven a cerrar la app y a actualizarla.
6. Tests cubren: cada interruptor, los presets, y una prueba que verifica que lo esencial
   nunca desaparece.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] ~~Contenido y motor - n/a: el motor ya acepta los ajustes~~
- [ ] App
- [ ] Reloj - el reloj hereda los ajustes del teléfono (task 015)
- [ ] ~~Audio - n/a~~
- [ ] Accesibilidad - los interruptores se operan y se entienden con lector de pantalla
- [ ] ~~Sitio - n/a~~
