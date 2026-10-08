import html
import json
import os
import re
import subprocess
import sys

DL = sys.argv[1]
OUT = sys.argv[2]
READINGS = json.load(open(sys.argv[3]))

BOOKS = {
    # key: (LPD title, NV slug, DR name, es abbr, la abbr)
    "Mt": ("EVANGELIO SEGUN SAN MATEO", "evang-matthaeum", "Matthew", "Mt", "Mt"),
    "Mk": ("EVANGELIO SEGUN SAN MARCOS", "evang-marcum", "Mark", "Mc", "Mc"),
    "Lk": ("EVANGELIO SEGUN SAN LUCAS", "evang-lucam", "Luke", "Lc", "Lc"),
    "Jn": ("EVANGELIO SEGUN SAN JUAN", "evang-ioannem", "John", "Jn", "Io"),
    "Acts": ("HECHOS DE LOS APOSTOLES", "actus-apostolorum", "Acts", "Hch", "Act"),
    "1 Cor": ("PRIMERA CARTA A LOS CORINTIOS", "epist-i-corinthios", "1 Corinthians", "1 Co", "1 Cor"),
    "2 Pt": ("SEGUNDA CARTA DE SAN PEDRO", "epist-ii-petri", "2 Peter", "2 P", "2 Pt"),
    "Rev": ("APOCALIPSIS", "apocalypsis-ioannis", "Apocalypse", "Ap", "Ap"),
}

REF_RE = re.compile(r"^(\d? ?[A-Za-z]+) (\d+):(\d+)-(?:(\d+):)?(\d+)$|^(\d? ?[A-Za-z]+) (\d+):(\d+)$")


def parse_ref(ref):
    m = REF_RE.match(ref)
    if not m:
        raise ValueError(ref)
    if m.group(1):
        book, c1, v1, c2, v2 = m.group(1), int(m.group(2)), int(m.group(3)), m.group(4), int(m.group(5))
        c2 = int(c2) if c2 else c1
    else:
        book, c1, v1 = m.group(6), int(m.group(7)), int(m.group(8))
        c2, v2 = c1, v1
    return book, c1, v1, c2, v2


def clean(s):
    s = html.unescape(re.sub(r"<[^>]+>", "", s))
    s = s.replace("\xa0", " ")
    return re.sub(r"\s+", " ", s).strip()


def curl(url, path):
    if not os.path.exists(path) or os.path.getsize(path) < 500:
        subprocess.run(["curl", "-s", "--compressed", "-L", "-m", "90", "-o", path, url], check=True)
    return open(path, "rb").read().decode("latin-1")


# ---------- Libro del Pueblo de Dios ----------
LPD_MAP = json.load(open(os.path.join(DL, "lpd", "map.json")))
LPD_BASE = "https://www.vatican.va/archive/ESL0506/"


def lpd_chapter(book, ch):
    fname = LPD_MAP[BOOKS[book][0]][str(ch)]
    t = curl(LPD_BASE + fname, os.path.join(DL, "lpd", fname))
    verses = {}
    cur = None
    started = False
    for cls, body in re.findall(r"(?is)<p class=(\w+)[^>]*>(.*?)</p>", t):
        b = clean(body)
        if cls.lower().startswith("capitulo"):
            started = True
            continue
        if not started or not b:
            continue
        m = re.match(r"^(\d+)\s+(.*)$", b)
        if m:
            cur = int(m.group(1))
            verses[cur] = m.group(2)
        elif cur is not None:
            verses[cur] += " " + b
    return verses, LPD_BASE + fname


# ---------- Nova Vulgata ----------
NV_BASE = "https://www.vatican.va/archive/bible/nova_vulgata/documents/nova-vulgata_nt_{}_lt.html"
_nv_cache = {}


def nv_book(book):
    if book in _nv_cache:
        return _nv_cache[book]
    slug = BOOKS[book][1]
    url = NV_BASE.format(slug)
    t = curl(url, os.path.join(DL, "nv", slug + ".html"))
    t = t.replace("\r", " ").replace("\n", " ")
    parts = re.split(r'<a name="(\d+)">\s*\d+\s*</a>', t)
    chapters = {}
    for i in range(1, len(parts), 2):
        ch = int(parts[i])
        seg = parts[i + 1]
        seg = re.split(r"<!--FINE|</td>", seg)[0]
        txt = html.unescape(re.sub(r"<br\s*/?>", "\n", seg))
        txt = re.sub(r"<[^>]+>", " ", txt).replace("\xa0", " ")
        verses = {}
        cur = None
        for line in txt.split("\n"):
            line = re.sub(r"\s+", " ", line).strip()
            if not line:
                continue
            line = re.sub(r"^\(\d+\)\s*", "", line)
            m = re.match(r"^(\d+)\s+(.*)$", line)
            if m:
                cur = int(m.group(1))
                verses[cur] = m.group(2)
            elif cur is not None:
                verses[cur] += " " + line
        chapters[ch] = verses
    _nv_cache[book] = (chapters, url)
    return _nv_cache[book]


# ---------- Douay-Rheims (Challoner) ----------
DR_PATH = os.path.join(DL, "dr", "pg1581.txt")
DR_URL = "https://www.gutenberg.org/ebooks/1581"
_dr = None


