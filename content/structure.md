# Cómo se reza el Rosario

Estructura del Rosario según el magisterio, con las variantes regionales documentadas. Cada paso nombra el `id` de su texto en `prayers.json`. Las citas textuales se copian de la fuente; los resúmenes van marcados como tales.

## Fuentes

| Clave | Documento | URL |
| --- | --- | --- |
| RVM | Juan Pablo II, carta apostólica *Rosarium Virginis Mariae* (16-X-2002) | https://www.vatican.va/content/john-paul-ii/es/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html |
| Compendio | *Compendio del Catecismo de la Iglesia Católica* (2005), Apéndice A | https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_sp.html |
| VA-Rosario | Santa Sede, "El Santo Rosario: ¿Cómo se reza el Rosario?" | https://www.vatican.va/special/rosary/documents/misteri_sp.html |
| EI | Paenitentiaria Apostolica, *Enchiridion Indulgentiarum*, 4.ª ed. (1999) | https://www.vatican.va/roman_curia/tribunals/apost_penit/documents/rc_trib_appen_doc_20020826_enchiridion-indulgentiarum_lt.html |
| USCCB | USCCB, "How to Pray the Rosary" | https://www.usccb.org/how-to-pray-the-rosary |
| DLF | Desde la fe (Arquidiócesis Primada de México), "¿Cómo rezar el Rosario?" (17-VII-2025) y "Rosario del lunes y sábado" | https://desdelafe.mx/noticias/sabias-que/como-rezar-el-rosario/ · https://desdelafe.mx/rosarios/rosario-lunes-rosario-sabado-misterios-gozosos/ |

Consultadas el 2026-10-06. USCCB bloquea la descarga automática; sus páginas se leyeron en la copia de web.archive.org de 2026.

## Lo esencial (magisterio)

Lo que RVM describe para cada misterio, en este orden:

1. **Enunciar el misterio** (RVM 29).
2. **Escuchar la Palabra** (opcional): "es útil que al enunciado del misterio siga la proclamación del pasaje bíblico correspondiente, que puede ser más o menos largo según las circunstancias" (RVM 30). Lecturas en `mysteries.json` → `readings`.
3. **Silencio**: "es conveniente que, después de enunciar el misterio y proclamar la Palabra, esperemos unos momentos antes de iniciar la oración vocal" (RVM 31).
4. **Padre nuestro** `our-father` (RVM 32).
5. **Diez Avemarías** `hail-mary` (RVM 33). RVM alaba la costumbre, citando *Marialis cultus* 46, de añadir tras el nombre de Jesús "una cláusula evocadora del misterio que se está meditando".
6. **Gloria** `glory-be` (RVM 34): "En el rezo público podría ser cantado".
7. **Jaculatoria final** (opcional, RVM 35): "después de la doxología trinitaria sigue una jaculatoria, que varía según las costumbres". La más extendida es `fatima-prayer`.

RVM 36: el rosario (objeto) "está centrado en el Crucifijo, que abre y cierra el proceso mismo de la oración".

### Inicio (RVM 37)

"Hay varios modos de comenzar el Rosario, según los diversos contextos eclesiales. En algunas regiones se suele iniciar con la invocación del Salmo 69: «Dios mío ven en mi auxilio, Señor date prisa en socorrerme» [...]; en otras, se comienza recitando el Credo [...]. Éstos y otros modos similares [...] son usos igualmente legítimos."

### Conclusión (RVM 37)

"La plegaria se concluye rezando por las intenciones del Papa" (`prayer-for-the-pope`). Después, "bien con la espléndida oración de la Salve Regina, bien con las Letanías lauretanas" (`hail-holy-queen`, `litany-of-loreto`).

RVM 35 cita la colecta que pide "imitar lo que contienen y conseguir lo que prometen" (`rosary-closing-prayer`, colecta de la fiesta de Nuestra Señora del Rosario en el *Missale Romanum* de 1960, RVM nota 38).

### Distribución semanal (RVM 38)

Lunes y sábado: gozosos. Martes y viernes: dolorosos. Miércoles y domingo: gloriosos. Jueves: luminosos. Para quien no reza los luminosos, el orden que RVM 38 describe como la praxis anterior: lunes y jueves gozosos, martes y viernes dolorosos, miércoles, sábado y domingo gloriosos (`schedule.withoutLuminous`). RVM 38 añade que "esta indicación no pretende limitar una conveniente libertad [...] según las exigencias espirituales y pastorales y, sobre todo, las coincidencias litúrgicas". Datos en `mysteries.json` → `schedule`.

