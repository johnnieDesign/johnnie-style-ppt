# 장면 만들기 가이드

이 발표의 장면을 만드는 사람(메인 에이전트 · 병렬 에이전트)이 모두 이 파일 하나를 보고 같은 손맛으로 만든다.
**디자인 방향** 칸은 디자인 단계에서 채운다. 나머지는 엔진 규칙이라 그대로 둔다.

## 디자인 방향 (디자인 단계에서 채운다)

- 쓴 디자인 스킬: (예: frontend-design · 빠른 안)
- 바탕 · 서체 · 강조색: (예: 검정 · Pretendard · #FF4800 하나)
- 견본 장면: (먼저 만든 3장면의 문단 번호. 예: 01-02 · 03-01 · 03-06) 이 셋과 같은 손맛으로 만든다
- 참고한 초안: (Figma 링크 · 레퍼런스. 초안은 전체 장표가 아니라 맥락이다. 요소와 규칙만 뽑는다)

## 파일과 소유

- 장면은 `scenes/NN.js` 하나에 파트 하나. **자기 파트 파일만 고친다.** index.html · data.js · timing.js · 다른 파트는 건드리지 않는다.
- 이 파트에만 필요한 CSS 는 파일의 `css` 에, 모든 선택자를 `[data-part="NN"]` 로 시작한다.
- 새 이미지는 `assets/NN/` 에 둔다(자르거나 줄인 것). 받은 원본(`refs/`)은 고치지 않는다.

```js
(window.SCENES ||= {})['02'] = {
  clicks: '02-02@그게 전부인지',          // 문단 안에서 한 번 더 누를 반전 구절(| 로 구분). 파트당 1~3개
  css: String.raw`[data-part="02"] .x{...}`,
  html: String.raw`<h2 class="title" data-at="02-01" data-until="02-02">...</h2> ...`
};
```

## 마커

- `data-at="02-04"`(문단 시작) · `data-at="02-04@구절"`(그 구절에서) · `data-at="02-04@$"`(문단 끝, 말을 다 마친 뒤) · `data-until="02-05"`(거기서 사라짐)
- **구절은 data.js 의 그 문단 `text` 에 글자 그대로 있어야 한다.** 따옴표로 시작하는 구절은 쓰지 않는다(장면 문자열이 깨진다)
- `data-state0="a" data-state="02-04@구절:b|02-05:c"` 는 `data-s` 를 바꾼다. `data-seq="02-04@구절:24"` 숫자 세기(`data-from`), `data-type="02-04@구절"` 타자
- 늦게 등장시킬 땐 `style="--d:.2s"`. 효과는 엔진의 `fx-fade` · `fx-pop` · `fx-wipe` · `fx-draw` 만 쓴다. 장면마다 다른 모션을 만들지 않는다
- **누를 때마다 화면에 무언가 바뀌어야 한다.** 장표만 보기 모드는 모든 전환(문단 시작 · 마커)에서 한 번씩 누른다. 바뀌는 게 없으면 헛누름이다
- 0.3초 안에 몰린 전환은 한 번 누름으로 합쳐진다. 따로 누르고 싶으면 구절을 떨어뜨린다

## 배치

- 무대 1920×1080, 좌우 여백 100. 위 진행 바(y ≤ 110) · 아래 푸터(y ≥ 990)는 엔진이 그린다. 내용은 **y 150 ~ 960** 안에
- **강조는 가운데 정렬**: `<h2 class="title c">`(y 257) + 가운데 내용. 한 문장 선언, 큰 숫자, 대비
- **자료 · 설명은 왼쪽 정렬**: `<h2 class="title">`(100, 190) + 내용은 x 100~200, y 320~
- 위치는 `class="abs" style="left:..px;top:..px"`. 마커 달린 요소를 `transform:translateX(-50%)` 로 가운데 맞추지 않는다(엔진이 등장 · 퇴장에 transform 을 쓴다). 고정 폭 상자 + `text-align:center` 로

## 쓸 수 있는 것 (index.html)

- 글자: `.title` `.title.c` · `.disp`(120) · `.disp-xl`(400) · `.lead`(64) · `.body-l`(50) · `.body`(36) · `.label`(30/800) · `.cap`(24) · `.num` · `.mono` · `.acc`(강조색) · `.dim` · `.faint` · `.strike` · `.center`
- 물건: `.card` · `.hl`(빨강 3px 강조 테두리) · `.hlbox`(자리 지정 강조 상자) · `.chip` `.chip.acc` · `.bubble` + `.who`(사람 말) · `.wires`(svg 선, `marker-end="url(#ah-ink)"`/`#ah-acc`, `path.fx-draw` 로 그려지듯) · `.cells`(`data-cells="99" data-hl-first="28"` 또는 `data-hl-spread="30"`)
- **실제 서비스 화면 = 밝은 창 `.app`**: `<div class="app"><div class="bar"><img class="logo s" src="assets/logos/jira.svg">PROJ-128</div><div class="body jira">…</div></div>`
  - 주소창: `.bar` 안에 `<span class="dots"><i></i><i></i><i></i></span><span class="url">example.com/…</span>`
  - 지라 `.jira`(.key · h4 · dl/dt/dd · `.lz.todo/.doing/.done/.bug`) · 구글 시트 `.gs`(table · th · `tr.hd` · `.st.y/.r/.g/.b/.n`) · 컨플루언스 `.cf`(.crumb · h3 · table) · 슬랙 `.sl`(.chn · .msg · .av · .nm · .tm · .tag · .tx) · 피그마 `.app.fg` · 터미널 `.app.term`(.p · .ok · .dim) · 깃허브 `.gh .row` · 휴대폰 `.phone`
  - 스크린샷은 `<img class="shot" src="refs/…">`. **잘라서 크게** 보여 준다(감싼 상자에 `overflow:hidden`). 글자가 작아 안 읽히면 그 부분만 확대한다
- 로고: `assets/logos/` chat(메신저) · jira · confluence · figma · google-sheets · github · claude (`.logo.s/m/l/xl`). **서비스 이름이 나오면 그 로고를 쓴다.** 새 로고는 출처와 라이선스를 `assets/logos/SOURCE.md` 에 적는다

## 내용

- 티켓 · 시트 · 문서를 이야기할 땐 추상 도형 말고 **아는 서비스처럼** 다시 그린다. 실제 키 · 제목 · 행 · 상태를 쓴다
- **팀원 실명은 화면에 안 나오게**: 디자이너 1 · 2 · 3 처럼 바꾼다
- **지어낸 값(채널 이름 · 시각 · 숫자)을 넣었으면 목록으로 남긴다.** 발표자가 확인하기 전에는 사실처럼 두지 않는다
- 글은 짧고 쉬운 말로, 대본의 단어를 쓴다. 화면 글자는 22px 이상(멀리서 읽혀야 한다). 실제 서비스 창 안의 주소 · 시각 같은 메타는 16px 도 된다
- 장면마다 굵게 갈 곳은 하나. 나머지는 조용히
- 하지 말 것: 제목 위 작은 라벨, 전부 대문자 라벨, 장식용 그라데이션 · 그림자 · 빛, 진짜 순서가 아닌데 01/02/03 번호

## 확인

```bash
node tools/shoot.mjs --part NN --port <배정 포트> --out <임시 폴더>/shots-NN
```

누를 때마다 960×540 화면과 9장 모음(`sheet-K.png`)이 나온다. 모음을 직접 보고 겹침 · 잘림 · 작은 글자 · 빈 화면 · 헛누름을 고친다.
콘솔 경고 · 오류는 0 이어야 한다(특히 `대본에 없는 구절`). 병렬로 만들 때는 사람마다 포트를 나누고, 끝나면 Chrome 이 닫혔는지 본다.
