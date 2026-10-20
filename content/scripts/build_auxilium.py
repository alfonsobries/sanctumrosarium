"""Builds content/auxilium.json from the official Auxilium Christianorum booklets.

The site answers scripts with a browser check, so the three lay booklets are downloaded
by hand from https://auxiliumchristianorum.org/prayers/ into one folder: dailyprayers.pdf
(English), Latinlaicis-1.pdf (Latin) and AC_Esp.pdf (Spanish). The English and Latin
PDFs print two booklet pages per sheet, so each half is read on its own. Needs pdftotext
(poppler).

Run: python3 content/scripts/build_auxilium.py <folder with the PDFs>
"""
import json, re, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'auxilium.json'
PDFS = Path(sys.argv[1])
AC = tempfile.mkdtemp()

def extract(pdf, name, sheets):
    path = str(PDFS / pdf)
    def run(*args):
        return subprocess.run(['pdftotext', *args, path, '-'], check=True, capture_output=True, text=True).stdout
    if sheets:
        text = ''.join(run('-f', str(page), '-l', str(page), '-x', str(x), '-y', '0', '-W', '396', '-H', '612') for page in range(1, 5) for x in (0, 396))
    else:
        text = run()
    Path(f'{AC}/{name}').write_text(text)

extract('dailyprayers.pdf', 'dailyprayers.txt', True)
extract('Latinlaicis-1.pdf', 'Latinlaicis-1.txt', True)
extract('AC_Esp.pdf', 'es.txt', False)

def load(name):
    t = open(f'{AC}/{name}').read()
    t = re.sub(r'\n\s*\d+\s*\n', '\n', t)  # page numbers
    t = t.replace('\f', '\n')
    return t

def flat(s):
    s = re.sub(r'\s*\n\s*', ' ', s.strip())
    return re.sub(r' {2,}', ' ', s)

def between(t, start, end=None, include_start=True):
    i = t.index(start)
    j = t.index(end, i + len(start)) if end else len(t)
    seg = t[i:j] if include_start else t[i + len(start):j]
    return seg.strip()

def lines(seg):
    # Joins wrapped lines: a new line starts after a sentence end.
    out, cur = [], ''
    for raw in seg.split('\n'):
        l = raw.strip()
        if not l:
            continue
        cur = (cur + ' ' + l).strip() if cur else l
        if re.search(r'[.!?:]$', cur) or cur.endswith('Domine') or cur.endswith('Escúchame'):
            out.append(cur); cur = ''
    if cur:
        out.append(cur)
    return out

KYRIE_END = ('God the Father of Heaven', 'Pater de cælis', 'Dios Padre celestial')

def litany(seg, responses):
    items = []
    kyrie = any(k in seg for k in KYRIE_END)
    for l in lines(seg):
        if kyrie and l.startswith(KYRIE_END):
            kyrie = False
        if kyrie:
            items.append({'call': l})
            continue
        for r in responses:
            m = re.match(r'^(.*?)[,]?\s*(?:[–—-]\s*)?(' + re.escape(r) + r')$', l)
            if m:
                items.append({'call': m.group(1).strip().rstrip(','), 'response': m.group(2)})
                break
        else:
            items.append({'call': l})
    return items

def text(s, **kw):
    b = {'kind': 'text', 'text': flat(s)}
    b.update(kw)
    return b

def versicle(seg):
    v, r = [x for x in seg.strip().split('\n') if x.strip()][:2]
    return {'kind': 'versicle', 'call': re.sub(r'^V\.\s*', '', v.strip()), 'response': re.sub(r'^R\.\s*', '', r.strip())}

def prayer(pid):
    return {'kind': 'prayer', 'prayer': pid}

def sec(id_, blocks, day=None):
    s = {'id': id_, 'blocks': blocks}
    if day is not None:
        s['day'] = day
    return s

