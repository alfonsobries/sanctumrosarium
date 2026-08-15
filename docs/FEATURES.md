# Mapa de features

Todo lo que la app construye, agrupado en 10 fases. Sirve para decidir qué entra y qué no;
el orden fino de ejecución vive en [`ROADMAP.md`](./ROADMAP.md) y el detalle de cada pieza
en su task.

**Mapa vivo.** Las fases lejanas están escritas con lo que se sabe hoy. Una feature
listada aquí no es un compromiso de alcance ni de forma.

**Tres principios que atraviesan el mapa**, tomados de donde la competencia falla:

- **Texto y audio a la vez, siempre.** La queja número uno contra la app líder es que no
  puedes leer mientras suena. Aquí el texto se resalta al ritmo del audio, y el audio deja
  hueco para tu voz.
- **Sin teléfono.** El reloj reza solo: audio propio, háptica, corona. No es un control
  remoto.
- **Cada texto con su fuente.** Magisterio, liturgia o tradición piadosa, y se distingue.

## Transversales (no son fases)

Corren a la par de todas las fases, feature por feature.

| Track             | Qué incluye                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------- |
| **Contenido**     | Textos de oraciones por idioma y región, misterios, citas bíblicas, meditaciones, con fuente |
| **Audio**         | Grabación o síntesis, cortes por oración, timings para el resaltado, empaquetado offline     |
| **Sitio**         | Qué es, cómo se reza, guías indexables, donar                                                |
| **Accesibilidad** | VoiceOver/TalkBack, tipografía grande, contraste, rezo a pantalla apagada                    |

## Fase 1 - Rezar bien

**Objetivo:** que se pueda rezar el Rosario entero, bien, en español e inglés, sin
conexión y sin cuenta.

| Feature                    | Descripción                                                                       |
| -------------------------- | --------------------------------------------------------------------------------- |
| Motor del Rosario          | Secuencia completa: inicio, cinco misterios, cierre; estado, avance y reanudación |
| Misterio del día           | Según el día de la semana y el tiempo litúrgico, con opción de elegir otro        |
| Textos por idioma y región | Español (México y España), inglés; variantes reales, no traducción                |
| Los 20 misterios           | Título, cita bíblica, fruto, meditación breve, imagen                             |
| Audio guía                 | Voz que dice la primera mitad y espera la respuesta; velocidad ajustable          |
| Resaltado sincronizado     | El texto avanza con el audio, palabra o línea                                     |
| Avance por tacto           | Toque en cualquier parte, deslizar, o automático                                  |
| Modo pantalla apagada      | Rezar a oscuras con háptica y audio                                               |
| Offline total              | Textos y audio empaquetados; nada requiere red                                    |
| Oraciones opcionales       | Fátima, Salve, letanías, San Miguel, ofrecimiento e intención: cada una un ajuste |
| Sin cuenta                 | Todo local; nada que registrar                                                    |

## Fase 2 - Rezar en movimiento

**Objetivo:** rezar corriendo, caminando o manejando, con el reloj y sin sacar el
teléfono.

| Feature                   | Descripción                                                                  |
| ------------------------- | ---------------------------------------------------------------------------- |
| App de Apple Watch        | Rosario completo en el reloj, con su propia interfaz                         |
| Audio independiente       | Suena en el reloj a los auriculares, sin el teléfono cerca                   |
| Háptica por cuenta        | Toque distinto para Ave, Padrenuestro y Gloria                               |
| Corona digital            | Pasar cuentas girando la corona                                              |
| Sesión de ejercicio       | Mantiene la app viva y la pantalla encendida mientras corres                 |
| Complicación              | Misterio del día en la esfera, empezar en un toque                           |
| Controles de bloqueo      | Reproducir, pausar y avanzar desde auriculares, pantalla de bloqueo y coche  |
| Sincronía con el teléfono | Regla, progreso e idioma; el rezo nunca depende de que el teléfono esté vivo |
| Widget iOS                | Misterio del día y empezar                                                   |

## Fase 3 - Latín

**Objetivo:** rezar en latín de verdad, y aprenderlo si no se sabe.

