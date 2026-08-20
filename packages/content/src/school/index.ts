import type { SchoolPage } from './types';

export type { SchoolBlock, SchoolPage, SchoolPageId, SchoolPageText } from './types';

/**
 * The school of the Rosary: what it is, where it comes from, what the Church says, and
 * what it is not. Every statement carries its source, and magisterium, liturgy and
 * pious tradition are never mixed (task 034). Read by the app and the site alike.
 *
 * Spanish quotations are verified against docs/referencias/rosario-doctrina.md. English
 * blocks state the same content in indirect speech unless the English wording itself is
 * verified there.
 */
export const schoolPages: readonly SchoolPage[] = [
  {
    id: 'what-it-is',
    source: {
      es: {
        name: 'Pío V, Consueverunt Romani Pontifices (1569); Pablo VI, Marialis cultus; Juan Pablo II, Rosarium Virginis Mariae',
        url: 'https://www.vatican.va/content/john-paul-ii/es/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html',
      },
      en: {
        name: 'Pius V, Consueverunt Romani Pontifices (1569); Paul VI, Marialis cultus; John Paul II, Rosarium Virginis Mariae',
        url: 'https://www.vatican.va/content/john-paul-ii/en/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html',
      },
    },
    text: {
      es: {
        title: 'Qué es el Rosario',
        lead: 'Contemplar la vida de Cristo con María, contando con los dedos.',
        blocks: [
          {
            text: 'San Pío V lo describió así: el saludo del ángel repetido ciento cincuenta veces, el Padrenuestro en cada decena, y entre esas oraciones, meditaciones que muestran la vida entera de Jesucristo.',
            cite: 'Consueverunt Romani Pontifices, 1569',
            kind: 'magisterium',
          },
          {
            text: 'Lo esencial son cuatro cosas: la meditación de los misterios, el Padrenuestro de cada decena, las diez avemarías y el Gloria. Lo demás es marco legítimo que cambia según la región: el Credo del principio, las tres avemarías, la oración de Fátima y las jaculatorias de cada decena, la Salve. Las letanías lauretanas suelen cerrarlo en octubre, pero son un acto de culto por sí mismas, y no un apéndice del Rosario.',
            cite: 'Marialis cultus 49; RVM 37; DPPL 203',
            kind: 'magisterium',
          },
          {
            text: 'De carácter mariano, el Rosario es en el fondo una oración centrada en Cristo: la tradición lo llama compendio del Evangelio, porque sus misterios recorren la vida del Señor desde la encarnación hasta la gloria.',
            cite: 'RVM 1; MC 42',
            kind: 'magisterium',
          },
          {
            text: 'Los misterios luminosos los propuso Juan Pablo II en 2002, y su incorporación "se deja a la libre consideración de los individuos y de las comunidades": quien reza el esquema de quince misterios no reza de menos.',
            cite: 'RVM 19',
            kind: 'magisterium',
          },
          {
            text: 'La praxis corriente reparte los misterios por día: gozosos el lunes y el sábado, luminosos el jueves, dolorosos el martes y el viernes, gloriosos el miércoles y el domingo. En Adviento y Navidad los domingos suelen ser gozosos; en Cuaresma, dolorosos. Es la indicación de RVM 38, que el mismo documento deja en libertad; el esquema anterior a 2002 (gozosos lunes y jueves, gloriosos miércoles, sábado y domingo) sigue siendo un uso legítimo.',
            cite: 'RVM 38; DPPL 200; USCCB',
            kind: 'note',
          },
          {
            text: 'El día litúrgico prevalece sobre el día de la semana: en Navidad tocan los misterios del nacimiento aunque caiga en viernes.',
            cite: 'DPPL 200',
            kind: 'liturgy',
          },
          {
            text: 'No todo lo que se reza en unas cuentas es el Rosario: la coronilla de la Divina Misericordia usa el mismo objeto y es otra devoción; la corona de los Siete Dolores es otra corona mariana aprobada. Y los misterios inventados fuera de los veinte no forman parte del Rosario que la Iglesia enriquece con indulgencias.',
            cite: 'DPPL 202; Rosary Center',
            kind: 'note',
          },
          {
            text: 'Sobre la obligación, la Iglesia es clara: nadie está obligado a rezar el Rosario. Pablo VI pidió que el fiel se sienta "serenamente libre" ante él, atraído por su belleza; y el Directorio manda evitar que se cree "un sentimiento de culpa en quien no lo recita habitualmente".',
            cite: 'MC 55; DPPL 202',
            kind: 'magisterium',
          },
        ],
      },
      en: {
        title: 'What the Rosary is',
        lead: 'Contemplating the life of Christ with Mary, counting on your fingers.',
        blocks: [
          {
            text: "Saint Pius V described it plainly: the angel's greeting repeated a hundred and fifty times, the Lord's Prayer at each decade, and woven between them, meditations showing forth the entire life of our Lord Jesus Christ.",
            cite: 'Consueverunt Romani Pontifices, 1569',
            kind: 'magisterium',
          },
          {
            text: 'Four things are essential: meditating the mysteries, the Our Father of each decade, the ten Hail Marys, and the Glory Be. The rest is a legitimate frame that varies by region: the opening Creed, the three Hail Marys, the Fatima prayer and the invocations after each decade, the Salve. The Litany of Loreto often closes it in October, but it is an act of worship in its own right, and never a mere appendix of the Rosary.',
            cite: 'Marialis cultus 49; RVM 37; DPPL 203',
            kind: 'magisterium',
          },
          {
            text: 'Marian in character, the Rosary is at heart a prayer centered on Christ: tradition calls it a compendium of the Gospel, because its mysteries walk the life of the Lord from the incarnation to the glory.',
            cite: 'RVM 1; MC 42',
            kind: 'magisterium',
          },
          {
            text: 'The luminous mysteries were proposed by John Paul II in 2002, and their adoption is left to the free consideration of individuals and communities: whoever prays the fifteen-mystery scheme does not pray a lesser Rosary.',
            cite: 'RVM 19',
            kind: 'magisterium',
          },
          {
            text: 'Common practice assigns the mysteries by day: joyful on Monday and Saturday, luminous on Thursday, sorrowful on Tuesday and Friday, glorious on Wednesday and Sunday. In Advent and Christmastide the Sundays are usually joyful; in Lent, sorrowful. That is the indication of RVM 38, which the same document leaves free; the pre-2002 scheme (joyful on Monday and Thursday, glorious on Wednesday, Saturday and Sunday) remains a legitimate use.',
            cite: 'RVM 38; DPPL 200; USCCB',
            kind: 'note',
          },
          {
            text: 'The liturgical day prevails over the day of the week: on Christmas the mysteries of the birth are prayed even when it falls on a Friday.',
            cite: 'DPPL 200',
            kind: 'liturgy',
          },
          {
            text: 'Not everything prayed on beads is the Rosary: the Divine Mercy chaplet uses the same object and is another devotion; the chaplet of the Seven Sorrows is another approved Marian crown. And mysteries invented outside the twenty are not part of the Rosary the Church enriches with indulgences.',
            cite: 'DPPL 202; Rosary Center',
            kind: 'note',
          },
          {
            text: 'On obligation the Church is clear: no one is obliged to pray the Rosary. Paul VI asked that the faithful feel serenely free before it, drawn by its beauty; and the Directory orders that no feeling of guilt be created in those who do not pray it regularly.',
            cite: 'MC 55; DPPL 202',
            kind: 'magisterium',
          },
        ],
      },
    },
  },
  {
    id: 'history',
    source: {
      es: {
        name: 'Catholic Encyclopedia, "The Rosary" (H. Thurston); León XIII, Supremi apostolatus officio',
        url: 'https://www.newadvent.org/cathen/13184b.htm',
      },
      en: {
        name: 'Catholic Encyclopedia, "The Rosary" (H. Thurston); Leo XIII, Supremi apostolatus officio',
        url: 'https://www.newadvent.org/cathen/13184b.htm',
      },
    },
    text: {
      es: {
        title: 'De dónde viene',
        lead: 'Lo que dice la tradición y lo que dice la historia, sin mezclarlas.',
        blocks: [
          {
            text: 'La tradición piadosa cuenta que la Virgen entregó el Rosario a santo Domingo, hacia 1214, como arma contra la herejía. Los documentos pontificios que la recogen afirman algo más sobrio: que Domingo introdujo y difundió el Rosario, "no sin la sugerencia e inspiración celestial" de la Madre de Dios.',
            cite: 'Consueverunt (1569); Supremi (1883); Ingravescentibus 12',
            kind: 'tradition',
          },
          {
            text: 'La historia documenta otro camino: ninguna de las vidas tempranas de santo Domingo menciona el Rosario; los salterios marianos de 150 avemarías y las cuentas para contar existían antes; hacia 1409 el cartujo Domingo de Prusia añadió cincuenta cláusulas sobre la vida de Cristo tras el nombre de Jesús; el beato Alano de la Roche fundó la cofradía de Douai hacia 1470, y Jacob Sprenger la de Colonia en 1475; los quince misterios se fijaron en el siglo XVI con san Pío V.',
            cite: 'Catholic Encyclopedia, "The Rosary"',
            kind: 'note',
          },
          {
            text: 'Esta escuela no zanja esa diferencia: la aparición a santo Domingo no se presenta como hecho histórico verificado ni como leyenda descartada. Juan Pablo II se limita a decir que esta oración ha sido utilizada especialmente por los dominicos, y que el Rosario "se ha consolidado en la práctica más común corroborada por la autoridad eclesial".',
            cite: 'RVM 17 y 19',
            kind: 'note',
          },
          {
            text: 'El 7 de octubre de 1571, la flota cristiana venció en Lepanto. San Pío V atribuyó la victoria a la intercesión de la Virgen, invocada con el Rosario; de ahí viene la celebración de Nuestra Señora del Rosario, hoy memoria obligatoria del 7 de octubre en toda la Iglesia.',
            cite: 'Supremi 4; Gregorio XIII (1573); Clemente XI (1716)',
            kind: 'note',
          },
        ],
      },
      en: {
        title: 'Where it comes from',
        lead: 'What tradition says and what history says, kept apart.',
        blocks: [
          {
            text: 'Pious tradition tells that the Virgin gave the Rosary to Saint Dominic, around 1214, as a weapon against heresy. The pontifical documents that hand this on state something more sober: that Dominic introduced and spread the Rosary, not without the heavenly suggestion and inspiration of the Mother of God.',
            cite: 'Consueverunt (1569); Supremi (1883); Ingravescentibus 12',
            kind: 'tradition',
          },
          {
            text: 'History documents another road: none of the early Lives of Saint Dominic mentions the Rosary; Marian psalters of a hundred and fifty Hail Marys, and beads to count them, existed before him; around 1409 the Carthusian Dominic of Prussia added fifty clauses on the life of Christ after the name of Jesus; Blessed Alan de la Roche founded the confraternity of Douai around 1470, and Jacob Sprenger that of Cologne in 1475; the fifteen mysteries were fixed in the sixteenth century under Saint Pius V.',
            cite: 'Catholic Encyclopedia, "The Rosary"',
            kind: 'note',
          },
          {
            text: 'This school does not settle that difference: the apparition to Saint Dominic is presented neither as a verified historical fact nor as a discarded legend. John Paul II limits himself to saying that this prayer has been used especially by the Dominicans, and that the Rosary has become consolidated in the most common practice, corroborated by ecclesial authority.',
            cite: 'RVM 17 and 19',
            kind: 'note',
          },
          {
            text: 'On October 7, 1571, the Christian fleet won at Lepanto. Saint Pius V attributed the victory to the intercession of the Virgin, invoked with the Rosary; from there comes the celebration of Our Lady of the Rosary, today an obligatory memorial kept on October 7 across the whole Church.',
            cite: 'Supremi 4; Gregory XIII (1573); Clement XI (1716)',
            kind: 'note',
          },
        ],
      },
    },
  },
  {
    id: 'method',
    source: {
      es: {
        name: 'Juan Pablo II, Rosarium Virginis Mariae, 26-38',
        url: 'https://www.vatican.va/content/john-paul-ii/es/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html',
      },
      en: {
        name: 'John Paul II, Rosarium Virginis Mariae, 26-38',
        url: 'https://www.vatican.va/content/john-paul-ii/en/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html',
      },
    },
    text: {
      es: {
        title: 'El método',
        lead: 'Rezarlo como lo enseña Rosarium Virginis Mariae, paso a paso.',
        blocks: [
          {
            text: 'La repetición no es rutina: es "expresión del amor que no se cansa de dirigirse a la persona amada". Quien la vive así no recita: contempla.',
            cite: 'RVM 26',
            kind: 'magisterium',
          },
          {
            text: 'Enunciar el misterio "es como abrir un escenario en el cual concentrar la atención". Ayuda mirar al mismo tiempo una imagen que lo represente.',
            cite: 'RVM 29',
            kind: 'magisterium',
          },
          {
            text: 'Después del enunciado, la Palabra: proclamar el pasaje bíblico del misterio, largo o breve según el momento. "No, no se trata de recordar una información, sino de dejar hablar a Dios."',
            cite: 'RVM 30',
            kind: 'magisterium',
          },
          {
            text: 'Luego, el silencio: "esperemos unos momentos antes de iniciar la oración vocal".',
            cite: 'RVM 31',
            kind: 'magisterium',
          },
          {
            text: 'La app trae ese silencio como ajuste, y cero segundos es una opción tan válida como un minuto.',
            kind: 'note',
          },
          {
            text: 'El centro del avemaría es el nombre de Jesús. Pablo VI recordó la costumbre de añadirle una cláusula que evoca el misterio ("Jesús, bautizado en el Jordán"); Juan Pablo II la llama "costumbre loable, especialmente en la plegaria pública", porque mantiene atenta la meditación. El Directorio pide que la cláusula sea fija por decena, breve y bíblica.',
            cite: 'MC 46; RVM 33; DPPL 201',
            kind: 'magisterium',
          },
          {
            text: 'El Gloria es "el culmen de la contemplación", y merece su tono: en el rezo público podría incluso cantarse. Tras él, sin quitar valor a las jaculatorias de cada región, a Juan Pablo II le parece oportuno cerrar cada misterio con una oración por sus frutos.',
            cite: 'RVM 34-35',
            kind: 'magisterium',
          },
          {
            text: 'Las distracciones involuntarias no anulan el rezo. El Catecismo aconseja no perseguirlas: "basta volver a nuestro corazón"; y Montfort escribe que no se puede rezar el Rosario sin algunas distracciones involuntarias, y que hay más mérito cuando rezar cuesta.',
            cite: 'CIC 2729; Montfort, rosas 42-43',
            kind: 'magisterium',
          },
          {
            text: 'La postura acompaña, no condiciona: de rodillas cuando se puede, y con toda legitimidad sentado, en la cama si se está enfermo, caminando o de viaje. La tradición lo dice con Montfort: María premia la buena voluntad más que los gestos externos.',
            cite: 'Montfort, rosa 45',
            kind: 'tradition',
          },
        ],
      },
      en: {
        title: 'The method',
        lead: 'Praying it the way Rosarium Virginis Mariae teaches, step by step.',
        blocks: [
          {
            text: 'Repetition is not routine: it is an expression of the love that never tires of turning to the person loved. Lived that way, it is not recitation but contemplation.',
            cite: 'RVM 26',
            kind: 'magisterium',
          },
          {
            text: 'Announcing the mystery opens, as it were, a scenario on which to focus the attention. Looking at an image of the mystery at the same time helps.',
            cite: 'RVM 29',
            kind: 'magisterium',
          },
          {
            text: 'After the announcement, the Word: proclaiming the biblical passage of the mystery, longer or shorter as the moment allows. It is not a matter of recalling information, but of letting God speak.',
            cite: 'RVM 30',
            kind: 'magisterium',
          },
          {
            text: 'Then silence: waiting a few moments before beginning the vocal prayer.',
            cite: 'RVM 31',
            kind: 'magisterium',
          },
          {
            text: 'The app carries that silence as a setting, and zero seconds is as valid a choice as a full minute.',
            kind: 'note',
          },
          {
            text: 'The center of the Hail Mary is the name of Jesus. Paul VI recalled the custom of adding to it a clause evoking the mystery ("Jesus, baptized in the Jordan"); John Paul II calls it a praiseworthy custom, especially in public recitation, because it keeps the meditation attentive. The Directory asks that the clause be fixed per decade, brief and biblical.',
            cite: 'MC 46; RVM 33; DPPL 201',
            kind: 'magisterium',
          },
          {
            text: 'The Glory Be is the high-point of contemplation and deserves its tone: in public prayer it could even be sung. After it, without taking value from the customary invocations, John Paul II finds it fitting to close each mystery with a prayer for its fruits.',
            cite: 'RVM 34-35',
            kind: 'magisterium',
          },
          {
            text: 'Involuntary distractions do not undo the prayer. The Catechism advises against chasing them: it is enough to return to our heart; and Montfort writes that the Rosary cannot be prayed without some involuntary distractions, and that there is more merit when praying is hard.',
            cite: 'CCC 2729; Montfort, roses 42-43',
            kind: 'magisterium',
          },
          {
            text: 'Posture accompanies; it does not condition: kneeling when possible, and just as legitimately seated, in bed when sick, walking or traveling. The tradition says it with Montfort: Mary rewards good will more than exterior actions.',
            cite: 'Montfort, rose 45',
            kind: 'tradition',
          },
        ],
      },
    },
  },
  {
    id: 'promises',
    source: {
      es: {
        name: 'Rosary Center (dominicos), con Nihil obstat e Imprimi potest',
        url: 'https://www.rosarycenter.org/',
      },
      en: {
        name: 'Rosary Center (Dominican), with Nihil obstat and Imprimi potest',
        url: 'https://www.rosarycenter.org/',
      },
    },
    text: {
      es: {
        title: 'Las quince promesas',
        lead: 'Tradición piadosa del siglo XV, con su origen a la vista.',
        blocks: [
          {
            text: 'Las quince promesas se atribuyen a la Virgen por el beato Alano de la Roche, en el siglo XV. Son tradición piadosa, no doctrina definida por la Iglesia: ningún documento pontificio las enumera. La Cofradía dominicana las presenta como "dadas a santo Domingo y al beato Alano".',
            cite: 'Catholic Encyclopedia, "The Rosary"; rosarycenter.org',
            kind: 'note',
          },
          {
            text: 'El propio Alano es un testigo discutido: la historiografía señala que fundó sus revelaciones en testimonios de autores que no existieron. Eso no decide la cuestión de fe; sitúa el género: promesas de devocionario, no historia documentada.',
            cite: 'Catholic Encyclopedia, "The Rosary" (H. Thurston)',
            kind: 'note',
          },
          {
            text: 'Se publican con imprimatur en devocionarios dominicanos, lo cual garantiza que no contienen error doctrinal; no garantiza su historicidad.',
            cite: 'rosarycenter.org',
            kind: 'note',
          },
          {
            text: 'La tradición misma las entiende condicionadas: a la fe, a la conversión y a la perseverancia de quien reza. San Luis de Montfort lo dice sin rodeos: la Virgen no protege a quien persevera en amar el pecado.',
            cite: 'Montfort, El secreto admirable del Rosario, rosa 41',
            kind: 'tradition',
          },
          {
            text: 'Según esa tradición piadosa, prometen, entre otras cosas: gracias y protección especial a quien lo rece con devoción (1-2); que el Rosario será escudo contra el infierno y remedio contra el vicio (3); que hará florecer las virtudes (4); que el alma que se encomiende a María por el Rosario no perecerá (5); que quien lo rece meditando sus misterios no será vencido por la desgracia ni tendrá una muerte imprevista (6); que quien le tenga verdadera devoción no morirá sin los sacramentos (7); luz y plenitud de gracia en la vida y en la muerte (8); la liberación del purgatorio para sus devotos (9); un alto grado de gloria (10); que lo pedido por el Rosario se alcanzará (11); ayuda a quien lo propague (12); la corte celestial por intercesora (13); la hermandad con Jesucristo (14); y que la devoción al Rosario es una gran señal de predestinación (15).',
            cite: 'Resumen de la lista publicada por rosarycenter.org; numeración tradicional',
            kind: 'tradition',
          },
          {
            text: 'Esta app las muestra como lo que son: un testimonio de lo que generaciones han esperado de esta oración. Nada de esto es un mecanismo, y ningún contador de la app tiene relación con ellas.',
            kind: 'note',
          },
        ],
      },
      en: {
        title: 'The fifteen promises',
        lead: 'A fifteenth-century pious tradition, with its origin in plain sight.',
        blocks: [
          {
            text: 'The fifteen promises are attributed to the Virgin through Blessed Alan de la Roche, in the fifteenth century. They are pious tradition, not doctrine defined by the Church: no pontifical document lists them. The Dominican Confraternity presents them as given to Saint Dominic and Blessed Alan.',
            cite: 'Catholic Encyclopedia, "The Rosary"; rosarycenter.org',
            kind: 'note',
          },
          {
            text: 'Alan himself is a disputed witness: historians note that he based his revelations on the testimony of writers that never existed. That does not decide the question of faith; it names the genre: prayer-book promises, not documented history.',
            cite: 'Catholic Encyclopedia, "The Rosary" (H. Thurston)',
            kind: 'note',
          },
          {
            text: 'They are published with imprimatur in Dominican prayer books, which guarantees they contain no doctrinal error; it does not guarantee their historicity.',
            cite: 'rosarycenter.org',
            kind: 'note',
          },
          {
            text: 'The tradition itself understands them as conditional: on faith, conversion and perseverance. Saint Louis de Montfort says it without softening: the Virgin does not protect whoever continues to love sin.',
            cite: 'Montfort, The Secret of the Rosary, rose 41',
            kind: 'tradition',
          },
          {
            text: 'According to that pious tradition, they promise, among other things: signal graces and special protection to those who pray it faithfully (1-2); that the Rosary shall be an armor against hell and a remedy against vice (3); that it will cause virtues to flourish (4); that the soul which commends itself to Mary by the Rosary shall not perish (5); that those who pray it devoutly, meditating its mysteries, shall not be conquered by misfortune nor die an unprovided death (6); that those with true devotion to it shall not die without the sacraments (7); the light and the fullness of grace in life and at death (8); deliverance from purgatory for its devoted (9); a high degree of glory (10); that what is asked through the Rosary shall be obtained (11); help for those who propagate it (12); the whole celestial court as intercessors (13); brotherhood with Jesus Christ (14); and that devotion to the Rosary is a great sign of predestination (15).',
            cite: 'Summary of the list published by rosarycenter.org; traditional numbering',
            kind: 'tradition',
          },
          {
            text: 'This app shows them for what they are: a testimony of what generations have hoped from this prayer. None of this is a mechanism, and no counter in the app has anything to do with them.',
            kind: 'note',
          },
        ],
      },
    },
  },
  {
    id: 'indulgences',
    source: {
      es: {
        name: 'Enchiridion Indulgentiarum, concesión 17 y normas 3, 6 y 17-21',
        url: 'https://www.vatican.va/roman_curia/tribunals/apost_penit/documents/rc_trib_appen_doc_20020826_enchiridion-indulgentiarum_lt.html',
      },
      en: {
        name: 'Enchiridion Indulgentiarum, concession 17 and norms 3, 6 and 17-21',
        url: 'https://www.vatican.va/roman_curia/tribunals/apost_penit/documents/rc_trib_appen_doc_20020826_enchiridion-indulgentiarum_lt.html',
      },
    },
    text: {
      es: {
        title: 'Las indulgencias',
        lead: 'Lo que la Iglesia concede, con sus condiciones exactas. La app describe; no otorga.',
        blocks: [
          {
            text: 'La Iglesia concede indulgencia plenaria a quien reza el Rosario en una iglesia u oratorio, en familia, en comunidad religiosa, en asociación de fieles y, en general, cuando varios se reúnen con un fin honesto; y también a quien se une piadosamente al Rosario rezado por el Papa y transmitido en directo por radio o televisión. En las demás circunstancias, la indulgencia es parcial.',
            cite: 'Enchiridion Indulgentiarum, conc. 17 §1',
            kind: 'magisterium',
          },
          {
            text: 'Rezar solo en casa, por tanto, lleva indulgencia parcial, aunque se cumpla todo lo demás. Y la concesión por medios habla del Rosario del Papa en directo: una grabación, el audio de esta app o el streaming de una parroquia no entran en su letra.',
            cite: 'EI, conc. 17 §1; Penitenciaría Apostólica, decreto 20-III-2020',
            kind: 'note',
          },
          {
            text: 'Para la plenaria bastan cinco decenas, pero rezadas seguidas, añadiendo a la oración vocal la meditación de los misterios. En el rezo público los misterios se enuncian según la costumbre del lugar; en el privado, basta unir la meditación a la oración vocal.',
            cite: 'EI, conc. 17, condiciones a-c',
            kind: 'magisterium',
          },
          {
            text: 'A toda plenaria se suman las condiciones habituales: confesión sacramental, comunión eucarística, oración por las intenciones del Papa y desapego de todo pecado, incluso venial. Si falta alguna, la indulgencia queda en parcial: no se pierde, cambia de grado. Se concede una plenaria al día.',
            cite: 'EI, normas 18 y 20',
            kind: 'magisterium',
          },
          {
            text: 'Las mismas normas traen sus anchuras: basta estar en gracia al terminar la obra y tener la intención al menos general de ganarla; una sola confesión sirve para varias plenarias; las condiciones pueden cumplirse varios días antes o después; y la oración por el Papa se cumple con un Padrenuestro y un Avemaría.',
            cite: 'EI, normas 17 y 20 §2-5',
            kind: 'magisterium',
          },
          {
            text: 'Rezar el Rosario por partes a lo largo del día es una práctica que Montfort recomienda; para la indulgencia, cuenta como obra dividida: parcial. Y desde 1967 las indulgencias no se cuentan en días ni en años: esa aritmética ya no existe.',
            cite: 'EI, norma 6; Montfort, rosa 45; Pablo VI, Indulgentiarum doctrina (1967)',
            kind: 'note',
          },
          {
            text: 'Las indulgencias pueden aplicarse a los difuntos, a modo de sufragio.',
            cite: 'EI, norma 3',
            kind: 'magisterium',
          },
          {
            text: 'La app nunca marca una indulgencia como conseguida: las condiciones interiores (el estado de gracia, el desapego del pecado) no las puede ver nadie más que Dios y tu confesor. Aquí solo está escrito lo que la Iglesia concede.',
            kind: 'note',
          },
        ],
      },
      en: {
        title: 'Indulgences',
        lead: 'What the Church grants, with its exact conditions. The app describes; it does not grant.',
        blocks: [
          {
            text: 'The Church grants a plenary indulgence to those who pray the Rosary in a church or oratory, in the family, in a religious community, in an association of the faithful and, in general, whenever several gather for an honest purpose; and to those who devoutly join the Rosary prayed by the Pope, broadcast live by radio or television. In other circumstances, the indulgence is partial.',
            cite: 'Enchiridion Indulgentiarum, conc. 17 §1',
            kind: 'magisterium',
          },
          {
            text: "Praying alone at home, therefore, carries a partial indulgence, even when everything else is fulfilled. And the media concession speaks of the Pope's Rosary broadcast live: a recording, the audio of this app or a parish stream do not fall within its letter.",
            cite: 'EI, conc. 17 §1; Apostolic Penitentiary, decree of March 20, 2020',
            kind: 'note',
          },
          {
            text: 'For the plenary, five decades suffice, but prayed without interruption, adding devout meditation on the mysteries to the vocal prayer. In public recitation the mysteries are announced according to the local custom; in private, it is enough to join the meditation to the vocal prayer.',
            cite: 'EI, conc. 17, conditions a-c',
            kind: 'magisterium',
          },
          {
            text: 'Every plenary carries the usual conditions: sacramental confession, eucharistic communion, prayer for the intentions of the Pope, and detachment from all sin, even venial. If any is missing, the indulgence remains partial: it is not lost, it changes degree. One plenary is granted per day.',
            cite: 'EI, norms 18 and 20',
            kind: 'magisterium',
          },
          {
            text: 'The same norms carry their own breadth: it is enough to be in grace at the completion of the work, with at least a general intention of gaining the indulgence; one confession serves for several plenaries; the conditions may be fulfilled several days before or after; and the prayer for the Pope is satisfied with one Our Father and one Hail Mary.',
            cite: 'EI, norms 17 and 20 §2-5',
            kind: 'magisterium',
          },
          {
            text: 'Praying the Rosary in parts through the day is a practice Montfort recommends; for the indulgence, it counts as a divided work: partial. And since 1967 indulgences are no longer counted in days or years: that arithmetic no longer exists.',
            cite: 'EI, norm 6; Montfort, rose 45; Paul VI, Indulgentiarum doctrina (1967)',
            kind: 'note',
          },
          {
            text: 'Indulgences may be applied to the dead, by way of suffrage.',
            cite: 'EI, norm 3',
            kind: 'magisterium',
          },
          {
            text: 'The app never marks an indulgence as obtained: the interior conditions (the state of grace, detachment from sin) can be seen by no one but God and your confessor. Here is written only what the Church grants.',
            kind: 'note',
          },
        ],
      },
    },
  },
  {
    id: 'the-object',
    source: {
      es: {
        name: 'Catecismo de la Iglesia Católica, 1667-1671 y 2111; RVM 28 y 36',
        url: 'https://www.vatican.va/archive/catechism_sp/index_sp.html',
      },
      en: {
        name: 'Catechism of the Catholic Church, 1667-1671 and 2111; RVM 28 and 36',
        url: 'https://www.vatican.va/archive/ENG0015/_INDEX.HTM',
      },
    },
    text: {
      es: {
        title: 'El rosario en la mano',
        lead: 'Un sacramental sirve para rezar. No protege por sí mismo.',
        blocks: [
          {
            text: 'El rosario de cuentas es un sacramental: un signo sagrado que dispone a recibir la gracia y santifica circunstancias de la vida. Los sacramentales "no confieren la gracia del Espíritu Santo a la manera de los sacramentos, pero por la oración de la Iglesia preparan a recibirla".',
            cite: 'CIC 1667, 1670',
            kind: 'magisterium',
          },
          {
            text: 'Atribuir eficacia "a la sola materialidad de las oraciones o de los signos sacramentales, prescindiendo de las disposiciones interiores que exigen, es caer en la superstición". El Catecismo lo dice de prácticas legítimas, y el Rosario lo es: el problema nunca es el objeto, sino esperar de él lo que Dios da por la fe, la atención y la caridad de quien reza, y por la intercesión de María y de la Iglesia.',
            cite: 'CIC 2111',
            kind: 'magisterium',
          },
          {
            text: 'Juan Pablo II advirtió el riesgo exacto: que el rosario "acabe por considerarse como una especie de amuleto o un objeto mágico": una distorsión radical de su sentido y su cometido.',
            cite: 'RVM 28',
            kind: 'magisterium',
          },
          {
            text: 'El mismo documento da la imagen contraria: el rosario está centrado en el Crucifijo, que abre y cierra la oración, y evoca el camino incesante de la contemplación: "cadena, sí, pero cadena dulce", que nos une a Dios.',
            cite: 'RVM 36',
            kind: 'magisterium',
          },
          {
            text: 'La bendición de un rosario bendice sobre todo a quien va a rezarlo: pide que quien medite los misterios establezca "una armonía perfecta entre la oración y la vida".',
            cite: 'DPPL 198',
            kind: 'liturgy',
          },
          {
            text: 'Usar con devoción un rosario bendecido lleva indulgencia parcial: es la oración de la Iglesia unida al uso piadoso, no el objeto. Si lo bendijo el Papa o un obispo, hay plenaria en la solemnidad de san Pedro y san Pablo, añadiendo una profesión de fe.',
            cite: 'EI, conc. 15',
            kind: 'magisterium',
          },
          {
            text: 'Un rosario roto se repara, o se desecha con respeto; no hay mala suerte ni número mágico de cuentas. Y Montfort recuerda dónde está el peso: una avemaría bien dicha vale más que ciento cincuenta mal dichas.',
            cite: 'Can. 1171; Montfort, rosa 41',
            kind: 'note',
          },
          {
            text: 'Por eso en esta app no hay rosarios que "se cargan", ni protección que se pierde, ni poder que se acumula. Se cuenta lo que rezaste; la gracia no se cuenta.',
            kind: 'note',
          },
        ],
      },
      en: {
        title: 'The rosary in your hand',
        lead: 'A sacramental is for praying. It does not protect by itself.',
        blocks: [
          {
            text: 'The rosary of beads is a sacramental: a sacred sign that disposes us to receive grace and sanctifies circumstances of life. Sacramentals do not confer the grace of the Holy Spirit in the way the sacraments do; by the prayer of the Church, they prepare us to receive it.',
            cite: 'CCC 1667, 1670',
            kind: 'magisterium',
          },
          {
            text: 'To attribute efficacy to the mere materiality of prayers or sacramental signs, apart from the interior dispositions they demand, is to fall into superstition. The Catechism says this of legitimate practices, and the Rosary is one: the problem is never the object, but expecting from it what God gives through the faith, attention and charity of the one who prays, and through the intercession of Mary and of the Church.',
            cite: 'CCC 2111',
            kind: 'magisterium',
          },
          {
            text: 'John Paul II named the exact risk: that the rosary can come to be regarded as a kind of amulet or magic object, a radical distortion of its meaning and purpose.',
            cite: 'RVM 28',
            kind: 'magisterium',
          },
          {
            text: 'The same document gives the opposite image: the rosary is centered on the Crucifix, which opens and closes the prayer, and evokes the unceasing path of contemplation: a chain, yes, but a sweet chain that binds us to God.',
            cite: 'RVM 36',
            kind: 'magisterium',
          },
          {
            text: 'The blessing of a rosary blesses above all the one who will pray it: it asks that whoever meditates the mysteries may establish a perfect harmony between prayer and life.',
            cite: 'DPPL 198',
            kind: 'liturgy',
          },
          {
            text: 'Devoutly using a blessed rosary carries a partial indulgence: the prayer of the Church joined to pious use, never the object alone. If it was blessed by the Pope or a bishop, there is a plenary on the solemnity of Saints Peter and Paul, adding a profession of faith.',
            cite: 'EI, conc. 15',
            kind: 'magisterium',
          },
          {
            text: 'A broken rosary is repaired, or set aside with respect; there is no bad luck and no magic number of beads. And Montfort remembers where the weight lies: a single Hail Mary said properly is worth more than a hundred and fifty said badly.',
            cite: 'Can. 1171; Montfort, rose 41',
            kind: 'note',
          },
          {
            text: 'That is why this app has no rosaries that "charge up", no protection that is lost, no power that accumulates. What you prayed is counted; grace is not.',
            kind: 'note',
          },
        ],
      },
    },
  },
];

export function findSchoolPage(id: string): SchoolPage | undefined {
  return schoolPages.find((page) => page.id === id);
}