# ---------- English ----------
en = load('dailyprayers.txt')
en = en[en.index('Prayers to be said every day:'):]
en_sm = "Saint Michael Archangel, defend us in battle, be our protection against the wickedness and snares of the devil; may God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl through the world seeking the ruin of souls. Amen."
en_ga = "Angel of God, my guardian dear, to whom God's love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen."
pb = between(en, 'Lord have mercy.', 'V. Thou hast redeemed', )
EN_RESP = ['have mercy on us.', 'save us.', 'spare us, O Lord.', 'graciously hear us, O Lord.']
thu = between(en, 'My Lord, Thou art all powerful', 'On Fridays:')
thu_intro = thu[:thu.index('From anxiety')]
thu_lit = thu[thu.index('From anxiety'):thu.index('Thou who said')]
thu_lit = re.sub(r'\.\s*From', '.\nFrom', thu_lit)
thu_end = thu[thu.index('Thou who said'):]
sun = between(en, 'O Glorious Queen', 'On Mondays:')
fri = between(en, 'O Jesus, meek', 'On Saturdays:')
concl = between(en, 'August Queen', 'Most Sacred Heart')
inv = between(en, 'Most Sacred Heart', 'In the name of the Father, the Son')
closing = between(en, 'Almighty, and everlasting God', 'On Sundays:')
en_sections = [
    sec('opening', [versicle(between(en, 'V. Our help', 'Most gracious'))]),
    sec('offering', [text(between(en, 'Most gracious Virgin Mary', 'St. Michael Prayer.'))]),
    sec('saint-michael', [text(en_sm)]),
    sec('guardian-angel', [text(en_ga)]),
    sec('our-father', [prayer('our-father')]),
    sec('hail-mary', [prayer('hail-mary')]),
    sec('glory-be', [prayer('glory-be')]),
    sec('precious-blood', [
        {'kind': 'litany', 'items': litany(pb, EN_RESP)},
        versicle(between(en, 'V. Thou hast redeemed', 'Let us pray.')),
        text('Let us pray.', lead=True),
        text(closing[:closing.index('R. Amen.')], response='Amen.'),
    ]),
    sec('sunday', [text(sun[:sun.index('St. Joseph, Patron')]), text(sun[sun.index('St. Joseph, Patron'):sun.index('St. Michael, summon')]), text(sun[sun.index('St. Michael, summon'):])], 0),
    sec('monday', [text(between(en, 'In Thy name, Lord Jesus Christ', 'On Tuesdays:'))], 1),
    sec('tuesday', [text(between(en, 'Lord Jesus Christ, we beg Thee', 'On Wednesdays:'))], 2),
    sec('wednesday', [text(between(en, 'In the Name of Jesus Christ, Our Lord and God', 'On Thursdays:'))], 3),
    sec('thursday', [text(thu_intro), {'kind': 'litany', 'items': litany(thu_lit, ['We implore Thee, deliver us, O Lord.'])}, text(thu_end)], 4),
    sec('friday', [{'kind': 'litany', 'items': litany(fri, ['hear me.', 'deliver me, Jesus.', 'Jesus, grant me the grace to desire it.'])}], 5),
    sec('saturday', [text(between(en, 'O God and Father of our Lord', 'Conclusion for Every Day'))], 6),
    sec('conclusion', [text(concl)]),
    sec('invocations', [{'kind': 'litany', 'items': litany(inv, ['have mercy on us.', 'pray for us.'])}]),
    sec('sign-of-the-cross', [text(between(en, 'In the name of the Father, the Son'))]),
]

