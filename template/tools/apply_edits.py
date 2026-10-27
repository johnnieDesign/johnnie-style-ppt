#!/usr/bin/env python3
"""발표자 화면 '대본 고치기'에서 복사한 수정 내용(JSON)을 장표 원본에 반영한다.
  pbpaste | python3 tools/apply_edits.py              # 반영
  pbpaste | python3 tools/apply_edits.py --dry-run    # 바뀔 것만 보기
  python3 tools/apply_edits.py edits.json --deck <deck 폴더>
- data.js: 고친 문단의 text(화면용)만 바꾼다. tts(음성용 한글)는 그대로 두고 '음성 다시 만들 문단'으로 알린다.
- scenes/*.js: 그 문단의 마커(PP-NN@구절)를 새 글에 맞게 바꾼다. 옮긴 ▶ 는 그 자리에서 시작하는 가장 짧은 고유 구절로,
  ▶ 가 없는 마커는 옛 글 → 새 글 대응(difflib)으로 자리를 찾는다.
"""
import argparse
import difflib
import json
import os
import re
import shutil
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ATTR = re.compile(r'data-(at|until|type|state|seq)="([^"]*)"')
CLICKS = re.compile(r"clicks:\s*'([^']*)'")


def markers(src):
    """장면 파일 안의 마커 문자열(중복 포함)"""
    out = []
    for kind, val in ATTR.findall(src):
        if kind in ('state', 'seq'):
            out += [x[:x.rindex(':')] for x in val.split('|') if ':' in x]
        else:
            out.append(val)
    for val in CLICKS.findall(src):
        out += [x.strip() for x in val.split('|') if x.strip()]
    return out


def tidy(text):
    return re.sub(r'\s+', ' ', text).strip()


def map_pos(a, b, i):
    """글 a 의 i 번째 자리가 글 b 에서는 어디인지"""
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if i1 <= i < i2:
            return j1 + (i - i1) if tag == 'equal' else j1
    return len(b)


def phrase_at(text, at, keep=None):
    """text[at:] 에서 시작하는 가장 짧은 고유 구절(공백 빼고 2글자 이상, 14자까지).
    14자 안에 고유한 게 없으면 첫 등장이 at 인 가장 짧은 구절. 옛 구절이 그 자리에 그대로 있으면 그대로 둔다."""
    if at >= len(re.sub(r'[\s.!?…"\'”’)]+$', '', text)):
        return '$'                                   # 문단 끝: 장표 엔진의 '@$'(말을 다 마친 뒤 누른다)
    while at < len(text) and text[at] in ' \'"‘’“”':   # 따옴표로 시작하는 구절은 만들지 않는다. 장면 파일의 '…' 문자열이 깨진다
        at += 1
    if keep and text.find(keep) == at:
        return keep
    first = None
    for n in range(2, len(text) - at + 1):
        ph = text[at:at + n]
        if ph.endswith(' ') or len(ph.replace(' ', '')) < 2 or text.find(ph) != at or any(c in ph for c in '\'"`|:'):
            continue
        if n <= 14 and text.find(ph, at + 1) < 0:
            return ph
        first = first or ph
        if n > 14:
            break
    return first


