// 06 패턴: 일의 흐름. 단계 한 줄을 파트 내내 두고 data-state 로 지금 단계만 켜기 · 단계마다 서비스 창을 아래에 붙이기 · 창 안 상태 바꾸기. 형식은 scenes/STYLE.md
(window.SCENES ||= {})['06'] = {
  clicks: '06-01@완료에서 끝납니다|06-02@완료로 바뀝니다',
  css: String.raw`
/* 단계 한 줄. 06-01 은 가운데 높이, 06-02 에서 위로 올라가 창 자리를 비운다 */
[data-part="06"] .flow{position:absolute;left:100px;top:470px;display:flex;align-items:center;transition:transform .6s cubic-bezier(.2,.7,.2,1)}
[data-part="06"] .flow[data-s^="s"]{transform:translateY(-170px)}
[data-part="06"] .cell{display:flex;align-items:center;gap:22px;width:330px;height:112px;padding:0 26px;border:1px solid var(--rule);border-radius:4px;background:var(--sheet);
  outline:3px solid transparent;outline-offset:6px;transition:opacity .4s ease,border-color .4s ease,background-color .4s ease,outline-color .4s ease}
[data-part="06"] .ic{width:64px;height:64px;flex:none;border-radius:14px;background:#FFFFFF;display:grid;place-items:center}
[data-part="06"] .ic .logo,[data-part="06"] .ic svg{width:40px;height:40px}
[data-part="06"] .lb{display:flex;flex-direction:column;gap:6px}
[data-part="06"] .lb b{font:600 36px/1.15 var(--f-ed);color:var(--ink)}
[data-part="06"] .lb em{font:500 22px/1.3 var(--f-ed);font-style:normal;color:var(--ink-2)}
[data-part="06"] .ar{display:block;flex:none;width:110px;height:24px;transition:opacity .4s ease}
[data-part="06"] .ar path{fill:none;stroke:var(--ink-2);stroke-width:3;stroke-linecap:round}

/* 06-01 흐름의 끝을 짚는다 */
[data-part="06"] .flow[data-s="end"] .c4{outline-color:var(--box)}
/* 06-02 지금 단계만 켠다: 지난 단계는 그대로, 지금은 강조색, 아직 안 온 단계는 흐리게 */
[data-part="06"] .flow[data-s^="s"] :is(.cell,.ar){opacity:.35}
[data-part="06"] .flow[data-s="s1"] .c1,
[data-part="06"] .flow[data-s="s2"] :is(.c1,.a1,.c2),
[data-part="06"] .flow[data-s="s3"] :is(.c1,.a1,.c2,.a2,.c3),
[data-part="06"] .flow[data-s="s4"] :is(.cell,.ar){opacity:1}
[data-part="06"] .flow[data-s="s1"] .c1,[data-part="06"] .flow[data-s="s2"] .c2,
[data-part="06"] .flow[data-s="s3"] .c3,[data-part="06"] .flow[data-s="s4"] .c4{border-color:var(--accent);background-color:var(--accent-soft)}

/* 단계 아래 서비스 창. 왼쪽 끝을 단계 칸에 맞춘다(티켓 창은 티켓 · 완료 두 칸에 걸친다) */
[data-part="06"] .w1,[data-part="06"] .w2,[data-part="06"] .w3{position:absolute;top:470px;height:450px}
[data-part="06"] .w1{left:100px;width:400px}
[data-part="06"] .w2{left:540px;width:400px}
[data-part="06"] .w3{left:980px;width:840px}
[data-part="06"] .w1>.body{position:relative;height:394px}
[data-part="06"] .w1 .req{margin:6px -12px 0;padding:12px;border-radius:8px;background:#FFF1EB}
[data-part="06"] .w1 .inp{position:absolute;left:32px;right:32px;bottom:24px;height:48px;border:1px solid #CCCCCC;border-radius:8px;padding:0 16px;
  display:flex;align-items:center;font:400 18px/1 var(--f-ui);color:#8A8A8A}
[data-part="06"] .w2>.body{padding:0}
[data-part="06"] .w2 table{width:100%}
[data-part="06"] .w2 th:first-child{width:40px}
[data-part="06"] .w2 .lnk{color:#1155CC;text-decoration:underline}
[data-part="06"] .w2 tr.nw td{background:#FFF1EB}
[data-part="06"] .w2 .tk{opacity:0;transition:opacity .45s ease}
[data-part="06"] .w2:is([data-s="tk"],[data-s="done"]) .tk{opacity:1}
[data-part="06"] .w3>.body{display:grid;grid-template-columns:1fr 250px;gap:40px}
[data-part="06"] .w3 h4{font-size:32px;margin:12px 0 22px}
[data-part="06"] .w3 .dlb{margin:0 0 10px;font:600 18px/1 var(--f-ui);color:var(--ui-ink-2)}
[data-part="06"] .w3 .dsc{margin:0 0 26px;padding:16px 18px;border-radius:6px;background:var(--ui-bg-2);font:400 21px/1.5 var(--f-ui);color:var(--ui-ink)}
[data-part="06"] .w3 .side dl{grid-template-columns:90px 1fr;margin-top:26px}
[data-part="06"] .w3 .side .lz{font-size:20px;padding:8px 14px}

/* 창 안 상태: 같은 자리에서 .s-a → .s-b 로 겹쳐 바꾼다. 시트 상태가 바뀌는 칸에 빨강 테두리(.hl 과 같은 값) */
[data-part="06"] .sw{display:inline-grid;vertical-align:middle}
[data-part="06"] .sw>*{grid-area:1/1;justify-self:start;transition:opacity .45s ease}
[data-part="06"] .sw .s-b{opacity:0}
[data-part="06"] [data-s="done"] .sw .s-a{opacity:0}
[data-part="06"] [data-s="done"] .sw .s-b{opacity:1}
[data-part="06"] .w2 .nw .sw{border-radius:14px;outline:3px solid transparent;outline-offset:5px;transition:outline-color .4s ease}
[data-part="06"] .w2[data-s="done"] .nw .sw{outline-color:var(--box)}
`,
  html: String.raw`
<!-- 06-01 자료라서 왼쪽 정렬. '한 줄로 놓고'에서 단계 네 칸과 화살표가 왼쪽부터 차례로, '완료에서 끝납니다'에서 끝 칸을 짚는다 -->
<h2 class="title" data-at="06-01" data-until="06-02">요청에서 완료까지, 한 줄로</h2>
<div class="flow" data-state0="" data-state="06-01@완료에서 끝납니다:end|06-02:s0|06-02@메신저의 요청이:s1|06-02@시트의 한 줄이:s2|06-02@그 줄이 티켓이:s3|06-02@완료로 바뀝니다:s4">
  <div data-at="06-01@한 줄로 놓고"><div class="cell c1"><span class="ic"><img class="logo" src="assets/logos/chat.svg" alt=""></span><span class="lb"><b>요청</b><em>메신저</em></span></div></div>
  <svg class="ar a1" viewBox="0 0 110 24" aria-hidden="true"><path class="fx-draw" pathLength="1" d="M16 12 H90" marker-end="url(#ah-ink)" data-at="06-01@한 줄로 놓고" style="--d:.1s"/></svg>
  <div data-at="06-01@한 줄로 놓고" style="--d:.15s"><div class="cell c2"><span class="ic"><img class="logo" src="assets/logos/google-sheets.svg" alt=""></span><span class="lb"><b>정리</b><em>시트</em></span></div></div>
  <svg class="ar a2" viewBox="0 0 110 24" aria-hidden="true"><path class="fx-draw" pathLength="1" d="M16 12 H90" marker-end="url(#ah-ink)" data-at="06-01@한 줄로 놓고" style="--d:.25s"/></svg>
  <div data-at="06-01@한 줄로 놓고" style="--d:.3s"><div class="cell c3"><span class="ic"><img class="logo" src="assets/logos/jira.svg" alt=""></span><span class="lb"><b>티켓</b><em>지라</em></span></div></div>
  <svg class="ar a3" viewBox="0 0 110 24" aria-hidden="true"><path class="fx-draw" pathLength="1" d="M16 12 H90" marker-end="url(#ah-ink)" data-at="06-01@한 줄로 놓고" style="--d:.4s"/></svg>
  <div data-at="06-01@한 줄로 놓고" style="--d:.45s"><div class="cell c4"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#22A06B"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="lb"><b>완료</b><em>시트 · 지라</em></span></div></div>
</div>

<!-- 06-02 줄은 그대로 두고(위로 옮겨 흐리게) 지금 단계만 켠다. 켜질 때마다 그 단계의 창이 아래에 붙는다 -->
<h2 class="title" data-at="06-02">단계마다 실제 화면을 붙인다</h2>
<div class="app w1" data-at="06-02@메신저의 요청이">
  <div class="bar"><img class="logo s" src="assets/logos/chat.svg" alt="">메신저</div>
  <div class="body sl">
    <div class="chn"># 디자인-요청</div>
    <div class="msg"><div class="av">3</div><div><span class="nm">팀원 3</span><span class="tm">오전 9:41</span><div class="tx">오늘 배포 목록 올렸어요.</div></div></div>
    <div class="msg req" data-at="06-02@메신저의 요청이" style="--d:.3s"><div class="av">1</div><div><span class="nm">팀원 1</span><span class="tm">오전 10:12</span><div class="tx">홈 상단 배너 문구 바꿔 주세요.</div></div></div>
    <div class="inp">메시지 보내기</div>
  </div>
</div>
<!-- 시트는 새 줄이 조금 늦게 들어온다. '그 줄이 티켓이'에서 티켓 칸이 채워지고, '완료로 바뀝니다'에서 상태 칩이 완료로(티켓 창도 함께) -->
<div class="app w2" data-at="06-02@시트의 한 줄이" data-state0="new" data-state="06-02@그 줄이 티켓이:tk|06-02@완료로 바뀝니다:done">
  <div class="bar"><img class="logo s" src="assets/logos/google-sheets.svg" alt="">요청 목록</div>
  <div class="body gs">
    <table>
      <tr><th></th><th>A</th><th>B</th><th>C</th></tr>
      <tr class="hd"><th>1</th><td>요청</td><td>티켓</td><td>상태</td></tr>
      <tr><th>2</th><td>버튼 색</td><td class="lnk">PROJ-126</td><td><span class="st g">완료</span></td></tr>
      <tr><th>3</th><td>알림 아이콘</td><td class="lnk">PROJ-127</td><td><span class="st y">진행 중</span></td></tr>
      <tr class="nw fx-fade" data-at="06-02@시트의 한 줄이" style="--d:.35s"><th>4</th><td>홈 배너 문구</td><td class="lnk"><span class="tk">PROJ-128</span></td><td><span class="sw"><span class="st n s-a">대기</span><span class="st g s-b">완료</span></span></td></tr>
      <tr><th>5</th><td></td><td></td><td></td></tr>
      <tr><th>6</th><td></td><td></td><td></td></tr>
      <tr><th>7</th><td></td><td></td><td></td></tr>
      <tr><th>8</th><td></td><td></td><td></td></tr>
    </table>
  </div>
</div>
<div class="app w3" data-at="06-02@그 줄이 티켓이" data-state0="todo" data-state="06-02@완료로 바뀝니다:done">
  <div class="bar"><img class="logo s" src="assets/logos/jira.svg" alt="">PROJ-128</div>
  <div class="body jira">
    <div>
      <div class="key"><img class="logo s" src="assets/logos/jira.svg" alt="">PROJ-128</div>
      <h4>[홈] 상단 배너 문구 수정</h4>
      <p class="dlb">설명</p>
      <p class="dsc">메신저 요청: 홈 상단 배너 문구 바꿔 주세요.</p>
      <dl><dt>요청한 곳</dt><dd># 디자인-요청</dd><dt>시트</dt><dd>요청 목록 4행</dd></dl>
    </div>
    <div class="side">
      <span class="sw"><span class="lz todo s-a">해야 할 일</span><span class="lz done s-b">완료</span></span>
      <dl><dt>담당자</dt><dd>팀원 2</dd><dt>보고자</dt><dd>팀원 1</dd><dt>레이블</dt><dd>홈</dd><dt>우선순위</dt><dd>보통</dd></dl>
    </div>
  </div>
</div>
`
};
