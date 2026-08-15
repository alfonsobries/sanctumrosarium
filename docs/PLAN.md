# Plan de producto

> El nombre del producto todavía no está decidido. Mientras tanto, los documentos hablan
> de "la app" y "el sitio". Candidatos y criterio: [`DECISIONES.md`](./DECISIONES.md).

## Visión

La mejor app del mundo para **rezar** el Rosario. No para consumir contenido espiritual,
no para coleccionar minutos: para que alguien que se propone rezar el Rosario todos los
días lo consiga, lo rece mejor cada vez, y lo entienda.

Tres cosas la definen:

- **Fiel a la tradición católica, al 100%.** Cada texto sale de una fuente identificable
  (magisterio, liturgia, tradición piadosa) y lo dice. Nada de amuleto, nada de promesas
  automáticas, nada de números mágicos. El dossier doctrinal es
  [`referencias/rosario-doctrina.md`](./referencias/rosario-doctrina.md) y manda sobre
  cualquier decisión de producto.
- **Se reza sin mirar la pantalla.** Con audio, con el reloj, corriendo, en el coche, a
  oscuras, sin señal. La pantalla ayuda cuando la miras y no estorba cuando no.
- **Multiidioma de verdad.** Español, inglés y latín desde el primer día, con variantes
  regionales (la forma mexicana no es la española), no un inglés traducido a medias.

## El problema

El mercado está lleno (ver [`../competencia/`](../competencia/)) y aun así:

- Nadie tiene el Rosario en Apple Watch con audio propio y háptica. La app más grande del
  nicho ni siquiera tiene app de reloj, y sus usuarios la piden para rezar mientras
  entrenan.
- El latín existe como texto en muchas apps y como audio digno en una sola, y en ninguna
  como algo que se pueda **aprender**.
- Las apps buenas son solo en inglés; las que hay en español son genéricas, con anuncios y
  abandonadas.
- La queja número uno de la app líder es que no puedes leer el texto mientras suena el
  audio.
- Nadie ayuda con lo único que de verdad cuesta: **la atención**. "Mantener el foco mental
  es una lucha" es literalmente el argumento de venta de una de ellas, y ninguna hace nada
  al respecto.

## Para quién

- **El que ya reza el Rosario a diario** y quiere rezarlo mejor: con meditación, sin
  prisa, y algún día en latín. Es el usuario principal. La app le sirve el resto de su
  vida.
- **El que quiere empezar y no sabe** o lo intenta y lo deja. Necesita estructura, una
  regla realista y cero culpa cuando falla.
- **El que reza en movimiento**: corriendo, caminando, manejando, en el metro. Aquí el
  reloj y el audio son el producto entero.
- **La familia que reza junta**: modo a dos coros, en voz alta, con los niños.

No es para: quien busca una plataforma de contenido devocional (podcasts, biblia en un
año, meditaciones diarias). Eso ya existe y está bien hecho. Esta app hace una sola cosa.

## Superficies

| Superficie      | Qué es                                                                        |
| --------------- | ----------------------------------------------------------------------------- |
| **App móvil**   | El producto. iOS y Android. Todo existe aquí primero                          |
| **Apple Watch** | Rezar sin el teléfono: audio propio, háptica por cuenta, corona, complicación |
| **Sitio**       | Qué es, por qué, cómo se reza (contenido real, indexable), y dónde donar      |
| **Widget**      | Misterio del día y "empezar" en un toque                                      |

**El reloj no es una fase futura.** Es la razón por la que alguien elige esta app y no
otra: se construye junto a la app, no después.

## Principios de producto

1. **Cristo en el centro.** Nunca hay un contador sin su misterio a la vista. El Rosario
   es contemplación, y sin ella "es un cuerpo sin alma" (MC 47, RVM 12).
2. **Rezar, no escuchar.** El audio guía deja el espacio para tu voz: la app dice la
   primera mitad, tú respondes. Nunca es un podcast que corre mientras miras.
3. **Cuenta actos, nunca gracias.** Rosarios, decenas, días. Jamás "puntos de gracia",
   "nivel espiritual" ni barras de protección. La Iglesia dejó de numerar indulgencias en
   1967 justamente porque el número confundía.
4. **Constancia sin culpa.** Una regla que tú fijas, que no obliga bajo pecado, y que
   cuando se rompe se retoma sin castigo, sin pantallas rojas y sin "vas a perder tu
   racha".
5. **La atención se ayuda, no se califica.** Todo lo que la app mide sobre tu recogimiento
   es privado, opcional y apagable, y jamás se convierte en un puntaje ni se compara con
   nadie.