# ---------- Latin ----------
la = load('Latinlaicis-1.txt')
la = la[la.index('Preces sunt cotidie dicendae'):]
la = la.replace('Audjutorium a nostrum', 'Adjutorium nostrum')
la = re.sub(r'Filii a\s+et', 'Filii, ✠ et', la).replace('Patris, a et Filii', 'Patris, ✠ et Filii')
assert re.search(r'\ba\s+et\s+(Filii|Spiritus)', la) is None
la_pb = between(la, 'Kyrie, eleison.', 'V. Redimisti')
la_thu = between(la, 'Omnipotens Deus, Pater', 'Feria VI')
la_thu_lit = la_thu[la_thu.index('Ab anxietate'):la_thu.index('Da, qui dixisti')]
la_sun = between(la, 'O Gloriosa Regina', 'Feria II')
la_closing = between(la, 'Omnipotens sempiterne Deus', 'Dominica')
la_sections = [
    sec('opening', [versicle(between(la, 'V. Adjutorium', 'O Piissima'))]),
    sec('offering', [text(between(la, 'O Piissima Virgo Maria', 'SANCTE Michæl'))]),
    sec('saint-michael', [text(between(la, 'SANCTE Michæl', 'ANGELE Dei').replace('SANCTE', 'Sancte'))]),
    sec('guardian-angel', [text(between(la, 'ANGELE Dei', 'PATER NOSTER').replace('ANGELE', 'Angele'))]),
    sec('our-father', [prayer('our-father')]),
    sec('hail-mary', [prayer('hail-mary')]),
    sec('glory-be', [prayer('glory-be')]),
    sec('precious-blood', [
        {'kind': 'litany', 'items': litany(la_pb, ['miserere nobis.', 'salva nos.', 'parce nobis, Domine.', 'exaudi nos, Domine.', 'miserere nobis, Domine.'])},
        versicle(between(la, 'V. Redimisti', 'Oremus.')),
        text('Oremus.', lead=True),
        text(la_closing[:la_closing.index('Amen.')]  , response='Amen.'),
    ]),
    sec('sunday', [text(la_sun[:la_sun.index('Sancte Joseph')]), text(la_sun[la_sun.index('Sancte Joseph'):la_sun.index('Sancte Michæl, invoca')]), text(la_sun[la_sun.index('Sancte Michæl, invoca'):])], 0),
    sec('monday', [text(between(la, 'Domine Jesu Christe, oramus', 'Feria III'))], 1),
    sec('tuesday', [text(between(la, 'Domine Jesu Christe, quæsumus', 'Feria IV'))], 2),
    sec('wednesday', [text(between(la, 'In Nomine Jesu Christi', 'Feria V'))], 3),
    sec('thursday', [text(la_thu[:la_thu.index('Ab anxietate')]), {'kind': 'litany', 'items': litany(re.sub(r'\s*—\s*', ' — ', la_thu_lit), ['Te rogamus libera nos Domine.', 'Te rogamus, libera nos Domine.'])}, text(la_thu[la_thu.index('Da, qui dixisti'):])], 4),
    sec('friday', [{'kind': 'litany', 'items': litany(between(la, 'O Jesu, mitis', 'Sabatto'), ['exaudi me.', 'libera me Domine.', 'Iesu, da mihi gratiam ita desiderandi.'])}], 5),
    sec('saturday', [text(between(la, 'Invoco Nomen Sanctum', 'Conclusio Cotidiana'))], 6),
    sec('conclusion', [text(between(la, 'Augusta Regina', 'Cor Jesu Sacratissimum'))]),
    sec('invocations', [{'kind': 'litany', 'items': litany(between(la, 'Cor Jesu Sacratissimum', 'In nomine Patris, ✠'), ['miserere nobis.', 'ora pro nobis.', 'orate pro nobis.'])}]),
    sec('sign-of-the-cross', [text(between(la, 'In nomine Patris, ✠'))]),
]

# ---------- Spanish ----------
es = load('es.txt')
es = es[es.index('Oraciones para dichas cada día:'):]
es = re.sub(r'\n1?\s*Con Aprobación Eclesiástica\. Derechos de autor c 2012 Auxilium Christianorum\.\s*\n', '\n', es)
assert 'Derechos de autor' not in es
es_fix = [
    ('tu que aplastas', 'tú que aplastas'), ('contra quien\nvengarse', 'contra quién\nvengarse'),
    ('tu que tienes', 'tú que tienes'), ('haz\nrecibido', 'has\nrecibido'),
    ('perseguir los\na espíritus', 'perseguir a\nlos espíritus'), ('sin hacer dañando a ninguno', 'sin hacer daño a ninguno'),
    ('rabia muerte', 'rabia y muerte'), ('consuelo del moribundo, Sálvanos\n', 'consuelo del moribundo, Sálvanos.\n'), ('Tu que dijiste', 'Tú que dijiste'),
    ('tu eres Todopoderoso, tu eres Dios, tu eres mi Padre', 'tú eres Todopoderoso, tú eres Dios, tú eres mi Padre'),
]
for a, b in es_fix:
    assert a in es, a
    es = es.replace(a, b)
