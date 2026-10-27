// 한 파트를 장표만 보기 모드로 넘기며 화면을 찍고 9장씩 모은다(헤드리스 Chrome · 시계 8배속). Node 22 이상.
//   node tools/shoot.mjs --part 03 --port 9371 --out /tmp/shots-03          # 누를 때마다 한 장(장표가 계산한 멈춤 전부)
//   node tools/shoot.mjs --part 03 --port 9371 --out /tmp/shots-03 --keys   # 문단 시작 + clicks 만(리뷰 보드용 핵심 화면)
//   node tools/shoot.mjs --presenter 1470x956 --port 9371 --out /tmp/pv     # 발표자 화면: 문단마다 대본 칸이 넘치는지
// 출력: <out>/NN-<문단>.png (960×540, --scale 1 이면 1920×1080), <out>/sheet-K.png, 콘솔 경고 · 오류 목록
//   --page index.html (기본) · --wait 1300 (누른 뒤 기다릴 ms) · Chrome 위치는 환경 변수 CHROME 으로 바꾼다
import { spawn } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const PART = arg('part'), PV = arg('presenter'), PORT = +arg('port', 9371), SPEED = +arg('speed', 8), SCALE = +arg('scale', .5);
const OUT = resolve(arg('out', join(tmpdir(), `jsp-shots-${PART || 'presenter'}`)));
const PAGE = arg('page', 'index.html'), WAIT = +arg('wait', 1300), KEYS_ONLY = process.argv.includes('--keys');
const DECK = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'deck');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!PART && !PV) { console.error('--part NN 또는 --presenter 1470x956 필요'); process.exit(2); }
rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT, { recursive: true });

