// 02 견본: 자료 장면. 왼쪽 정렬 · 실제 서비스 창(.app) · 상태 바꾸기(data-state) · 문단 끝에서 넘기기(@$). 형식은 scenes/STYLE.md
(window.SCENES ||= {})['02'] = {
  clicks: '02-02@상태가',
  css: String.raw`
[data-part="02"] .chat{position:absolute;left:100px;top:320px;width:900px}
[data-part="02"] .ticket{position:absolute;left:100px;top:320px;width:1000px}
[data-part="02"] .ticket .st-todo,[data-part="02"] .ticket[data-s="done"] .st-done{display:inline-block}
[data-part="02"] .ticket .st-done,[data-part="02"] .ticket[data-s="done"] .st-todo{display:none}
[data-part="02"] .side{position:absolute;left:1200px;top:340px;width:620px}
[data-part="02"] .end{position:absolute;left:100px;top:320px;width:1100px}
`,
  html: String.raw`
<!-- 02-01 자료라서 왼쪽 정렬. 서비스 이름이 나오면 그 로고를 쓴다 -->
<h2 class="title" data-at="02-01" data-until="02-02">실제 서비스는 밝은 창으로</h2>
<div class="app chat" data-at="02-01@실제 서비스는" data-until="02-02">
  <div class="bar"><img class="logo s" src="assets/logos/chat.svg" alt="">#프로젝트-채널</div>
  <div class="body sl">
    <div class="msg"><div class="av">디1</div><div><span class="nm">디자이너 1</span><span class="tm">오전 10:12</span><div class="tx">QA 시트 3행 버그 등록하고 티켓 발행해 주세요.</div></div></div>
  </div>
</div>

<!-- 02-02 상태가 바뀌는 순간을 짚는다. data-state0 → data-state, 강조 상자는 .hl -->
<h2 class="title" data-at="02-02" data-until="02-03">티켓은 진짜 화면처럼</h2>
<div class="app ticket" data-at="02-02" data-until="02-03" data-state0="todo" data-state="02-02@상태가:done">
  <div class="bar"><img class="logo s" src="assets/logos/jira.svg" alt="">PROJ-128</div>
  <div class="body jira">
    <div class="key">PROJ-128</div>
    <h4>[홈] 상단 배너 글자 굵기 확인</h4>
    <dl><dt>상태</dt><dd><span class="lz todo st-todo">해야 할 일</span><span class="lz done st-done hl">완료</span></dd><dt>담당</dt><dd>개발자 1</dd></dl>
  </div>
</div>
<p class="body side" data-at="02-02@순간을" data-until="02-03">누름 한 번에 바뀌는 것 하나</p>

<!-- 02-03 문단 끝(@$)에 둔 전환은 말을 다 마친 뒤 누른다 -->
<h2 class="title" data-at="02-03">문단 끝에서 넘기기</h2>
<div class="card end" data-at="02-03"><p class="body-l">마커 끝에 <span class="mono acc">@$</span></p><p class="body">말을 다 마친 뒤에 누르는 전환</p></div>
<p class="lead abs" style="left:100px;top:700px" data-at="02-03@$">끝.</p>
`
};
