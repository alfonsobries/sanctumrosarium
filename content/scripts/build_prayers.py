import json
import sys

OUT = sys.argv[1]
ACC = "2026-10-06"


def src(publisher, url, title, via=None, accessed=ACC):
    s = {"publisher": publisher, "title": title, "url": url, "accessed": accessed}
    if via:
        s["retrievedVia"] = via
    return s


def wb(url):
    return "https://web.archive.org/web/2026/" + url


COMP_ES = src("Santa Sede (vatican.va)", "https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_sp.html", "Compendio del Catecismo de la Iglesia Católica (2005), Apéndice A: Oraciones comunes")
COMP_ES_CREED = src("Santa Sede (vatican.va)", "https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_sp.html", "Compendio del Catecismo de la Iglesia Católica (2005), Primera parte, segunda sección: El Credo")
COMP_EN = src("Holy See (vatican.va)", "https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_en.html", "Compendium of the Catechism of the Catholic Church (2005), Appendix A: Common Prayers (Latin column)")
COMP_EN_CREED = src("Holy See (vatican.va)", "https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_en.html", "Compendium of the Catechism of the Catholic Church (2005), Part One, Section Two: The Creed (Latin column)")
COMP_EN_EN = src("Holy See (vatican.va)", "https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_en.html", "Compendium of the Catechism of the Catholic Church (2005), Appendix A: Common Prayers")
VAT_ROS_ES = src("Santa Sede (vatican.va)", "https://www.vatican.va/special/rosary/documents/misteri_sp.html", "El Santo Rosario - ¿Cómo se reza el Rosario?")
VAT_ROS_EN = src("Holy See (vatican.va)", "https://www.vatican.va/special/rosary/documents/misteri_en.html", "The Holy Rosary - How to pray the Rosary?")
VAT_LIT_ES = src("Santa Sede (vatican.va)", "https://www.vatican.va/special/rosary/documents/litanie-lauretane_sp.html", "El Santo Rosario - Letanías de la Virgen")
VAT_LIT_EN = src("Holy See (vatican.va)", "https://www.vatican.va/special/rosary/documents/litanie-lauretane_en.html", "The Holy Rosary - The Litany of Loreto")
CEI_LIT = src("Conferenza Episcopale Italiana, Ufficio Liturgico Nazionale (Notiziario, anno 55, n. 2, 31-VIII-2021)", "https://www.chiesacattolica.it/wp-content/uploads/sites/31/2026/09/87714-2021_06_Congr-culto-divino_Litanie-Lauretane.pdf", "Tre nuove invocazioni nelle Litanie Lauretane - LITANIAE LAURETANAE")
CDW_2020 = src("Sala Stampa della Santa Sede, Bollettino N. 0350 (20-VI-2020)", "https://press.vatican.va/content/salastampa/it/bollettino/pubblico/2020/06/20/0350.pdf", "Congregatio de Cultu Divino, Litterae circulares de invocationibus «Mater misericordiae», «Mater spei» et «Solacium migrantium» in Litanias Lauretanas inserendis")
DLF_RR = src("Desde la fe (Arquidiócesis Primada de México)", "https://desdelafe.mx/noticias/sabias-que/como-rezar-el-rosario/", "¿Cómo rezar el Rosario? (17-VII-2025)")
DLF_GOZ = src("Desde la fe (Arquidiócesis Primada de México)", "https://desdelafe.mx/rosarios/rosario-lunes-rosario-sabado-misterios-gozosos/", "Rosario del lunes y sábado: Misterios Gozosos")
DLF_LIT = src("Desde la fe (Arquidiócesis Primada de México)", "https://desdelafe.mx/noticias/sabias-que/letania-completa-actualizada-rosario/", "Letanía del Santo Rosario completa y actualizada (actualizado 6-VI-2024)")
DLF_PER = src("Desde la fe (Arquidiócesis Primada de México)", "https://desdelafe.mx/noticias/arquidiocesis-de-mexico/guia-para-rezar-el-rosario-en-la-peregrinacion-2025/", "Guía para rezar el Rosario en la peregrinación 2025")
DLF_MISAL = src("Desde la fe / Centro Católico de Comunicaciones (Arquidiócesis Primada de México): La Santa Misa, Misal Diario, septiembre 2024; Ordinario de la Misa según el Misal Romano, 3a ed. típica, edición para México (Buena Prensa 2014 / BAC-CEM 2015)", "https://desdelafe.mx/wp-content/uploads/2024/08/Misal_SEPTIEMBRE_2024_web_compressed.pdf", "Ordinario de la Misa (Misal Romano para México)")
US_HM = src("United States Conference of Catholic Bishops", "https://www.usccb.org/prayers/hail-mary", "Hail Mary", wb("https://www.usccb.org/prayers/hail-mary"))
US_OF = src("United States Conference of Catholic Bishops", "https://www.usccb.org/prayers/our-father", "Our Father")
US_GB = src("United States Conference of Catholic Bishops", "https://www.usccb.org/prayers/glory-be-doxology", "Glory Be (Doxology)", wb("https://www.usccb.org/prayers/glory-be-doxology"))
US_CR = src("United States Conference of Catholic Bishops", "https://www.usccb.org/prayers/apostles-creed", "Apostles' Creed", wb("https://www.usccb.org/prayers/apostles-creed"))
US_HQ = src("United States Conference of Catholic Bishops", "https://www.usccb.org/prayers/hail-holy-queen-salve-regina", "Hail, Holy Queen (Salve Regina)", wb("https://www.usccb.org/prayers/hail-holy-queen-salve-regina"))
US_AC = src("United States Conference of Catholic Bishops", "https://www.usccb.org/prayers/act-contrition", "Act of Contrition", wb("https://www.usccb.org/prayers/act-contrition"))
US_PR = src("United States Conference of Catholic Bishops", "https://www.usccb.org/prayers/prayers-rosary", "Prayers of the Rosary", wb("https://www.usccb.org/prayers/prayers-rosary"))
US_HOW = src("United States Conference of Catholic Bishops", "https://www.usccb.org/how-to-pray-the-rosary", "How to Pray the Rosary", wb("https://www.usccb.org/how-to-pray-the-rosary"))
NV_PS70 = src("Santa Sede (vatican.va)", "https://www.vatican.va/archive/bible/nova_vulgata/documents/nova-vulgata_vt_psalmorum_lt.html", "Nova Vulgata, Psalmus 70 (69), 2")
EI_1999 = src("Paenitentiaria Apostolica (vatican.va)", "https://www.vatican.va/roman_curia/tribunals/apost_penit/documents/rc_trib_appen_doc_20020826_enchiridion-indulgentiarum_lt.html", "Enchiridion Indulgentiarum, editio quarta (1999), Normae N. 20 § 5")
ACC_VIRTUES = "2026-10-09"
RDM_REZAR = src("El Rosario de María (Carlos José Romero Mensaque, laico dominico; web dedicada al Rosario en España)", "https://www.rosariodemaria.org/rezar.html", "Forma de rezar el Rosario", accessed=ACC_VIRTUES)
DLF_GOZ_V = src("Desde la fe (Arquidiócesis Primada de México)", "https://desdelafe.mx/rosarios/rosario-lunes-rosario-sabado-misterios-gozosos/", "Rosario del lunes y sábado: Misterios Gozosos", accessed=ACC_VIRTUES)
OAX_COF = src("Cofradía de Nuestra Señora del Santísimo Rosario, Templo de Santo Domingo de Guzmán (Oaxaca, México)", "https://cofradiadelrosarioax.wixsite.com/oaxaca/rezo-del-sant%C3%ADsimo-rosario", "Rezo del Santísimo Rosario", accessed=ACC_VIRTUES)
CNET_ROS = src("Catholic.net", "https://es.catholic.net/op/articulos/13325/el-santo-rosario", "El Santo Rosario", accessed=ACC_VIRTUES)
RVM_ES = src("Santa Sede (vatican.va)", "https://www.vatican.va/content/john-paul-ii/es/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html", "Juan Pablo II, Rosarium Virginis Mariae (16-X-2002)")


