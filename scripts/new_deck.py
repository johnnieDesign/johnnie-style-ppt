#!/usr/bin/env python3
"""새 발표 폴더를 만든다: 템플릿(deck/ · tools/)을 복사하고 data.js meta 에 제목과 id 를 넣는다.

  python3 <스킬>/scripts/new_deck.py <발표 폴더> --title "발표 제목" [--subtitle "부제"] [--eyebrow "행사 · 날짜"]
  python3 <스킬>/scripts/new_deck.py <폴더> --gallery     # 장면 패턴 모음(gallery/)을 넘겨 보는 장표

발표 폴더는 그 자체로 완결된다(엔진 · 도구 · 대본 · 음성). 발표 기기로 옮길 때는 폴더를 통째로 zip 한다.
이미 내용이 있는 폴더에는 만들지 않는다.
"""
import argparse
import json
import os
import re
import shutil
import sys

SKILL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATE = os.path.join(SKILL, 'template')
GALLERY = os.path.join(SKILL, 'gallery')


def use_gallery(deck):
    """대본 · 장면을 gallery/ 것으로 바꾸고 index.html 의 장면 줄을 그 파트에 맞춘다."""
    shutil.copy(os.path.join(GALLERY, 'data.js'), os.path.join(deck, 'data.js'))
    scenes = os.path.join(deck, 'scenes')
    for f in os.listdir(scenes):
        if re.fullmatch(r'\d+\.js', f):
            os.remove(os.path.join(scenes, f))
    ids = sorted(f[:-3] for f in os.listdir(os.path.join(GALLERY, 'scenes')) if re.fullmatch(r'\d+\.js', f))
    for i in ids:
        shutil.copy(os.path.join(GALLERY, 'scenes', i + '.js'), scenes)
    if os.path.isdir(os.path.join(GALLERY, 'assets')):
        shutil.copytree(os.path.join(GALLERY, 'assets'), os.path.join(deck, 'assets'), dirs_exist_ok=True)
    index = os.path.join(deck, 'index.html')
    html = open(index, encoding='utf-8').read()
    lines = ''.join(f'<script src="scenes/{i}.js"></script>\n' for i in ids)
    html, n = re.subn(r'(?:<script src="scenes/\d+\.js"></script>\n)+', lambda m: lines, html, count=1)
    if not n:
        sys.exit('index.html 에서 장면 줄(<script src="scenes/NN.js">)을 못 찾았습니다')
    open(index, 'w', encoding='utf-8').write(html)


def main():
    ap = argparse.ArgumentParser(description='새 발표 폴더')
    ap.add_argument('dest')
    ap.add_argument('--title', help='발표 제목(--gallery 가 아니면 필요)')
    ap.add_argument('--subtitle', default='')
    ap.add_argument('--eyebrow', default='')
    ap.add_argument('--gallery', action='store_true', help='장면 패턴 모음을 넘겨 보는 장표로 만든다')
    a = ap.parse_args()
    if not a.gallery and not a.title:
        ap.error('--title 이 필요합니다')

    dest = os.path.abspath(os.path.expanduser(a.dest))
    if os.path.exists(dest) and os.listdir(dest):
        sys.exit(f'이미 내용이 있는 폴더입니다. 다른 폴더를 고르세요: {dest}')
    os.makedirs(dest, exist_ok=True)
    for name in ('deck', 'tools'):
        shutil.copytree(os.path.join(TEMPLATE, name), os.path.join(dest, name), ignore=shutil.ignore_patterns('.DS_Store', '__pycache__'))
    for d in ('deck/audio', 'deck/assets', 'deck/refs', 'audio/paras'):   # 동기화로 빈 폴더가 빠졌을 수 있다
        os.makedirs(os.path.join(dest, d), exist_ok=True)

    if a.gallery:
        use_gallery(os.path.join(dest, 'deck'))
        print(f'만들었습니다(장면 패턴 모음): {dest}')
        print(f'  장표: {dest}/deck/index.html  (→ · Space 로 넘기며 본다)')
        print(f'  패턴표: {SKILL}/references/patterns.md')
        return

    path = os.path.join(dest, 'deck', 'data.js')
    src = open(path, encoding='utf-8').read()
    slug = re.sub(r'[^0-9A-Za-z가-힣]+', '-', os.path.basename(dest)).strip('-').lower() or 'deck'
    meta_line = re.search(r'^"meta": (\{.*\}),$', src, re.M)
    meta = json.loads(meta_line.group(1))
    meta.update(id=slug, title=a.title, footer=a.title, subtitle=a.subtitle, eyebrow=a.eyebrow)
    src = src.replace(meta_line.group(0), '"meta": ' + json.dumps(meta, ensure_ascii=False) + ',')
    open(path, 'w', encoding='utf-8').write(src)
    print(f'만들었습니다: {dest}')
    print(f'  장표: {dest}/deck/index.html (견본 2파트가 들어 있다. 대본을 넣으면 견본 파트는 지운다)')
    print(f'  발표자 화면: {dest}/deck/index.html#presenter')
    print('  공유본에는 장표 서체가 들어간다: 서체 블록(index.html)의 서체가 이 맥에 설치돼 있어야 한다')
    print('  (기본 Pretendard. 없으면 https://github.com/orioncactus/pretendard/releases 에서 받아 설치)')


if __name__ == '__main__':
    main()
