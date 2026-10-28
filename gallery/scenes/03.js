// 03 패턴: 화면에서 짚기. 왼쪽 정렬, 가상 앱 화면(.phone) · 잘라서 크게(같은 마크업을 확대 · overflow:hidden) · 말하는 자리마다 강조 상자(.hlbox). 형식은 scenes/STYLE.md
(window.SCENES ||= {})['03'] = {
  clicks: '03-01@잘라서 크게|03-02@맨 아래 버튼',
  css: String.raw`
/* 가상 앱 화면. 휴대폰 안쪽(280×600)을 좌표로 고정해서, 확대 상자와 강조 상자를 같은 좌표로 맞춘다 */
[data-part="03"] .ph{position:absolute;left:100px;top:300px;width:300px;height:620px}
[data-part="03"] .scr{position:relative;width:280px;height:600px;background:#FFFFFF;color:#111111;font-family:var(--f-ui)}
[data-part="03"] .scr>*{position:absolute;margin:0}
[data-part="03"] .scr .tm{left:26px;top:13px;font:600 16px/1 var(--f-ui)}
[data-part="03"] .scr .isl{left:94px;top:10px;width:92px;height:26px;border-radius:13px;background:#111111}
[data-part="03"] .scr .bat{right:22px;top:14px;width:26px;height:13px;border:2px solid #111111;border-radius:4px}
[data-part="03"] .scr .bat::after{content:"";position:absolute;left:2px;top:2px;width:15px;height:5px;border-radius:1px;background:#111111}
[data-part="03"] .scr .hd{left:16px;right:16px;top:50px;height:36px;display:flex;align-items:center;justify-content:space-between;font:800 20px/1 var(--f-ui)}
[data-part="03"] .scr .hd span{display:flex;gap:14px}
[data-part="03"] .scr .hd svg{width:22px;height:22px}
[data-part="03"] .scr .bn{left:14px;top:100px;width:252px;height:64px;padding:0 16px;border-radius:12px;background:#24324A;color:#FFFFFF;display:flex;align-items:center;justify-content:space-between}
[data-part="03"] .scr .bn b{font:700 17px/1 var(--f-ui)}
[data-part="03"] .scr .bn span{font:500 16px/1 var(--f-ui);opacity:.8}
[data-part="03"] .scr .cd{left:14px;top:178px;width:252px}
[data-part="03"] .scr .lk{position:absolute;right:0;top:196px;width:24px;height:24px}
[data-part="03"] .scr .lk svg{display:block;width:24px;height:24px}
[data-part="03"] .scr .im{height:184px;border-radius:12px;background:#F1F1F1;display:grid;place-items:center}
[data-part="03"] .scr .im svg{width:110px;height:110px}
[data-part="03"] .scr .nm{margin:14px 0 0;font:600 17px/1.3 var(--f-ui)}
[data-part="03"] .scr .pr{margin:6px 0 0;display:flex;align-items:baseline;gap:8px}
[data-part="03"] .scr .pr b{font:800 20px/1.2 var(--f-ui)}
[data-part="03"] .scr .pr s{font:500 16px/1 var(--f-ui);color:#9A9A9A}
[data-part="03"] .scr .rv{margin:6px 0 0;font:500 16px/1.3 var(--f-ui);color:#8A8A8A}
[data-part="03"] .scr .by{left:14px;top:520px;width:252px;height:56px;border-radius:12px;background:#111111;color:#FFFFFF;display:grid;place-items:center;font:700 18px/1 var(--f-ui)}
[data-part="03"] .scr .home{left:90px;bottom:7px;width:100px;height:5px;border-radius:3px;background:#111111}

/* 03-01 같은 마크업을 3.8배로 키워 일부만 보인다. 자를 곳 = 휴대폰 안쪽 (10, 368) 260×96
   .clip = 자를 크기 × 배율(988×365), .scr = scale(배율) translate(-10px,-368px). 점선 .cut = 같은 자리 + 휴대폰 테두리 10px, 4px 바깥 */
[data-part="03"] .cut{position:absolute;left:16px;top:374px;width:268px;height:104px;border:3px dashed var(--accent);border-radius:8px}
[data-part="03"] .zoom{position:absolute;left:620px;top:470px;padding:32px 40px;border-radius:16px;background:#FFFFFF}
[data-part="03"] .zoom .clip{width:988px;height:365px;overflow:hidden}
[data-part="03"] .zoom .scr{transform-origin:0 0;transform:scale(3.8) translate(-10px,-368px)}
[data-part="03"] .wires path{stroke-width:2}

/* 03-02 말하는 자리마다 강조 상자 + 이름. 상자 = 휴대폰 안쪽 좌표 + 테두리 10px, 6px 바깥. 이름은 상자 오른쪽 끝(382)에서 빨간 선으로 잇는다 */
[data-part="03"] .ph .hlbox{left:18px;width:264px}
[data-part="03"] .call{position:absolute;left:382px;display:flex;align-items:center;gap:22px;margin:0;font:600 40px/1.2 var(--f-ed);color:var(--ink);white-space:nowrap}
[data-part="03"] .call::before{content:"";width:70px;height:3px;border-radius:2px;background:var(--box)}
`,
  html: String.raw`
<!-- 03-01 자료라서 왼쪽. 실제 화면(가상 앱)을 먼저 두고, 잘라서 크게: 자를 자리에 점선 → 선 → 확대 상자가 한 번에 이어서 나온다(--d) -->
<h2 class="title" data-at="03-01" data-until="03-02">부분만 잘라서 크게</h2>
<div class="ph" data-at="03-01@실제 화면을" style="--d:.15s">
  <div class="phone">
    <div class="scr">
      <b class="tm">9:41</b><i class="isl"></i><i class="bat"></i>
      <div class="hd">example<span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="#111" stroke-width="2"/><path d="M16 16l4 4" stroke="#111" stroke-width="2" stroke-linecap="round"/></svg><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6z" fill="none" stroke="#111" stroke-width="2" stroke-linejoin="round"/><path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="#111" stroke-width="2"/></svg></span></div>
      <div class="bn"><b>첫 구매 10% 쿠폰</b><span>받기 ›</span></div>
      <div class="cd"><div class="im"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M36 14 22 20 8 38 20 48 28 40 28 88 72 88 72 40 80 48 92 38 78 20 64 14Q50 26 36 14Z" fill="#D2D2D2"/></svg></div><p class="nm">오버핏 셔츠</p><p class="pr"><b>39,000원</b><s>49,000원</s></p><p class="rv">★ 4.8 · 리뷰 1,024</p><i class="lk"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="#111" stroke-width="2" stroke-linejoin="round"/></svg></i></div>
      <div class="by">구매하기</div>
      <i class="home"></i>
    </div>
  </div>
  <span class="cut fx-fade" data-at="03-01@잘라서 크게" data-until="03-02"></span>
  <span class="hlbox fx-pop" style="top:104px;height:76px" data-at="03-02@위쪽 배너"></span>
  <span class="hlbox fx-pop" style="top:182px;height:308px" data-at="03-02@가운데 카드"></span>
  <span class="hlbox fx-pop" style="top:524px;height:68px" data-at="03-02@맨 아래 버튼"></span>
</div>
<svg class="wires" viewBox="0 0 1920 1080" aria-hidden="true">
  <path class="w-ink fx-draw" pathLength="1" d="M384 674 L620 470" data-at="03-01@잘라서 크게" data-until="03-02" style="--d:.15s"/>
  <path class="w-ink fx-draw" pathLength="1" d="M384 778 L620 899" data-at="03-01@잘라서 크게" data-until="03-02" style="--d:.25s"/>
</svg>
<div class="zoom fx-pop" data-at="03-01@잘라서 크게" data-until="03-02" style="--d:.4s" aria-hidden="true"><div class="clip">
  <div class="scr">
    <b class="tm">9:41</b><i class="isl"></i><i class="bat"></i>
    <div class="hd">example<span><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" fill="none" stroke="#111" stroke-width="2"/><path d="M16 16l4 4" stroke="#111" stroke-width="2" stroke-linecap="round"/></svg><svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6z" fill="none" stroke="#111" stroke-width="2" stroke-linejoin="round"/><path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="#111" stroke-width="2"/></svg></span></div>
    <div class="bn"><b>첫 구매 10% 쿠폰</b><span>받기 ›</span></div>
    <div class="cd"><div class="im"><svg viewBox="0 0 100 100"><path d="M36 14 22 20 8 38 20 48 28 40 28 88 72 88 72 40 80 48 92 38 78 20 64 14Q50 26 36 14Z" fill="#D2D2D2"/></svg></div><p class="nm">오버핏 셔츠</p><p class="pr"><b>39,000원</b><s>49,000원</s></p><p class="rv">★ 4.8 · 리뷰 1,024</p><i class="lk"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="#111" stroke-width="2" stroke-linejoin="round"/></svg></i></div>
    <div class="by">구매하기</div>
    <i class="home"></i>
  </div>
</div></div>

<!-- 03-02 휴대폰은 그대로 두고, 말하는 자리마다 강조 상자와 이름을 하나씩 켠다(위 → 가운데 → 아래) -->
<h2 class="title" data-at="03-02">말하는 자리마다 상자 하나</h2>
<p class="call" style="top:418px;--d:.15s" data-at="03-02@위쪽 배너">위쪽 배너</p>
<p class="call" style="top:612px;--d:.15s" data-at="03-02@가운데 카드">가운데 카드</p>
<p class="call" style="top:834px;--d:.15s" data-at="03-02@맨 아래 버튼">맨 아래 버튼</p>
`
};
