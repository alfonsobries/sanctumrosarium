import sys,re,html
for f in sys.argv[1:]:
    b=open(f,'rb').read()
    enc='utf-8'
    m=re.search(rb'charset=["\']?([\w-]+)',b[:3000])
    if m: enc=m.group(1).decode()
    try: t=b.decode(enc)
    except Exception: t=b.decode('latin-1')
    t=re.sub(r'(?is)<(script|style|noscript).*?</\1>','',t)
    t=re.sub(r'(?is)<br\s*/?>','\n',t); t=re.sub(r'(?is)</(p|td|tr|div|h\d|li)>','\n',t)
    t=re.sub(r'(?s)<[^>]+>','',t); t=html.unescape(t)
    t=re.sub(r'[ \t\r\xa0]+',' ',t); t=re.sub(r'\n\s*\n+','\n',t)
    open(f+'.txt','w').write(t)
