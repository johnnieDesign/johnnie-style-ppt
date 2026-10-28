// 01 패턴: 선언 · 교체 · 숫자. 가운데 정렬 강조, 타자(data-type) · 같은 자리 교체(data-state) · 숫자 세기(data-seq) · 격자(.cells). 형식은 scenes/STYLE.md
(window.SCENES ||= {})['01'] = {
  clicks: '01-02@후로 바꿉니다|01-03@42곳이 어디인지',
  css: String.raw`
/* 01-01 한 문장. 보이지 않는 전체 문장이 폭을 잡아 두고, 타자는 그 왼쪽 끝에서 시작한다(가운데 정렬이 글자마다 흔들리지 않게) */
[data-part="01"] .say{position:absolute;left:100px;right:100px;top:470px;display:grid;justify-content:center}
[data-part="01"] .say>*{grid-area:1/1;white-space:nowrap}
[data-part="01"] .say .ghost{visibility:hidden}
[data-part="01"] .say .kw{display:inline-block}

/* 01-02 같은 자리 교체. 전 · 후 두 벌을 한 칸(grid-area 1/1)에 겹쳐 두고 data-s 로 투명도만 바꾼다. 전이 먼저 빠지고 후가 조금 늦게(.15s) 들어와 글자가 겹쳐 보이지 않는다 */
[data-part="01"] .swap{position:absolute;left:510px;top:360px;width:900px}
[data-part="01"] .stack{display:grid}
[data-part="01"] .stack>*{grid-area:1/1;transition:opacity .3s ease}
[data-part="01"] .swap .af,[data-part="01"] .swap[data-s="after"] .bf{opacity:0}
[data-part="01"] .swap[data-s="after"] .af{opacity:1;transition:opacity .4s ease .15s}
[data-part="01"] .tags{justify-items:center;margin-bottom:26px}
[data-part="01"] .tags .chip{font-size:32px;padding:12px 34px}
[data-part="01"] .ui{background:#FFFFFF;color:#111111;border-radius:24px;padding:40px 44px;font-family:var(--f-ui)}
[data-part="01"] .prod{display:flex;gap:32px;align-items:center}
[data-part="01"] .thumb{width:150px;height:150px;flex:none;border-radius:16px;background:#F1F1F1;display:grid;place-items:center}
[data-part="01"] .thumb svg{width:96px;height:96px}
[data-part="01"] .nm{margin:0;font:600 34px/1.3 var(--f-ui)}
[data-part="01"] .pr{margin:8px 0 0;display:flex;align-items:baseline;gap:14px}
[data-part="01"] .pr b{font:800 40px/1.2 var(--f-ui)}
[data-part="01"] .pr s{font:500 26px/1 var(--f-ui);color:#9A9A9A}
[data-part="01"] .rv{margin:8px 0 0;font:500 24px/1.3 var(--f-ui);color:#8A8A8A}
[data-part="01"] .acts{margin-top:36px}
[data-part="01"] .row{display:flex;gap:16px;height:96px}
[data-part="01"] .ob{flex:1;display:grid;place-items:center;border:2px solid #D6D6D6;border-radius:16px;font:600 32px/1 var(--f-ui);color:#707070}
[data-part="01"] .ib{width:96px;flex:none;display:grid;place-items:center;border:2px solid #D6D6D6;border-radius:16px}
[data-part="01"] .ib svg{width:44px;height:44px}
[data-part="01"] .fb{flex:1;display:grid;place-items:center;border-radius:16px;background:#111111;color:#FFFFFF;font:700 34px/1 var(--f-ui)}

/* 01-03 숫자 → 격자. 숫자는 사라지지 않고 data-s 로 자리만 옮긴다(solo 가운데 → side 오른쪽 → hl 강조색) */
[data-part="01"] .mv{position:absolute;left:960px;top:400px;transition:left .6s cubic-bezier(.2,.7,.2,1)}
[data-part="01"] .mv .big{margin:0;display:flex;align-items:baseline;white-space:nowrap;transform:translateX(-50%);transition:transform .6s cubic-bezier(.2,.7,.2,1)}
[data-part="01"] .mv .n{font-size:300px;transition:color .5s ease}
[data-part="01"] .mv .u{margin-left:14px;font:800 96px/1 var(--f-ed);color:var(--ink-2);transition:color .5s ease}
[data-part="01"] .mv[data-s="side"],[data-part="01"] .mv[data-s="hl"]{left:1281px}
[data-part="01"] .mv[data-s="side"] .big,[data-part="01"] .mv[data-s="hl"] .big{transform:none}
[data-part="01"] .mv[data-s="hl"] .n,[data-part="01"] .mv[data-s="hl"] .u{color:var(--accent)}
[data-part="01"] .mv .what{margin-top:22px;font-size:30px;color:var(--ink);opacity:0;transition:opacity .4s ease .2s}
[data-part="01"] .mv[data-s="hl"] .what{opacity:1}
[data-part="01"] .grid{position:absolute;left:181px;top:400px}
[data-part="01"] .grid .cells{--cols:25;--cs:32px;--cg:8px;--step:2ms}
[data-part="01"] .grid .cells i.h{background:var(--rule-2)}
[data-part="01"] .grid[data-s="hl"] .cells i.h{background:var(--accent)}
[data-part="01"] .grid .cap{margin-top:22px;font-size:28px}
`,
  html: String.raw`
<!-- 01-01 강조라서 가운데. 제목 → 한 문장(타자). 강조색은 마지막 한 단어만, 타자가 끝날 즈음(--d) 붙는다 -->
<h2 class="title c" data-at="01-01" data-until="01-02">첫 장면은 한 문장</h2>
<p class="disp say" data-at="01-01" data-until="01-02">
  <span class="ghost" aria-hidden="true">가져갈 말은 하나</span>
  <span><span data-type="01-01@가져갈 말 하나를">가져갈 말은 </span><span class="kw acc fx-pop" data-at="01-01@가져갈 말 하나를" style="--d:.55s">하나</span></span>
</p>

<!-- 01-02 같은 자리 교체. 전을 먼저 보이고, 그 자리에서 data-state 로 후로 바꾼다. 나란히 두지 않는다 -->
<h2 class="title c" data-at="01-02" data-until="01-03">같은 자리에서 전과 후</h2>
<div class="swap" data-at="01-02@전을 먼저" data-until="01-03" data-state0="before" data-state="01-02@후로 바꿉니다:after">
  <div class="stack tags"><span class="chip bf">전</span><span class="chip acc af">후</span></div>
  <div class="ui">
    <div class="prod">
      <span class="thumb"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M36 14 22 20 8 38 20 48 28 40 28 88 72 88 72 40 80 48 92 38 78 20 64 14Q50 26 36 14Z" fill="#D2D2D2"/></svg></span>
      <div><p class="nm">오버핏 셔츠</p><p class="pr"><b>39,000원</b><s>49,000원</s></p><p class="rv">리뷰 1,024</p></div>
    </div>
    <div class="stack acts">
      <div class="row bf"><span class="ob">장바구니</span><span class="ob">구매하기</span></div>
      <div class="row af"><span class="ib"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6z" fill="none" stroke="#111" stroke-width="2" stroke-linejoin="round"/><path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="#111" stroke-width="2"/></svg></span><span class="fb">구매하기</span></div>
    </div>
  </div>
</div>

<!-- 01-03 숫자 강조. 큰 숫자를 세어 올리고(data-seq), 격자가 들어오면 숫자는 오른쪽으로 비켜서고(data-state), 42칸이 강조색이 된다 -->
<h2 class="title c" data-at="01-03">숫자 하나로 궁금하게</h2>
<div class="abs" style="left:0;top:0" data-at="01-03@크게 세어 올립니다">
  <div class="mv" data-state0="solo" data-state="01-03@전체 300곳 가운데:side|01-03@42곳이 어디인지:hl">
    <p class="big"><span class="num n" data-seq="01-03@크게 세어 올립니다:42" data-from="0"></span><span class="u">곳</span></p>
    <p class="cap what">고쳐야 할 곳</p>
  </div>
</div>
<div class="grid" style="--d:.15s" data-at="01-03@전체 300곳 가운데" data-state="01-03@42곳이 어디인지:hl">
  <div class="cells" data-cells="300" data-hl-spread="42"></div>
  <p class="cap">전체 300곳</p>
</div>
`
};
