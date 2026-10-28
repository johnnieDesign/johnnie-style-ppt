// 07 패턴: 흐름도. 출발점 → 선 → 도착점 순서로, 선은 fx-draw 시간차로 그린다. 그림은 문단을 넘어 그대로 둔다. 형식은 scenes/STYLE.md
(window.SCENES ||= {})['07'] = {
  clicks: '07-01@가운데로|07-02@다시 사람에게',
  css: String.raw`
[data-part="07"] .src{position:absolute;left:356px;height:64px;display:flex;align-items:center;gap:20px;font:600 32px/1 var(--f-ed);color:var(--ink-1)}
[data-part="07"] .src .ic{width:64px;height:64px;border-radius:14px;background:#FFFFFF;display:grid;place-items:center;flex:none}   /* 밝은 바탕에 맞춘 로고라 흰 칸에 올린다 */
[data-part="07"] .src .ic .logo{width:40px;height:40px}
[data-part="07"] .hub{position:absolute;left:760px;top:475px;width:400px;height:200px;border:2px solid var(--accent);background:var(--accent-soft);border-radius:4px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px}
[data-part="07"] .hub p{margin:0;font:700 42px/1.2 var(--f-ed);color:var(--ink)}
[data-part="07"] .ppl{position:absolute;left:1414px}
[data-part="07"] .ppl .chip{width:150px;justify-content:center;font-size:28px;padding:12px 0}
[data-part="07"] .step{position:absolute;top:821px}
[data-part="07"] .step .chip{width:200px;justify-content:center;font-size:28px;padding:12px 0}
`,
  html: String.raw`
<!-- 07-01 강조라서 가운데 정렬. 출발점 넷이 먼저(흩어진 정보를), 선이 시간차로(선을 그려), 도착점은 맨 나중에(가운데로) -->
<h2 class="title c" data-at="07-01" data-until="07-02">흩어진 정보를 한곳으로</h2>
<div class="src" style="top:408px" data-at="07-01@흩어진 정보를"><span class="ic"><img class="logo" src="assets/logos/chat.svg" alt=""></span>메신저</div>
<div class="src" style="top:498px;--d:.12s" data-at="07-01@흩어진 정보를"><span class="ic"><img class="logo" src="assets/logos/jira.svg" alt=""></span>티켓</div>
<div class="src" style="top:588px;--d:.24s" data-at="07-01@흩어진 정보를"><span class="ic"><img class="logo" src="assets/logos/google-sheets.svg" alt=""></span>시트</div>
<div class="src" style="top:678px;--d:.36s" data-at="07-01@흩어진 정보를"><span class="ic"><img class="logo" src="assets/logos/confluence.svg" alt=""></span>문서</div>
<div class="hub fx-pop" data-at="07-01@가운데로"><img class="logo m" src="assets/logos/claude.svg" alt=""><p>정리 담당 에이전트</p></div>

<!-- 07-02 그림은 그대로 두고 제목만 바꾼다. 가운데에서 사람에게 강조색 선, 사람은 선이 닿을 때(다시 사람에게). 끝으로 그리는 순서를 한 줄로 다시 짚는다(순서대로) -->
<h2 class="title c" data-at="07-02">모인 정보를 사람에게</h2>
<div class="ppl" style="top:456px;--d:.4s" data-at="07-02@다시 사람에게"><span class="chip">팀원 1</span></div>
<div class="ppl" style="top:546px;--d:.5s" data-at="07-02@다시 사람에게"><span class="chip">팀원 2</span></div>
<div class="ppl" style="top:636px;--d:.6s" data-at="07-02@다시 사람에게"><span class="chip">팀원 3</span></div>
<div class="step" style="left:646px" data-at="07-02@순서대로"><span class="chip">출발한 곳</span></div>
<div class="step" style="left:1074px;--d:.6s" data-at="07-02@순서대로"><span class="chip">도착하는 곳</span></div>

<svg class="wires" viewBox="0 0 1920 1080" aria-hidden="true">
  <path class="w-ink fx-draw" pathLength="1" d="M556 440 C 665 440 645 545 755.5 545" marker-end="url(#ah-ink)" data-at="07-01@선을 그려"/>
  <path class="w-ink fx-draw" pathLength="1" d="M556 530 C 665 530 645 565 755.5 565" marker-end="url(#ah-ink)" data-at="07-01@선을 그려" style="--d:.1s"/>
  <path class="w-ink fx-draw" pathLength="1" d="M556 620 C 665 620 645 585 755.5 585" marker-end="url(#ah-ink)" data-at="07-01@선을 그려" style="--d:.2s"/>
  <path class="w-ink fx-draw" pathLength="1" d="M556 710 C 665 710 645 605 755.5 605" marker-end="url(#ah-ink)" data-at="07-01@선을 그려" style="--d:.3s"/>
  <path class="w-acc fx-draw" pathLength="1" d="M1168 545 C 1295 545 1285 485 1409.5 485" marker-end="url(#ah-acc)" data-at="07-02@다시 사람에게"/>
  <path class="w-acc fx-draw" pathLength="1" d="M1168 575 L 1409.5 575" marker-end="url(#ah-acc)" data-at="07-02@다시 사람에게" style="--d:.1s"/>
  <path class="w-acc fx-draw" pathLength="1" d="M1168 605 C 1295 605 1285 665 1409.5 665" marker-end="url(#ah-acc)" data-at="07-02@다시 사람에게" style="--d:.2s"/>
  <path class="w-ink fx-draw" pathLength="1" d="M858 850 L 1069.5 850" marker-end="url(#ah-ink)" data-at="07-02@순서대로" style="--d:.15s"/>
</svg>
`
};
