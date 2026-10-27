#!/usr/bin/env python3
"""공유용 한 파일 장표: 장면 · 대본 · 이미지 · 음성 · 서체를 HTML 하나에 넣는다. 서체는 반드시 넣는다(공유본 스펙).
옆 파일을 못 읽는 곳(HTML 공유 서비스 · 클라우드 드라이브 · 메일 첨부 · Artifact 한 페이지)에 올릴 때 쓴다.

  python3 tools/build_single.py                          # → dist/<제목>.html
  python3 tools/build_single.py --mode rehearse          # 열자마자 '프레젠테이션'(음성 자동 재생) 모드로
  python3 tools/build_single.py --kbps 64                # 음성을 64kbps AAC 로 다시 인코딩(크기 줄이기, 길이는 그대로)
  python3 tools/build_single.py --out ~/Desktop/공유.html
  python3 tools/build_single.py --list-fonts pretendard  # 이 맥에 설치된 서체 이름 찾기(index.html local() 에 쓸 이름)

- 서체: index.html @font-face 의 local() 이름으로 이 맥에 설치된 서체 파일을 찾아, 장표에 쓴 글자만 남긴 woff2 를 넣는다
  (한국어 서체 한 굵기 50~60KB). 하나라도 못 찾으면 공유본을 만들지 않는다. 보는 기기에 서체가 없어도 같은 모양이어야 하기 때문이다.
- 도구: fontTools · brotli · Pillow 가 필요하다. 없으면 처음 한 번 ~/Library/Caches/johnnie-style-ppt/venv 에 받아 그걸로 다시 실행한다
  (인터넷 필요, 1분 안팎). 받지 못하면 공유본을 만들지 않는다.
- 이미지: PNG · WebP 무손실 · WebP 90 중 가장 작은 것으로 넣는다.
- 크기: Artifact 한 페이지는 16MB 까지, 공유 서비스는 곳마다 다르다(10MB 인 곳이 있었다). 넘으면 --kbps 64 로 음성부터 줄인다.
"""
import argparse
import base64
import glob
import html
import io
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DECK = os.path.join(ROOT, 'deck')
CACHE = os.path.expanduser('~/Library/Caches/johnnie-style-ppt')
VENV = os.path.join(CACHE, 'venv')
FONT_DIRS = [os.path.expanduser('~/Library/Fonts'), '/Library/Fonts', '/System/Library/Fonts', '/System/Library/Fonts/Supplemental']
MIME = {'.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
        '.woff2': 'font/woff2', '.woff': 'font/woff', '.otf': 'font/otf', '.ttf': 'font/ttf'}


def ensure_tools():
    """fontTools · brotli · Pillow 가 없으면 캐시 venv 를 만들어(처음 한 번) 그 python 으로 다시 실행한다."""
    try:
        import brotli  # noqa: F401  woff2 압축
        import fontTools  # noqa: F401
        import PIL  # noqa: F401
        return
    except ImportError:
        pass
    if os.environ.get('JSP_BUILD_VENV'):
        sys.exit(f'!! 준비한 환경에서도 서체 도구를 불러오지 못했습니다. 이 폴더를 지우고 다시 실행하세요: {VENV}')
    vpy = os.path.join(VENV, 'bin', 'python3')
    ok = os.path.exists(vpy) and subprocess.run([vpy, '-I', '-c', 'import fontTools, brotli, PIL'], capture_output=True).returncode == 0
    if not ok:
        print(f'서체를 넣는 도구(fontTools · brotli · Pillow)를 준비합니다. 처음 한 번만, 1분 안팎 → {VENV}', flush=True)
        os.makedirs(CACHE, exist_ok=True)
        if not os.path.exists(vpy):
            subprocess.run([sys.executable, '-m', 'venv', VENV], check=True)
        r = subprocess.run([vpy, '-m', 'pip', 'install', '-q', '--disable-pip-version-check', 'fonttools', 'brotli', 'pillow'])
        if r.returncode:
            sys.exit('!! 서체 도구를 받지 못했습니다(인터넷 연결을 확인하세요). 공유본은 서체 없이 만들지 않습니다.')
    os.environ['JSP_BUILD_VENV'] = '1'
    os.execv(vpy, [vpy, '-I', os.path.abspath(__file__), *sys.argv[1:]])


def data_uri(mime, raw):
    return f'data:{mime};base64,' + base64.b64encode(raw).decode()