def t(lines, source, response_from=None, notes=None, variants=None):
    d = {"lines": lines, "responseFrom": response_from, "source": source}
    if notes:
        d["notes"] = notes
    if variants:
        d["variants"] = variants
    return d


def same(locale, note):
    return {"sameAs": locale, "notes": note}


def missing(note):
    return {"missing": True, "notes": note}


def var(label, lines, source, response_from=None, notes=None):
    d = {"label": label, "lines": lines, "responseFrom": response_from, "source": source}
    if notes:
        d["notes"] = notes
    return d


prayers = []

prayers.append({
    "id": "sign-of-the-cross",
    "category": "liturgy",
    "titles": {"es-MX": "Señal de la cruz", "es-ES": "Señal de la Cruz", "en-US": "The Sign of the Cross", "la": "Signum Crucis"},
    "texts": {
        "es-MX": t(["En el nombre del Padre, y del Hijo, y del Espíritu Santo.", "Amén."], DLF_MISAL, 1, "Fórmula del rito de entrada del Misal Romano para México; 'Amén' es la respuesta del pueblo."),
        "es-ES": t(["En el nombre del Padre", "y del Hijo", "y del Espíritu Santo. Amén."], COMP_ES, None),
        "en-US": t(["In the name of the Father", "and of the Son", "and of the Holy Spirit. Amen."], COMP_EN_EN, None, "USCCB page usccb.org/prayers/sign-cross could not be retrieved (bot wall, no archive); text from the Compendium (English edition)."),
        "la": t(["In nómine Patris", "et Fílii", "et Spíritus Sancti. Amen."], COMP_EN),
    },
})

prayers.append({
    "id": "by-the-sign-of-the-holy-cross",
    "category": "pious-tradition",
    "categoryNote": "Persignación tradicional en el mundo hispano; RVM 37 reconoce que el inicio del Rosario varía según los contextos eclesiales.",
    "regional": ["es-MX"],
    "titles": {"es-MX": "Por la señal de la Santa Cruz (persignarse)"},
    "texts": {
        "es-MX": t(["Por la señal de la santa Cruz,", "de nuestros enemigos,", "líbranos, Señor, Dios nuestro.", "En el nombre del Padre y del Hijo y del Espíritu Santo."], DLF_GOZ, None,
                   "La guía de la peregrinación 2025 (Desde la fe) añade 'R. Amén' al final.",
                   [var("Guía de la peregrinación 2025", ["Por la señal de la Santa Cruz, de nuestros enemigos, líbranos Señor Dios nuestro.", "En el nombre del Padre, del Hijo y del Espíritu Santo.", "Amén."], DLF_PER, 2)]),
        "es-ES": missing("Uso también extendido en España, pero no se encontró fuente oficial española verificable en esta revisión."),
        "en-US": missing("No existe forma inglesa de uso común; no aplica."),
        "la": missing("Sin texto latino oficial localizado."),
    },
})

prayers.append({
    "id": "o-god-come-to-my-aid",
    "category": "liturgy",
    "categoryNote": "Invocación inicial de la Liturgia de las Horas (Sal 70[69], 2). RVM 37 la menciona como inicio usado 'en algunas regiones'; vatican.va la usa como inicio del Rosario.",
    "titles": {"es-MX": "Dios mío, ven en mi auxilio", "es-ES": "Dios mío, ven en mi auxilio", "en-US": "O God, come to my aid", "la": "Deus, in adiutorium meum intende"},
    "texts": {
        "es-ES": t(["Dios mío, ven en mi auxilio.", "Señor, date prisa en socorrerme."], VAT_ROS_ES, 1, "En vatican.va va precedida de la señal de la cruz y seguida del Gloria al Padre."),
        "es-MX": same("es-ES", "Texto de vatican.va (no específico de país); no se verificó fuente mexicana propia."),
        "en-US": t(["O God come to my aid;", "O Lord, make haste to help me."], VAT_ROS_EN, 1, "Holy See text, not USCCB."),
        "la": t(["Deus, in adiutorium meum intende;", "Domine, ad adiuvandum me festina."], NV_PS70, 1, "Tomado del versículo bíblico (Nova Vulgata). La fórmula litúrgica de la Liturgia Horarum no se verificó en línea."),
    },
})

prayers.append({
    "id": "apostles-creed",
    "category": "magisterium",
    "categoryNote": "Símbolo de la fe de la Iglesia (Compendio, primera parte).",
    "titles": {"es-MX": "Credo de los Apóstoles", "es-ES": "Símbolo de los Apóstoles", "en-US": "The Apostles' Creed", "la": "Symbolum Apostolicum"},
    "texts": {
        "es-MX": t(["Creo en Dios, Padre todopoderoso,", "Creador del Cielo y de la tierra.", "Creo en Jesucristo, su único Hijo, nuestro Señor,", "que fue concebido por obra y gracia del Espíritu Santo,", "nació de santa María Virgen,", "padeció bajo el poder de Poncio Pilato,", "fue crucificado, muerto y sepultado,", "descendió a los infiernos;", "al tercer día, resucitó de entre los muertos,", "subió a los Cielos", "y está sentado a la derecha de Dios, Padre todopoderoso.", "Desde allí ha de venir a juzgar a vivos y muertos.", "Creo en el Espíritu Santo,", "la santa Iglesia católica,", "la comunión de los santos,", "el perdón de los pecados,", "la resurrección de la carne", "y la vida eterna.", "Amén."], DLF_MISAL, None, "En la Misa, en las palabras 'que fue concebido... María Virgen' todos se inclinan (rúbrica del Misal)."),
        "es-ES": t(["Creo en Dios, Padre Todopoderoso,", "Creador del cielo y de la tierra.", "Creo en Jesucristo, su único Hijo,", "Nuestro Señor,", "Que fue concebido por obra y gracia del Espíritu Santo, nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato,", "fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre todopoderoso. Desde allí ha de venir", "a juzgar a vivos y muertos.", "Creo en el Espíritu Santo,", "la santa Iglesia católica,", "la comunión de los santos,", "el perdón de los pecados,", "la resurrección de la carne", "y la vida eterna.", "Amén."], COMP_ES_CREED, None, "Saltos de línea tal como en la fuente (irregulares)."),
        "en-US": t(["I believe in God,", "the Father almighty,", "Creator of heaven and earth,", "and in Jesus Christ, his only Son, our Lord,", "who was conceived by the Holy Spirit,", "born of the Virgin Mary,", "suffered under Pontius Pilate,", "was crucified, died and was buried;", "he descended into hell;", "on the third day he rose again from the dead;", "he ascended into heaven,", "and is seated at the right hand of God the Father almighty;", "from there he will come to judge the living and the dead.", "I believe in the Holy Spirit,", "the holy catholic Church,", "the communion of saints,", "the forgiveness of sins,", "the resurrection of the body,", "and life everlasting.", "Amen."], US_CR, None, "Same wording on usccb.org/prayers/prayers-rosary."),
        "la": t(["Credo in Deum Patrem omnipoténtem, Creatorem cæli et terræ,", "et in Iesum Christum, Filium Eius unicum, Dominum nostrum,", "qui concéptus est de Spíritu Sancto, natus ex Maria Virgine,", "passus sub Póntio Piláto, crucifixus, mórtuus, et sepúltus,", "descéndit ad ínferos, tértia die resurréxit a mórtuis,", "ascéndit ad cælos, sedet ad déxteram Dei Patris omnipoténtis,", "inde ventúrus est iudicáre vivos et mórtuos.", "Et in Spíritum Sanctum,", "sanctam Ecclésiam cathólicam,", "sanctórum communiónem,", "remissiónem peccatórum,", "carnis resurrectiónem,", "vitam ætérnam. Amen."], COMP_EN_CREED, None, "En la fuente la primera parte es un solo párrafo; los saltos de línea de las primeras siete líneas son editoriales."),
    },
})

