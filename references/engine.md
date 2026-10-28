# 장표 엔진

`new_deck.py` 가 만든 발표 폴더 하나가 장표 전부다. 엔진 · 도구 · 대본 · 음성이 다 들어 있어서 폴더를 통째로 옮기면 어디서든 열린다.

## 목차

- 폴더 · data.js 형식 · 모드 · 발표자 화면 · 대본 고치기 · 단축키 · 모양 바꾸는 곳 · 파트 더하기 · 엔진 설정 · 도구

## 폴더

| 경로 | 역할 |
| --- | --- |
| `deck/index.html` | 엔진. 1920×1080 무대를 창에 맞춰 줄인다. 진행 바(파트 길이 = 대본 길이 비율) · 아래 챕터명과 고정 제목 · 공통 부품 · 발표자 화면 · 두 창 싱크 |
| `deck/data.js` | **대본 = 정본.** meta(제목 · 강조색 · 음성 이름) + 파트 → 문단. 문단마다 `text`(화면 · 발표자 대본) · `tts`(음성용 한글 표기) |
| `deck/timing.js` | 문단별 `[화면 전환, 말 시작, 말 끝]` 초. `tools/tts.py` 가 쓴다. 비어 있으면 글자 수로 추정한다 |
| `deck/scenes/NN.js` | 파트 하나 = 파일 하나 `{ clicks, css, html }`. 규칙은 `deck/scenes/STYLE.md` |
| `deck/assets/` · `deck/refs/` · `deck/audio/` | 장면 이미지(자른 것) · 받은 원본 화면 · 파트 음성(m4a) |
| `tools/` | `apply_edits.py` · `tts.py` · `shoot.mjs` · `collect_files.py` · `build_single.py` · `check_single.mjs` |
| `audio/paras/` | 문단 음성 캐시(고친 문단만 다시 만든다) |
| `dist/` · `.apply-backup/` | 공유용 한 파일 · 대본 반영 전 백업 |

## data.js 형식

```js
window.DECK = {
"meta": {"id": "team-share-1103", "title": "발표 제목", "subtitle": "부제", "eyebrow": "행사 · 날짜", "footer": "아래 고정 제목", "accent": "#FF4800", "fonts": "Pretendard", "voice": "필재", "defaultMode": "live"},
"version": "대본 v2 (출처 · 날짜)",
"parts": [
{"id": "01", "title": "오프닝", "audio": "", "dur": 0,
 "context": "이 파트가 하는 일 한 줄",
 "paras": [
  {"id": "01-01", "text": "10월 9일, 우리 앱의 AI 추천이 바뀌었습니다.", "tts": "시월 구일, 우리 앱의 에이아이 추천이 바뀌었습니다."}
 ]}
]
};
```

- **줄 모양을 바꾸지 않는다.** `tts.py` 는 파트 줄(`"id" · "title" · "audio" · "dur"` 순서)을, `apply_edits.py` 는 문단 줄(`{"id": …, "text": …`)을 줄 단위로 고친다
- JSON 이어야 한다(끝 쉼표 없음). 문단 id 는 `파트-번호`(01-01). 마커가 이 id 와 `text` 의 구절을 쓴다
- `meta.id` 는 장표마다 다르게. 브라우저 저장(대본 고치기 · 모드)과 두 창 싱크 채널 이름이 된다
- `meta.defaultMode`: `live`(장표만 보기) · `rehearse`(프레젠테이션). 공유본은 `rehearse` 로 굽는다(`build_single.py --mode rehearse`)
- `meta.voice_id` 를 넣으면 `tts.py` 가 그 목소리를 쓴다(없으면 필재)

## 모드

| 모드 | 무엇 | 넘기기 |
| --- | --- | --- |
| 장표만 보기 (`live`) | 사람이 말하며 누른다. **기본값** | 누를 때마다 다음 전환 하나(문단 시작 · 마커). 시계가 흐르지 않아 말과 어긋나지 않는다. 0.3초 안에 몰린 전환은 한 번으로, 문단 시작에 바뀌는 게 없으면 그 문단 첫 전환과 합친다 |
| 프레젠테이션 (`rehearse`) | 음성이 시간을 끌고 간다. 리허설 · 공유용 | 자동. 누를 곳마다 오른쪽 아래에 ▶ 가 깜빡인다. 음성이 하나도 없으면 이 모드는 숨는다 |