| Feature          | Descripción                                                                   |
| ---------------- | ----------------------------------------------------------------------------- |
| Textos en latín  | Todas las oraciones, incluidas letanías lauretanas completas                  |
| Audio en latín   | Pronunciación eclesiástica, rezado                                            |
| Texto bilingüe   | Latín y lengua propia alineados, línea a línea                                |
| Modo aprendizaje | De escuchar, a responder leyendo, a responder de memoria (el texto se atenúa) |
| Latín cantado    | Salve Regina y letanías en canto                                              |
| Mezcla           | Rezar unas oraciones en latín y otras en tu idioma                            |

## Fase 4 - Constancia

**Objetivo:** que la costumbre se sostenga, sin culpa.

| Feature            | Descripción                                                          |
| ------------------ | -------------------------------------------------------------------- |
| La Regla           | Norma personal, editable, que no obliga bajo pecado                  |
| Calendario del mes | Días fieles, huecos sin drama, meses anteriores                      |
| Modo pausa         | Enfermedad, viaje, luto: sin huecos y sin explicaciones              |
| Recordatorio       | Uno, a tu hora, o el modelo del Ángelus                              |
| Intenciones        | Por quién ofreces, con historial                                     |
| Rosas del mes      | Corona visual de lo rezado, apagable                                 |
| Rezar por partes   | Guardar y retomar una decena a la vez, con nota sobre la indulgencia |

## Fase 5 - El Camino

**Objetivo:** enseñar a rezarlo mejor, no premiar por rezar más.

| Feature               | Descripción                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| Ocho etapas           | Estructura, meditar, cláusulas, responder, latín, cantar, familia, completo |
| Lecturas breves       | Qué es cada parte y por qué, con fuente                                     |
| Cláusulas             | Frase del misterio tras el nombre de Jesús, fijas y bíblicas                |
| Lectura de la Palabra | Pasaje antes de cada decena, con silencio configurable                      |
| Escuela del Rosario   | Historia, magisterio, promesas y su estatus, indulgencias y condiciones     |

## Fase 6 - Recogimiento

**Objetivo:** ayudar a la atención, que es lo único que de verdad cuesta.

| Feature                 | Descripción                                                              |
| ----------------------- | ------------------------------------------------------------------------ |
| Ritmo pausado           | Tiempos por Ave, pausas dentro de las oraciones, silencio entre decenas  |
| Imagen del misterio     | Arte sacro a pantalla completa mientras rezas                            |
| Señales de recogimiento | Interrupciones, salidas de la app, ritmo: privado, opcional, sin puntaje |
| Corazón y variabilidad  | Desde el reloj, con permiso; se escribe como sesión de atención plena    |
| Antes de empezar        | Tres respiraciones, señal de la cruz, intención                          |

## Fase 7 - En familia

| Feature                | Descripción                                                    |
| ---------------------- | -------------------------------------------------------------- |
| A dos coros            | La app hace de guía o de respuesta, en voz alta                |
| Modo niños             | Menos texto, imágenes grandes, decena suelta                   |
| Rezo compartido        | Varias personas, un solo dispositivo o varios en la misma casa |
| Ofrecer por la familia | Intenciones compartidas                                        |

## Fase 8 - Idiomas

Italiano, portugués, francés, polaco, alemán. Cada idioma trae su estructura regional real
(el alemán mete el misterio como cláusula dentro del Ave; el polaco siempre reza la
oración de Fátima; México y España rematan distinto), sus textos oficiales y su audio.

## Fase 9 - Devociones hermanas

Letanías lauretanas completas y cantadas, novena de 54 días, Coronilla de la Divina
Misericordia, Corona de los Siete Dolores, Rosario perpetuo, Cofradía del Rosario
(inscripción y cuenta semanal). Cada una con su nombre y su contador propio: nunca se
mezclan con el Rosario.

## Fase 10 - Comunidad ligera

Cuántos están rezando ahora, rezar a la misma hora que otros, misterio compartido del día.
Sin chat, sin nombres, sin ranking, sin perfiles.

## Lo que no se construye

- Suscripción para rezar, anuncios, contenido de pago.
- Tablas de posiciones, comparaciones sociales, perfiles públicos.
- Meditaciones generadas por IA presentadas como texto espiritual.
- Misterios inventados o devociones no aprobadas mezcladas con el Rosario.
- Chat, red social, feed.
- Cualquier función que prometa un efecto sobrenatural por usar la app.
