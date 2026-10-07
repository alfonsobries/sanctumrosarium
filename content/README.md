# Contenido litúrgico

Textos que se rezan en SanctaMaria: oraciones, misterios, lecturas bíblicas y estructura del Rosario. Cada texto viene de una fuente citable consultada en línea el 2026-10-06 y guarda esa fuente junto al dato. Nada está escrito de memoria.

Idiomas: `es-MX`, `es-ES`, `en-US`, `la`.

## Archivos

| Archivo | Contenido |
| --- | --- |
| `prayers.json` | 15 oraciones con texto por idioma y fuente |
| `mysteries.json` | 4 series, 20 misterios, lecturas y calendario semanal |
| `scripture/es.json`, `en.json`, `la.json` | Texto de cada pasaje citado en `mysteries.json` (76 citas) |
| `structure.md` | Cómo se reza, variantes regionales e indulgencia plenaria |

## `prayers.json`

```jsonc
{
  "id": "hail-mary",                  // estable, no se renombra
  "category": "pious-tradition",      // magisterium | liturgy | pious-tradition
  "categoryNote": "...",
  "titles": { "es-MX": "...", ... },
  "texts": {
    "es-ES": {
      "lines": ["..."],
      "responseFrom": 6,              // índice de la línea donde responde la asamblea; null si no aplica
      "source": { "publisher", "title", "url", "accessed", "retrievedVia"? },
      "notes": "...",
      "variants": [{ "label", "lines", "responseFrom", "source" }]
    },
    "es-MX": { "sameAs": "es-ES", "notes": "..." },   // sin fuente propia: usar el otro idioma
    "la": { "missing": true, "notes": "..." }         // no hay texto con fuente
  }
}
```

- `litany-of-loreto` usa `structured` en lugar de `lines`: `opening`, `trinity`, `invocations` (54, en orden), `invocationResponse`, `agnusDei`. `additions` registra las tres invocaciones de 2020 con el documento que las ordena.
- `prayer-for-the-pope` no tiene texto propio: `composition` indica qué oraciones se rezan.
- Ids: `sign-of-the-cross`, `by-the-sign-of-the-holy-cross`, `o-god-come-to-my-aid`, `apostles-creed`, `our-father`, `hail-mary`, `glory-be`, `fatima-prayer`, `hail-holy-queen`, `pray-for-us-holy-mother-of-god`, `rosary-closing-prayer`, `grant-us-your-servants`, `litany-of-loreto`, `act-of-contrition`, `prayer-for-the-pope`.

## `mysteries.json`

- `sets`: las cuatro series con su párrafo de RVM.
- `schedule`: días de la semana según RVM 38, más la costumbre de Adviento y Cuaresma que menciona USCCB (marcada como `pious-tradition`).
- `mysteries[]`: `id` (`joyful-1-annunciation`...), `set`, `order`, `titles` por idioma con `titleSources`, `titleVariants` (títulos de vatican.va), `readings`, `excerpts` y `fruit`.
- `readings[]`: `{ ref, kind, note? }`. `kind`: `primary` (pasaje principal), `parallel` (el mismo hecho en otro evangelio o autor; la app puede rotarlos), `related` (texto afín que no narra el hecho). Las citas usan abreviaturas inglesas: `Mt`, `Mk`, `Lk`, `Jn`, `Acts`, `1 Cor`, `2 Pt`, `Rev`.
- `excerpts`: versículos breves que vatican.va pone en cada misterio (USCCB usa las mismas citas).
- `fruit`: fruto tradicional, solo en inglés porque solo USCCB lo publica. Es `pious-tradition`.

## `scripture/<idioma>.json`

```jsonc
{
  "_meta": { "translation", "publisher", "license", "url", "accessed" },
  "passages": {
    "Lk 1:26-38": {
      "displayRef": "Lc 1, 26-38",          // cita en la convención del idioma
      "text": "...",                        // versículos unidos
      "verses": [{ "chapter": 1, "verse": 26, "text": "..." }],
      "sourceUrls": ["..."],
      "omittedVerses": ["Lk 23:17"],        // si la edición no tiene ese versículo
      "editorialCorrections": [{ "chapter", "verse", "from", "to", "reason" }]
    }
  }
}
```