def dr_load():
    global _dr
    if _dr is not None:
        return _dr
    lines = open(DR_PATH, encoding="utf-8").read().replace("\r", "").split("\n")
    data = {}
    book = ch = None
    para = []

    def flush():
        if book and para:
            p = " ".join(x.strip() for x in para)
            m = re.match(r"^(\d+):(\d+)\. (.*)$", p)
            if m and int(m.group(1)) == ch:
                data.setdefault(book, {}).setdefault(ch, {})[int(m.group(2))] = m.group(3)

    for line in lines:
        h = re.match(r"^(.+) Chapter (\d+)$", line)
        if h:
            flush(); para = []
            book, ch = h.group(1), int(h.group(2))
            continue
        if not line.strip():
            flush(); para = []
        else:
            para.append(line)
    flush()
    _dr = data
    return _dr


def dr_chapter(book, ch):
    return dr_load()[BOOKS[book][2]][ch]


OMITTED = []


def collect(getter, book, c1, v1, c2, v2):
    out = []
    for ch in range(c1, c2 + 1):
        verses = getter(book, ch)
        lo = v1 if ch == c1 else 1
        hi = v2 if ch == c2 else max(verses)
        for v in range(lo, hi + 1):
            if v not in verses:
                OMITTED.append(f"{book} {ch}:{v}")
                continue
            out.append({"chapter": ch, "verse": v, "text": verses[v]})
    return out


def local_ref(ref, locale):
    book, c1, v1, c2, v2 = parse_ref(ref)
    if locale == "en":
        return ref
    abbr = BOOKS[book][3] if locale == "es" else BOOKS[book][4]
    if c1 == c2:
        tail = f"{c1}, {v1}" + (f"-{v2}" if v2 != v1 else "")
    else:
        tail = f"{c1}, {v1}-{c2}, {v2}"
    return f"{abbr} {tail}"


CORRECTIONS = {
    ("la", "Rev", 12, 1): [("appa ruit", "apparuit", "Errata de la edición en vatican.va (palabra partida).")],
    ("es", "Lk", 1, 48): [("porque el miró", "porque él miró", "Errata de la edición en vatican.va (falta tilde).")],
    ("es", "Lk", 1, 49): [("Todopoderoso he hecho", "Todopoderoso ha hecho", "Errata de la edición en vatican.va ('he' por 'ha').")],
}


def apply_corrections(loc, book, verses):
    applied = []
    for v in verses:
        for old, new, why in CORRECTIONS.get((loc, book, v["chapter"], v["verse"]), []):
            if old not in v["text"]:
                raise ValueError(f"correction not applicable: {loc} {book} {v}")
            v["text"] = v["text"].replace(old, new)
            applied.append({"chapter": v["chapter"], "verse": v["verse"], "from": old, "to": new, "reason": why})
    return applied


def main():
    refs = sorted({r["ref"] for m in READINGS for r in m["readings"]} | {e for m in READINGS for e in m.get("excerpts", [])})
    corpora = {"es": {}, "en": {}, "la": {}}
    for ref in refs:
        book, c1, v1, c2, v2 = parse_ref(ref)
        lpd_urls = []

        def lpd_get(b, c):
            v, u = lpd_chapter(b, c)
            lpd_urls.append(u)
            return v

        OMITTED.clear()
        es = collect(lpd_get, book, c1, v1, c2, v2)
        om_es = list(OMITTED); OMITTED.clear()
        nv_chapters, nv_url = nv_book(book)
        la = collect(lambda b, c: nv_chapters[c], book, c1, v1, c2, v2)
        om_la = list(OMITTED); OMITTED.clear()
        en = collect(dr_chapter, book, c1, v1, c2, v2)
        om_en = list(OMITTED); OMITTED.clear()
        omitted = {"es": om_es, "la": om_la, "en": om_en}
        for loc, verses, src in (("es", es, sorted(set(lpd_urls))), ("la", la, [nv_url]), ("en", en, [DR_URL])):
            fixes = apply_corrections(loc, book, verses)
            corpora[loc][ref] = {
                "displayRef": local_ref(ref, loc),
                "text": " ".join(x["text"] for x in verses),
                "verses": verses,
                "sourceUrls": src,
            }
            if fixes:
                corpora[loc][ref]["editorialCorrections"] = fixes
            if omitted[loc]:
                corpora[loc][ref]["omittedVerses"] = omitted[loc]
                print("omitted", loc, omitted[loc])
    meta = {
        "es": {"translation": "El Libro del Pueblo de Dios (La Biblia, traducción argentina, 1990)", "publisher": "Conferencia Episcopal Argentina; edición electrónica en vatican.va (Libreria Editrice Vaticana / IntraText)", "license": "copyright", "url": LPD_BASE + "_INDEX.HTM"},
        "la": {"translation": "Nova Vulgata, Bibliorum Sacrorum Editio, editio typica altera (1979/1986)", "publisher": "Santa Sede (vatican.va)", "license": "copyright", "url": "https://www.vatican.va/archive/bible/nova_vulgata/documents/nova-vulgata_index_lt.html"},
        "en": {"translation": "Douay-Rheims Bible, Challoner revision (1749-1752)", "publisher": "Project Gutenberg eBook #1581", "license": "public-domain", "url": DR_URL},
    }
    os.makedirs(OUT, exist_ok=True)
    for loc, data in corpora.items():
        with open(os.path.join(OUT, f"{loc}.json"), "w", encoding="utf-8") as f:
            json.dump({"_meta": {**meta[loc], "accessed": "2026-10-06"}, "passages": data}, f, ensure_ascii=False, indent=2)
            f.write("\n")
    print(len(refs), "refs")


main()