def main():
    ap = argparse.ArgumentParser(description='발표자 화면에서 고친 대본을 data.js · scenes 에 반영')
    ap.add_argument('json', nargs='?', help='수정 내용 JSON 파일(없으면 표준 입력)')
    ap.add_argument('--deck', default=os.path.join(ROOT, 'deck'))
    ap.add_argument('--dry-run', action='store_true', help='바뀔 것만 보여 주고 쓰지 않는다')
    ap.add_argument('--force', action='store_true', help='장표 원본이 그사이 바뀌었어도 반영')
    a = ap.parse_args()
    edits = json.load(open(a.json, encoding='utf-8')) if a.json else json.load(sys.stdin)

    data_path, scene_dir = os.path.join(a.deck, 'data.js'), os.path.join(a.deck, 'scenes')
    src = open(data_path, encoding='utf-8').read()
    deck = json.loads(src[src.index('{'):src.rindex('}') + 1])
    texts = {q['id']: q['text'] for p in deck['parts'] for q in p['paras']}
    scenes = {n: open(os.path.join(scene_dir, n), encoding='utf-8').read() for n in sorted(os.listdir(scene_dir)) if n.endswith('.js')}
    all_marks = sorted({m for s in scenes.values() for m in markers(s)})

    repl, new_text, notes = {}, {}, []
    for pid, e in sorted(edits.items()):
        if pid not in texts:
            notes.append(f'!! {pid}: 장표에 없는 문단이라 건너뜀')
            continue
        cur = texts[pid]
        if e.get('orig') not in (None, cur) and not a.force:
            notes.append(f'!! {pid}: 고친 뒤 장표 원본이 바뀌어 건너뜀(--force 로 강제)')
            continue
        orig, text = e.get('orig') or cur, tidy(e['text'])
        ats = [m['at'] if text == e['text'] else map_pos(e['text'], text, m['at']) for m in e.get('marks', [])]
        found = {}
        for mk, at in zip(e.get('marks', []), ats):   # 끌어 옮긴(또는 그대로인) ▶: 그 자리에서 시작하는 구절
            for k in mk['keys']:
                ph = phrase_at(text, at, keep=k.split('@', 1)[1])
                found[k] = pid if not text[:at].strip(' \'"‘’“”') else f'{pid}@{ph}' if ph else None   # 맨 앞 ▶ = 문단 시작과 함께
        for k in e.get('cueKeys', []):                  # 문단 시작에 합쳐진 마커. 구절이 없어지면 문단 시작으로
            found[k] = k if k.split('@', 1)[1] in text else pid
        for k in all_marks:                             # ▶ 로 넘어오지 않은 이 문단의 마커: 옛 글 → 새 글 대응
            if '@' not in k or k.split('@', 1)[0] != pid or k in found:
                continue
            old = k.split('@', 1)[1]
            i = orig.find(old)
            ph = phrase_at(text, map_pos(orig, text, i), keep=old) if i >= 0 else None
            found[k] = f'{pid}@{ph}' if ph else None
        for k, v in found.items():
            if v is None:
                notes.append(f'!! {pid}: {k} 의 새 자리를 찾지 못함')
            elif v != k:
                repl[k] = v
        new_text[pid] = text

    # 장면 파일: 옛 마커 → 새 마커를 한 번에(바꾼 결과를 다시 바꾸지 않게). 앞뒤가 따옴표 · | · : 인 자리만
    counts = {}
    if repl:
        pat = re.compile(r'(?<=["\'|])(' + '|'.join(re.escape(k) for k in sorted(repl, key=len, reverse=True)) + r')(?=["\'|:])')
        for name in scenes:
            n = [0]

            def sub(m):
                n[0] += 1
                return repl[m.group(1)]
            scenes[name] = pat.sub(sub, scenes[name])
            if n[0]:
                counts[name] = n[0]
    for pid, text in new_text.items():
        line = re.compile(r'(\{"id":\s*"' + re.escape(pid) + r'",\s*"text":\s*)"(?:[^"\\]|\\.)*"')
        src, n = line.subn(lambda m: m.group(1) + json.dumps(text, ensure_ascii=False), src, count=1)
        if n != 1:
            notes.append(f'!! data.js 에서 {pid} 의 text 를 찾지 못함')
        texts[pid] = text

    # 검사: 모든 마커 구절이 새 대본에 있는가
    missing = [(name, m) for name, s in scenes.items() for m in markers(s)
               if '@' in m and m.split('@', 1)[0] in texts and m.split('@', 1)[1] != '$' and m.split('@', 1)[1] not in texts[m.split('@', 1)[0]]]
    # 검사: 고친 문단에서 ▶ 끼리 0.3초(장표의 MERGE) 안으로 붙으면 반영 뒤 한 번 누름으로 합쳐진다. 장표와 같은 셈으로
    tsrc = open(os.path.join(a.deck, 'timing.js'), encoding='utf-8').read()
    timing = json.loads(re.sub(r'//[^\n]*', '', tsrc[tsrc.index('{'):tsrc.rindex('}') + 1]))
    nz = lambda s: len(re.sub(r'\s', '', s))
    for pid, text in new_text.items():
        if pid not in timing:
            continue
        cue, t0, t1 = timing[pid]
        live = sorted({m.split('@', 1)[1] for s in scenes.values() for m in markers(s) if m.split('@', 1)[0] == pid and '@' in m}, key=text.find)
        ts = [max(cue, t0 + (t1 - t0) * nz(text[:text.find(ph)]) / max(1, nz(text)) - 0.15) for ph in live if ph in text]
        close = [(live[i], live[i + 1]) for i in range(len(ts) - 1) if 0 < ts[i + 1] - ts[i] < 0.3]
        notes += [f'주의 {pid}: 「{p}」·「{q}」가 0.3초 안이라 한 번 누름으로 합쳐집니다' for p, q in close]

    for pid in sorted(new_text):
        print(f'{pid}: 글 {"바꿈" if new_text[pid] != (edits[pid].get("orig") or "") else "그대로"}')
        for k, v in sorted(repl.items()):
            if k.split('@', 1)[0] == pid:
                print(f'  {k} → {v}')
    for name, n in counts.items():
        print(f'scenes/{name}: {n}곳')
    print(*notes, sep='\n') if notes else None
    print(f'대본에 없는 구절: {len(missing)}' + ''.join(f'\n  {n}: {m}' for n, m in missing))
    print('음성 다시 만들 문단(data.js 의 tts 는 그대로):', ', '.join(sorted(new_text)) or '없음')

    if a.dry_run or not new_text:
        print('(dry-run: 아무것도 쓰지 않았습니다)' if a.dry_run else '반영할 문단이 없습니다')
        return
    bak = os.path.join(os.path.dirname(os.path.abspath(a.deck)), '.apply-backup', time.strftime('%Y%m%d-%H%M%S'))   # 대상 장표 폴더 옆
    os.makedirs(os.path.join(bak, 'scenes'), exist_ok=True)
    shutil.copy2(data_path, bak)
    with open(data_path, 'w', encoding='utf-8') as f:
        f.write(src)
    for name in counts:
        shutil.copy2(os.path.join(scene_dir, name), os.path.join(bak, 'scenes'))
        with open(os.path.join(scene_dir, name), 'w', encoding='utf-8') as f:
            f.write(scenes[name])
    print(f'반영했습니다 · 이전 파일은 {bak}')


if __name__ == '__main__':
    main()
