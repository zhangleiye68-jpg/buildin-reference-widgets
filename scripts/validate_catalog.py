#!/usr/bin/env python3
"""Validate registry coverage, usable paths, metadata and real PNG previews."""
import json,pathlib,struct,urllib.parse
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=ROOT/'docs/catalog'
data=json.loads((BASE/'components.json').read_text())
entries=data['components']+data['assets'];ids=set();errors=[]
required=['id','kind','name','category','language','ownership','status','embed_url','aliases','source_url','code_url','license','description','tags','recommended_size','dependencies','notes','parameters','preview','checked_at','verification','replacement_id']
for e in entries:
    missing=set(required)-e.keys()
    if missing:errors.append(f'{e.get("id")}: missing {missing}');continue
    if e['id']in ids:errors.append(f'Duplicate ID {e["id"]}')
    ids.add(e['id'])
    for u in [e['embed_url'],e['source_url'],*e['aliases']]:
        if not u.startswith('https://')or'.chatgpt.site'in u or'buildin.ai/'in u:errors.append(f'{e["id"]}: unexpected public URL {u}')
    if e['status']not in ['ready','sample','needs-review','retired','unavailable','reference']:errors.append(f'{e["id"]}: unknown status')
    if not e['checked_at']:errors.append(f'{e["id"]}: no check date')
    if e['replacement_id']and not any(x['id']==e['replacement_id']for x in entries):errors.append(f'{e["id"]}: missing replacement')
    p=urllib.parse.urlsplit(e['embed_url'])
    if p.hostname=='zhangleiye68-jpg.github.io'and p.path.startswith('/buildin-reference-widgets/'):
        f=ROOT/'docs'/p.path.removeprefix('/buildin-reference-widgets/')
        if f.is_dir():f=f/'index.html'
        if not f.is_file():errors.append(f'{e["id"]}: missing target {f}')
    if e['kind']=='widget':
        f=BASE/e['preview']
        if not f.is_file():errors.append(f'{e["id"]}: missing preview');continue
        content=f.read_bytes()
        if content[:8]!=b'\x89PNG\r\n\x1a\n':errors.append(f'{e["id"]}: preview is not PNG');continue
        width,height=struct.unpack('>II',content[16:24])
        if width<160 or height<100:errors.append(f'{e["id"]}: preview is too small')
if errors:
    print('\n'.join(errors));raise SystemExit(1)
print(f'PASS: {len(data["components"])} components, {len(data["assets"])} assets, {len(ids)} unique IDs')