주소로 고르기: `index.html?mode=live` · `?mode=rehearse` · `#p03`(03 파트부터).

## 발표자 화면

1. 서체가 깔린 맥의 Chrome 으로 `deck/index.html#presenter` 를 연다
2. `발표 화면 열기` → 새 창을 프로젝터로 옮기고 그 창에서 `F`(전체 화면). 디스플레이는 **확장**(미러링이면 대본이 청중에게 보인다)
3. → · Space · 클리커는 어느 창에서 눌러도 두 화면이 같이 넘어간다(BroadcastChannel + postMessage, `file://` 에서도 된다)

- 위: 청중 화면 미리보기 · 조작 · 파트 · 문단 바로 가기 · 경과 시간 · 연결 상태
- 아래: 지금 문단 대본(▶ = 누를 곳, 다음에 누를 ▶ 는 주황 상자) · 다음 문단 두 줄
- 역할은 열 때 주소로 정해진다. 테스트에서 바꾸려면 `about:blank` 를 거쳐 다시 연다
- 자막(`S`)은 저장하지 않고, 발표자 창과 이어진 청중 화면에서는 켜지지 않는다(리허설 때 켠 자막이 청중에게 뜬 사고 뒤)

## 대본 고치기 (리허설하며 대본 · 넘김 기점 고치기)

1. 발표자 화면 `대본 고치기` → 대본 칸에서 바로 타이핑. ▶ 는 끌어서 옮긴다(같은 문단, 앞뒤 ▶ 사이에서만 · 누르는 순서는 그대로). `Esc` 로 끝
2. 고친 글은 그 브라우저에 문단별로 자동 저장되고 발표자 대본에만 쓰인다. `이 문단 원래대로` 로 되돌린다
3. `수정 내용 복사` → 사용자가 알려 주면 `pbpaste | python3 tools/apply_edits.py --dry-run` 으로 바뀔 것을 보여 준다
4. 이상 없으면 `--dry-run` 없이 반영한다. data.js `text` 가 바뀌고, 장면 마커는 새 자리의 가장 짧은 고유 구절로(문단 끝이면 `@$`) 바뀐다. 이전 파일은 `.apply-backup/` 에
5. 바뀐 문단의 `tts`(음성용 한글 표기)를 새 글에 맞춰 고치고 `python3 tools/tts.py --only <문단들> --go`
6. 원본에 반영된 수정은 다음에 장표를 열 때 브라우저에서 지워진다

- 저장은 **같은 브라우저 · 같은 주소**에서만 보인다. `file://` 로 연 것과 `http://127.0.0.1:8765` 로 연 것은 다른 저장소다
- 반영 결과의 `주의 …0.3초 안` 은 고친 뒤 두 ▶ 가 한 번 누름으로 합쳐진다는 뜻이다. 구절을 떨어뜨리거나 그대로 둘지 사용자에게 묻는다

## 단축키

| 키 | 장표만 보기 | 프레젠테이션 |
| --- | --- | --- |
| → · PgDn · Space | 다음 전환(클리커 다음) | → 다음 문단 · Space 재생/멈춤 |
| ← · PgUp | 누르기 직전 화면 | 이전 문단 |
| Shift + ←→ | 이전 · 다음 파트 | 같음 |
| 1 ~ 9 | 파트로 바로 가기 | 같음 |
| M · S · A · F · H | 모드 바꾸기 · 자막 · 다음 파트 자동 이어 재생 · 전체 화면 · 도움말 | 같음 |

## 모양 바꾸는 곳 (디자인 단계)

