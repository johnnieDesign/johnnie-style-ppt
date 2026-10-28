// 05 패턴: 겹쳐 비교. 두 화면을 나란히 → data-state 로 한자리에 반투명하게 포개기(파트 CSS transition) → 어긋난 것만 빨강 → 나머지 흐리게. 형식은 scenes/STYLE.md
(window.SCENES ||= {})['05'] = {
  clicks: '05-01@반투명하게 포개면|05-02@빨갛게 칠하면',
  css: String.raw`
/* 비교 판 하나(.ov)에 두 버전을 넣고, .ov 의 data-s 로 자리 · 투명도 · 색을 바꾼다 */
[data-part="05"] .ov{position:absolute;left:100px;top:316px;width:1720px;height:634px}
[data-part="05"] .v1,[data-part="05"] .v2{position:absolute;left:0;top:0;padding-top:74px}   /* 버전 하나 = 칩 + 화면 */
[data-part="05"] .mv{position:absolute;left:900px;top:0;width:820px;height:634px;transition:transform .6s cubic-bezier(.2,.7,.2,1)}
[data-part="05"] .tg1{position:absolute;left:0;top:0;transition:opacity .5s ease}
[data-part="05"] .tg2{position:absolute;left:0;top:0;transition:transform .6s cubic-bezier(.2,.7,.2,1),opacity .5s ease}
[data-part="05"] .nt{position:absolute;left:900px;top:74px;width:720px}
[data-part="05"] .nt span{transition:opacity .5s ease}
[data-part="05"] .nt b{font-weight:400;transition:color .4s ease}
[data-part="05"] .dm{position:absolute;border:2px dashed var(--accent);border-radius:10px}

/* 가상의 화면 조각. .k = 두 버전이 같은 것, .x = 어긋난 것 */
[data-part="05"] .scr{position:relative;width:820px;height:560px;border-radius:12px;background-color:#FFFFFF;color:#111111;overflow:hidden;font-family:var(--f-ui);
  transition:opacity .5s ease,background-color .5s ease}
[data-part="05"] .scr>*{position:absolute;margin:0;white-space:nowrap;transition:opacity .5s ease,color .4s ease,border-color .4s ease}
[data-part="05"] .scr .bk{left:40px;top:50px;width:30px;height:30px}
[data-part="05"] .scr .tt{left:88px;top:44px;font:600 40px/1.2 var(--f-ui)}
[data-part="05"] .scr .im{left:40px;top:132px;width:120px;height:120px;border-radius:16px;background:#EDEDED;display:grid;place-items:center}
[data-part="05"] .scr .im i{width:56px;height:56px;border-radius:50%;background:#CFCFCF}
[data-part="05"] .scr .nm5{left:188px;top:144px;font:600 34px/1.3 var(--f-ui)}
[data-part="05"] .scr .op{left:188px;top:192px;font:400 26px/1.4 var(--f-ui);color:#6B7280}
[data-part="05"] .scr .cp{right:40px;top:170px;padding:4px 14px;border:2px solid #9CA3AF;border-radius:8px;font:600 24px/1.3 var(--f-ui);color:#374151}
[data-part="05"] .scr .ln{left:40px;top:290px;width:740px;height:2px;background:#EEEEEE}
[data-part="05"] .scr .sl5{left:40px;top:330px;font:400 30px/1.3 var(--f-ui);color:#4B5563}
[data-part="05"] .scr .pr5{right:40px;top:322px;font:700 42px/1.25 var(--f-ui)}
[data-part="05"] .scr .bt{left:40px;top:436px;width:740px;height:92px;border-radius:14px;background:#111111;color:#FFFFFF;display:grid;place-items:center;font:600 34px/1 var(--f-ui)}
/* 후: 어긋난 세 곳(제목은 아래로, 쿠폰은 왼쪽으로, 가격은 아래로) */
[data-part="05"] .v2 .scr .tt{top:62px}
[data-part="05"] .v2 .scr .cp{right:72px}
[data-part="05"] .v2 .scr .pr5{top:338px}

/* 05-01 포개기: 후가 전 위로 미끄러져 오며 반투명해진다 */
[data-part="05"] .ov:not([data-s="pair"]) .mv{transform:translateX(-900px)}
[data-part="05"] .ov:not([data-s="pair"]) .tg2{transform:translateX(84px)}
[data-part="05"] .ov[data-s="stack"] .v2 .scr{opacity:.5}
/* 05-02 빨강: 어긋난 것만 두 장 모두 빨강. 후는 같은 것을 지워 겹친 곳이 전 한 장으로 보이게 */
[data-part="05"] .ov:is([data-s="red"],[data-s="dim"]) .v2 .scr{background-color:transparent}
[data-part="05"] .ov:is([data-s="red"],[data-s="dim"]) .v2 .k{opacity:0}
[data-part="05"] .ov:is([data-s="red"],[data-s="dim"]) :is(.x,.nt b){color:var(--box);border-color:var(--box)}
/* 05-02 흐리게: 빨강만 남긴다 */
[data-part="05"] .ov[data-s="dim"] .v1 .k{opacity:.15}
[data-part="05"] .ov[data-s="dim"] :is(.tg1,.tg2,.nt span){opacity:.35}
`,
  html: String.raw`
<!-- 05-01 자료라서 왼쪽 정렬. 전 · 후를 나란히 두고, '반투명하게 포개면'에서 후가 전 위로 와 반투명해진다 -->
<h2 class="title" data-at="05-01" data-until="05-02">전과 후를 반투명하게 포갠다</h2>
<div class="ov" data-state0="pair" data-state="05-01@반투명하게 포개면:stack|05-02@빨갛게 칠하면:red|05-02@눈이 그곳으로:dim">
  <div class="v1" data-at="05-01@두 버전이">
    <div class="tg1"><span class="chip">전</span></div>
    <div class="scr">
      <svg class="bk k" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <p class="tt x">주문 확인</p>
      <div class="im k"><i></i></div>
      <p class="nm5 k">기본 머그컵</p>
      <p class="op k">화이트 · 1개</p>
      <span class="cp x">쿠폰 10%</span>
      <i class="ln k"></i>
      <p class="sl5 k">결제 금액</p>
      <p class="pr5 x">10,800원</p>
      <div class="bt k">결제하기</div>
    </div>
  </div>
  <div class="mv">
    <div class="v2" data-at="05-01@두 버전이" style="--d:.2s">
      <div class="tg2"><span class="chip">후</span></div>
      <div class="scr">
        <svg class="bk k" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <p class="tt x">주문 확인</p>
        <div class="im k"><i></i></div>
        <p class="nm5 k">기본 머그컵</p>
        <p class="op k">화이트 · 1개</p>
        <span class="cp x">쿠폰 10%</span>
        <i class="ln k"></i>
        <p class="sl5 k">결제 금액</p>
        <p class="pr5 x">10,800원</p>
        <div class="bt k">결제하기</div>
      </div>
    </div>
  </div>
  <!-- '어긋난 곳이'에서 두 번 보이는 자리를 점선으로 짚는다. 05-02 에서 빨강이 그 일을 넘겨받으면 사라진다 -->
  <span class="dm" style="left:76px;top:106px;width:171px;height:90px" data-at="05-01@어긋난 곳이" data-until="05-02@빨갛게 칠하면"></span>
  <span class="dm" style="left:609px;top:232px;width:183px;height:67px;--d:.15s" data-at="05-01@어긋난 곳이" data-until="05-02@빨갛게 칠하면"></span>
  <span class="dm" style="left:590px;top:384px;width:202px;height:93px;--d:.3s" data-at="05-01@어긋난 곳이" data-until="05-02@빨갛게 칠하면"></span>
  <p class="body nt" data-at="05-01@어긋난 곳이"><span>두 번 보이는 곳이<br><b>어긋난 곳</b></span></p>
</div>

<!-- 05-02 판은 그대로 두고 상태만 바꾼다. '빨갛게 칠하면' 어긋난 것만 빨강, '눈이 그곳으로' 나머지를 흐리게 -->
<h2 class="title" data-at="05-02">어긋난 곳만 빨갛게</h2>
`
};
