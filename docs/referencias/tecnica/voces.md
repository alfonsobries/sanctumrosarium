# Voces: síntesis, latín eclesiástico y locución humana

Verificado en agosto de 2026. Este documento decide, junto con la decisión 5 de
[`../../DECISIONES.md`](../../DECISIONES.md), cómo suena la app.

## El hallazgo que resuelve el latín

**El "latín" del sintetizador de Google es, literalmente, la voz italiana.** Se comprobó
pidiendo el mismo texto con `tl=la` y con `tl=it`: el audio devuelto es idéntico byte a
byte, con dos textos distintos. No es un truco casero: es lo que la industria ya hace por
debajo.

De ahí la conclusión práctica: **el latín eclesiástico se sintetiza con una voz
italiana**, porque su pronunciación es italianizante. Y el latín no aparece en la lista de
idiomas de ningún proveedor grande.

### Lo que la voz italiana da gratis y lo que hay que corregir

| Regla del latín eclesiástico                                     | ¿Sale bien con voz italiana? |
| ---------------------------------------------------------------- | ---------------------------- |
| `c`+e/i → ch, `g`+e/i → ge, `gn`, `gl`, `sc`+e/i, `v`, geminadas | Sí                           |
| `ae` / `oe` → e (caelis)                                         | **No**, dice "ka-e-lis"      |
| `ti` + vocal → tsi (gratia)                                      | **No**                       |
| `h` muda (mihi → miki)                                           | **No**                       |
| `x` en excelsis                                                  | **No**                       |
| Acento latino (penúltima o antepenúltima)                        | **No**, el italiano adivina  |

