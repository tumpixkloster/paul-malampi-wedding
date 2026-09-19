#!/usr/bin/env python3
import json,sys,pathlib,qrcode
from qrcode.constants import ERROR_CORRECT_H
root=pathlib.Path(__file__).parent
if len(sys.argv)!=2: raise SystemExit('Usage: python generate_qr.py https://USERNAME.github.io/REPOSITORY')
base=sys.argv[1].rstrip('/')
guests=json.loads((root/'assets/data/guests.json').read_text(encoding='utf-8'))
out=root/'qr-codes'; out.mkdir(exist_ok=True)
cards=[]
for g in guests:
 url=f"{base}/guest.html?g={g['slug']}"
 qr=qrcode.QRCode(error_correction=ERROR_CORRECT_H,box_size=10,border=4);qr.add_data(url);qr.make(fit=True)
 qr.make_image(fill_color='black',back_color='white').save(out/f"{g['slug']}.png")
 cards.append(f"<article><img src='{g['slug']}.png'><b>{g['name']}</b><small>{g['id']} · {g['size']} guest(s)</small></article>")
html="<!doctype html><meta charset=utf-8><title>Invitation QR codes</title><style>body{font-family:Arial}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}article{text-align:center;border:1px solid #bbb;padding:10px;break-inside:avoid}img{width:100%}b,small{display:block}</style><h1>Invitation QR codes</h1><div class=grid>"+''.join(cards)+"</div>"
(out/'_overview.html').write_text(html,encoding='utf-8')
print(f'Created {len(guests)} invitation QR codes in {out}')