prayers.append({
    "id": "our-father",
    "category": "liturgy",
    "categoryNote": "Oración enseñada por Cristo (Mt 6, 9-13; Lc 11, 2-4); la Iglesia usa el texto de Mateo (Compendio 578).",
    "titles": {"es-MX": "Padre nuestro", "es-ES": "Padre nuestro", "en-US": "Our Father", "la": "Pater Noster"},
    "texts": {
        "es-MX": t(["Padre nuestro, que estás en el Cielo,", "santificado sea tu Nombre;", "venga a nosotros tu Reino;", "hágase tu voluntad en la tierra como en el Cielo.", "Danos hoy nuestro pan de cada día;", "perdona nuestras ofensas", "como también nosotros perdonamos a los que nos ofenden;", "no nos dejes caer en la tentación,", "y líbranos del mal.", "Amén."], DLF_MISAL, 4,
                   "Texto del Rito de la Comunión del Misal Romano para México; en la Misa no lleva 'Amén' (sigue el embolismo). El 'Amén' final se toma de la guía del Rosario de Desde la fe, que trae el mismo texto. Los saltos de línea son editoriales.",
                   [var("Desde la fe, Rosario de los misterios gozosos (mismo texto, otra puntuación)", ["Padre Nuestro, que estás en el Cielo, santificado sea Tu nombre, venga a nosotros Tu reino, hágase tu voluntad, en la tierra como en el cielo.", "Danos hoy nuestro pan de cada día, perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden. No nos dejes caer en la tentación, y líbranos del mal. Amén"], DLF_GOZ, 1)]),
        "es-ES": t(["Padre nuestro que estás en el cielo,", "santificado sea tu Nombre;", "venga a nosotros tu Reino;", "hágase tu voluntad", "en la tierra como en el cielo.", "Danos hoy", "nuestro pan de cada día;", "perdona nuestras ofensas,", "como también nosotros perdonamos", "a los que nos ofenden;", "no nos dejes caer en la tentación,", "y líbranos del mal. Amén."], COMP_ES, 5),
        "en-US": t(["Our Father, who art in heaven,", "hallowed be thy name;", "thy kingdom come,", "thy will be done", "on earth as it is in heaven.", "Give us this day our daily bread,", "and forgive us our trespasses,", "as we forgive those who trespass against us;", "and lead us not into temptation,", "but deliver us from evil.", "Amen."], US_OF, 5, "Fetched directly from usccb.org. The Compendium (English) has the same words with different punctuation."),
        "la": t(["Pater noster, qui es in cælis:", "sanctificétur Nomen Tuum:", "advéniat Regnum Tuum:", "fiat volúntas Tua,", "sicut in cælo, et in terra.", "Panem nostrum", "cotidiánum da nobis hódie,", "et dimítte nobis débita nostra,", "sicut et nos", "dimíttimus debitóribus nostris.", "et ne nos indúcas in tentatiónem;", "sed líbera nos a Malo.", "Amen."], COMP_EN, 5,
                "Texto de la cuarta parte del Compendio (edición inglesa, columna latina), sin 'Amen' en la fuente; se añade 'Amen' como en el Apéndice. El Apéndice de la edición española trae 'quotidianum' y otra acentuación."),
    },
})

prayers.append({
    "id": "hail-mary",
    "category": "pious-tradition",
    "categoryNote": "Primera parte bíblica (Lc 1, 28.42); segunda parte de la tradición de la Iglesia (RVM 33). Oración común del Compendio.",
    "titles": {"es-MX": "Avemaría", "es-ES": "Ave María", "en-US": "Hail Mary", "la": "Ave Maria"},
    "texts": {
        "es-MX": t(["Dios te salve, María, llena eres de gracia, el Señor es contigo.", "Bendita tú eres entre todas las mujeres y bendito es el fruto de tu vientre, Jesús.", "Santa María, Madre de Dios,", "ruega por nosotros pecadores,", "ahora y en la hora de nuestra muerte. Amén."], DLF_GOZ, 2,
                   "La fuente escribe 'Dios te Salve'; se normalizó a minúscula. Saltos de línea editoriales."),
        "es-ES": t(["Dios te salve, María,", "llena eres de gracia;", "el Señor es contigo.", "Bendita Tú eres", "entre todas las mujeres,", "y bendito es el fruto de tu vientre, Jesús.", "Santa María, Madre de Dios,", "ruega por nosotros, pecadores,", "ahora y en la hora de nuestra muerte. Amén"], COMP_ES, 6,
                   None, [var("vatican.va, El Santo Rosario ('está contigo')", ["Dios te Salve, María, llena eres de gracia, el Señor está contigo. Bendita tú eres entre todas las mujeres y bendito es el fruto de tu vientre, Jesús.", "Santa María, Madre de Dios, ruega por nosotros pecadores, ahora y en la hora de nuestra muerte. Amén"], VAT_ROS_ES, 1)]),
        "en-US": t(["Hail, Mary, full of grace,", "the Lord is with thee.", "Blessed art thou among women", "and blessed is the fruit of thy womb, Jesus.", "Holy Mary, Mother of God,", "pray for us sinners,", "now and at the hour of our death.", "Amen."], US_HM, 4, "Identical words in the Compendium (English).",
                   [var("USCCB 'Prayers of the Rosary' (modern 'you' form)", ["Hail Mary, full of grace, the Lord is with you;", "blessed are you among women,", "and blessed is the fruit of your womb, Jesus.", "Holy Mary, Mother of God,", "pray for us sinners", "now and at the hour of our death.", "Amen."], US_PR, 3)]),
        "la": t(["Ave, María, grátia plena,", "Dóminus tecum.", "Benedícta tu in muliéribus,", "et benedíctus fructus ventris tui, Iesus.", "Sancta María, Mater Dei,", "ora pro nobis peccatóribus,", "nunc et in hora mortis nostræ.", "Amen."], COMP_EN, 4, "La edición española del Compendio rotula 'Ave, Maríæ' (errata); se usa la edición inglesa."),
    },
})

