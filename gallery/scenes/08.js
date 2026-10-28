// 08 패턴: 하루 따라가기. 시간 막대는 파트 끝까지 두고 data-state 로 지금 시각만 옮긴다. 시각마다 그 장면(서비스 창)을 붙인다. 형식은 scenes/STYLE.md
(window.SCENES ||= {})['08'] = {
  clicks: '08-01@리포트를 씁니다|08-03@쌓인 리포트가',
  css: String.raw`
/* 시간 막대: 오전 9시에서 저녁 7시까지를 1720px 에 비례로. 바뀌는 건 채움 · 지금 점 · 글자색뿐 */
[data-part="08"] .tl{position:absolute;left:100px;top:286px;width:1720px;height:72px}
[data-part="08"] .tl .track{position:absolute;left:0;right:0;top:56px;height:3px;border-radius:999px;background:var(--rule)}
[data-part="08"] .tl .fill{position:absolute;left:0;top:56px;width:0;height:3px;border-radius:999px;background:var(--accent);transition:width .6s ease}
[data-part="08"] .tl .stop{position:absolute;top:0;font:500 26px/1 var(--f-ed);color:var(--ink-3);white-space:nowrap;transition:color .4s}
[data-part="08"] .tl .stop i{position:absolute;left:0;top:47px;width:21px;height:21px;border-radius:50%;background:var(--paper);border:3px solid var(--ink-3);transition:background-color .4s,border-color .4s}
[data-part="08"] .tl .now{position:absolute;left:-2px;top:45px;width:25px;height:25px;border-radius:50%;background:var(--accent);opacity:0;transition:left .6s ease,opacity .4s}
[data-part="08"] .tl[data-s="s1"] .now{opacity:1}
[data-part="08"] .tl[data-s="s2"] .now{opacity:1;left:858px}
[data-part="08"] .tl[data-s="s3"] .now{opacity:1;left:1546px}
[data-part="08"] .tl[data-s="s2"] .fill{width:870px}
[data-part="08"] .tl[data-s="s3"] .fill{width:1558px}
[data-part="08"] .tl[data-s="s1"] .t1,[data-part="08"] .tl[data-s="s2"] .t2,[data-part="08"] .tl[data-s="s3"] .t3{color:var(--ink);font-weight:700}
[data-part="08"] .tl[data-s="s2"] .t1,[data-part="08"] .tl[data-s="s3"] .t1,[data-part="08"] .tl[data-s="s3"] .t2{color:var(--ink-2)}
[data-part="08"] .tl[data-s="s2"] .t1 i,[data-part="08"] .tl[data-s="s3"] .t1 i,[data-part="08"] .tl[data-s="s3"] .t2 i{background:var(--accent);border-color:var(--accent)}

/* 08-01 오전 9:00 밤사이 대화 → 하루 리포트 */
[data-part="08"] .night{position:absolute;left:100px;top:410px;width:640px;height:372px}
[data-part="08"] .night>.body{padding:14px 28px;font:400 22px/1.3 var(--f-ui)}   /* 창 본문이 글자 클래스 .body(36px)를 물려받지 않게 */
[data-part="08"] .night .msg{padding:14px 0}
[data-part="08"] .night .nm{font-size:22px}
[data-part="08"] .night .tx{font-size:23px}
[data-part="08"] .night .av.c1{background:#3E63DD} [data-part="08"] .night .av.c2{background:#2F9E6E} [data-part="08"] .night .av.c3{background:#7C5CC4}
[data-part="08"] .rep{position:absolute;left:820px;top:410px;width:1000px;height:372px}
[data-part="08"] .rep>.body{padding:22px 32px}
[data-part="08"] .rep h3{margin:10px 0 8px;font-size:34px}
[data-part="08"] .rep .meta{font:400 17px/1 var(--f-ui);color:var(--ui-ink-2);margin-bottom:24px}
[data-part="08"] .rep h5{margin:0 0 8px;font:700 23px/1.3 var(--f-ui);color:var(--ui-ink)}
[data-part="08"] .rep ul{margin:0;padding-left:26px;font:400 23px/1.6 var(--f-ui);color:var(--ui-ink)}

/* 08-02 오후 2:00 작업 시작 → 바뀐 규칙부터 */
[data-part="08"] .cc{position:absolute;left:100px;top:410px;width:1000px}
[data-part="08"] .cc>.bar{gap:10px}
[data-part="08"] .cc>.body{padding:26px 32px;font:400 26px/1.65 var(--f-mono)}
[data-part="08"] .cc .ln{white-space:pre}
[data-part="08"] .cc .warn{color:var(--accent);font-weight:700}
[data-part="08"] .cc .del{color:#8A8A8A;text-decoration:line-through}
[data-part="08"] .cc .add{color:#7CC88A}

/* 08-03 저녁 6:00 버그 하나 → 시트 · 문서 · 티켓이 차례로 바뀐다(data-state + 창마다 --c 시간차) */
[data-part="08"] .found{position:absolute;left:100px;top:410px;display:flex;align-items:center;gap:20px;font:600 36px/1.2 var(--f-ed);color:var(--ink)}
[data-part="08"] .found .lz{font-size:26px;padding:6px 14px;border-radius:6px}
[data-part="08"] .fx{position:absolute;top:500px;width:540px;height:318px}
[data-part="08"] .fx>.bar{gap:12px}
[data-part="08"] .fx>.body{padding:20px 26px}
[data-part="08"] .fx .gs table{width:100%;font-size:22px}
[data-part="08"] .fx .gs td{height:55px;padding:8px 14px}
[data-part="08"] .fx .ttl{display:flex;align-items:center;height:55px;padding:0 12px;border-bottom:1px solid var(--ui-line);font:700 22px/1 var(--f-ui);color:var(--ui-ink);background:#F4F5F7}
[data-part="08"] .fx .cf .ttl{padding:0 2px;font:600 27px/1 var(--f-ui);background:none}
[data-part="08"] .fx .li{display:flex;align-items:center;gap:12px;height:55px;padding:0 12px;border-bottom:1px solid var(--ui-line);font:400 22px/1.3 var(--f-ui);color:var(--ui-ink);white-space:nowrap}
[data-part="08"] .fx .li .lz{margin-left:auto}
[data-part="08"] .fx .lz,[data-part="08"] .fx .st{font-size:20px}
[data-part="08"] .fx .k{font-weight:600;color:var(--ui-link)}
[data-part="08"] .fx .sw{display:inline-grid}
[data-part="08"] .fx .sw>*{grid-area:1/1;justify-self:start}
[data-part="08"] .fixes .old,[data-part="08"] .fixes .new,[data-part="08"] .fixes .mk{transition:opacity .4s ease var(--c,0s),outline-color .4s ease var(--c,0s)}
[data-part="08"] .fixes .mk{outline:3px solid transparent;outline-offset:5px;border-radius:8px}
[data-part="08"] .fixes .new{opacity:0}
[data-part="08"] .fixes[data-s="after"] .new{opacity:1}
[data-part="08"] .fixes[data-s="after"] .old{opacity:0}
[data-part="08"] .fixes[data-s="after"] .mk{outline-color:var(--box)}

/* 08-03 쌓인 리포트 30일치 */
[data-part="08"] .cnt{position:absolute;left:100px;top:400px;display:flex;align-items:baseline;gap:18px}
[data-part="08"] .cnt .num{font-size:220px}
[data-part="08"] .cnt .unit{font:600 48px/1 var(--f-ed);color:var(--ink)}
[data-part="08"] .list{position:absolute;left:600px;top:420px;width:960px}
[data-part="08"] .list>.body{padding:14px 28px 18px}
[data-part="08"] .list .pg{display:flex;align-items:center;gap:14px;height:58px;font:400 24px/1 var(--f-ui);color:var(--ui-ink)}
[data-part="08"] .list .pg svg{width:22px;height:22px;flex:none}
[data-part="08"] .list .pg small{margin-left:auto;font:400 18px/1 var(--f-ui);color:var(--ui-ink-2)}
[data-part="08"] .list .more{height:48px;padding-left:36px;font:400 21px/48px var(--f-ui);color:var(--ui-ink-2)}
`,
  html: String.raw`
<!-- 08-01 자료라서 왼쪽 정렬. 제목 다음에 시간 막대(하루를 따라가며), 지금 시각 9:00(아침 아홉 시), 읽는 것(밤사이 쌓인 대화를), 쓰는 것(리포트를 씁니다) -->
<h2 class="title" data-at="08-01">정리 담당 에이전트의 하루</h2>
<div class="tl" data-at="08-01@하루를 따라가며" data-state0="s0" data-state="08-01@아침 아홉 시:s1|08-02:s2|08-03:s3">
  <div class="track"></div><div class="fill"></div>
  <div class="stop t1" style="left:0"><span>오전 9:00</span><i></i></div>
  <div class="stop t2" style="left:860px"><span>오후 2:00</span><i></i></div>
  <div class="stop t3" style="left:1548px"><span>오후 6:00</span><i></i></div>
  <b class="now"></b>
</div>
<div class="app night" data-at="08-01@밤사이 쌓인 대화를" data-until="08-02">
  <div class="bar"><img class="logo s" src="assets/logos/chat.svg" alt="">#프로젝트</div>
  <div class="body sl">
    <div class="msg"><div class="av c2">2</div><div><span class="nm">팀원 2</span><span class="tm">오후 11:20</span><div class="tx">버튼 문구는 동사로 끝내기로 했어요</div></div></div>
    <div class="msg" style="--d:.15s" data-at="08-01@밤사이 쌓인 대화를"><div class="av c3">3</div><div><span class="nm">팀원 3</span><span class="tm">오전 1:05</span><div class="tx">장바구니 버튼 고쳤습니다</div></div></div>
    <div class="msg" style="--d:.3s" data-at="08-01@밤사이 쌓인 대화를"><div class="av c1">1</div><div><span class="nm">팀원 1</span><span class="tm">오전 7:40</span><div class="tx">오늘 확인할 화면 세 개 올렸어요</div></div></div>
  </div>
</div>
<svg class="wires" viewBox="0 0 1920 1080" aria-hidden="true">
  <path class="w-ink fx-draw" pathLength="1" d="M752 596 L 815.5 596" marker-end="url(#ah-ink)" data-at="08-01@리포트를 씁니다" data-until="08-02"/>
</svg>
<div class="app rep" style="--d:.1s" data-at="08-01@리포트를 씁니다" data-until="08-02">
  <div class="bar"><img class="logo s" src="assets/logos/confluence.svg" alt=""><span class="url">example.com/wiki/project/daily-report</span></div>
  <div class="body cf">
    <div class="crumb">프로젝트 / 하루 리포트</div>
    <h3>10월 28일 (수) 하루 리포트</h3>
    <div class="meta">정리 담당 에이전트 · 오전 9:00 작성</div>
    <h5>오늘 챙길 것</h5>
    <ul>
      <li style="--d:.2s" data-at="08-01@리포트를 씁니다">버튼 문구 규칙이 바뀌었습니다. 오늘 작업부터 적용</li>
      <li style="--d:.4s" data-at="08-01@리포트를 씁니다">장바구니 버튼 수정 끝. 팀원 1 확인 필요</li>
      <li style="--d:.6s" data-at="08-01@리포트를 씁니다">확인할 화면 3개, 오늘 안에</li>
    </ul>
  </div>
</div>

<!-- 08-02 문단 시작에 지금 시각만 2:00 으로 옮긴다(앞 장면은 퇴장). 터미널(작업을 시작하면), 경고 줄과 바뀐 규칙(바뀐 규칙부터) -->
<div class="app term cc" data-at="08-02@작업을 시작하면" data-until="08-03">
  <div class="bar"><img class="logo s" src="assets/logos/claude.svg" alt="">팀원 1 · Claude Code</div>
  <div class="body">
    <div class="ln"><span class="p">❯</span> 작업 시작해 줘</div>
    <div class="ln dim" style="--d:.3s" data-at="08-02@작업을 시작하면">⏺ 공유 규칙을 확인하는 중…</div>
    <div class="ln warn" data-at="08-02@바뀐 규칙부터">⚠ 어제 바뀐 규칙이 있습니다 (팀원 2)</div>
    <div class="ln del" style="--d:.2s" data-at="08-02@바뀐 규칙부터">- 버튼 문구는 명사로 끝낸다</div>
    <div class="ln add" style="--d:.4s" data-at="08-02@바뀐 규칙부터">+ 버튼 문구는 동사로 끝낸다</div>
  </div>
</div>

<!-- 08-03 시각 6:00 으로. 버그 하나와 지금의 시트 · 문서 · 티켓(버그 하나를), 셋이 차례로 바뀜(한 번에 고칩니다), 쌓인 리포트 30일치(쌓인 리포트가) -->
<div class="found" data-at="08-03@버그 하나를" data-until="08-03@쌓인 리포트가"><span class="lz bug">버그</span>상품 상세에서 가격이 두 줄로 넘칩니다</div>
<div class="fixes" data-state0="before" data-state="08-03@한 번에 고칩니다:after">
  <div class="app fx" style="left:100px;--d:.1s;--c:0s" data-at="08-03@버그 하나를" data-until="08-03@쌓인 리포트가">
    <div class="bar"><img class="logo s" src="assets/logos/google-sheets.svg" alt="">QA 시트</div>
    <div class="body gs"><table>
      <tr class="hd"><td>화면</td><td>상태</td></tr>
      <tr><td>홈</td><td><span class="st g">완료</span></td></tr>
      <tr><td>장바구니</td><td><span class="st g">완료</span></td></tr>
      <tr><td>상품 상세</td><td><span class="sw mk"><span class="st y old">QA 중</span><span class="st r new">버그</span></span></td></tr>
    </table></div>
  </div>
  <div class="app fx" style="left:690px;--d:.3s;--c:.2s" data-at="08-03@버그 하나를" data-until="08-03@쌓인 리포트가">
    <div class="bar"><img class="logo s" src="assets/logos/confluence.svg" alt="">프로젝트 위키</div>
    <div class="body cf">
      <div class="ttl">버그 목록</div>
      <div class="li">홈 배너 여백이 좁음<span class="lz done">고침</span></div>
      <div class="li">장바구니 버튼이 작음<span class="lz done">고침</span></div>
      <div class="li new mk">상품 상세 가격이 두 줄로 넘침<span class="lz bug">새로</span></div>
    </div>
  </div>
  <div class="app fx" style="left:1280px;--d:.5s;--c:.4s" data-at="08-03@버그 하나를" data-until="08-03@쌓인 리포트가">
    <div class="bar"><img class="logo s" src="assets/logos/jira.svg" alt="">PROJ</div>
    <div class="body jira">
      <div class="ttl">백로그</div>
      <div class="li"><span class="k">PROJ-126</span>홈 배너 여백<span class="lz done">완료</span></div>
      <div class="li"><span class="k">PROJ-127</span>장바구니 버튼<span class="lz done">완료</span></div>
      <div class="li new mk"><span class="k">PROJ-128</span>상품 상세 가격<span class="lz todo">해야 할 일</span></div>
    </div>
  </div>
</div>
<div class="cnt" style="--d:.2s" data-at="08-03@쌓인 리포트가"><span class="num" data-seq="08-03@쌓인 리포트가:30" data-from="0"></span><span class="unit">일치</span></div>
<div class="app list" style="--d:.35s" data-at="08-03@쌓인 리포트가">
  <div class="bar"><img class="logo s" src="assets/logos/confluence.svg" alt="">프로젝트 / 하루 리포트</div>
  <div class="body">
    <div class="pg"><svg viewBox="0 0 20 20"><path d="M4.5 1.5h7.5l4 4v13h-11.5z M12 1.5v4h4" fill="none" stroke="#5E6C84" stroke-width="1.6" stroke-linejoin="round"/></svg>10월 28일 (수) 하루 리포트<small>정리 담당 에이전트 · 오전 9:00</small></div>
    <div class="pg"><svg viewBox="0 0 20 20"><path d="M4.5 1.5h7.5l4 4v13h-11.5z M12 1.5v4h4" fill="none" stroke="#5E6C84" stroke-width="1.6" stroke-linejoin="round"/></svg>10월 27일 (화) 하루 리포트<small>정리 담당 에이전트 · 오전 9:00</small></div>
    <div class="pg"><svg viewBox="0 0 20 20"><path d="M4.5 1.5h7.5l4 4v13h-11.5z M12 1.5v4h4" fill="none" stroke="#5E6C84" stroke-width="1.6" stroke-linejoin="round"/></svg>10월 26일 (월) 하루 리포트<small>정리 담당 에이전트 · 오전 9:00</small></div>
    <div class="more">… 26개 더</div>
    <div class="pg"><svg viewBox="0 0 20 20"><path d="M4.5 1.5h7.5l4 4v13h-11.5z M12 1.5v4h4" fill="none" stroke="#5E6C84" stroke-width="1.6" stroke-linejoin="round"/></svg>9월 17일 (목) 하루 리포트<small>정리 담당 에이전트 · 오전 9:00</small></div>
  </div>
</div>
`
};
