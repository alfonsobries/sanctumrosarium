import json
import sys

OUT, READINGS_OUT = sys.argv[1], sys.argv[2]
ACC = "2026-10-06"


def src(publisher, url, title, via=None):
    s = {"publisher": publisher, "title": title, "url": url, "accessed": ACC}
    if via:
        s["retrievedVia"] = via
    return s


COMP_ES = src("Santa Sede (vatican.va)", "https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_sp.html", "Compendio del Catecismo de la Iglesia Católica, Apéndice A: Rosario")
COMP_EN = src("Holy See (vatican.va)", "https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_en.html", "Compendium of the Catechism of the Catholic Church, Appendix A: The Rosary / Rosarium")
DLF_RR = src("Desde la fe (Arquidiócesis Primada de México)", "https://desdelafe.mx/noticias/sabias-que/como-rezar-el-rosario/", "¿Cómo rezar el Rosario? (17-VII-2025)")
US_HOW = src("United States Conference of Catholic Bishops", "https://www.usccb.org/how-to-pray-the-rosary", "How to Pray the Rosary", "https://web.archive.org/web/2026/https://www.usccb.org/how-to-pray-the-rosary")
RVM = {
    "es": src("Santa Sede (vatican.va)", "https://www.vatican.va/content/john-paul-ii/es/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html", "Juan Pablo II, Rosarium Virginis Mariae (16-X-2002)"),
    "en": src("Holy See (vatican.va)", "https://www.vatican.va/content/john-paul-ii/en/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html", "John Paul II, Rosarium Virginis Mariae (16-X-2002)"),
    "la": src("Sancta Sedes (vatican.va)", "https://www.vatican.va/content/john-paul-ii/la/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html", "Ioannes Paulus II, Rosarium Virginis Mariae (16-X-2002)"),
}


def vat(set_slug, lang):
    return src("Santa Sede (vatican.va)", f"https://www.vatican.va/special/rosary/documents/misteri_{set_slug}_{lang}.html", "El Santo Rosario - Los Misterios" if lang == "sp" else "The Holy Rosary - The Mysteries")


SETS = [
    {"id": "joyful", "vatSlug": "gaudiosi", "rvm": "RVM 20",
     "titles": {"es-MX": "Misterios gozosos", "es-ES": "Misterios gozosos", "en-US": "The Joyful Mysteries", "la": "Mystéria gaudiósa"}},
    {"id": "luminous", "vatSlug": "luminosi", "rvm": "RVM 21",
     "titles": {"es-MX": "Misterios luminosos", "es-ES": "Misterios luminosos", "en-US": "The Luminous Mysteries", "la": "Mystéria luminósa"},
     "titlesNote": "El Compendio (inglés) los llama 'The Mysteries of Light'; USCCB, 'Luminous Mysteries'."},
    {"id": "sorrowful", "vatSlug": "dolorosi", "rvm": "RVM 22",
     "titles": {"es-MX": "Misterios dolorosos", "es-ES": "Misterios dolorosos", "en-US": "The Sorrowful Mysteries", "la": "Mystéria dolorósa"}},
    {"id": "glorious", "vatSlug": "gloriosi", "rvm": "RVM 23",
     "titles": {"es-MX": "Misterios gloriosos", "es-ES": "Misterios gloriosos", "en-US": "The Glorious Mysteries", "la": "Mystéria gloriósa"}},
]

P, PAR, REL = "primary", "parallel", "related"


def r(ref, kind=PAR, note=None):
    d = {"ref": ref, "kind": kind}
    if note:
        d["note"] = note
    return d