prayers.append({
    "id": "glory-be",
    "category": "liturgy",
    "categoryNote": "Doxología menor de la liturgia (RVM 34).",
    "titles": {"es-MX": "Gloria al Padre", "es-ES": "Gloria al Padre", "en-US": "Glory Be", "la": "Gloria Patri"},
    "texts": {
        "es-MX": t(["Gloria al Padre y al Hijo y al Espíritu Santo.", "Como era en el principio, ahora y siempre,", "por los siglos de los siglos. Amén."], DLF_GOZ, 1),
        "es-ES": t(["Gloria al Padre", "y al Hijo", "y al Espíritu Santo.", "Como era en el principio,", "ahora y siempre,", "por los siglos de los siglos. Amén."], COMP_ES, 3),
        "en-US": t(["Glory be to the Father", "and to the Son", "and to the Holy Spirit,", "as it was in the beginning", "is now, and ever shall be", "world without end.", "Amen."], US_GB, 3, "Identical in the Compendium (English)."),
        "la": t(["Glória Patri", "et Fílio", "et Spirítui Sancto.", "Sicut erat in princípio,", "et nunc et semper", "et in sæcula sæculórum. Amen."], COMP_EN, 3, "La fuente trae 'sæ´cula' con un acento suelto (errata); corregido."),
    },
})

prayers.append({
    "id": "fatima-prayer",
    "category": "pious-tradition",
    "categoryNote": "Jaculatoria de Fátima (aparición de 1917). RVM 35: tras el Gloria 'sigue una jaculatoria, que varía según las costumbres'. Opcional.",
    "titles": {"es-MX": "Oh Jesús mío", "en-US": "Fatima Prayer"},
    "texts": {
        "es-MX": t(["¡Oh Jesús mío!, perdona nuestros pecados;", "líbranos del fuego del infierno.", "Lleva al cielo a todas las almas,", "especialmente a las más necesitadas de Tu misericordia."], DLF_RR, None, None,
                   [var("Desde la fe, misterios gozosos", ["Oh Jesús mío: Perdona nuestros pecados, líbranos del fuego del infierno, lleva al Cielo a todas las almas, especialmente a las más necesitadas de Tu misericordia."], DLF_GOZ)]),
        "es-ES": missing("No se encontró fuente oficial española; usar es-MX solo con revisión humana."),
        "en-US": t(["O my Jesus, forgive us our sins,", "save us from the fires of hell;", "lead all souls to Heaven,", "especially those who have most need of your mercy."], US_HOW, None, "USCCB introduces it as 'requested by the Blessed Virgin Mary at Fatima' and as optional ('some say')."),
        "la": missing("No existe versión latina oficial; circulan varias traducciones privadas. No se incluye."),
    },
})

prayers.append({
    "id": "hail-holy-queen",
    "category": "liturgy",
    "categoryNote": "Antífona mariana de la Liturgia de las Horas; RVM 37 la propone al final del Rosario.",
    "titles": {"es-MX": "Salve", "es-ES": "Salve", "en-US": "Hail, Holy Queen", "la": "Salve, Regina"},
    "texts": {
        "es-MX": t(["Dios te salve, Reina y Madre de misericordia,", "vida, dulzura y esperanza nuestra; Dios te salve.", "A ti llamamos los desterrados hijos de Eva;", "a ti suspiramos, gimiendo y llorando en este valle de lágrimas.", "Ea, pues, Señora, abogada nuestra,", "vuelve a nosotros esos tus ojos misericordiosos;", "y después de este destierro, muéstranos a Jesús, fruto bendito de tu vientre.", "¡Oh, clemente, oh piadosa, oh dulce Virgen María!"], DLF_GOZ, None,
                   "Diferencia con España: 'clemente' en lugar de 'clementísima'. Mismo texto en el Rosario por los difuntos de Desde la fe."),
        "es-ES": t(["Dios te salve, Reina", "y Madre de misericordia,", "vida, dulzura y esperanza nuestra;", "Dios te salve.", "A ti llamamos", "los desterrados hijos de Eva;", "a ti suspiramos, gimiendo y llorando", "en este valle de lágrimas.", "Ea, pues, Señora, abogada nuestra,", "vuelve a nosotros esos tus ojos", "misericordiosos;", "y después de este destierro,", "muéstranos a Jesús,", "fruto bendito de tu vientre.", "¡Oh, clementísima, oh piadosa,", "oh dulce Virgen María!"], COMP_ES, None, "Mismo texto en vatican.va, El Santo Rosario."),
        "en-US": t(["Hail, Holy Queen, Mother of Mercy,", "our life, our sweetness and our hope.", "To thee do we cry,", "poor banished children of Eve.", "To thee do we send up our sighs,", "mourning and weeping in this valley of tears.", "Turn then, most gracious advocate,", "thine eyes of mercy toward us,", "and after this our exile", "show unto us the blessed fruit of thy womb, Jesus.", "O clement, O loving,", "O sweet Virgin Mary."], US_HQ, None, None,
                   [var("USCCB 'Prayers of the Rosary' ('you' form)", ["Hail, holy Queen, mother of mercy,", "our life, our sweetness, and our hope.", "To you we cry, poor banished children of Eve;", "to you we send up our sighs,", "mourning and weeping in this valley of tears.", "Turn, then, most gracious advocate,", "your eyes of mercy toward us;", "and after this, our exile,", "show unto us the blessed fruit of your womb, Jesus.", "O clement, O loving, O sweet Virgin Mary."], US_PR)]),
        "la": t(["Salve, Regína,", "Mater misericórdiæ,", "vita, dulcédo et spes nostra, salve.", "Ad te clamámus,", "éxsules fílii Evæ.", "Ad te suspirámus geméntes et flentes", "in hac lacrimárum valle.", "Eia ergo, advocáta nostra,", "illos tuos misericórdes óculos", "ad nos convérte.", "Et Iesum benedíctum fructum ventris tui,", "nobis, post hoc exsílium, osténde.", "O clemens, o pia, o dulcis Virgo María!"], COMP_EN, None, "La edición española del Compendio trae 'Eva' y 'Maríae' (erratas)."),
    },
})

prayers.append({
    "id": "pray-for-us-holy-mother-of-god",
    "category": "liturgy",
    "categoryNote": "Versículo y respuesta que preceden a la oración final.",
    "titles": {"es-MX": "Ruega por nosotros", "es-ES": "Ruega por nosotros", "en-US": "Pray for us", "la": "Ora pro nobis"},
    "texts": {
        "es-MX": t(["Ruega por nosotros, Santa Madre de Dios,", "para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo. Amén."], DLF_GOZ, 1,
                   None, [var("Desde la fe y vatican.va, final de la letanía", ["Ruega por nosotros, Santa Madre de Dios.", "Para que seamos dignos de las promesas de Cristo."], DLF_LIT, 1)]),
        "es-ES": t(["Ruega por nosotros,", "Santa Madre de Dios,", "para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo."], COMP_ES, 2),
        "en-US": t(["V. Pray for us, O holy Mother of God.", "R. That we may be made worthy of the promises of Christ."], US_HOW, 1),
        "la": t(["Ora pro nobis, sancta Dei génetrix.", "Ut digni efficiámur promissiónibus Christi."], COMP_EN, 1),
    },
})

