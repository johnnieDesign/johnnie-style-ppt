// 09 패턴: 마무리. 가져갈 것 세 줄(진짜 순서라 번호), 마지막 화면은 인사 한마디만. 세 줄은 data-state 로 흐려졌다가 퇴장. 형식은 scenes/STYLE.md
(window.SCENES ||= {})['09'] = {
  clicks: '09-01@화면은 대본에|09-02@감사합니다',
  css: String.raw`
[data-part="09"] .take{position:absolute;inset:0;transition:opacity .5s ease}
[data-part="09"] .take[data-s="dim"]{opacity:.3}
[data-part="09"] .pt{position:absolute;left:100px;margin:0;white-space:nowrap;font:800 88px/1.2 var(--f-ed);letter-spacing:-.02em;color:var(--ink)}
[data-part="09"] .pt .n{display:inline-block;width:110px;color:var(--ink-3)}
[data-part="09"] .thanks{position:absolute;left:0;right:0;top:466px;text-align:center}
`,
  html: String.raw`
<!-- 09-01 정리라서 왼쪽 정렬. 진짜 순서라 번호를 쓴다. 말하는 구절마다 한 줄씩 -->
<div class="take" data-state0="" data-state="09-02:dim">
  <h2 class="title" data-at="09-01" data-until="09-02@감사합니다">가져갈 것 세 줄</h2>
  <p class="pt" style="top:350px" data-at="09-01@대본을 먼저" data-until="09-02@감사합니다"><span class="n">1.</span>대본을 먼저 쓴다</p>
  <p class="pt" style="top:530px" data-at="09-01@소리로 듣고" data-until="09-02@감사합니다"><span class="n">2.</span>소리로 듣고 고친다</p>
  <p class="pt" style="top:710px" data-at="09-01@화면은 대본에" data-until="09-02@감사합니다"><span class="n">3.</span>화면은 대본에 매단다</p>
</div>

<!-- 09-02 문단 시작에 세 줄이 흐려지고, 감사합니다에서 사라지며 가운데에 인사 한마디만 -->
<div class="thanks" style="--d:.25s" data-at="09-02@감사합니다"><p class="disp">감사합니다</p></div>
`
};