const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${join(OUT, '.chrome')}`, '--window-size=1920,1080', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required', '--mute-audio', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let list; for (let i = 0; i < 60; i++) { try { list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); if (list.length) break; } catch {} await sleep(200); }
if (!list) { console.error('Chrome 에 붙지 못함(포트가 겹치는지 보세요):', PORT); chrome.kill(); process.exit(1); }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r, { once: true }));
let id = 0; const wait = new Map(), logs = [];
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data);
  if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id); }
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type !== 'log') logs.push(`[${m.params.type}] ` + m.params.args.map(a => a.value ?? a.description ?? '').join(' '));
  if (m.method === 'Runtime.exceptionThrown') logs.push('[exception] ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text)); });
const send = (method, params = {}) => new Promise(r => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expression => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
const KEYS = { Space: [' ', 32], ArrowRight: ['ArrowRight', 39] };
const key = async code => { const [k, vk] = KEYS[code]; await send('Input.dispatchKeyEvent', { type: 'keyDown', code, key: k, windowsVirtualKeyCode: vk }); await send('Input.dispatchKeyEvent', { type: 'keyUp', code, key: k, windowsVirtualKeyCode: vk }); };
const shot = async (file, scale = SCALE, w = 1920, h = 1080) => { const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: h, scale } }); writeFileSync(file, Buffer.from(r.result.data, 'base64')); };
const finish = async () => {
  const uniq = [...new Set(logs)];
  console.log(uniq.length ? '--- 콘솔\n' + uniq.join('\n') : '콘솔 경고 · 오류 없음');
  ws.close(); chrome.kill(); await new Promise(r => { chrome.once('exit', r); setTimeout(r, 3000); });
  try { rmSync(join(OUT, '.chrome'), { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch {}
};

await send('Runtime.enable'); await send('Page.enable');
await send('Page.addScriptToEvaluateOnNewDocument', { source: `try{localStorage.clear()}catch(e){}; const __pn = performance.now.bind(performance); performance.now = () => __pn() * ${SPEED};` });
const url = h => pathToFileURL(join(DECK, PAGE)).href + '?mode=live' + h;
// 장표 서체가 이 기기에 있는지(시작 화면 서체 확인 문구). 아무것도 받거나 설치하지 않고 볼 수 있는 방법이다
const fontLine = async () => { await sleep(300); console.log('서체:', (await ev(`(document.querySelector('#fontNote') || {}).textContent || '알 수 없음'`))); };

// ── 발표자 화면: 노트북 크기에서 문단마다 대본 칸이 스크롤 없이 들어가는지 ──
if (PV) {
  const [W, H] = PV.split('x').map(Number);
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: url('#presenter') });
  await sleep(2500);
  await fontLine();
  const ids = await ev('window.DECK.parts.flatMap(p => p.paras.map(q => q.id))');
  const over = [];
  for (const pid of ids) {
    await ev(`window.deckDebug.goPara(${JSON.stringify(pid)})`); await sleep(150);
    const o = await ev('window.deckDebug.overflow()');
    if (o > 0) over.push(`${pid} +${o}px`);
  }
  await ev(`window.deckDebug.goPara(${JSON.stringify(ids[0])})`); await sleep(400);
  await shot(join(OUT, `presenter-${W}x${H}.png`), 1, W, H);
  console.log(`발표자 화면 ${W}×${H}: 문단 ${ids.length}개 중 대본 칸이 넘치는 문단 ${over.length}개${over.length ? ' · ' + over.join(' · ') : ''} → ${OUT}`);
  await finish(); process.exit(0);
}

await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: url('#p' + PART) });   // #pNN = 그 파트에서 시작
await sleep(2500);
await fontLine();

// 멈춤은 장표가 계산한 값을 그대로 쓴다. window.__holds(멈춤) · __keys(문단 시작 + clicks) · __step(모든 전환 직접 넘김인지)
const pi = await ev(`window.DECK.parts.findIndex(p => p.id === ${JSON.stringify(PART)})`);
if (!(pi >= 0) || !(await ev('!!window.__holds'))) { console.error('장표에서 멈춤을 읽지 못함:', PART, '\n' + logs.join('\n')); await finish(); process.exit(1); }
const H = await ev(`window.__holds[${pi}]`), K = await ev(`window.__keys[${pi}]`), STEP = await ev('window.__step');
const dur = await ev(`(() => { const p = window.DECK.parts[${pi}], T = window.TIMING || {}; return T[p.id] || (T[p.paras[p.paras.length - 1].id] || [0, 0, 60])[2]; })()`);
// --keys: 핵심 지점 j 마다 '다음 핵심 지점 직전'의 마지막 멈춤을 찍는다. 이름은 NN-<문단>_<n>_<m>
const plan = new Map();
if (KEYS_ONLY && STEP) K.forEach((k, j) => {
  const end = j + 1 < K.length ? K[j + 1].t - 0.02 : Infinity, same = K.filter(x => x.id === k.id);
  let b = 0; H.forEach((h, i) => { if (h.t1 <= end) b = i; });
  plan.set(b, (plan.get(b) || []).concat(`${String(j + 1).padStart(2, '0')}-${k.id}_${same.indexOf(k) + 1}_${same.length}.png`));
});

await key('Space'); await sleep(300);   // 시작 화면 → 그 파트
const names = [];
for (let b = 0; b < H.length; b++) {
  if (b > 0) await key('ArrowRight');
  if (plan.size) {
    if (!plan.has(b)) { await sleep(120); continue; }
    await sleep(WAIT);
    for (const n of plan.get(b)) { await shot(join(OUT, n)); names.push(n); }
    continue;
  }
  // STEP_EVERY=false 엔진은 누른 뒤 시계가 흐르니 다음 멈춤 직전까지 기다린다
  if (!STEP) await sleep(((b + 1 < H.length ? H[b + 1].t0 : dur) - H[b].t0) / 0.85 / SPEED * 1000);
  await sleep(WAIT);
  const where = (await ev(`document.querySelector('#fpid').textContent`)) || '';
  const name = `${String(b + 1).padStart(2, '0')}-${where.replace(/[^\w-]+/g, '_')}.png`;
  await shot(join(OUT, name)); names.push(name);
}
// 9장씩 모은 판
const ROW = 356 + 26 + 12;
writeFileSync(join(OUT, 'sheet.html'), '<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#333;font:600 18px -apple-system}main{display:grid;grid-template-columns:repeat(3,632px);gap:12px;padding:12px}figure{margin:0}img{width:632px;height:356px;display:block}figcaption{color:#fff;padding:5px 0 0;height:26px;box-sizing:border-box}</style><main>' + names.map(n => `<figure><img src="${n}"><figcaption>${n.slice(0, -4)}</figcaption></figure>`).join('') + '</main>');
await send('Emulation.setDeviceMetricsOverride', { width: 1932, height: 1200, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: pathToFileURL(join(OUT, 'sheet.html')).href }); await sleep(1500);
for (let s = 0; s < Math.ceil(names.length / 9); s++) {
  const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: s * 3 * ROW, width: 1932, height: 3 * ROW + 12, scale: 1 } });
  writeFileSync(join(OUT, `sheet-${s + 1}.png`), Buffer.from(r.result.data, 'base64'));
}
console.log(`${PART}: ${plan.size ? `핵심 ${K.length}곳` : `누름 ${H.length}번`} · 화면 ${names.length}장 · 모음 ${Math.ceil(names.length / 9)}장 → ${OUT}`);
await finish();
