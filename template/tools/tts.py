#!/usr/bin/env python3
"""Typecast 음성(기본 필재)을 문단별로 만들고, 이어 붙여 파트 음성과 timing.js 를 다시 쓴다.

대본은 deck/data.js 에서 읽는다. 음성은 문단의 tts(음성용 한글 표기: 숫자 · 영문 → 한글)로 만들고, 없으면 text.
문단별 wav 는 audio/paras/ 에 캐시해서, 고친 문단만 다시 만든다(캐시 없이 돌리면 매번 전체 글자 수만큼 크레딧이 든다).

  python3 tools/tts.py                          # 계획만: 새로 만들 문단 · 필요한 크레딧 · 남은 크레딧
  python3 tools/tts.py --go                     # 생성 → deck/audio/NN.m4a · deck/timing.js · data.js 음성 경로
  python3 tools/tts.py --only 02-04,03-01 --go  # 이 문단만 캐시를 무시하고 다시
  python3 tools/tts.py --voice <voice_id>       # 다른 목소리(data.js meta.voice_id 로도 정한다)

API 키는 맥 키체인 typecast-api-key 에서 읽고, 값은 어디에도 출력하지 않는다. 키는 기기마다 따로 넣어야 한다.
과금은 공백 포함 1자 = 1크레딧. ffmpeg 가 없어도 되게 wav 로 받아 afconvert(macOS)로 m4a 를 만든다.
"""
import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
import wave
from array import array

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DECK = os.path.join(ROOT, 'deck')
CACHE = os.path.join(ROOT, 'audio', 'paras')
API = 'https://api.typecast.ai/v1'
VOICE = 'tc_68257f68bc6e3c161ab5078d'  # 필재(기본값). --voice 나 data.js meta.voice_id 가 있으면 그것
MODEL = 'ssfm-v30'
LEAD, GAP, TAIL = 0.35, 1.1, 0.6  # 파트 앞 · 문단 사이 · 파트 끝 쉼 (초)
SILENCE = 184  # 16bit 에서 −45 dBFS. 문단 앞뒤의 이보다 작은 소리는 깎는다
KEEP = 0.04  # 깎고 남기는 여유 (초)


def load_deck():
    src = open(os.path.join(DECK, 'data.js'), encoding='utf-8').read()
    return json.loads(src[src.index('{'):src.rindex('}') + 1])


def say(p):
    """음성으로 읽을 문장. data.js 의 tts(한글 표기)를 쓰고, 없으면 text."""
    return p.get('tts') or p['text']