es = re.sub(r'\bAmen\b', 'Amén', es)
es_sm = "San Miguel Arcángel, defiéndenos en la lucha. Sé nuestro amparo contra la perversidad y acechanzas del demonio. Que Dios manifieste sobre él su poder, es nuestra humilde súplica. Y tú, oh Príncipe de la Milicia Celestial, con el poder que Dios te ha conferido, arroja al infierno a Satanás, y a los demás espíritus malignos que vagan por el mundo para la perdición de las almas. Amén."
es_ga = "Ángel de Dios, que eres mi custodio, pues la bondad divina me ha encomendado a ti, ilumíname, guárdame, defiéndeme y gobiérname. Amén."
es_pb = between(es, 'Señor, ten piedad de nosotros.', 'V. ¡Oh Señor')
es_thu = between(es, 'Mi Señor, tú eres', 'Día Viernes:')
es_sun = between(es, 'Oh Gloriosa Reina', 'Día Lunes:')
es_closing = between(es, 'Omnipotente y Sempiterno Dios', 'Día Domingo:')
es_sections = [
    sec('opening', [versicle(between(es, 'V. Nuestro auxilio', 'Amabilísima'))]),
    sec('offering', [text(between(es, 'Amabilísima Virgen María', 'Deberá rezarse'))]),
    sec('saint-michael', [text(es_sm)]),
    sec('guardian-angel', [text(es_ga)]),
    sec('our-father', [prayer('our-father')]),
    sec('hail-mary', [prayer('hail-mary')]),
    sec('glory-be', [prayer('glory-be')]),
    sec('precious-blood', [
        {'kind': 'litany', 'items': litany(es_pb, ['ten piedad de nosotros.', 'Sálvanos.', 'Sálvanos', 'Perdónanos, Señor.', 'Escúchanos, Señor.', 'Ten piedad de nosotros.'])},
        versicle(between(es, 'V. ¡Oh Señor', 'Oremos')),
        text('Oremos.', lead=True),
        text(es_closing[:es_closing.index('R. Amén.')], response='Amén.'),
    ]),
    sec('sunday', [text(es_sun[:es_sun.index('Ven, Ama Soberana')]), text(es_sun[es_sun.index('Ven, Ama Soberana'):es_sun.index('San José, Patrón')]), text(es_sun[es_sun.index('San José, Patrón'):es_sun.index('San Miguel, llama')]), text(es_sun[es_sun.index('San Miguel, llama'):])], 0),
    sec('monday', [text(between(es, 'Señor Jesucristo, te suplicamos', 'Día Martes:'))], 1),
    sec('tuesday', [text(between(es, 'Señor Jesucristo, te imploramos', 'Día Miércoles:'))], 2),
    sec('wednesday', [text(between(es, 'En el Nombre de Jesucristo, Nuestro Señor y Dios', 'Día Jueves:'))], 3),
    sec('thursday', [text(es_thu[:es_thu.index('De toda ansiedad')]), {'kind': 'litany', 'items': litany(es_thu[es_thu.index('De toda ansiedad'):es_thu.index('Tú que dijiste')], ['Te suplicamos, líbranos Señor.'])}, text(es_thu[es_thu.index('Tú que dijiste'):])], 4),
    sec('friday', [{'kind': 'litany', 'items': litany(between(es, 'Jesús, manso y humilde', 'Día Sábado:'), ['Escúchame', 'Líbrame, Jesús.', 'Jesús, dame la gracia de desearlo.'])}], 5),
    sec('saturday', [text(between(es, 'Oh Dios y Padre de Nuestro Señor', 'Conclusión para Cada Día'))], 6),
    sec('conclusion', [text(between(es, 'Augusta Reina de los Cielos', 'Sacratísimo Corazón'))]),
    sec('invocations', [{'kind': 'litany', 'items': litany(between(es, 'Sacratísimo Corazón', 'En el Nombre del Padre, del Hijo'), ['ten piedad de nosotros.', 'Ruega por nosotros.', 'Rueguen por nosotros.'])}]),
    sec('sign-of-the-cross', [text(between(es, 'En el Nombre del Padre, del Hijo'))]),
]

def src(publisher, title, url):
    return {'publisher': publisher, 'title': title, 'url': url, 'accessed': '2026-10-19'}