La clave es la misma en los tres archivos.

## Traducciones y licencias

| Idioma | Texto | Fuente | Licencia |
| --- | --- | --- | --- |
| es | *El Libro del Pueblo de Dios* (traducción argentina, 1990) | vatican.va, ESL0506 | © Libreria Editrice Vaticana / Conferencia Episcopal Argentina. Publicado abierto en vatican.va, pero no es dominio público |
| la | *Nova Vulgata*, editio typica altera | vatican.va | © Libreria Editrice Vaticana. No es dominio público |
| en | Douay-Rheims, revisión de Challoner | Project Gutenberg #1581 | Dominio público |

Oraciones:

- Compendio del Catecismo, vatican.va (es-ES, la y algunos en-US): © Libreria Editrice Vaticana.
- USCCB (en-US): la traducción del Credo es de ICEL y tiene derechos.
- Misal Romano para México y textos de Desde la fe (es-MX): © CEM / Buena Prensa / Desde la fe.
- CEI y Sala Stampa (latín de la letanía): textos de la Santa Sede y de la CEI.

Antes de publicar se necesita permiso o confirmar el uso permitido para todo lo que no es dominio público, empezando por las dos Biblias. NABRE no se usó porque tiene derechos.

## Pendiente de revisión humana

**Licencias**

1. Permisos para *El Libro del Pueblo de Dios* y la *Nova Vulgata* (LEV) y para los textos de oraciones con derechos (ICEL, CEM, LEV). Sin esto no se puede publicar.

**Biblia**

2. La Biblia en español no es la de la liturgia mexicana. El Leccionario mexicano y la *Biblia de la Iglesia en América* no se encontraron en línea con licencia clara. El Libro del Pueblo de Dios es la traducción argentina. Decidir si sirve para México o si se pide licencia de otra.
3. Douay-Rheims: 23 de 574 versículos difieren en detalles de redacción entre Gutenberg #1581 y drbo.org, que siguen ediciones distintas de Challoner. Ejemplos: Mt 27:25 "upon us and upon our children" / "upon us and our children"; Jn 19:17 "to the place" / "to that place"; Mk 15:17 "clothed" / "clothe". Hay que elegir una edición. El resto coincide palabra por palabra.
4. Correcciones editoriales a erratas de vatican.va (`editorialCorrections`): Lc 1, 48 "el miró" → "él miró"; Lc 1, 49 "he hecho" → "ha hecho"; Ap 12, 1 "appa ruit" → "apparuit". Cotejar con la edición impresa.
5. La *Nova Vulgata* no tiene Lc 23, 17 ni Mc 15, 28 (`omittedVerses`). El latín conserva las comillas con espacio de la fuente (`“ Ave ”`).
6. El texto español y el latino tienen una sola fuente en línea. Falta cotejarlos con una segunda.

**Oraciones**

7. `responseFrom` es una decisión editorial: dónde empieza la parte de la asamblea al rezar en común. Ninguna fuente la marca, salvo los V/R explícitos.
8. Los saltos de línea marcados como "editoriales" en `notes` no vienen de la fuente. Las fuentes que traen el texto en un solo párrafo se partieron por la puntuación.
9. Huecos:
   - es-ES: `fatima-prayer`, `by-the-sign-of-the-holy-cross`.
   - es-MX: `rosary-closing-prayer` y `o-god-come-to-my-aid` usan `sameAs: es-ES`.
   - la: `fatima-prayer` no tiene versión latina oficial; `grant-us-your-servants` (*Concede nos famulos tuos*) no se encontró en una fuente oficial en línea.