Es un problema **completamente regular**: unas veinte reglas. Y hay un punto de partida
hecho: **`medieval_latina`**
([GitHub](https://github.com/jaysonvirissimo/medieval_latina), licencia MIT, actualizado
en 2026) tiene **2.319 palabras latinas con su pronunciación eclesiástica en IPA** y
genera léxicos en el formato que los sintetizadores aceptan.

### El inventario fonético cuadra

Verificado en la documentación de Azure: el juego de fonemas de `it-IT` **cubre el 100% de
los fonemas del latín eclesiástico**. No falta ninguno. Y si se pide un fonema fuera del
inventario, la petición falla con error, no suena mal: se detecta al compilar, no en
producción.

### Respelear gana a marcar fonemas

Testimonio de quien construyó una capa de corrección de pronunciación sobre ElevenLabs:
"what actually ships is a plain respelling string, not phoneme tags: alias-based
substitution has been far more consistently respected in my testing than markup has". Y en
el mismo hilo: "the only thing that has worked for correct pronunciations is to spell it
like it sounds".

## Proveedores

Precio por millón de caracteres, verificado (agosto 2026):

| Proveedor                  | Precio  | SSML y pausas                            | Fonemas por palabra                                   |
| -------------------------- | ------- | ---------------------------------------- | ----------------------------------------------------- |
| **Azure Neural**           | **$15** | **W3C completo**, `<break>` y silencios  | **Sí, también en `it-IT`**                            |
| Google Chirp 3 HD          | $30     | `<break>`, velocidad hasta 0.25x         | IPA, pero solo inglés en el diccionario personalizado |
| ElevenLabs Multilingual v2 | $100    | `<break>` hasta 3 s, velocidad mín. 0.7x | No en español                                         |
| ElevenLabs v3              | $100    | **No soporta `<break>`**                 | IPA entre barras, 80-90% de consistencia              |
| OpenAI                     | $15     | **Ninguno**                              | Ninguno                                               |
| Hume Octave                | $50-150 | Silencio final y pausas                  | No                                                    |

**Recomendación: Azure.** Resuelve las tres cosas a la vez (marcas de tiempo gratis,
fonemas en `it-IT` para el latín, control determinista de pausas para el ritmo lento) y es
de los más baratos. El corpus del Rosario son unos 10 a 15 mil caracteres únicos por
idioma: **menos de un dólar por idioma, incluso con cincuenta iteraciones**. El precio no
es criterio; el control determinista sí.

**MiniMax queda descartado por contenido**: sus términos prohíben "content related to
feudal superstitions", terminología regulatoria que históricamente se aplica a contenido
religioso. Es el único proveedor con una cláusula que pone en riesgo directo este caso de
uso.

**PlayAI / Play.ht cerró**: los dominios no resuelven y el último archivo del sitio dice
"We have shut down the service".

## Licencias de las voces sintetizadas

**Regla número uno: "gratis con donativos" es uso comercial.** Ninguna licencia distingue
monetizado de comercial. Hay que generar siempre desde una cuenta de pago.

- **ElevenLabs**: la licencia **sobrevive a la cancelación**: "you will still have a
  commercial license to use whatever you generated during that subscription forever". Se
  puede pagar un mes, generar todo y cancelar. Los planes gratuitos son solo para uso no
  comercial.
- **Azure**: el nivel gratuito **no** da derechos comerciales; el de pago sí,
  explícitamente. Su código de conducta **exige divulgar que la voz es sintética**.
- **OpenAI**: exige divulgación explícita de que la voz es generada por IA.
- **Google**: su cláusula de propiedad del resultado está redactada para servicios
  generativos, y el sintetizador está catalogado aparte. PENDIENTE.

**Un aviso único en la pantalla de Acerca de ("las voces de esta app son generadas por
inteligencia artificial") cubre a la vez a OpenAI, Azure y Deepgram, y no cuesta nada.**
Va siempre, sea cual sea el proveedor.

## Locución humana

Supuestos: 40 minutos terminados, ritmo devocional de 110 a 130 palabras por minuto (4.500
a 5.500 palabras), unos 53 cortes, licencia perpetua y mundial.

Fuentes de tarifa verificadas: la
[guía GVAA](https://globalvoiceacademy.com/gvaa-rate-guide-2/) (Estados Unidos), la
[Lista de Precios de Locución en México 2026](https://www.eltallerdelasvoces.com.mx/lista-de-precios-mx)
del Taller de las Voces (la única con renglón explícito de app: **600 a 700 dólares para
más de cinco minutos**), y Gravy for the Brain.

| Idioma                 | Bajo           | Medio (lo que presupuestaría) | Alto            |
| ---------------------- | -------------- | ----------------------------- | --------------- |
| Español de LatAm       | $400-$700      | **$1.200-$1.600**             | $2.400-$3.300   |
| Inglés                 | $800-$1.000    | **$1.500-$1.900**             | $2.600-$3.800   |
| Latín eclesiástico     | $600-$1.000    | **$1.900-$2.600**             | $3.500-$5.000   |
| **Total tres idiomas** | ~$1.800-$2.700 | **~$4.600-$6.100**            | ~$8.500-$12.100 |

**La celda del latín es la más débil de la tabla y hay que decirlo:** no se verificó ni
una sola oferta real de mercado. El rango se construyó aplicando premios que sí están
publicados (+50% por idioma distinto al español, +40 a 50% por lenguaje técnico).

### Dos cosas que descuadran el presupuesto

1. **Casi ninguna tarifa incluye distribución pública.** El tarifario mexicano cede
   derechos por **seis meses** por defecto. La única ancla publicada para perpetuidad da
   un multiplicador de 2.0 a 2.6 sobre la tarifa de un año. Regla práctica: **+30% a +100%
   sobre la base**, y contratar **perpetuo no exclusivo** (la exclusividad se cobra de 1 a
   5 veces la base).
2. **El encuadre cambia el precio.** GVAA cobra las guías de museo con "usage in
   perpetuity" incluida: unos 800 a 1.100 dólares por cuarenta minutos. Es el análogo
   conceptual más cercano a una app de rezos guiados y el encuadre más barato del mercado.

### La opción voluntaria está probada en esta categoría

**Rezandovoy** (jesuitas, España) declara que sus voces son voluntarias: "una inmensa red
de voluntarios... que comparten su inspiración, ofrecen su voz", con unos cuarenta
colaboradores nombrados ([rezandovoy.org](https://rezandovoy.org/quienes-somos/)).

Y hay un punto de fondo que cambia la recomendación: **un locutor comercial casi con
certeza no sabe pronunciar latín litúrgico.** Para el latín, la vía voluntaria (un
párroco, un seminarista, un director de coro) **no es el compromiso barato: es la opción
de mayor calidad.**

**Conseguir cesión de derechos por escrito, perpetua y mundial, incluso cuando el trabajo
sea donado.** Es exactamente el punto donde estos proyectos se rompen dos años después.

## Recomendación

| Concepto         | Solo síntesis | **Híbrida (recomendada)** | Solo humana        |
| ---------------- | ------------- | ------------------------- | ------------------ |
| Español e inglés | ~$0.50-$3     | ~$2 (síntesis)            | $2.700-$3.500      |
| Latín            | ~$0.25        | **$0 (voz voluntaria)**   | $1.900-$2.600      |
| Marcas de tiempo | $0 (nativas)  | ~$0.15 o $0               | ~$0.50             |
| **Total**        | **~$30-$80**  | **~$40**                  | **~$4.600-$6.100** |

La ruta híbrida gana: el latín es justo donde la síntesis es más débil y el voluntario más
fuerte, y Rezandovoy opera exactamente así.

## El modo a dos voces cambia el corte del audio

Cada oración se parte en dos archivos (llamada y respuesta), no en uno con marcas: hacer
saltos dentro de un archivo cincuenta y tres veces produce microcortes audibles. El
silencio de respuesta **no se graba**: se guarda como duración configurable por el usuario
(tres, cinco, ocho segundos, o esperar un toque), porque cada quien reza a su ritmo.

**Hay que decidirlo antes de grabar o generar:** convertir clips completos en llamada y
respuesta después es rehacer todo el corte.