# titles: es-MX (Desde la fe), es-ES (Compendio), en-US (USCCB), la (Compendio); esVatican / enVatican = vatican.va special rosary
M = [
    ("joyful", 1, "annunciation",
     {"es-MX": "La Anunciación", "es-ES": "La encarnación del Hijo de Dios", "en-US": "The Annunciation", "la": "Annuntiátio"},
     {"es": "La Encarnación del Hijo de Dios", "en": "The Annunciation"},
     [r("Lk 1:26-38", P)], {"es": "Lk 1:26-27", "en": "Lk 1:26-27"}, "Humility"),
    ("joyful", 2, "visitation",
     {"es-MX": "La Visitación", "es-ES": "La visitación de Nuestra Señora a su prima Santa Isabel", "en-US": "The Visitation", "la": "Visitátio"},
     {"es": "La Visitación de Nuestra Señora a su prima Santa Isabel", "en": "The Visitation"},
     [r("Lk 1:39-56", P)], {"es": "Lk 1:39-42", "en": "Lk 1:39-42"}, "Love of Neighbor"),
    ("joyful", 3, "nativity",
     {"es-MX": "El Nacimiento de Jesús", "es-ES": "El nacimiento del Hijo de Dios", "en-US": "The Nativity", "la": "Natívitas"},
     {"es": "El Nacimiento del Hijo de Dios en el portal de Belén", "en": "The Birth of Our Lord"},
     [r("Lk 2:1-20", P), r("Mt 1:18-25", PAR, "Relato de Mateo: concepción y nacimiento de Jesús desde José."), r("Mt 2:1-12", REL, "Adoración de los magos.")],
     {"es": "Lk 2:1-7", "en": "Lk 2:1-7"}, "Poverty"),
    ("joyful", 4, "presentation",
     {"es-MX": "La Presentación del Niño en el Templo", "es-ES": "La Presentación de Jesús en el templo", "en-US": "The Presentation in the Temple", "la": "Præsentátio"},
     {"es": "La presentación de Jesús en el Templo", "en": "The Presentation in the Temple"},
     [r("Lk 2:22-40", P)], {"es": "Lk 2:21-24", "en": "Lk 2:21-24"}, "Purity of Heart and Body"),
    ("joyful", 5, "finding-in-the-temple",
     {"es-MX": "El Niño perdido y hallado en el Templo", "es-ES": "El Niño Jesús perdido y hallado en el templo", "en-US": "The Finding in the Temple", "la": "Invéntio in Templo"},
     {"es": "El Niño Jesús perdido y hallado en el Templo", "en": "The finding of Jesus in the temple"},
     [r("Lk 2:41-52", P)], {"es": "Lk 2:41-47", "en": "Lk 2:41-47"}, "Devotion to Jesus"),

    ("luminous", 1, "baptism",
     {"es-MX": "El Bautismo de Jesús en el Jordán", "es-ES": "El Bautismo de Jesús en el Jordán", "en-US": "The Baptism of Christ in the Jordan", "la": "Baptísma apud Iordánem"},
     {"es": "El Bautismo en el Jordán", "en": "The Baptism in the Jordan"},
     [r("Mt 3:13-17", P), r("Mk 1:9-11"), r("Lk 3:21-22"), r("Jn 1:29-34", PAR, "Testimonio del Bautista; Juan no narra el bautismo mismo.")],
     {"es": "Mt 3:16-17", "en": "Mt 3:16-17"}, "Openness to the Holy Spirit"),
    ("luminous", 2, "wedding-at-cana",
     {"es-MX": "La autorrevelación de Jesús en las bodas de Caná", "es-ES": "La autorrevelación de Jesús en las bodas de Caná", "en-US": "The Wedding Feast at Cana", "la": "Autorevelátio apud Cananénse matrimónium"},
     {"es": "Las bodas de Caná", "en": "The wedding feast of Cana"},
     [r("Jn 2:1-11", P)], {"es": "Jn 2:1-5", "en": "Jn 2:1-5"}, "To Jesus through Mary"),
    ("luminous", 3, "proclamation-of-the-kingdom",
     {"es-MX": "El anuncio del Reino de Dios invitando a la conversión", "es-ES": "El anuncio del Reino de Dios invitando a la conversión", "en-US": "Jesus' Proclamation of the Coming of the Kingdom of God", "la": "Regni Dei proclamátio coniúncta cum invitaménto ad conversiónem"},
     {"es": "El anuncio del Reino de Dios", "en": "The proclamation of the kingdom of God"},
     [r("Mk 1:14-15", P), r("Mt 4:12-17"), r("Lk 4:14-21", PAR, "Inicio del ministerio en Galilea y predicación en Nazaret."), r("Mk 2:1-12", REL, "RVM 21 cita Mc 2, 3-13: perdón de los pecados."), r("Lk 7:36-50", REL, "RVM 21 cita Lc 7, 47-48: perdón de los pecados.")],
     {"es": "Mk 1:15", "en": "Mk 1:15"}, "Conversion"),
    ("luminous", 4, "transfiguration",
     {"es-MX": "La Transfiguración", "es-ES": "La Transfiguración", "en-US": "The Transfiguration", "la": "Transfigurátio"},
     {"es": "La Transfiguración", "en": "The Transfiguration"},
     [r("Mt 17:1-9", P), r("Mk 9:2-10"), r("Lk 9:28-36"), r("2 Pt 1:16-18", REL, "Testimonio apostólico de la Transfiguración.")],
     {"es": "Mt 17:1-2", "en": "Mt 17:1-2"}, "Desire for holiness"),
    ("luminous", 5, "institution-of-the-eucharist",
     {"es-MX": "La institución de la Eucaristía", "es-ES": "La Institución de la Eucaristía", "en-US": "The Institution of the Eucharist", "la": "Eucharístiæ Institútio"},
     {"es": "La institución de la Eucaristía", "en": "The institution of the Eucharist"},
     [r("Mt 26:26-29", P), r("Mk 14:22-25"), r("Lk 22:14-20"), r("1 Cor 11:23-26", PAR, "Relato paulino de la institución."), r("Jn 13:1-15", REL, "RVM 21 cita Jn 13, 1; Juan no narra la institución.")],
     {"es": "Mt 26:26", "en": "Mt 26:26"}, "Adoration"),

    ("sorrowful", 1, "agony-in-the-garden",
     {"es-MX": "La oración de Jesús en el Huerto", "es-ES": "La Oración de Jesús en el Huerto", "en-US": "The Agony in the Garden", "la": "Agonía in Hortu"},
     {"es": "La oración en el Huerto", "en": "The agony in the Garden"},
     [r("Mt 26:36-46", P), r("Mk 14:32-42"), r("Lk 22:39-46")],
     {"es": "Mt 26:36-39", "en": "Mt 26:36-39"}, "Obedience to God's Will"),
    ("sorrowful", 2, "scourging-at-the-pillar",
     {"es-MX": "La flagelación del Señor", "es-ES": "La Flagelación del Señor", "en-US": "The Scourging at the Pillar", "la": "Flagellátio"},
     {"es": "La flagelación de Jesús atado a la columna", "en": "The scourging at the pillar"},
     [r("Mt 27:15-26", P), r("Mk 15:6-15"), r("Jn 18:38-19:1"), r("Lk 23:13-25", PAR, "Lucas no narra la flagelación; Pilato propone castigarlo (23, 16.22).")],
     {"es": "Mt 27:26", "en": "Mt 27:26"}, "Mortification"),
    ("sorrowful", 3, "crowning-with-thorns",
     {"es-MX": "Jesús es coronado de espinas", "es-ES": "La Coronación de espinas", "en-US": "The Crowning with Thorns", "la": "Coronátio Spinis"},
     {"es": "La coronación de espinas", "en": "The crowning with thorns"},
     [r("Mt 27:27-31", P), r("Mk 15:16-20"), r("Jn 19:2-5")],
     {"es": "Mt 27:27-29", "en": "Mt 27:27-29"}, "Courage"),
    ("sorrowful", 4, "carrying-of-the-cross",
     {"es-MX": "Jesús camina al Calvario con la cruz a cuestas", "es-ES": "Jesús con la Cruz a cuestas camino del Calvario", "en-US": "The Carrying of the Cross", "la": "Baiulátio Crucis"},
     {"es": "Jesús con la Cruz a cuestas camino del Calvario", "en": "The carrying of the cross"},
     [r("Lk 23:26-32", P), r("Mt 27:31-32"), r("Mk 15:20-22"), r("Jn 19:16-17")],
     {"es": "Mk 15:21-22", "en": "Mk 15:21-22"}, "Patience"),
    ("sorrowful", 5, "crucifixion",
     {"es-MX": "La crucifixión y muerte de nuestro Señor", "es-ES": "La Crucifixión y Muerte de Nuestro Señor", "en-US": "The Crucifixion and Death", "la": "Crucifíxio et Mors"},
     {"es": "La crucifixión y muerte de Jesús", "en": "The crucifixion"},
     [r("Lk 23:33-49", P), r("Mt 27:33-54"), r("Mk 15:22-39"), r("Jn 19:17-30")],
     {"es": "Lk 23:33-46", "en": "Lk 23:33-46"}, "Sorrow for our Sins"),

    ("glorious", 1, "resurrection",
     {"es-MX": "La Resurrección del Señor", "es-ES": "La Resurrección del Hijo de Dios", "en-US": "The Resurrection", "la": "Resurréctio"},
     {"es": "La resurrección del Hijo de Dios", "en": "The Resurrection"},
     [r("Lk 24:1-12", P), r("Mt 28:1-10"), r("Mk 16:1-8"), r("Jn 20:1-18")],
     {"es": "Lk 24:1-6", "en": "Lk 24:1-5"}, "Faith"),
    ("glorious", 2, "ascension",
     {"es-MX": "La Ascensión del Señor", "es-ES": "La Ascensión del Señor a los Cielos", "en-US": "The Ascension", "la": "Ascénsio"},
     {"es": "La Ascensión del Señor al cielo", "en": "The Ascension"},
     [r("Acts 1:6-11", P), r("Mk 16:15-20"), r("Lk 24:50-53")],
     {"es": "Mk 16:19", "en": "Mk 16:19"}, "Hope"),
    ("glorious", 3, "descent-of-the-holy-spirit",
     {"es-MX": "La venida del Espíritu Santo", "es-ES": "La Venida del Espíritu Santo sobre los Apóstoles", "en-US": "The Descent of the Holy Spirit", "la": "Descénsus Spíritus Sancti"},
     {"es": "La venida del Espíritu Santo", "en": "The descent of the Holy Spirit"},
     [r("Acts 2:1-11", P), r("Jn 20:19-23", REL, "Cristo resucitado da el Espíritu a los discípulos.")],
     {"es": "Acts 2:1-4", "en": "Acts 2:1-4"}, "Wisdom"),
    ("glorious", 4, "assumption",
     {"es-MX": "La Asunción de Nuestra Señora a los Cielos", "es-ES": "La Asunción de Nuestra Señora a los Cielos", "en-US": "The Assumption", "la": "Assúmptio"},
     {"es": "La Asunción de María al cielo", "en": "The Assumption"},
     [r("Lk 1:46-55", REL, "La Escritura no narra la Asunción. vatican.va y USCCB proponen Lc 1, 48-49; aquí el Magníficat completo.")],
     {"es": "Lk 1:48-49", "en": "Lk 1:48-49"}, "Devotion to Mary"),
    ("glorious", 5, "coronation",
     {"es-MX": "La Coronación de la Santísima Virgen", "es-ES": "La Coronación de la Santísima Virgen como Reina de Cielos y Tierra", "en-US": "The Coronation of Mary", "la": "Coronátio in Cælo"},
     {"es": "La coronación de María como Reina y Señora de todo lo creado", "en": "The crowning of Our Lady Queen of Heaven"},
     [r("Rev 11:19-12:1", REL, "La Escritura no narra la coronación. vatican.va y USCCB proponen Ap 12, 1; Desde la fe, Ap 11, 19-12, 1.")],
     {"es": "Rev 12:1", "en": "Rev 12:1"}, "Grace of a happy death"),
]

