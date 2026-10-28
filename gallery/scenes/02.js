// 02 패턴: 통념 뒤집기. 가운데에서 흔한 생각(.bubble)을 대신 말하고, 왼쪽 목록 · 오른쪽 질문으로 나눠 뒤집는다(강조색 줄 · 같은 자리 교체). 형식은 scenes/STYLE.md
(window.SCENES ||= {})['02'] = {
  clicks: '02-02@이게 전부일까요|02-02@목록에 없던 곳이',
  css: String.raw`
/* 02-01 말풍선(가운데) 아래에 그 버튼. 꼬리는 가운데로 */
[data-part="02"] .say{position:absolute;left:100px;right:100px;top:376px;text-align:center}
[data-part="02"] .say .who{margin:0 0 16px;font-size:26px}
[data-part="02"] .say .bubble{display:inline-block;margin:0;padding:30px 46px;font-size:50px}
[data-part="02"] .say .bubble::after{left:calc(50% - 13px)}
[data-part="02"] .bbar{position:absolute;left:580px;top:610px;width:760px;height:140px;padding:24px;display:flex;gap:20px;border-radius:24px;background:#FFFFFF;font-family:var(--f-ui)}
[data-part="02"] .bbar .ib{width:92px;flex:none;display:grid;place-items:center;border:2px solid #D6D6D6;border-radius:16px}
[data-part="02"] .bbar .ib svg{width:44px;height:44px}
[data-part="02"] .bbar .fb{flex:1;display:grid;place-items:center;border-radius:16px;background:#111111;color:#FFFFFF;font:700 36px/1 var(--f-ui)}

/* 02-02 왼쪽 = 정리한 목록(문서). 나중에 붙을 세 줄 자리를 미리 비워 둬서 창 크기가 변하지 않는다 */
[data-part="02"] .doc{position:absolute;left:100px;top:290px;width:880px}
[data-part="02"] .doc .body{padding:26px 34px 30px}
[data-part="02"] .doc h3{margin:4px 0 18px;font-size:34px}
/* 칸 테두리는 줄마다 따로 그린다(합친 테두리는 아직 안 나온 줄에도 선이 남는다) */
[data-part="02"] .doc table{font-size:25px;border-collapse:separate;border-spacing:0;border-top:1px solid #DFE1E6}
[data-part="02"] .doc th{color:var(--ui-ink-2)}
[data-part="02"] .doc td,[data-part="02"] .doc th{padding:9px 18px;border:0;border-bottom:1px solid #DFE1E6}
[data-part="02"] .doc td:first-child,[data-part="02"] .doc th:first-child{width:70px;text-align:center;color:var(--ui-ink-2);border-right:1px solid #DFE1E6}
[data-part="02"] .doc tr.new td{color:color-mix(in srgb,var(--accent) 82%,#000000);font-weight:700;background:color-mix(in srgb,var(--accent) 9%,#FFFFFF)}
/* 오른쪽 = 질문 → 합계. 두 벌을 한 칸에 겹쳐 두고 data-s 로 바꾼다 */
[data-part="02"] .ask{position:absolute;left:1060px;top:330px;width:760px;display:grid;text-align:center}
[data-part="02"] .ask>div{grid-area:1/1;transition:opacity .3s ease}
[data-part="02"] .ask .disp-xl{font-size:340px;line-height:1}
[data-part="02"] .ask .lead{margin-top:18px}
[data-part="02"] .ask .a,[data-part="02"] .ask[data-s="found"] .q{opacity:0}
[data-part="02"] .ask[data-s="found"] .a{opacity:1;transition:opacity .4s ease .15s}
`,
  html: String.raw`
<!-- 02-01 강조라서 가운데. 이야기할 버튼을 먼저 두고, 모두가 아는 답을 말풍선으로 대신 말한다 -->
<h2 class="title c" data-at="02-01" data-until="02-02">모두가 아는 답</h2>
<div class="bbar" data-at="02-01" data-until="02-02" style="--d:.15s">
  <span class="ib"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="#111" stroke-width="2" stroke-linejoin="round"/></svg></span>
  <span class="fb">구매하기</span>
</div>
<div class="say fx-pop" data-at="02-01@버튼 하나 바꾸면" data-until="02-02">
  <p class="who">흔한 생각</p>
  <p class="bubble">버튼 하나 바꾸면 끝 아닌가요?</p>
</div>
<div class="hlbox" style="left:708px;top:626px;width:616px;height:108px;--d:.3s" data-at="02-01@버튼 하나 바꾸면" data-until="02-02"></div>

<!-- 02-02 자료라서 왼쪽 목록 · 오른쪽 질문. 다섯 줄이 차례로 → 이게 전부일까 → 목록에 없던 세 줄(강조색) → 같은 자리에서 +3 -->
<h2 class="title" data-at="02-02">목록으로 정리한 곳</h2>
<div class="app doc" data-at="02-02">
  <div class="bar"><img class="logo s" src="assets/logos/confluence.svg" alt="">작업 범위</div>
  <div class="body cf">
    <h3>구매 버튼이 들어간 곳</h3>
    <table>
      <tr><th>#</th><th>위치</th></tr>
      <tr class="fx-fade" data-at="02-02" style="--d:.2s"><td>1</td><td>상품 상세</td></tr>
      <tr class="fx-fade" data-at="02-02" style="--d:.32s"><td>2</td><td>장바구니</td></tr>
      <tr class="fx-fade" data-at="02-02" style="--d:.44s"><td>3</td><td>찜 목록</td></tr>
      <tr class="fx-fade" data-at="02-02" style="--d:.56s"><td>4</td><td>검색 결과</td></tr>
      <tr class="fx-fade" data-at="02-02" style="--d:.68s"><td>5</td><td>기획전</td></tr>
      <tr class="new fx-fade" data-at="02-02@목록에 없던 곳이"><td>+</td><td>주문 내역</td></tr>
      <tr class="new fx-fade" data-at="02-02@목록에 없던 곳이" style="--d:.15s"><td>+</td><td>최근 본 상품</td></tr>
      <tr class="new fx-fade" data-at="02-02@목록에 없던 곳이" style="--d:.3s"><td>+</td><td>광고 이메일</td></tr>
    </table>
  </div>
</div>
<div class="ask" data-at="02-02@이게 전부일까요" data-state0="q" data-state="02-02@세 곳 더:found">
  <div class="q"><p class="disp-xl num">?</p><p class="lead">이게 전부일까?</p></div>
  <div class="a"><p class="disp-xl num acc">+3</p><p class="lead">목록에 없던 곳</p></div>
</div>
`
};