prayers.append({
    "id": "rosary-closing-prayer",
    "category": "liturgy",
    "categoryNote": "Colecta de la fiesta de Nuestra Señora del Rosario (Missale Romanum 1960), citada en RVM 35 y nota 38.",
    "titles": {"es-MX": "Oración final del Rosario", "es-ES": "Oración tras el rosario", "en-US": "Prayer concluding the Rosary", "la": "Oratio ad finem Rosarii dicenda"},
    "texts": {
        "es-ES": t(["Oremos.", "Oh Dios,", "cuyo Hijo por medio de su vida,", "muerte y resurrección,", "nos otorgó los premios", "de la vida eterna,", "te rogamos que", "venerando humildemente", "los misterios del Rosario", "de la Santísima Virgen María,", "imitemos lo que contienen", "y consigamos lo que nos prometen.", "Por Jesucristo, nuestro Señor. Amén"], COMP_ES, None, "La fuente escribe 'Oremos' como encabezado."),
        "es-MX": same("es-ES", "Desde la fe no trae esta oración; propone en su lugar la oración 'Te suplicamos nos concedas' (ver id grant-us-your-servants). Sin fuente mexicana para este texto."),
        "en-US": t(["Let us pray:", "O God, whose Only Begotten Son,", "by his life, Death, and Resurrection,", "has purchased for us the rewards of eternal life,", "grant, we beseech thee,", "that while meditating on these mysteries", "of the most holy Rosary of the Blessed Virgin Mary,", "we may imitate what they contain", "and obtain what they promise,", "through the same Christ our Lord.", "Amen."], US_HOW, None, "Line breaks editorial (single paragraph in source). The Compendium (English) reads 'that meditating' (without 'while')."),
        "la": t(["Orémus.", "Deus, cuius Unigénitus per vitam,", "mortem et resurrectiónem suam", "nobis salútis ætérnæ", "præmia comparávit,", "concéde, quæsumus:", "ut hæc mystéria sacratíssimo", "beátæ Maríæ Vírginis", "Rosário recoléntes,", "et imitémur quod cóntinent,", "et quod promíttunt assequámur.", "Per Christum Dóminum nostrum.", "Amen."], COMP_EN),
    },
})

prayers.append({
    "id": "grant-us-your-servants",
    "category": "liturgy",
    "categoryNote": "Colecta mariana tradicional 'Concede nos famulos tuos', usada tras la letanía (vatican.va) y como cierre del Rosario en México y España.",
    "titles": {"es-MX": "Te suplicamos nos concedas", "es-ES": "Te pedimos, Señor", "en-US": "Grant, we beseech thee", "la": "Concede nos famulos tuos"},
    "texts": {
        "es-MX": t(["Te suplicamos nos concedas, Señor, Dios Padre nuestro,", "gozar de continua salud de alma y cuerpo,", "y por la gloriosa intercesión de la bienaventurada siempre Virgen María,", "vernos libres de las tristezas de la vida presente", "y alcanzar los gozos de la vida eterna.", "Por Jesucristo nuestro Señor. Amén."], DLF_RR, None, "Saltos de línea editoriales.",
                   [var("Tras la letanía (Desde la fe y vatican.va)", ["Te rogamos nos concedas,", "Señor Dios nuestro,", "gozar de continua salud de alma y cuerpo,", "y por la gloriosa intercesión", "de la bienaventurada siempre Virgen María,", "vernos libres de las tristezas de la vida presente", "y disfrutar de las alegrías eternas.", "Por Cristo nuestro Señor.", "Amén."], VAT_LIT_ES)]),
        "es-ES": t(["Te pedimos Señor,", "nos concedas a nosotros tus siervos,", "gozar de perpetua salud de alma y cuerpo,", "y por la gloriosa intercesión", "de la bienaventurada siempre Virgen María, seamos librados de las tristezas presentes", "y gocemos de la eterna alegría.", "Por Jesucristo, nuestro Señor. Amén."], COMP_ES, None, "El Compendio lo presenta como 'Oremos (tradición española)'."),
        "en-US": t(["Let us pray.", "Grant, we beseech thee,", "O Lord God,", "that we, your servants,", "may enjoy perpetual health of mind and body;", "and by the glorious intercession of the Blessed Mary, ever Virgin,", "may be delivered from present sorrow,", "and obtain eternal joy.", "Through Christ our Lord.", "Amen."], VAT_LIT_EN, None, "Holy See text, not USCCB."),
        "la": missing("No se localizó el texto latino en una fuente oficial en línea durante esta revisión."),
    },
})

LIT_LA_INV = ["Sancta Maria", "Sancta Dei Genitrix", "Sancta Virgo virginum", "Mater Christi", "Mater Ecclesiae", "Mater misericordiae", "Mater divinae gratiae", "Mater spei", "Mater purissima", "Mater castissima", "Mater inviolata", "Mater intemerata", "Mater amabilis", "Mater admirabilis", "Mater boni consilii", "Mater Creatoris", "Mater Salvatoris", "Virgo prudentissima", "Virgo veneranda", "Virgo praedicanda", "Virgo potens", "Virgo clemens", "Virgo fidelis", "Speculum iustitiae", "Sedes sapientiae", "Causa nostrae laetitiae", "Vas spirituale", "Vas honorabile", "Vas insigne devotionis", "Rosa mystica", "Turris davidica", "Turris eburnea", "Domus aurea", "Foederis arca", "Ianua coeli", "Stella matutina", "Salus infirmorum", "Refugium peccatorum", "Solacium migrantium", "Consolatrix afflictorum", "Auxilium Christianorum", "Regina Angelorum", "Regina Patriarcharum", "Regina Prophetarum", "Regina Apostolorum", "Regina Martyrum", "Regina Confessorum", "Regina Virginum", "Regina Sanctorum omnium", "Regina sine labe originali concepta", "Regina in caelum assumpta", "Regina sacratissimi Rosarii", "Regina familiae", "Regina pacis"]

LIT_ES_INV = ["Santa María", "Santa Madre de Dios", "Santa Virgen de las Vírgenes", "Madre de Cristo", "Madre de la Iglesia", "Madre de la misericordia", "Madre de la divina gracia", "Madre de la esperanza", "Madre purísima", "Madre castísima", "Madre siempre virgen", "Madre inmaculada", "Madre amable", "Madre admirable", "Madre del buen consejo", "Madre del Creador", "Madre del Salvador", "Virgen prudentísima", "Virgen digna de veneración", "Virgen digna de alabanza", "Virgen poderosa", "Virgen clemente", "Virgen fiel", "Espejo de justicia", "Trono de la sabiduría", "Causa de nuestra alegría", "Vaso espiritual", "Vaso digno de honor", "Vaso de insigne devoción", "Rosa mística", "Torre de David", "Torre de marfil", "Casa de oro", "Arca de la Alianza", "Puerta del cielo", "Estrella de la mañana", "Salud de los enfermos", "Refugio de los pecadores", "Consuelo de los migrantes", "Consoladora de los afligidos", "Auxilio de los cristianos", "Reina de los Ángeles", "Reina de los Patriarcas", "Reina de los Profetas", "Reina de los Apóstoles", "Reina de los Mártires", "Reina de los Confesores", "Reina de las Vírgenes", "Reina de todos los Santos", "Reina concebida sin pecado original", "Reina asunta a los Cielos", "Reina del Santísimo Rosario", "Reina de la familia", "Reina de la paz"]
LIT_MX_INV = list(LIT_ES_INV)
LIT_MX_INV[5] = "Madre de la Misericordia"
LIT_MX_INV[7] = "Madre de esperanza"