def media(path):
    from PIL import Image
    raw = open(path, 'rb').read()
    ext = os.path.splitext(path)[1].lower()
    if ext not in ('.png', '.jpg', '.jpeg', '.webp'):
        return MIME.get(ext, 'application/octet-stream'), raw
    im = Image.open(path)
    im.load()
    alpha = im.mode in ('RGBA', 'LA', 'PA') or 'transparency' in im.info
    im = im.convert('RGBA' if alpha else 'RGB')
    best = (MIME[ext], raw)
    for kw in (dict(lossless=True, method=6), dict(quality=90, method=6)):
        b = io.BytesIO()
        im.save(b, 'WEBP', **kw)
        if b.tell() < len(best[1]):
            best = ('image/webp', b.getvalue())
    return best


def font_index():
    """설치된 서체의 PostScript 이름 · 전체 이름 → (파일, 모음 파일 안 번호)"""
    from fontTools.ttLib import TTCollection, TTFont
    idx = {}
    for d in FONT_DIRS:
        for path in sorted(glob.glob(os.path.join(d, '*'))):
            ext = os.path.splitext(path)[1].lower()
            if ext not in ('.otf', '.ttf', '.ttc', '.otc'):
                continue
            try:
                fonts = TTCollection(path, lazy=True).fonts if ext in ('.ttc', '.otc') else [TTFont(path, lazy=True)]
            except Exception:
                continue
            for n, f in enumerate(fonts):
                try:
                    for rec in f['name'].names:
                        if rec.nameID in (4, 6):
                            idx.setdefault(rec.toUnicode(), (path, n))
                except Exception:
                    pass
    return idx