## Secuencia completa por fuente

### Santa Sede (VA-Rosario)

1. `sign-of-the-cross`
2. `o-god-come-to-my-aid`
3. `glory-be`
4. Cinco decenas: enunciar el misterio, "breve pausa de reflexión", `our-father`, 10 × `hail-mary`, `glory-be`. "A cada decena [...] se puede añadir una invocación."
5. "Al final del Rosario se recita la Letanía Lauretana, u otras oraciones marianas." La página da `litany-of-loreto` y `hail-holy-queen`; tras la letanía, `pray-for-us-holy-mother-of-god` y `grant-us-your-servants`.

No incluye Credo, Padrenuestro ni tres Avemarías iniciales.

### Estados Unidos (USCCB)

1. `sign-of-the-cross`
2. `apostles-creed` (con el crucifijo)
3. `our-father`
4. 3 × `hail-mary`
5. `glory-be`
6. Cinco decenas: enunciar el misterio "(perhaps followed by a brief reading from Scripture)", `our-father`, 10 × `hail-mary`, `glory-be`. Opcional: `fatima-prayer` ("some say").
7. `hail-holy-queen`, `pray-for-us-holy-mother-of-god`, `rosary-closing-prayer`.
8. "(A prayer to St. Joseph may also follow.)" No incluido en este paquete.
9. `sign-of-the-cross`.

Es la forma inicial más difundida (Credo, Padrenuestro, tres Avemarías, Gloria), pero RVM no la prescribe: es uno de los "usos igualmente legítimos".

### México (DLF)

1. `by-the-sign-of-the-holy-cross` (persignarse) con `sign-of-the-cross`.
2. `act-of-contrition` ("Haz un acto de contrición"). La guía de los misterios gozosos usa en su lugar el "Yo confieso" y un `glory-be`. (El "Yo confieso" no está en este paquete.)
3. Cinco decenas: `our-father`, 10 × `hail-mary`, `glory-be`, y una o varias jaculatorias: "María, Madre de gracia, Madre de misericordia, en la vida y en la muerte ampáranos, gran Señora", `fatima-prayer`, "Sagrado Corazón de Jesús, en Ti confío", "Bendito san José, aumenta nuestra fe" (textos citados de DLF; solo `fatima-prayer` está modelada).
4. Al final: las Avemarías de las tres virtudes (`hail-mary-faith`, `hail-mary-hope`, `hail-mary-charity`) y la salutación `trinity-salutation` (ver abajo), `hail-holy-queen`, `pray-for-us-holy-mother-of-god`, `litany-of-loreto`, `grant-us-your-servants`.
5. "Reza un Padrenuestro y un Avemaría por las intenciones del Papa" (`prayer-for-the-pope`).

DLF no incluye el Credo al inicio.

### España (Compendio)

El Compendio no describe la secuencia; da los misterios con sus días, `pray-for-us-holy-mother-of-god`, `rosary-closing-prayer` y, como "tradición española", `grant-us-your-servants`.

## Avemarías de las tres virtudes

Forma hispana, de piedad popular (`pious-tradition`), de tres Avemarías: cada una empieza con una salutación a María en relación con una Persona de la Trinidad y encomienda una virtud teologal, y sigue con el Avemaría desde "llena eres de gracia". Las fuentes no le dan un nombre fijo: Desde la fe dice "Se rezan 3 Avemarías"; otras guías las llaman "salutaciones a la Virgen María".

1. `hail-mary-faith`: "Hija de Dios Padre, Virgen Purísima antes del parto", la fe "para que la ilumines".
2. `hail-mary-hope`: "Madre de Dios Hijo, Virgen Purísima en el parto", la esperanza "para que la alientes".
3. `hail-mary-charity`: "Esposa de Dios Espíritu Santo, Virgen Purísima después del parto", la caridad "para que la inflames"; El Rosario de María añade "nuestros dones y carismas para que los perfecciones y todas nuestras necesidades para que las remedies".
4. `trinity-salutation`: "Dios te salve, María Santísima, Templo, Trono y Sagrario de la Santísima Trinidad, Virgen concebida sin la culpa original." Se dice sola, sin Avemaría.