LIT_EN_INV = ["Holy Mary", "Holy Mother of God", "Holy Virgin of virgins", "Mother of Christ", "Mother of the Church", "Mother of Mercy", "Mother of divine grace", "Mother of Hope", "Mother most pure", "Mother most chaste", "Mother inviolate", "Mother undefiled", "Mother most amiable", "Mother most admirable", "Mother of good counsel", "Mother of our Creator", "Mother of our Saviour", "Virgin most prudent", "Virgin most venerable", "Virgin most renowned", "Virgin most powerful", "Virgin most merciful", "Virgin most faithful", "Mirror of justice", "Seat of wisdom", "Cause of our joy", "Spiritual vessel", "Vessel of honour", "Singular vessel of devotion", "Mystical rose", "Tower of David", "Tower of ivory", "House of gold", "Ark of the covenant", "Gate of heaven", "Morning star", "Health of the sick", "Refuge of sinners", "Solace of Migrants", "Comfort of the afflicted", "Help of Christians", "Queen of Angels", "Queen of Patriarchs", "Queen of Prophets", "Queen of Apostles", "Queen of Martyrs", "Queen of Confessors", "Queen of Virgins", "Queen of all Saints", "Queen conceived without original sin", "Queen assumed into heaven", "Queen of the most holy Rosary", "Queen of families", "Queen of peace"]

assert len(LIT_LA_INV) == len(LIT_ES_INV) == len(LIT_EN_INV) == 54


def litany(opening, trinity, trinity_resp, invocations, inv_resp, agnus, source, notes=None):
    return {
        "structured": {
            "opening": opening,
            "trinity": [{"call": c, "response": trinity_resp} for c in trinity],
            "invocations": invocations,
            "invocationResponse": inv_resp,
            "agnusDei": agnus,
        },
        "source": source,
        "notes": notes,
    }


prayers.append({
    "id": "litany-of-loreto",
    "category": "pious-tradition",
    "categoryNote": "Letanía aprobada por Sixto V (1587); su formulario lo regula la Santa Sede. RVM 37 la propone al final del Rosario. Opcional.",
    "invocationCount": 54,
    "additions": [
        {"invocation": "Mater misericordiae", "after": "Mater Ecclesiae", "year": 2020, "source": CDW_2020},
        {"invocation": "Mater spei", "after": "Mater divinae gratiae", "year": 2020, "source": CDW_2020},
        {"invocation": "Solacium migrantium", "after": "Refugium peccatorum", "year": 2020, "source": CDW_2020},
    ],
    "additionsCheck": "Búsqueda al 2026-10-06: no se encontraron invocaciones añadidas después de 2020 en fuentes de la Santa Sede.",
    "titles": {"es-MX": "Letanía Lauretana", "es-ES": "Letanías de la Virgen", "en-US": "Litany of Loreto", "la": "Litaniae Lauretanae"},
    "texts": {
        "la": litany(
            [{"call": "Kyrie, eleison.", "response": "Kyrie, eleison."}, {"call": "Christe, eleison.", "response": "Christe, eleison."}, {"call": "Kyrie, eleison.", "response": "Kyrie, eleison."}, {"call": "Christe, audi nos.", "response": "Christe, audi nos."}, {"call": "Christe, exaudi nos.", "response": "Christe, exaudi nos."}],
            ["Pater de caelis, Deus,", "Fili, Redemptor mundi, Deus,", "Spiritus Sancte, Deus,", "Sancta Trinitas, unus Deus,"], "miserere nobis.",
            LIT_LA_INV, "ora pro nobis.",
            [{"call": "Agnus Dei, qui tollis peccata mundi,", "response": "parce nobis, Domine."}, {"call": "Agnus Dei, qui tollis peccata mundi,", "response": "exaudi nos, Domine."}, {"call": "Agnus Dei, qui tollis peccata mundi,", "response": "miserere nobis."}],
            CEI_LIT, "La fuente no indica la repetición de las aclamaciones iniciales por el pueblo; se modela como repetición según el uso de vatican.va (es/en)."),
        "es-ES": litany(
            [{"call": "Señor, ten piedad", "response": "Señor, ten piedad"}, {"call": "Cristo, ten piedad", "response": "Cristo, ten piedad"}, {"call": "Señor, ten piedad.", "response": "Señor, ten piedad."}, {"call": "Cristo, óyenos.", "response": "Cristo, óyenos."}, {"call": "Cristo, escúchanos.", "response": "Cristo, escúchanos."}],
            ["Dios, Padre celestial,", "Dios, Hijo, Redentor del mundo,", "Dios, Espíritu Santo,", "Santísima Trinidad, un solo Dios,"], "ten piedad de nosotros.",
            LIT_ES_INV, "ruega por nosotros.",
            [{"call": "Cordero de Dios, que quitas el pecado del mundo,", "response": "perdónanos, Señor."}, {"call": "Cordero de Dios, que quitas el pecado del mundo,", "response": "escúchanos, Señor."}, {"call": "Cordero de Dios, que quitas el pecado del mundo,", "response": "ten misericordia de nosotros."}],
            VAT_LIT_ES, "Texto de vatican.va (no específico de España). Tras la letanía: versículo (pray-for-us-holy-mother-of-god) y oración (grant-us-your-servants)."),
        "es-MX": litany(
            [{"call": "Señor, ten piedad", "response": "Señor, ten piedad"}, {"call": "Cristo, ten piedad", "response": "Cristo, ten piedad"}, {"call": "Señor, ten piedad.", "response": "Señor, ten piedad"}, {"call": "Cristo, óyenos", "response": "Cristo, óyenos."}, {"call": "Cristo, escúchanos.", "response": "Cristo, escúchanos."}],
            ["Dios, Padre celestial,", "Dios, Hijo, Redentor del mundo", "Dios, Espíritu Santo,", "Santísima Trinidad, un solo Dios,"], "ten piedad de nosotros.",
            LIT_MX_INV, "Ruega por nosotros.",
            [{"call": "Cordero de Dios, que quitas el pecado del mundo,", "response": "perdónanos, Señor."}, {"call": "Cordero de Dios, que quitas el pecado del mundo,", "response": "escúchanos, Señor."}, {"call": "Cordero de Dios, que quitas el pecado del mundo,", "response": "ten misericordia de nosotros."}],
            DLF_LIT, "Coincide con vatican.va salvo 'Madre de la Misericordia' (mayúscula) y 'Madre de esperanza' (sin artículo)."),
        "en-US": litany(
            [{"call": "Lord have mercy.", "response": "Lord have mercy."}, {"call": "Christ have mercy.", "response": "Christ have mercy."}, {"call": "Lord have mercy.", "response": "Lord have mercy."}, {"call": "Christ hear us.", "response": "Christ hear us."}, {"call": "Christ graciously hear us.", "response": "Christ graciously hear us."}],
            ["God, the Father of heaven,", "God the Son, Redeemer of the world,", "God the Holy Spirit,", "Holy Trinity, one God,"], "have mercy on us.",
            LIT_EN_INV, "pray for us.",
            [{"call": "Lamb of God, who takes away the sins of the world,", "response": "spare us, O Lord."}, {"call": "Lamb of God, who takes away the sins of the world,", "response": "graciously hear us, O Lord."}, {"call": "Lamb of God, who takes away the sins of the world,", "response": "have mercy on us."}],
            VAT_LIT_EN, "Holy See English text (British spelling 'Saviour', 'honour'); no USCCB text was found. EWTN's online text omits 'Mother of Mercy' and must not be used."),
    },
})

