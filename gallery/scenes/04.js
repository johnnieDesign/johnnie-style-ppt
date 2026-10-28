// 04 패턴: 같은 것 세 장. 같은 카드 세 장을 그대로 두고 상태(data-state)만 바꾸기 · 칩 시간차 · 강조 상자(.hlbox) 시간차 · 나머지 흐리게. 형식은 scenes/STYLE.md
(window.SCENES ||= {})['04'] = {
  clicks: '04-01@가격 표시 하나만|04-02@빨간 상자가',
  css: String.raw`
/* 카드 위 한 줄: 04-01 은 카드마다 다른 가격 표시의 이름, 04-02 는 사람 */
[data-part="04"] .vlab{position:absolute;top:322px;margin:0;font:500 24px/1.4 var(--f-ed);color:var(--ink-2);white-space:nowrap}
[data-part="04"] .who4{position:absolute;top:316px}

/* 같은 카드 세 장. 카드는 파트 끝까지 그대로 두고 .trio 의 data-s 로만 바꾼다 */
[data-part="04"] .trio{position:absolute;left:100px;top:390px;display:flex;gap:110px}
[data-part="04"] .pc{position:relative;width:500px;display:flex;flex-direction:column;align-items:flex-start}
[data-part="04"] .ph{position:relative;width:500px;height:300px;margin-bottom:24px}
[data-part="04"] .th{position:absolute;inset:0;border-radius:8px;background:#232323;display:grid;place-items:center}
[data-part="04"] .th i{width:140px;height:140px;border-radius:50%;background:#3C3C3C}
[data-part="04"] .hrt{position:absolute;right:20px;top:20px;width:36px;height:36px}
[data-part="04"] .bdg{position:absolute;left:20px;bottom:20px;padding:6px 12px;border-radius:6px;background:#FFFFFF;color:#111111;font:600 22px/1.2 var(--f-ed)}
[data-part="04"] .tt{position:relative;margin:0;font:600 32px/1.3 var(--f-ed);color:var(--ink)}
[data-part="04"] .ds{margin:10px 0 0;font:400 24px/1.4 var(--f-ed);color:var(--ink-2)}
[data-part="04"] .pr{margin-top:16px;font:700 36px/1.25 var(--f-ed);color:var(--ink);border-radius:10px;outline:3px solid transparent;outline-offset:6px;
  transition:outline-color .4s ease,opacity .5s ease}
[data-part="04"] .pr .rt{color:var(--accent);margin-right:12px}
[data-part="04"] .pr s{font-weight:400;color:var(--ink-3);margin-right:12px;text-decoration-thickness:2px}
[data-part="04"] .mt{margin:14px 0 0;font:400 22px/1.4 var(--f-ed);color:var(--ink-3)}
[data-part="04"] .fx .hlbox{inset:-8px -12px}

/* 04-01 가격 표시만 서로 달라진다: 같은 자리에서 .va → .vb 로 겹쳐 바꾸고, 그 줄에 빨강 테두리(.hl 과 같은 값). 카드마다 .15초씩 늦게 */
[data-part="04"] .sw{display:grid}
[data-part="04"] .sw>*{grid-area:1/1;justify-self:start;white-space:nowrap;transition:opacity .45s ease}
[data-part="04"] .sw .va{position:relative}
[data-part="04"] .sw .vb{opacity:0}
[data-part="04"] .trio[data-s="price"] .sw .va{opacity:0}
[data-part="04"] .trio[data-s="price"] .sw .vb{opacity:1}
[data-part="04"] .trio[data-s="price"] .pr{outline-color:var(--box)}
[data-part="04"] .pc:nth-child(2) :is(.sw>*,.pr){transition-delay:.15s}
[data-part="04"] .pc:nth-child(3) :is(.sw>*,.pr){transition-delay:.3s}

/* 04-02 빨간 상자만 남기고 나머지를 흐리게 */
[data-part="04"] :is(.th,.hrt,.bdg,.tt,.ds,.mt){transition:opacity .5s ease}
[data-part="04"] .trio[data-s="focus"] :is(.th,.hrt,.bdg,.tt,.ds,.pr,.mt):not(.fx){opacity:.2}
`,
  html: String.raw`
<!-- 04-01 자료라서 왼쪽 정렬. 같은 카드 세 장이 시간차로 나오고, '가격 표시 하나만'에서 그 줄만 서로 달라진다 -->
<h2 class="title" data-at="04-01" data-until="04-02@세 사람에게">같은 카드 세 장, 가격 표시만 다르게</h2>
<p class="vlab" style="left:100px" data-at="04-01@가격 표시 하나만" data-until="04-02@세 사람에게">할인가만</p>
<p class="vlab" style="left:710px;--d:.15s" data-at="04-01@가격 표시 하나만" data-until="04-02@세 사람에게">할인율 + 할인가</p>
<p class="vlab" style="left:1320px;--d:.3s" data-at="04-01@가격 표시 하나만" data-until="04-02@세 사람에게">정가 + 할인가</p>

<div class="trio" data-state0="same" data-state="04-01@가격 표시 하나만:price|04-02@세 사람에게:same|04-02@빨간 상자가:focus">
  <div class="pc" data-at="04-01@같은 카드 세 장을">
    <div class="ph"><div class="th"><i></i></div><svg class="hrt" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.1C1.6 8.2 3.6 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.7 1.2-1.6 2.8-2.7 4.8-2.7 3.6 0 5.6 3.7 4.4 6.9-1.7 4.5-9.2 9.1-9.2 9.1z" fill="none" stroke="#FFFFFF" stroke-width="1.6"/></svg><span class="bdg">무료배송</span></div>
    <p class="tt fx">기본 머그컵 350ml<span class="hlbox" data-at="04-02@셋 다 달랐습니다"></span></p>
    <p class="ds">매일 쓰기 좋은 도자기 컵</p>
    <div class="pr">10,800원</div>
    <p class="mt">★ 4.8 · 리뷰 120</p>
  </div>
  <div class="pc" data-at="04-01@같은 카드 세 장을" style="--d:.2s">
    <div class="ph"><div class="th"><i></i></div><svg class="hrt" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.1C1.6 8.2 3.6 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.7 1.2-1.6 2.8-2.7 4.8-2.7 3.6 0 5.6 3.7 4.4 6.9-1.7 4.5-9.2 9.1-9.2 9.1z" fill="none" stroke="#FFFFFF" stroke-width="1.6"/></svg><span class="bdg fx">무료배송<span class="hlbox" data-at="04-02@셋 다 달랐습니다" style="--d:.25s"></span></span></div>
    <p class="tt">기본 머그컵 350ml</p>
    <p class="ds">매일 쓰기 좋은 도자기 컵</p>
    <div class="pr"><span class="sw"><span class="va">10,800원</span><span class="vb"><span class="rt">10%</span>10,800원</span></span></div>
    <p class="mt">★ 4.8 · 리뷰 120</p>
  </div>
  <div class="pc" data-at="04-01@같은 카드 세 장을" style="--d:.4s">
    <div class="ph"><div class="th"><i></i></div><svg class="hrt" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.1C1.6 8.2 3.6 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.7 1.2-1.6 2.8-2.7 4.8-2.7 3.6 0 5.6 3.7 4.4 6.9-1.7 4.5-9.2 9.1-9.2 9.1z" fill="none" stroke="#FFFFFF" stroke-width="1.6"/></svg><span class="bdg">무료배송</span></div>
    <p class="tt">기본 머그컵 350ml</p>
    <p class="ds">매일 쓰기 좋은 도자기 컵</p>
    <div class="pr fx"><span class="sw"><span class="va">10,800원<span class="hlbox" data-at="04-02@셋 다 달랐습니다" style="--d:.5s"></span></span><span class="vb"><s>12,000원</s>10,800원</span></span></div>
    <p class="mt">★ 4.8 · 리뷰 120</p>
  </div>
</div>

<!-- 04-02 카드는 04-01 것을 그대로 두고 상태만 같은 카드로 되돌린다. 문단 첫 구절이라 문단 시작과 한 번에 누른다 -->
<h2 class="title" data-at="04-02@세 사람에게">같은 카드, 고칠 곳은 셋 다 달랐다</h2>
<span class="chip who4" style="left:100px" data-at="04-02@세 사람에게">팀원 1</span>
<span class="chip who4" style="left:710px;--d:.15s" data-at="04-02@세 사람에게">팀원 2</span>
<span class="chip who4" style="left:1320px;--d:.3s" data-at="04-02@세 사람에게">팀원 3</span>
<!-- 빨간 상자는 각 카드 안(.fx)에 들어 있다: 팀원 1 제목, 팀원 2 배지, 팀원 3 가격. '빨간 상자가'에서 상자 자리만 남기고 흐린다 -->
`
};
