#!/usr/bin/env python3
"""장표 디자인에 쓸 수 있는 디자인 스킬이 이 기기에 있는지 본다. 없는 스킬은 사용자가 고를 때만 받는다(선택).

  python3 <스킬>/scripts/design_skills.py                        # 있는지 · 어디 있는지 · 없으면 출처 · 라이선스 · 부작용
  python3 <스킬>/scripts/design_skills.py fetch frontend-design   # 이번 발표에만 쓰기: 캐시에 받아 SKILL.md 경로를 알려 준다(설치 안 함)
  python3 <스킬>/scripts/design_skills.py install frontend-design # 계속 쓰기: ~/.claude/skills 에 설치(--dest 로 다른 곳)

받을 때는 원본 저장소에서 그 스킬 폴더만 가져온다(git sparse checkout). 라이선스 파일을 같이 둔다.
"""
import argparse
import datetime
import glob
import json
import os
import shutil
import subprocess
import sys
import tempfile

CACHE = os.path.expanduser('~/Library/Caches/johnnie-style-ppt/design-skills')
SKILL_DIRS = [os.path.expanduser('~/.claude/skills'), os.path.expanduser('~/.codex/skills'), os.path.join(os.getcwd(), '.claude', 'skills')]
EMIL = ('emilkowalski/skills', 'MIT')
# 이름: (저장소, 저장소 안 폴더, 라이선스, 역할, 부작용)
REG = {
    'frontend-design': ('anthropics/claude-plugins-official', 'plugins/frontend-design/skills/frontend-design', 'Apache-2.0',
                        '주 · 가벼운 기본값(Anthropic 공식). 시간이 없을 때', '지침 파일만, 없음'),
    'hallmark': ('Nutlope/hallmark', 'skills/hallmark', 'MIT',
                 '주 · 테마 21종 · study(레퍼런스 DNA 추출)', '프로젝트에 .hallmark/ · design.md. impeccable 과 같이 쓰지 않는다'),
    'design-taste-frontend': ('Leonxlnx/taste-skill', 'skills/taste-skill', 'MIT',
                              '주 · 강한 아트 디렉션 · 실제 브라우저 검사(30~45분 + 토큰 수십만)', '공개 이미지 내려받기 · 헤드리스 Chrome · Node 22 이상'),
    'impeccable': ('pbakaus/impeccable', '.claude/skills/impeccable', 'Apache-2.0',
                   '주 · 만든 장표 다듬기(critique · polish · typeset · layout · quieter)', '첫 실행 때 엔진 바이너리 내려받기 · PRODUCT.md · DESIGN.md'),
    'review-animations': (*EMIL[:1], 'skills/review-animations', EMIL[1], '보조 · 전환(모션) 점검', '없음'),
    'animation-vocabulary': (*EMIL[:1], 'skills/animation-vocabulary', EMIL[1], '보조 · 모션 효과의 정확한 이름', '없음'),
    'animate': (*EMIL[:1], 'skills/animate', EMIL[1], '보조 · 새 전환 효과 설계', '코드 수정'),
    'prototype': (*EMIL[:1], 'skills/prototype', EMIL[1], '보조 · 핵심 장면 두세 안 비교', '안별 파일 + 전환기'),
}


def installed(name):
    """Skill 도구나 /이름 으로 부를 수 있게 설치된 곳: 스킬 폴더 · 계정에서 동기화된 스킬 · 설치된 플러그인"""
    for d in SKILL_DIRS:
        p = os.path.join(d, name, 'SKILL.md')
        if os.path.isfile(p):
            return p
    hits = glob.glob(os.path.expanduser('~/.claude/skills/synced') + f'/*/{name}/SKILL.md')
    if hits:
        return hits[0]
    try:   # 플러그인은 설치 기록에 있는 것만. plugins/marketplaces/ 는 설치 전 목록 사본이라 보지 않는다
        plugins = json.load(open(os.path.expanduser('~/.claude/plugins/installed_plugins.json'))).get('plugins', {})
    except (OSError, ValueError):
        plugins = {}
    for entries in plugins.values():
        for e in entries:
            p = os.path.join(e.get('installPath', ''), 'skills', name, 'SKILL.md')
            if os.path.isfile(p):
                return p
    return None


def plugin_hint(name):
    """설치는 안 됐지만 이 기기가 아는 플러그인 목록에 있으면 그 설치 명령"""
    for p in glob.glob(os.path.expanduser('~/.claude/plugins/marketplaces') + f'/*/plugins/*/skills/{name}/SKILL.md'):
        parts = p.split(os.sep)
        i = parts.index('marketplaces')
        return f'/plugin install {parts[i + 3]}@{parts[i + 1]}'
    return None