| Fuente | Dónde | Redacción |
| --- | --- | --- |
| El Rosario de María, "Forma de rezar el Rosario" (https://www.rosariodemaria.org/rezar.html) | España | "ponemos", "dones y carismas", "Templo, Trono y Sagrario". Texto principal |
| Desde la fe, guías de los misterios (https://desdelafe.mx/rosarios/rosario-lunes-rosario-sabado-misterios-gozosos/) | México | "ponemos", sin "dones y carismas", "Templo y Sagrario" |
| Cofradía del Rosario, Santo Domingo de Oaxaca (https://cofradiadelrosarioax.wixsite.com/oaxaca/rezo-del-sant%C3%ADsimo-rosario) | México | "Señora", "alumbres"; marca Lector y Respuesta |
| Catholic.net, "El Santo Rosario" (https://es.catholic.net/op/articulos/13325/el-santo-rosario) | General | "encomendamos", sin "Virgen Purísima..." |

Todas las fuentes las rezan **al final** del Rosario, después de los cinco misterios y antes de la Salve. En la app son una forma opcional de las tres Avemarías iniciales: con `three-virtues`, las tres Avemarías del inicio se rezan con estas salutaciones (fe, esperanza, caridad, en ese orden) y la salutación a la Trinidad va antes del Gloria.

Al rezar en común, quien dirige dice la salutación y el Avemaría hasta "Jesús"; la asamblea responde desde "Santa María" (Cofradía de Oaxaca: Lector / Respuesta). Es la misma división del Avemaría es-MX.

En inglés no se encontró una forma publicada: las guías rezan las tres Avemarías por la fe, la esperanza y la caridad sin cambiar el texto. En latín no hay texto.

## Indulgencia plenaria (EI)

Las indulgencias se describen; la app no las otorga ni las da por obtenidas.

**La obra** (EI, concesión 17, § 1): "Plenaria indulgentia conceditur christifideli qui 1° Rosarium mariale pie recitaverit in ecclesia aut oratorio, vel in familia, in religiosa Communitate, in christifidelium consociatione et generatim cum plures ad aliquem honestum finem conveniunt; 2° eiusdem precis recitationi, dum a Summo Pontifice peragitur, et ope instrumenti televisifici vel radiophonici propagatur, sese pie univerit. In aliis rerum adiunctis vero indulgentia erit partialis."

Resumen de trabajo (no es traducción oficial): plenaria si se reza en una iglesia u oratorio, en familia, en comunidad religiosa, en una asociación de fieles o, en general, cuando varios se reúnen con un fin honesto; también si uno se une piadosamente al Rosario que reza el Papa transmitido por televisión o radio. En los demás casos, parcial.

**Normas para la plenaria** (misma concesión): "a) sufficit recitatio tertiae tantum eius partis; sed quinque decades continuo recitari debent; b) orationi vocali addenda est pia mysteriorum meditatio; c) in publica recitatione, mysteria enuntiari debent iuxta probatam loci consuetudinem; in privata vero recitatione, sufficit ut christifidelis orationi vocali adiungat meditationem mysteriorum."

Resumen: basta una parte (cinco decenas), rezadas sin interrupción; a la oración vocal se une la meditación de los misterios; en el rezo público los misterios se enuncian según la costumbre aprobada del lugar. El texto de 1999 habla de "quince decenas" y de "tercera parte" porque es anterior a los misterios luminosos (2002).

**Condiciones** (EI, Normae N. 20):

- § 1: exclusión de todo afecto a cualquier pecado, incluso venial, y "trium condicionum, quae sunt: sacramentalis confessio, communio eucharistica et oratio ad mentem Summi Pontificis".
- § 2: una confesión vale para varias plenarias; una comunión y una oración por el Papa, para una sola.
- § 3: las condiciones pueden cumplirse varios días antes o después; conviene que la comunión y la oración por el Papa sean el mismo día.
- § 4: si falta la disposición plena o alguna condición, la indulgencia es parcial.
- § 5: la oración por el Papa se cumple "si recitantur ad eiusdem mentem semel Pater et Ave", o con otra oración según la devoción de cada fiel.

Otras normas:

- N. 18 § 1: la plenaria se gana una vez al día.
- N. 22: la indulgencia ligada a una oración se obtiene en cualquier idioma "dummodo versio sit a competente ecclesiastica auctoritate adprobata".
- "Aliae concessiones", proemio n. 4: cuando una concesión pide rezar oraciones o letanías, "textus eorum semper adprobatus esse debet a competenti Auctoritate ecclesiastica".
- Proemio n. 6: si una obra con plenaria se puede dividir ("e.g. Rosarium mariale in decades"), quien por causa razonable no la completa obtiene la parcial por la parte hecha.