def main():
    ap = argparse.ArgumentParser(description='공유용 한 파일 장표(서체 포함)')
    ap.add_argument('--out', default='')
    ap.add_argument('--kbps', type=int, default=0, help='음성을 이 비트레이트 AAC 로 다시 인코딩')
    ap.add_argument('--mode', choices=['live', 'rehearse'], default='', help='열었을 때 모드(rehearse = 프레젠테이션)')
    ap.add_argument('--list-fonts', metavar='검색어', help='이 맥에 설치된 서체 이름을 찾는다')
    a = ap.parse_args()
    ensure_tools()
    from fontTools import subset

    if a.list_fonts is not None:
        q = a.list_fonts.lower()
        hits = sorted((name, p) for name, p in font_index().items() if q in name.lower())
        for name, (path, n) in hits:
            print(f'{name}\t{os.path.basename(path)}{f" #{n}" if n else ""}')
        print(f'{len(hits)}개' if hits else '없음')
        return

    deck_src = open(os.path.join(DECK, 'data.js'), encoding='utf-8').read()
    meta = json.loads(deck_src[deck_src.index('{'):deck_src.rindex('}') + 1]).get('meta', {})
    out = os.path.expanduser(a.out) if a.out else os.path.join(ROOT, 'dist', re.sub(r'[\\/:*?"<>|]+', ' ', meta.get('title', 'deck')).strip() + '.html')
    tmp = tempfile.mkdtemp()

    # 장표가 쓰는 파일 → data URI
    files = json.loads(subprocess.check_output([sys.executable, '-I', os.path.join(ROOT, 'tools', 'collect_files.py'), '--json']))
    uris, sizes = {}, {'image': [0, 0], 'audio': [0, 0]}
    for pub, src in files.items():
        path = os.path.join(ROOT, src)
        if pub.endswith('.js'):
            continue
        if pub.endswith(('.m4a', '.mp4', '.mp3')):
            enc = path
            if a.kbps:
                enc = os.path.join(tmp, os.path.basename(pub) + '.m4a')
                subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', '-b', str(a.kbps * 1000), '-q', '127', path, enc], check=True)
            mime, raw, kind = ('audio/mpeg' if pub.endswith('.mp3') and not a.kbps else 'audio/mp4'), open(enc, 'rb').read(), 'audio'
        else:
            (mime, raw), kind = media(path), 'image'
        sizes[kind][0] += os.path.getsize(path)
        sizes[kind][1] += len(raw)
        uris[pub] = data_uri(mime, raw)

    pat = re.compile(r'(?<![\w./-])(' + '|'.join(re.escape(p) for p in sorted(uris, key=len, reverse=True)) + r')(?![\w./-])') if uris else None

    def embed(s):
        return pat.sub(lambda m: uris[m[1]], s) if pat else s

    page = open(os.path.join(DECK, 'index.html'), encoding='utf-8').read()
    js_text = ''.join(open(os.path.join(DECK, p), encoding='utf-8').read() for p in files if p.endswith('.js'))

    def inline(m):
        js = open(os.path.join(DECK, m[1]), encoding='utf-8').read()
        if '</script' in js.lower():
            sys.exit(f'{m[1]} 안에 </script 가 있어 한 파일로 넣을 수 없습니다')
        if m[1] == 'data.js' and a.mode:
            js, n = re.subn(r'"defaultMode":\s*"\w+"', f'"defaultMode": "{a.mode}"', js)
            if not n:
                print('!! data.js meta 에 defaultMode 가 없어 --mode 를 적용하지 못했습니다')
        return '<script>\n' + embed(js) + '\n</script>'

    page, n_js = re.subn(r'<script src="([^"]+)"></script>', inline, page)
    page = embed(page)
    left = re.findall(r'(?:assets|refs|img|audio|fonts)/[^"\'\s)]+\.(?:png|svg|jpe?g|webp|gif|m4a|mp4|mp3|woff2?|otf|ttf)', page)
    if left:
        sys.exit(f'한 파일에 못 넣은 경로가 남았습니다: {sorted(set(left))[:5]}')

    # 서체: @font-face 의 local() 이름으로 설치된 파일을 찾아, 장표에 쓴 글자만 남긴 woff2 를 local() 뒤에 붙인다
    rules = re.findall(r'@font-face\s*\{[^}]*\}', page)
    if not rules:
        sys.exit('!! index.html 에 서체 블록(@font-face)이 없습니다. 공유본은 서체를 넣어야 합니다')
    text = page + js_text
    chars = set(text) | set(html.unescape(text)) | {chr(c) for c in range(0x20, 0x7F)}
    chars |= {chr(int(h, 16)) for h in re.findall(r'\\u([0-9a-fA-F]{4})', text)}
    chars |= {chr(int(h, 16)) for h in re.findall(r'\\([0-9a-fA-F]{4,6})(?![0-9a-fA-F])', text) if int(h, 16) <= 0x10FFFF}
    chars = ''.join(sorted(c for c in chars if c >= ' '))
    idx, made, missing, font_bytes = font_index(), {}, [], 0
    for rule in rules:
        if 'url(data:' in rule:   # 서체 파일을 이미 붙인 규칙(fonts/… 를 위에서 data URI 로 바꿨다)
            continue
        names = re.findall(r'local\(\s*["\']([^"\']+)["\']\s*\)', rule)
        hit = next((idx[x] for x in names if x in idx), None)
        if not hit:
            fam = re.search(r'font-family:\s*["\']?([^;"\']+)', rule)
            wt = re.search(r'font-weight:\s*([^;}]+)', rule)
            missing.append(f'{fam[1] if fam else "?"} {wt[1].strip() if wt else ""}: {" · ".join(names) or "local() 없음"}')
            continue
        if hit not in made:
            opts = subset.Options()
            opts.flavor = 'woff2'
            opts.layout_features = ['*']
            if hit[0].lower().endswith(('.ttc', '.otc')):
                opts.font_number = hit[1]   # 모음 파일 안의 몇 번째 서체인지
            font = subset.load_font(hit[0], opts)
            sub = subset.Subsetter(opts)
            sub.populate(text=chars)
            sub.subset(font)
            b = io.BytesIO()
            subset.save_font(font, b, opts)
            made[hit] = f'url({data_uri("font/woff2", b.getvalue())}) format("woff2")'
            font_bytes += b.tell()
        page = page.replace(rule, re.sub(r'(src:[^;}]*?)(;?\s*\})$', lambda m: f'{m[1]},{made[hit]}{m[2]}', rule), 1)
    if missing:
        sys.exit('!! 공유본에 넣을 서체를 이 맥에서 찾지 못해 만들지 않았습니다:\n' + '\n'.join('   ' + x for x in missing) +
                 '\n   서체를 설치하거나(파일 더블클릭 → 설치), 이 맥에 설치된 이름을 index.html 서체 블록 local() 에 더하세요.'
                 '\n   이름 찾기: python3 tools/build_single.py --list-fonts <검색어>')

    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf-8').write(page)
    mb = lambda b: f'{b / 1048576:.1f}MB'
    size = os.path.getsize(out)
    print(f'스크립트 {n_js}개 · 이미지 {mb(sizes["image"][0])} → {mb(sizes["image"][1])} · 음성 {mb(sizes["audio"][0])} → {mb(sizes["audio"][1])} · '
          f'서체 {len(made)}개 {mb(font_bytes)}(규칙 {len(rules)}개 · 글자 {len(chars)}개) · 결과 {mb(size)}')
    print(out)
    if size > 16 * 1048576:
        print('!! 16MB 넘음: Artifact 한 페이지에 안 들어간다. --kbps 64 로 음성부터 줄인다')
    elif size > 10 * 1048576:
        print('!! 10MB 넘음: 10MB 제한이 있는 공유 서비스에는 안 올라간다. --kbps 64 로 음성부터 줄인다')


if __name__ == '__main__':
    main()