def unlinked(name):
    """이 기기 스킬 모음(예: 다른 스킬이 링크해 온 폴더)에는 있는데 설치 위치에 연결되지 않은 것"""
    base = os.path.expanduser('~/.claude/skills')
    roots = {os.path.dirname(os.path.realpath(os.path.join(base, n))) for n in (os.listdir(base) if os.path.isdir(base) else [])
             if os.path.islink(os.path.join(base, n))}
    for r in sorted(roots):
        p = os.path.join(r, name, 'SKILL.md')
        if os.path.isfile(p):
            return p
    return None


def cached(name):
    p = os.path.join(CACHE, name, 'SKILL.md')
    return p if os.path.isfile(p) else None


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f'!! 실패: {" ".join(cmd)}\n{r.stderr.strip()[:500]}')
    return r.stdout.strip()


def fetch(name):
    repo, sub, lic = REG[name][:3]
    tmp = tempfile.mkdtemp(prefix='jsp-design-')
    print(f'받는 중: github.com/{repo} 의 {sub} ({lic})', flush=True)
    run(['git', 'clone', '--quiet', '--depth', '1', '--filter=blob:none', '--sparse', f'https://github.com/{repo}.git', tmp])
    run(['git', '-C', tmp, 'sparse-checkout', 'set', sub])
    src = os.path.join(tmp, sub)
    if not os.path.isfile(os.path.join(src, 'SKILL.md')):
        sys.exit(f'!! 저장소 구조가 바뀌었습니다. {repo} 에서 {name} 의 SKILL.md 를 찾아 이 스크립트의 REG 를 고치세요')
    dest = os.path.join(CACHE, name)
    shutil.rmtree(dest, ignore_errors=True)
    shutil.copytree(src, dest, ignore=shutil.ignore_patterns('.git'))
    if not glob.glob(os.path.join(dest, 'LICENSE*')):   # 라이선스가 위 폴더에 있으면 같이 둔다
        d = sub
        while d:
            d = os.path.dirname(d)
            found = glob.glob(os.path.join(tmp, d, 'LICENSE*'))
            if found:
                shutil.copy2(found[0], os.path.join(dest, 'LICENSE.txt'))
                break
    commit = run(['git', '-C', tmp, 'rev-parse', '--short', 'HEAD'])
    with open(os.path.join(dest, 'SOURCE.txt'), 'w', encoding='utf-8') as f:
        f.write(f'https://github.com/{repo}/tree/{commit}/{sub}\n라이선스 {lic} · 받은 날 {datetime.date.today()} · johnnie-style-ppt design_skills.py\n')
    shutil.rmtree(tmp, ignore_errors=True)
    print(f'받았습니다(설치 안 함): {os.path.join(dest, "SKILL.md")}')
    return dest


def main():
    ap = argparse.ArgumentParser(description='디자인 스킬 확인 · 받기 · 설치')
    ap.add_argument('cmd', nargs='?', default='check', choices=['check', 'fetch', 'install'])
    ap.add_argument('name', nargs='?')
    ap.add_argument('--dest', default=os.path.expanduser('~/.claude/skills'), help='install 위치(Codex 는 ~/.codex/skills)')
    a = ap.parse_args()

    if a.cmd == 'check':
        print('장표 디자인 스킬 (모두 선택. 없어도 기본 안으로 만든다)')
        for name, (repo, _, lic, role, side) in REG.items():
            p, u, c = installed(name), unlinked(name), cached(name)
            if p:
                state = f'있음 {p}'
            elif u:
                state = f'있음(연결 안 됨) {u}'
            elif c:
                state = f'받아 둠(설치 안 함) {c}'
            else:
                hint = plugin_hint(name)
                state = f'없음 · 받을 곳 github.com/{repo} · {lic} · 부작용: {side}' + (f' · 플러그인으로도 설치: {hint}' if hint else '')
            print(f'  {name:22} {role}\n  {"":22} → {state}')
        mgr = installed('design-skill-manager') or unlinked('design-skill-manager')
        print(f'  design-skill-manager   {"있음 " + mgr + " (추천 · 승인 · 시간 기록은 이 흐름을 따른다)" if mgr else "없음 (없어도 된다)"}')
        return
    if a.name not in REG:
        sys.exit(f'모르는 이름입니다: {a.name}. 고를 수 있는 것: {", ".join(REG)}')
    if a.cmd == 'fetch':
        fetch(a.name)
        return
    target = os.path.join(os.path.expanduser(a.dest), a.name)
    if os.path.exists(target):
        sys.exit(f'이미 있습니다: {target}')
    src = os.path.dirname(cached(a.name) or os.path.join(fetch(a.name), 'SKILL.md'))
    os.makedirs(os.path.dirname(target), exist_ok=True)
    shutil.copytree(src, target)
    print(f'설치했습니다: {target}\n  새 세션부터 /{a.name} 으로도 부를 수 있다. 지금 세션에서는 SKILL.md 를 직접 읽어 따른다')


if __name__ == '__main__':
    main()