prayers.append({
    "id": "act-of-contrition",
    "category": "pious-tradition",
    "categoryNote": "Opcional al inicio (uso mexicano: Desde la fe lo propone tras la señal de la cruz). La segunda forma inglesa procede del Ritual de la Penitencia (liturgia).",
    "titles": {"es-MX": "Acto de contrición", "es-ES": "Acto de contrición", "en-US": "Act of Contrition", "la": "Actus Contritionis"},
    "texts": {
        "es-MX": t(["Señor mío Jesucristo, Dios y Hombre verdadero,", "me pesa de todo corazón de haber pecado", "porque te ofendí a ti que eres tan bueno y que tanto me amas,", "y a quien yo quiero amar sobre todas las cosas.", "Propongo firmemente, con tu gracia,", "enmendarme y alejarme de las ocasiones de pecar,", "confesarme y cumplir la penitencia.", "Confío en que me perdonarás por tu infinita misericordia. Amén."], DLF_PER, None, "Saltos de línea editoriales."),
        "es-ES": t(["Señor mío Jesucristo, Dios y hombre verdadero, Creador, Padre y Redentor mío.", "Por ser tú quien eres, Bondad infinita,", "y porque te amo sobre todas las cosas,", "me pesa de todo corazón haberte ofendido. También me pesa que puedas castigarme", "con las penas del infierno.", "Ayudado de tu divina gracia propongo firmemente nunca más pecar, confesarme y cumplir la penitencia que me fuera impuesta. Amén"], COMP_ES, None, "El Compendio la presenta como 'tradición española'.",
                   [var("Compendio, forma general", ["Dios mío,", "me arrepiento de todo corazón", "de todos mis pecados", "y los aborrezco,", "porque al pecar, no sólo merezco", "las penas establecidas por ti", "justamente,", "sino principalmente porque te ofendí,", "a ti sumo Bien y digno de amor", "por encima de todas las cosas.", "Por eso propongo firmemente,", "con ayuda de tu gracia,", "no pecar más en adelante", "y huir de toda ocasión de pecado.", "Amén."], COMP_ES)]),
        "en-US": t(["O my God,", "I am heartily sorry for having offended you,", "and I detest all my sins because of your just punishments,", "but most of all because they offend you, my God,", "who are all good and deserving of all my love.", "I firmly resolve, with the help of your grace,", "to sin no more", "and to avoid the near occasions of sin.", "Amen."], US_AC, None, None,
                   [var("Order of Penance, no. 45 (USCCB page, alternative)", ["O my God,", "I am sorry and repent with all my heart", "for all the wrong I have done", "and for the good I have failed to do,", "because by sinning I have offended you,", "who are all good and worthy to be loved above all things.", "I firmly resolve, with the help of your grace,", "to do penance,", "to sin no more,", "and to avoid the occasions of sin.", "Through the merits of the Passion of our Savior Jesus Christ,", "Lord, have mercy."], US_AC)]),
        "la": t(["Deus meus, ex toto corde pænitet me ómnium meórum peccatórum,", "éaque detéstor, quia peccándo,", "non solum pœnas a te iuste statútas proméritus sum,", "sed præsértim quia offéndi te, summum bonum,", "ac dignum qui super ómnia diligáris.", "Ídeo fírmiter propóno, adiuvánte grátia tua,", "de cétero me non peccatúrum", "peccandíque occasiónes próximas fugitúrum.", "Amen."], COMP_EN, None, "Un solo párrafo en la fuente; saltos de línea editoriales."),
    },
})

prayers.append({
    "id": "prayer-for-the-pope",
    "category": "magisterium",
    "categoryNote": "No es un texto propio: es la intención por el Papa al final del Rosario (RVM 37) y una de las tres condiciones de la indulgencia plenaria (Enchiridion, N. 20).",
    "kind": "intention",
    "composition": ["our-father", "hail-mary"],
    "compositionNote": "Enchiridion Indulgentiarum N. 20 § 5: la condición se cumple rezando a su intención un Padrenuestro y un Avemaría; cada fiel puede rezar cualquier otra oración según su piedad. Desde la fe (México): 'Reza un Padrenuestro y un Avemaría por las intenciones del Papa.' Muchas guías añaden un Gloria; no es requisito.",
    "sources": [RVM_ES, EI_1999, DLF_RR],
    "titles": {"es-MX": "Por las intenciones del Papa", "es-ES": "Por las intenciones del Papa", "en-US": "For the intentions of the Holy Father", "la": "Ad mentem Summi Pontificis"},
})

HAIL_MARY_REST_MX = ["llena eres de gracia, el Señor es contigo.", "Bendita tú eres entre todas las mujeres y bendito es el fruto de tu vientre, Jesús.", "Santa María, Madre de Dios,", "ruega por nosotros pecadores,", "ahora y en la hora de nuestra muerte. Amén."]
DLF_SANTA_MARIA = "Santa María, Madre de Dios, ruega por nosotros pecadores, ahora y en la hora de nuestra muerte. Amén."
OAX_RESPUESTA = "Santa María, Madre de Dios, ruega por nosotros los pecadores ahora y en la hora de nuestra muerte. Amén."
VIRTUES_NOTE = ("Forma hispana de las tres Avemarías: cada una va precedida de una salutación a María como Hija del Padre, Madre del Hijo y Esposa del Espíritu Santo, "
                "y encomienda la fe, la esperanza y la caridad. Las fuentes la ponen al final del Rosario, después de los cinco misterios y antes de la Salve "
                "(El Rosario de María: 'lo que sigue es opcional'; Desde la fe: 'Oraciones finales'); en la app es una forma opcional de las tres Avemarías iniciales. "
                "No es texto litúrgico y la redacción varía según la región ('ponemos'/'encomendamos', 'ilumines'/'alumbres').")
VIRTUES_TEXT_NOTE = ("Normalizado de la fuente: 'Dios te Salve María Santísima' → 'Dios te salve, María Santísima' (como en Desde la fe); 'esposa' → 'Esposa'; "
                     "'culpa Original' → 'culpa original'; coma tras 'parto'. La fuente abrevia el resto con 'llena eres de gracia...'; se completa con el Avemaría es-MX "
                     "de este paquete (hail-mary, Desde la fe). La parte de la asamblea empieza en 'Santa María', como marca la Cofradía del Rosario de Oaxaca "
                     "(Lector / Respuesta). Saltos de línea editoriales.")