10. `litany-of-loreto` es-ES es el texto de vatican.va, que no es específico de España. No se encontró texto de la Conferencia Episcopal Española con las invocaciones de 2020. EWTN omite "Mother of Mercy": no usarlo.
11. Latín de la letanía: la fuente (CEI, 2021) no lleva acentos y escribe "Ianua coeli". No trae el versículo ni la oración finales en latín.
12. Erratas del Apéndice del Compendio en español ("Ave, Maríæ", "Eva", "Maríae", "quasumus", "Agonía in Hortu"). Se usó la columna latina de la edición inglesa, que corrige la mayoría. "Agonía in Hortu" está en ambas y se dejó como en la fuente.
13. es-MX `our-father`: el texto es el del Misal Romano para México, tomado del misal mensual de Desde la fe, no del libro impreso de la CEM. Coincide con España palabra por palabra ("venga a nosotros tu Reino", "no nos dejes caer en la tentación").
14. Ave María: el Compendio y Desde la fe dicen "el Señor es contigo"; vatican.va ("El Santo Rosario") dice "el Señor está contigo". Guardado como variante.
15. `o-god-come-to-my-aid` en latín sale del Sal 70 (69), 2 de la *Nova Vulgata*. La fórmula de la *Liturgia Horarum* no se verificó en línea.
16. USCCB bloquea la descarga automática. Las páginas se leyeron en copias de web.archive.org de 2026 (`retrievedVia`), salvo el Padrenuestro, que se descargó directo. Confirmar en usccb.org.
17. No incluidos:
   - San Miguel Arcángel (opcional).
   - "Yo confieso".
   - Las tres Avemarías mexicanas finales ("Dios te salve, María Santísima, Hija de Dios Padre...").
   - Las jaculatorias "María, Madre de gracia" y "Sagrado Corazón".
   - La oración a san José que menciona USCCB.
   
   Están citadas en `structure.md` con su fuente si se quieren modelar.

**Misterios**

18. La Asunción y la Coronación no se narran en la Escritura. Sus lecturas son `related` y siguen las citas de vatican.va, USCCB y Desde la fe.
19. Los paralelos y los límites de cada perícopa (por ejemplo, Jn 18, 38-19, 1 para la flagelación o Lc 4, 14-21 para el anuncio del Reino) son una selección editorial. Revisarlos con un biblista.
20. Frutos de los misterios: solo existen en inglés (USCCB). No hay fuente para es ni la.

**Indulgencias**

21. El *Enchiridion* (1999) no tiene versión oficial en español en línea. `structure.md` cita el latín y da un resumen de trabajo. Su texto habla de quince decenas porque es anterior a 2002.

## Promesas del Rosario

`promises.json` guarda las quince promesas atribuidas a la Virgen María para quienes recen el Rosario, consultadas el 2026-10-07. Categoría `pious-tradition`: vienen de la revelación privada que el beato Alano de la Rupe (siglo XV) dijo haber recibido, no tienen aprobación de la Iglesia como revelación auténtica y no pertenecen al depósito de la fe (CIC 67).

```jsonc
{
  "_meta": { "generated", "editorialMarker", "context" },
  "category": "pious-tradition",
  "titles": { "es": { "text", "source" }, "en": { ... } },
  "intro": { "kind": "editorial", "es", "en", "basis": [source] },  // escrito para la app
  "origin": [{ "claim", "quote", "source" }],                       // claim en español, quote literal
  "promises": [{
    "n": 1,
    "texts": {
      "es": { "text", "source", "corroboratedBy": [source], "notes"?, "variants": [{ "label", "text", "source", "notes"? }] },
      "en": { "text", "source", "corroboratedBy": [source], "notes"? },
      "la": { "missing": true, "notes" }
    }
  }],
  "understanding": [{ "topic", "kind": "editorial", "es", "en", "quote"?: { "es"?, "en"? }, "source" }]
}
```

- Todo lo marcado `"kind": "editorial"` se redactó para la app a partir de las fuentes citadas. Los textos de `promises` y los `quote` son literales.
- Inglés: Rosary Center & Confraternity (provincia dominica del Santo Nombre, con Nihil Obstat e Imprimi Potest), cotejado con dominicanfriars.org.
- Español: ACI Prensa (recurso 530), igual palabra por palabra a EWTN en español e InfoVaticana.
- Las versiones española e inglesa son dos tradiciones de traducción y no coinciden en todo (n. 1, 9, 11, 13; ver `notes`).
- La variante de ACI Prensa (recurso 2961) dice "señal de profecía" en el n. 15 donde las demás dicen predestinación. No usarla para ese número.
- Latín: no se encontró un texto con fuente citable.
- Un Nihil Obstat o imprimatur sobre un texto de las promesas no es un juicio sobre la autenticidad de la revelación.