6. **Cada texto con su fuente.** Magisterio, liturgia o tradición piadosa: se distingue
   siempre. Las 15 promesas se muestran con su origen, nunca como garantía.
7. **Funciona sin nada.** Sin señal, sin cuenta, sin teléfono (en el reloj), sin mirar (a
   oscuras), sin manos (con auriculares).
8. **Sin anuncios, sin paywall en el Rosario, sin leaderboards.** El Rosario completo, en
   todos los idiomas, gratis para siempre.
9. **Multiidioma como contenido, no como traducción.** Cada idioma trae su forma real de
   rezar, con sus variantes regionales.
10. **Lo que no sirve para rezar mejor, no entra.** El catálogo no es la medida.

## Cómo se gamifica (y cómo no)

Esta es la decisión de diseño más delicada del producto: hay crítica católica seria y bien
fundada contra gamificar la oración, y tiene razón en casi todo. El detalle y las fuentes
están en
[`referencias/ripperger-y-gamificacion.md`](./referencias/ripperger-y-gamificacion.md); la
forma concreta, en [`gamificacion.md`](./gamificacion.md). En una página:

**Sí:**

- **La Regla.** Tú fijas tu norma (una decena, cinco decenas, el Rosario completo, o 15
  decenas a la semana al modo de la Cofradía). Se puede bajar en cualquier momento. La app
  nunca la sube sola.
- **Fidelidad, no racha.** La métrica principal es "días fieles a tu regla este mes",
  vista como un calendario que se llena, no como un número frágil que se rompe.
- **El Camino.** Una progresión real de formación, que se avanza recorriéndola y no
  acumulando puntos: aprender la estructura, meditar con la Palabra y el silencio, usar
  las cláusulas, rezar en latín, cantar, rezar en familia, el Rosario completo, la
  Cofradía.
- **Rosas.** La imagen tradicional (Montfort llama "rosas" a los capítulos de su libro; el
  Rosario es una corona de rosas para María). Cada Rosario ofrecido es una rosa del mes.
  Es inventario visual de lo que hiciste, no poder acumulado.
- **Intenciones.** Por quién ofreces. Historial de intenciones, nunca de "respuestas
  obtenidas".

**No:**

- Tablas de posiciones, comparar minutos con amigos, rachas que se "pierden", congeladores
  de racha comprables, insignias ruidosas, notificaciones de pérdida, "gracia"
  cuantificada, ni nada que insinúe que rezar más te protege más.
- Todo lo lúdico se puede apagar de una vez, y la app sigue completa.

## Modelo

**Gratis y completa.** Sin anuncios, sin suscripción para rezar, sin funciones
espirituales de pago. La app se sostiene con donativos: propina dentro de la app (donde
las tiendas lo permiten) y donativo en el sitio. Nadie compra nada que tenga que ver con
la oración.

Es un proyecto personal antes que un negocio: si solo la uso yo y me hace rezar mejor el
Rosario, ya sirvió. Detalle y alternativas en [`DECISIONES.md`](./DECISIONES.md).

## Fases

El mapa completo está en [`FEATURES.md`](./FEATURES.md) y el orden de ejecución en
[`ROADMAP.md`](./ROADMAP.md).

| Fase | Nombre              | Enfoque                                                             |
| ---- | ------------------- | ------------------------------------------------------------------- |
| 1    | Rezar bien          | El Rosario completo, texto y audio, offline, es/en, sin cuenta      |
| 2    | Rezar en movimiento | Apple Watch con audio propio y háptica, correr, auriculares         |
| 3    | Latín               | Textos, audio y modo de aprendizaje progresivo                      |
| 4    | Constancia          | La Regla, fidelidad, recordatorio, intenciones                      |
| 5    | El Camino           | Itinerario formativo por etapas                                     |
| 6    | Recogimiento        | Ayudas a la atención y medición honesta, privada y opcional         |
| 7    | En familia          | A dos coros, en voz alta, con niños, rezo compartido                |
| 8    | Idiomas             | Italiano, portugués, francés, polaco, alemán y variantes regionales |
| 9    | Devociones hermanas | Letanías, novena de 54 días, coronilla, Siete Dolores               |
| 10   | Comunidad ligera    | Rezar a la vez que otros, sin chat y sin nombres                    |

El sitio y el contenido corren en paralelo desde la fase 1, no al final.

**Este plan es vivo.** Las fases lejanas están escritas con lo que se sabe hoy. Lo estable
es la visión: rezar el Rosario mejor, con fidelidad total a lo que la Iglesia enseña.
