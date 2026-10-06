import json, re, html, subprocess, os, sys
d = json.load(open(sys.argv[1]))['passages']
num = {"Mt":47,"Mk":48,"Lk":49,"Jn":50,"Acts":51,"1 Cor":53,"2 Pt":68,"Rev":73}
cache = sys.argv[2]
def norm(s):
    s = s.replace("’","'").replace("‘","'").replace("“",'"').replace("”",'"')
    return re.sub(r"[^a-z]","",s.lower())
bad = 0; total = 0
for ref, p in d.items():
    book = re.match(r"^(\d? ?[A-Za-z]+) ", ref).group(1)
    for v in p["verses"]:
        f = os.path.join(cache, f"{num[book]}{v['chapter']:03d}.htm")
        if not os.path.exists(f):
            subprocess.run(["curl","-s","-L","-m","60","-A","Mozilla/5.0","-o",f,f"https://www.drbo.org/chapter/{num[book]}{v['chapter']:03d}.htm"])
        t = norm(html.unescape(re.sub(r"<[^>]+>"," ",open(f,encoding="latin-1",errors="ignore").read())))
        total += 1
        if norm(v["text"]) not in t:
            bad += 1; print("MISMATCH", ref, v["chapter"], v["verse"], v["text"][:90])
print(total, "verses checked,", bad, "mismatches")
