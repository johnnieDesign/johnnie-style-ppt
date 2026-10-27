#!/usr/bin/env python3
"""새 발표 폴더를 만든다: 템플릿(deck/ · tools/)을 복사하고 data.js meta 에 제목과 id 를 넣는다.

  python3 <스킬>/scripts/new_deck.py <발표 폴더> --title "발표 제목" [--subtitle "부제"] [--eyebrow "행사 · 날짜"]

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


def main():
    ap = argparse.ArgumentParser(description='새 발표 폴더')
    ap.add_argument('dest')
    ap.add_argument('--title', required=True)
    ap.add_argument('--subtitle', default='')
    ap.add_argument('--eyebrow', default='')
    a = ap.parse_args()

    dest = os.path.abspath(os.path.expanduser(a.dest))
    if os.path.exists(dest) and os.listdir(dest):
        sys.exit(f'이미 내용이 있는 폴더입니다. 다른 폴더를 고르세요: {dest}')
    os.makedirs(dest, exist_ok=True)
    for name in ('deck', 'tools'):
        shutil.copytree(os.path.join(TEMPLATE, name), os.path.join(dest, name), ignore=shutil.ignore_patterns('.DS_Store', '__pycache__'))
    for d in ('deck/audio', 'deck/assets', 'deck/refs', 'audio/paras'):   # 동기화로 빈 폴더가 빠졌을 수 있다
        os.makedirs(os.path.join(dest, d), exist_ok=True)

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