ac = 'Auxilium Christianorum (auxiliumchristianorum.org)'
doc = {
    '_meta': {
        'schema': 'Ver README.md, sección auxilium.json',
        'generated': '2026-10-19',
        'approval': 'Cada folleto dice "With Ecclesiastical Approval" / "Con Aprobación Eclesiástica" / "Cum approbatione ecclesiasticâ", sin nombrar obispo ni fecha.',
        'rights': 'Copyright © 2012 (en, es) y MMXVII (la) Auxilium Christianorum. El sitio no dice si se pueden reproducir; falta pedir permiso.',
        'membership': 'Según su FAQ, basta rezar estas oraciones cada día para ser miembro; recomiendan consultar antes al director espiritual o confesor.',
    },
    'id': 'auxilium-christianorum',
    'category': 'pious-tradition',
    'links': {
        'home': 'https://auxiliumchristianorum.org/',
        'prayers': 'https://auxiliumchristianorum.org/prayers/',
        'requirements': 'https://auxiliumchristianorum.org/requirements/',
        'faq': 'https://auxiliumchristianorum.org/faq/',
    },
    'texts': {
        'en-US': {
            'source': src(ac, 'Handbook and Prayers for the Association of the Auxilium Christianorum (laity)', 'https://auxiliumchristianorum.org/wp-content/uploads/2018/04/dailyprayers.pdf'),
            'sectionSources': {
                'saint-michael': src('Holy See Press Office (press.vatican.va)', 'Communiqué of 29 September 2018: the Rosary in October', 'https://press.vatican.va/content/salastampa/en/bollettino/pubblico/2018/09/29/180929d.html'),
                'guardian-angel': src('Holy See (vatican.va)', 'Compendium of the Catechism of the Catholic Church (2005), Appendix A: Common Prayers', 'https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_en.html'),
            },
            'notes': 'El folleto solo nombra la oración a San Miguel y la del Ángel de la Guarda; sus textos vienen de las fuentes de sectionSources.',
            'sections': en_sections,
        },
        'es-MX': {
            'source': src(ac, 'De la Introducción del Manual y Oraciones de la Asociación del Auxilium Christianorum', 'https://auxiliumchristianorum.org/wp-content/uploads/2018/04/AC_Esp.pdf'),
            'sectionSources': {
                'saint-michael': src('EWTN Español (antes ACI Prensa, recurso 431)', 'Oración a San Miguel Arcángel', 'https://www.ewtn.com/es/oracion/oracion-a-san-miguel-arcangel'),
                'guardian-angel': src('Santa Sede (vatican.va)', 'Compendio del Catecismo de la Iglesia Católica (2005), Apéndice A: Oraciones comunes', 'https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_sp.html'),
            },
            'notes': 'El folleto solo nombra la oración a San Miguel y la del Ángel de la Guarda; sus textos vienen de las fuentes de sectionSources.',
            'editorialCorrections': [{'from': a.replace('\n', ' '), 'to': b.replace('\n', ' ')} for a, b in es_fix] + [{'from': 'Amen', 'to': 'Amén', 'reason': 'Acento que falta en todo el folleto.'}],
            'sections': es_sections,
        },
        'es-ES': {'sameAs': 'es-MX'},
        'la': {
            'source': src(ac, 'Manuale et Orationes ad usum Sodalitatis Auxilii Christianorum (Pro Laicis)', 'https://auxiliumchristianorum.org/wp-content/uploads/2018/04/Latinlaicis-1.pdf'),
            'editorialCorrections': [
                {'from': 'Audjutorium a nostrum', 'to': 'Adjutorium nostrum', 'reason': 'Errata del folleto.'},
                {'from': 'Filii a et / Patris, a et Filii', 'to': 'Filii, ✠ et / Patris, ✠ et Filii', 'reason': 'La "a" es la cruz de la fuente tipográfica del PDF.'},
            ],
            'sections': la_sections,
        },
    },
}
json.dump(doc, open(OUT, 'w'), ensure_ascii=False, indent=2)
open(OUT, 'a').write('\n')
for loc in ['en-US', 'es-MX', 'la']:
    ss = doc['texts'][loc]['sections']
    print(loc, [(s['id'], sum(len(b.get('items', [])) for b in s['blocks'])) for s in ss])
