#!/usr/bin/env python3
"""장표가 실제로 쓰는 파일만 모은다. index.html 은 페이지라 빠진다.
  python3 tools/collect_files.py            # 목록과 크기
  python3 tools/collect_files.py --json     # {"published/path": "deck/…"} 맵 (Artifact files · build_single.py 가 읽는다)
"""
import json
import os
import re
import sys

DECK = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'deck')
scenes = sorted(n for n in os.listdir(os.path.join(DECK, 'scenes')) if n.endswith('.js'))
files = {'data.js', 'timing.js'} | {f'scenes/{n}' for n in scenes}
text = open(os.path.join(DECK, 'index.html'), encoding='utf-8').read()
text += ''.join(open(os.path.join(DECK, 'scenes', n), encoding='utf-8').read() for n in scenes)
src = open(os.path.join(DECK, 'data.js'), encoding='utf-8').read()
files |= {a for a in re.findall(r'"audio":\s*"([^"]+)"', src) if a}
for m in re.findall(r'''(?:src|href)=["']([^"'#?]+)["']|url\(["']?([^"')]+)["']?\)''', text):
    p = m[0] or m[1]
    if p.startswith(('http', 'data:', '//')):
        continue
    if os.path.isfile(os.path.join(DECK, p)):
        files.add(p)
files = sorted(f for f in files if os.path.isfile(os.path.join(DECK, f)))
total = sum(os.path.getsize(os.path.join(DECK, f)) for f in files)
if '--json' in sys.argv:
    print(json.dumps({f: os.path.join('deck', f) for f in files}, ensure_ascii=False))
else:
    for f in files:
        print(f'{os.path.getsize(os.path.join(DECK, f)) / 1024:8.0f} KB  {f}')
    print(f'{len(files)}개 · {total / 1048576:.1f} MB')