def api_key():
    r = subprocess.run(['security', 'find-generic-password', '-a', os.environ.get('USER', ''),
                        '-s', 'typecast-api-key', '-w'], capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else None


def call(method, path, key, body=None):
    req = urllib.request.Request(API + path, method=method,
                                 data=json.dumps(body).encode() if body is not None else None,
                                 headers={'X-API-KEY': key, 'Content-Type': 'application/json'})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 3:
                time.sleep(2 * (attempt + 1))
                continue
            sys.exit(f'Typecast {e.code}: {e.read().decode("utf-8", "replace")[:300]}')
        except urllib.error.URLError as e:
            if attempt < 3:
                time.sleep(2)
                continue
            sys.exit(f'Typecast 연결 실패: {e.reason}')


def cache_path(pid, text, tempo, emotion):
    h = hashlib.sha1(json.dumps([text, VOICE, MODEL, tempo, emotion], ensure_ascii=False).encode()).hexdigest()[:10]
    return os.path.join(CACHE, f'{pid}-{h}.wav')


def synth(key, text, prev, nxt, tempo, emotion):
    if emotion == 'smart':
        prompt = {'emotion_type': 'smart'}
        if prev:
            prompt['previous_text'] = prev
        if nxt:
            prompt['next_text'] = nxt
    else:
        prompt = {'emotion_type': 'preset', 'emotion_preset': emotion}
    return call('POST', '/text-to-speech', key, {
        'voice_id': VOICE, 'text': text, 'model': MODEL, 'language': 'kor', 'prompt': prompt,
        'output': {'audio_tempo': tempo, 'audio_format': 'wav'}})


def read_pcm(path):
    try:
        w = wave.open(path)
    except wave.Error:  # Python 3.9 의 wave 는 확장 형식 wav 를 못 읽는다 → 표준 PCM 으로 한 번 바꾼다
        subprocess.run(['afconvert', '-f', 'WAVE', '-d', 'LEI16', '-c', '1', path, path + '.pcm.wav'], check=True)
        os.replace(path + '.pcm.wav', path)
        w = wave.open(path)
    with w:
        if w.getnchannels() != 1 or w.getsampwidth() != 2:
            sys.exit(f'모노 16bit wav 가 아닙니다: {path}')
        a = array('h')
        a.frombytes(w.readframes(w.getnframes()))
        return w.getframerate(), a


def trim(a, rate):
    i, j = 0, len(a) - 1
    while i <= j and abs(a[i]) <= SILENCE:
        i += 1
    while j > i and abs(a[j]) <= SILENCE:
        j -= 1
    if i > j:
        return a
    keep = int(KEEP * rate)
    return a[max(0, i - keep):min(len(a), j + 1 + keep)]


def assemble(part, files):
    """문단 음성을 쉼과 함께 이어 붙이고 [화면 전환, 말 시작, 말 끝] 을 잰다."""
    out, timing, rate, t, prev_end = array('h'), {}, None, 0.0, 0.0
    for i, (p, f) in enumerate(zip(part['paras'], files)):
        r, a = read_pcm(f)
        if rate is None:
            rate = r
            out.extend([0] * int(LEAD * rate))
            t = LEAD
        elif r != rate:
            sys.exit(f'샘플레이트가 다릅니다: {f}')
        if i:
            out.extend([0] * int(GAP * rate))
            t += GAP
        seg = trim(a, rate)
        t0 = t
        t += len(seg) / rate
        out.extend(seg)
        timing[p['id']] = [0.0 if i == 0 else round(prev_end + GAP / 2, 2), round(t0, 2), round(t, 2)]
        prev_end = t
    out.extend([0] * int(TAIL * rate))
    return rate, out, timing, round(t + TAIL, 2)


def write_m4a(rate, pcm, dest):
    tmp = dest + '.wav'
    with wave.open(tmp, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(pcm.tobytes())
    subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', '-b', '128000', tmp, dest], check=True)
    os.remove(tmp)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--go', action='store_true', help='실제로 생성한다 (없으면 계획만 보여 준다)')
    ap.add_argument('--only', default='', help='캐시를 무시하고 다시 만들 문단 (쉼표로 구분)')
    ap.add_argument('--tempo', type=float, default=1.0)
    ap.add_argument('--emotion', default='smart', help='smart 또는 normal · happy · sad · toneup · tonedown 등 프리셋')
    ap.add_argument('--voice', default='', help='Typecast voice_id (기본: data.js meta.voice_id, 없으면 필재)')
    args = ap.parse_args()

    deck = load_deck()
    global VOICE
    VOICE = args.voice or deck.get('meta', {}).get('voice_id') or VOICE
    paras = [p for part in deck['parts'] for p in part['paras']]
    only = {s.strip() for s in args.only.split(',') if s.strip()}
    unknown = only - {p['id'] for p in paras}
    if unknown:
        sys.exit(f'대본에 없는 문단: {", ".join(sorted(unknown))}')
    todo = [i for i, p in enumerate(paras)
            if p['id'] in only or not os.path.exists(cache_path(p['id'], say(p), args.tempo, args.emotion))]
    cost = sum(len(say(paras[i])) for i in todo)
    print(f'대본 {len(paras)}문단 · 새로 만들 문단 {len(todo)}개 · {cost:,}자 = {cost:,}크레딧')
    if todo:
        print('  ' + ' '.join(paras[i]['id'] for i in todo))

    key = None
    if todo:
        key = api_key()
        if not key:
            sys.exit('키체인에 typecast-api-key 가 없습니다.')
        sub = json.loads(call('GET', '/users/me/subscription', key))
        c = sub.get('credits', {})
        left = c.get('plan_credits', 0) - c.get('used_credits', 0)
        print(f'Typecast {sub.get("plan")} 플랜 · {c.get("plan_credits", 0):,} 중 {c.get("used_credits", 0):,} 사용 → 남은 {left:,}')
        if cost > left:
            sys.exit('크레딧이 모자랍니다.')
    if not args.go:
        print('계획만 보여 줬습니다. 만들려면 --go')
        return

    os.makedirs(CACHE, exist_ok=True)
    for n, i in enumerate(todo, 1):
        p = paras[i]
        prev = say(paras[i - 1]) if i > 0 else ''
        nxt = say(paras[i + 1]) if i + 1 < len(paras) else ''
        data = synth(key, say(p), prev, nxt, args.tempo, args.emotion)
        with open(cache_path(p['id'], say(p), args.tempo, args.emotion), 'wb') as f:
            f.write(data)
        print(f'  [{n}/{len(todo)}] {p["id"]} {len(say(p))}자')

    timing, src = {}, open(os.path.join(DECK, 'data.js'), encoding='utf-8').read()
    for part in deck['parts']:
        files = [cache_path(p['id'], say(p), args.tempo, args.emotion) for p in part['paras']]
        rate, pcm, t, dur = assemble(part, files)
        write_m4a(rate, pcm, os.path.join(DECK, 'audio', f'{part["id"]}.m4a'))
        timing.update(t)
        timing[part['id']] = dur
        src = re.sub(r'("id": "%s", "title": "[^"]*", "audio": ")[^"]*(", "dur": )[\d.]+' % part['id'],
                     lambda m: f'{m.group(1)}audio/{part["id"]}.m4a{m.group(2)}{dur}', src)
        print(f'{part["id"]} {part["title"]} · {dur:.1f}초')

    lines = [f'  "{k}": {json.dumps(v)}' for k, v in timing.items()]
    with open(os.path.join(DECK, 'timing.js'), 'w', encoding='utf-8') as f:
        f.write('// 문단 타이밍 [화면 전환, 말 시작, 말 끝] (초). 파트 id 는 음성 길이.\n'
                '// tools/tts.py 가 문단별 음성을 이어 붙이며 쓴다. 없는 문단은 글자 수 비율로 추정한다.\n'
                'window.TIMING = {\n' + ',\n'.join(lines) + '\n};\n')
    with open(os.path.join(DECK, 'data.js'), 'w', encoding='utf-8') as f:
        f.write(src)
    total = sum(v for k, v in timing.items() if len(k) == 2)
    print(f'전체 {int(total // 60)}분 {round(total % 60)}초 · deck/audio/*.m4a · timing.js · data.js 음성 경로 갱신')


if __name__ == '__main__':
    main()