- `index.html` 맨 위 **서체** 블록: `Ed`(주 서체) · `Pre`(보조 서체) 두 자리. `local()` 에 PostScript 이름과 전체 이름을 둘 다 적는다(`build_single.py --list-fonts <검색어>` 로 찾는다). 공유본은 이 이름으로 서체 파일을 찾아 넣는다. 같은 서체도 기기마다 설치 이름이 다를 수 있다(한 기기는 `Brand-Sans-*`, 다른 기기는 `2026-Brand-Sans-*`). `meta.fonts` 는 시작 화면 서체 확인 문구에 쓰는 이름
- `:root` **테마**: 바탕 · 글자 단계 · 선 · 강조색 · 강조 상자색 · 서비스 창 색. 강조색은 `meta.accent` 로도 덮어쓴다
- `scenes/STYLE.md` 의 **디자인 방향** 칸
- 엔진 JS(마커 · 멈춤 계산 · 두 창 싱크 · 대본 고치기)는 디자인 때문에 고치지 않는다

## 파트 더하기 · 빼기

data.js 에 파트를 더하고, `scenes/NN.js` 를 만들고, `index.html` 의 장면 `<script src="scenes/NN.js">` 줄을 더한다.
줄이 빠지면 시작 화면에 `장면 파일 없음` 경고가 뜬다. 견본 파트(01 · 02)는 실제 대본을 넣을 때 지운다.

## 엔진 설정 (index.html)

- `STEP_EVERY = true`: 장표만 보기에서 모든 전환을 직접 누른다. `false` 면 문단 시작 + `clicks` 구절에서만 멈추고 그 사이는 `LIVE_RATE`(0.85배)로 저절로 흐른다. 저절로 흐르는 잔동작은 사람이 말하는 속도와 안 맞았다
- `MERGE = 0.3`: 이 초 안에 몰린 전환은 한 번 누름으로 합친다

## 도구

| 명령 | 하는 일 |
| --- | --- |
| `python3 <스킬>/scripts/new_deck.py <폴더> --title "제목"` | 새 발표 폴더 |
| `python3 <스킬>/scripts/new_deck.py <폴더> --gallery` | 장면 패턴 견본 장표(`gallery/` 의 대본 · 장면으로). 패턴 설명은 `references/patterns.md` |
| `python3 tools/tts.py` → `--go` · `--only 02-04 --go` | 음성 계획(새로 만들 문단 · 크레딧 · 남은 크레딧) → 생성 · 파트 음성 · timing.js · data.js 음성 경로 |
| `pbpaste \| python3 tools/apply_edits.py --dry-run` | 발표자 화면에서 고친 대본 · ▶ 를 원본에 |
| `node tools/shoot.mjs --part NN --port 9371 --out <폴더>` | 누를 때마다 화면 + 9장 모음 + 콘솔 경고 · 오류. `--keys` 핵심 화면만, `--scale 1` 원본 크기 |
| `node tools/shoot.mjs --presenter 1470x956 --port 9371 --out <폴더>` | 발표자 화면에서 대본 칸이 넘치는 문단 |
| `python3 tools/collect_files.py` | 장표가 실제로 쓰는 파일 · 크기(`--json` 은 Artifact files 맵) |
| `python3 tools/build_single.py [--kbps 64] [--mode rehearse]` | 공유용 한 파일 HTML(`dist/`). 서체를 반드시 넣고, 못 찾으면 만들지 않는다. `--list-fonts <검색어>` 는 이 기기에 설치된 서체 이름 |
| `node tools/check_single.mjs dist/<제목>.html <폴더>` | 한 파일을 샌드박스 iframe 에 띄워 서체 · 이미지 · 음성 · 콘솔 확인 후 끝까지 눌러 찍기 + 서체 내장 검사(실패면 종료 코드 1) |

요구: macOS(`afconvert` · 키체인) · Python 3.9 이상 · Node 22 이상(내장 WebSocket) · Google Chrome. 공유본 도구는 처음 실행 때 `~/Library/Caches/johnnie-style-ppt/venv` 에 fontTools · brotli · Pillow 를 받는다(인터넷 필요).