ES_ES_VIRTUES = "La fuente principal es una web dedicada al Rosario en España; Catholic.net trae la forma con 'encomendamos' (variante en es-MX)."
EN_VIRTUES = ("No se encontró una forma inglesa publicada de estas salutaciones. Las guías inglesas rezan las tres Avemarías por la fe, la esperanza y la caridad "
              "sin cambiar el texto del Avemaría (USCCB, Catholic Online).")
LA_VIRTUES = "No se encontró texto latino con fuente."


def virtue_hail_mary(pid, virtue, title, opening, dlf_first, oax_first, cnet_first, oax_note=None):
    return {
        "id": pid,
        "category": "pious-tradition",
        "categoryNote": VIRTUES_NOTE,
        "openingForm": "three-virtues",
        "virtue": virtue,
        "titles": {"es-MX": title, "es-ES": title},
        "texts": {
            "es-MX": t(opening + HAIL_MARY_REST_MX, RDM_REZAR, len(opening) + 2, VIRTUES_TEXT_NOTE, [
                var("Desde la fe (Arquidiócesis de México), Misterios Gozosos", [dlf_first, DLF_SANTA_MARIA], DLF_GOZ_V, 1,
                    "Igual a la forma principal salvo 'está contigo', la tercera sin 'nuestros dones y carismas...' y 'esposa' en minúscula. La fuente abrevia la segunda y la tercera con 'Llena eres de gracia…'."),
                var("Cofradía del Rosario de Oaxaca ('Señora', 'alumbres')", [oax_first, OAX_RESPUESTA], OAX_COF, 1, oax_note),
                var("Catholic.net ('encomendamos')", [cnet_first], CNET_ROS, None, "Sin 'Virgen Purísima...'; la fuente abrevia el resto del Avemaría."),
            ]),
            "es-ES": same("es-MX", ES_ES_VIRTUES),
            "en-US": missing(EN_VIRTUES),
            "la": missing(LA_VIRTUES),
        },
    }


prayers.append(virtue_hail_mary(
    "hail-mary-faith", "faith", "Avemaría por la fe",
    ["Dios te salve, María Santísima, Hija de Dios Padre,", "Virgen Purísima antes del parto,", "en tus manos ponemos nuestra fe para que la ilumines,"],
    "Dios te salve, María Santísima, Hija de Dios Padre, Virgen Purísima antes del parto, en tus manos ponemos nuestra fe para que la ilumines. Llena eres de gracia, el Señor está contigo. Bendita tú eres entre todas las mujeres y bendito es el fruto de tu vientre, Jesús.",
    "Dios te salve María Santísima, Hija de Dios Padre; Virgen Purísima antes del Parto; en tus manos, Señora, ponemos nuestra Fe, para que la alumbres, llena eres de gracia, el Señor es contigo, bendita eres entre las mujeres y bendito es el fruto de tu vientre, Jesús.",
    "Dios te salve María, Hija de Dios Padre, en tus manos encomendamos nuestra fe para que la ilumines, llena eres de gracia..",
))

prayers.append(virtue_hail_mary(
    "hail-mary-hope", "hope", "Avemaría por la esperanza",
    ["Dios te salve, María Santísima, Madre de Dios Hijo,", "Virgen Purísima en el parto,", "en tus manos ponemos nuestra esperanza para que la alientes,"],
    "Dios te salve, María Santísima, Madre de Dios Hijo, Virgen Purísima en el parto, en tus manos ponemos nuestra esperanza para que la alientes. Llena eres de gracia…",
    "Dios te salve María Santísima, Madre de Dios Hijo; Virgen Purísima en el Parto; en tus manos, Señora, ponemos nuestra Esperanza, para que la alientes, llena eres de gracia, el Señor es contigo, bendita eres entre las mujeres y bendito es el fruto de tu vientre, Jesús.",
    "Dios te salve María, Madre de Dios Hijo, en tus manos encomendamos nuestra esperanza para que la alientes, llena eres de gracia...",
    "La fuente parte 'muje- res' por un salto de línea; se une.",
))

prayers.append(virtue_hail_mary(
    "hail-mary-charity", "charity", "Avemaría por la caridad",
    ["Dios te salve, María Santísima, Esposa de Dios Espíritu Santo,", "Virgen Purísima después del parto,", "en tus manos ponemos nuestra caridad para que la inflames,", "nuestros dones y carismas para que los perfecciones", "y todas nuestras necesidades para que las remedies,"],
    "Dios te salve, María Santísima, esposa de Dios Espíritu Santo, Virgen Purísima después del parto, en tus manos ponemos nuestra caridad para que la inflames. Llena eres de gracia…",
    "Dios te salve María Santísima, Esposa de Dios Espíritu Santo; Virgen Purísima después del Parto; en tus manos, Señora, ponemos nuestra Caridad, para que la inflames, llena eres de gracia, el Señor es contigo, bendita eres entre las mujeres y bendito es el fruto de tu vientre, Jesús.",
    "Dios te salve María, Esposa de Dios Espíritu Santo, en tus manos encomendamos nuestra caridad para que la inflames, llena eres de gracia...",
))

prayers.append({
    "id": "trinity-salutation",
    "category": "pious-tradition",
    "categoryNote": VIRTUES_NOTE + " Esta cuarta salutación se dice sola, sin Avemaría, tras las tres (El Rosario de María, Desde la fe, Cofradía de Oaxaca); Catholic.net la sigue con 'llena eres de gracia...'.",
    "openingForm": "three-virtues",
    "titles": {"es-MX": "Templo de la Santísima Trinidad", "es-ES": "Templo de la Santísima Trinidad"},
    "texts": {
        "es-MX": t(["Dios te salve, María Santísima,", "Templo, Trono y Sagrario de la Santísima Trinidad,", "Virgen concebida sin la culpa original."], RDM_REZAR, None,
                   "Normalizado de la fuente: 'Dios te Salve, María' → 'Dios te salve, María'; 'culpa Original' → 'culpa original'. Saltos de línea editoriales.", [
                       var("Desde la fe (Arquidiócesis de México), Misterios Gozosos", ["Dios te salve, María Santísima, Templo y Sagrario de la Santísima Trinidad, Virgen concebida sin la culpa original."], DLF_GOZ_V),
                       var("Cofradía del Rosario de Oaxaca", ["Dios te salve María Santísima, Hija de Dios Padre, Madre de Dios Hijo y Esposa del Espíritu Santo; Templo, Trono y Sagrario de la Santísima Trinidad; Virgen concebida sin la culpa del pecado original. Amén."], OAX_COF),
                   ]),
        "es-ES": same("es-MX", ES_ES_VIRTUES),
        "en-US": missing(EN_VIRTUES),
        "la": missing(LA_VIRTUES),
    },
})

with open(OUT, "w", encoding="utf-8") as f:
    json.dump({
        "_meta": {
            "schema": "Ver README.md",
            "locales": ["es-MX", "es-ES", "en-US", "la"],
            "categories": {"magisterium": "Enseñanza o profesión de fe de la Iglesia", "liturgy": "Texto litúrgico o tomado de la liturgia", "pious-tradition": "Devoción aprobada, no litúrgica"},
            "generated": ACC,
        },
        "prayers": prayers,
    }, f, ensure_ascii=False, indent=2)
    f.write("\n")
print(len(prayers), "prayers")
