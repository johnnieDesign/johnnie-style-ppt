// 01 견본: 강조 장면. 가운데 정렬 · 숫자 세기(data-seq) · 타자(data-type). 형식은 scenes/STYLE.md
(window.SCENES ||= {})['01'] = {
  clicks: '01-01@화면은',
  css: String.raw`
[data-part="01"] .flow{position:absolute;left:100px;right:100px;top:420px;margin:0;text-align:center}
[data-part="01"] .count{position:absolute;left:0;right:0;top:300px;margin:0;text-align:center}
[data-part="01"] .count .unit{font-size:120px;letter-spacing:0;margin-left:16px;color:var(--ink-2)}
[data-part="01"] .one{position:absolute;left:100px;right:100px;top:440px;margin:0;text-align:center}
`,
  html: String.raw`
<!-- 01-01 강조라서 가운데 정렬. 반전 구절(clicks)에서 '화면'이 켜진다 -->
<h2 class="title c" data-at="01-01" data-until="01-02">대본이 원본</h2>
<p class="disp flow" data-at="01-01" data-until="01-02">대본 → <span class="acc fx-fade" data-at="01-01@화면은">화면</span></p>

<!-- 01-02 숫자는 data-seq 로 세어 올린다 -->
<h2 class="title c" data-at="01-02" data-until="01-03">누름</h2>
<p class="disp-xl num count" data-at="01-02" data-until="01-03"><span data-seq="01-02@128번:128" data-from="0"></span><span class="unit" data-at="01-02@128번">번</span></p>

<!-- 01-03 한 장면에 굵게 갈 곳은 하나. data-type 은 그 구절부터 타자로 -->
<h2 class="title c" data-at="01-03">가운데 정렬</h2>
<p class="lead one" data-at="01-03"><span data-type="01-03@굵게">굵게 갈 곳은 </span><span class="acc" data-at="01-03@하나만">하나</span></p>
`
};