mysteries = []
for set_id, order, slug, titles, vat_titles, readings, excerpts, fruit in M:
    s = next(x for x in SETS if x["id"] == set_id)
    mysteries.append({
        "id": f"{set_id}-{order}-{slug}",
        "set": set_id,
        "order": order,
        "titles": titles,
        "titleSources": {"es-MX": DLF_RR, "es-ES": COMP_ES, "en-US": US_HOW, "la": COMP_EN},
        "titleVariants": {
            "es (vatican.va)": {"title": vat_titles["es"], "source": vat(s["vatSlug"], "sp")},
            "en (vatican.va)": {"title": vat_titles["en"], "source": vat(s["vatSlug"], "en")},
        },
        "readings": readings,
        "excerpts": {
            "note": "Versículos breves que vatican.va (y USCCB, mismas citas) muestran al enunciar el misterio.",
            "es": excerpts["es"],
            "en": excerpts["en"],
            "source": vat(s["vatSlug"], "sp"),
        },
        "fruit": {
            "category": "pious-tradition",
            "en-US": fruit,
            "source": US_HOW,
            "notes": "Fruto tradicional según USCCB. Sin fuente oficial en español ni latín; no traducir sin fuente.",
        },
    })

assert len(mysteries) == 20

schedule = {
    "source": RVM,
    "paragraph": "RVM 38",
    "days": {
        "monday": "joyful",
        "tuesday": "sorrowful",
        "wednesday": "glorious",
        "thursday": "luminous",
        "friday": "sorrowful",
        "saturday": "joyful",
        "sunday": "glorious",
    },
    "withoutLuminous": {
        "note": "RVM 38: 'Según la praxis corriente, el lunes y el jueves están dedicados a los «misterios gozosos», el martes y el viernes a los «dolorosos», el miércoles, el sábado y el domingo a los «gloriosos»'. El orden anterior a los misterios de luz, para quien no los reza.",
        "days": {
            "monday": "joyful",
            "tuesday": "sorrowful",
            "wednesday": "glorious",
            "thursday": "joyful",
            "friday": "sorrowful",
            "saturday": "glorious",
            "sunday": "glorious",
        },
    },
    "flexibility": "RVM 38: 'esta indicación no pretende limitar una conveniente libertad en la meditación personal y comunitaria, según las exigencias espirituales y pastorales y, sobre todo, las coincidencias litúrgicas que pueden sugerir oportunas adaptaciones'.",
    "seasonalCustom": {
        "category": "pious-tradition",
        "note": "USCCB: los domingos de Adviento, misterios gozosos; los domingos de Cuaresma, dolorosos; los gloriosos, los domingos fuera de Adviento y Cuaresma. No está en RVM 38: es costumbre, opcional.",
        "adventSundays": "joyful",
        "lentSundays": "sorrowful",
        "source": US_HOW,
    },
    "confirmedBy": [COMP_ES, COMP_EN, src("Santa Sede (vatican.va)", "https://www.vatican.va/special/rosary/documents/misteri_sp.html", "Los Misterios del Santo Rosario")],
}

sets_out = []
for s in SETS:
    d = {"id": s["id"], "titles": s["titles"], "rvmParagraph": s["rvm"], "source": RVM}
    if "titlesNote" in s:
        d["titlesNote"] = s["titlesNote"]
    sets_out.append(d)

with open(OUT, "w", encoding="utf-8") as f:
    json.dump({
        "_meta": {"schema": "Ver README.md", "generated": ACC, "readingKinds": {"primary": "Pasaje principal", "parallel": "Mismo acontecimiento en otro evangelio o autor (rotable)", "related": "Texto relacionado, no narra el mismo hecho"}},
        "sets": sets_out,
        "schedule": schedule,
        "mysteries": mysteries,
    }, f, ensure_ascii=False, indent=2)
    f.write("\n")

with open(READINGS_OUT, "w") as f:
    json.dump([{"readings": m["readings"], "excerpts": [m["excerpts"]["es"], m["excerpts"]["en"]]} for m in mysteries], f)
print("ok")
