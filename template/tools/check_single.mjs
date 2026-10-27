// 공유용 한 파일 장표를 HTML 공유 서비스처럼 띄워 본다: allow-scripts 만 준 샌드박스 iframe(출처 없음 · localStorage 막힘).
// 콘솔 · 서체 · 이미지 · 음성을 보고, 처음부터 끝까지 장표만 보기로 눌러 찍는다(시계 8배속). Node 22 이상.
// 마지막으로 공유본 스펙(서체 내장)을 본다: 설치 서체를 못 쓰게 바꾼 사본에서도 장표 서체가 모두 떠야 통과. 실패하면 종료 코드 1.
//   node tools/check_single.mjs dist/<제목>.html <out> [port]
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , FILE, OUT0, PORT = '9451'] = process.argv;
if (!FILE || !OUT0) { console.error('사용: node tools/check_single.mjs <한 파일 html> <출력 폴더> [port]'); process.exit(2); }
const OUT = resolve(OUT0);
if (!existsSync(FILE)) { console.error('파일이 없습니다:', FILE); process.exit(2); }
rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT, { recursive: true });
// 공유 서비스처럼 파일을 샌드박스 iframe 에 띄우는 틀(같은 폴더에 둬야 file:// 로 읽힌다)
const harness = join(dirname(resolve(FILE)), '.check-harness.html');
writeFileSync(harness, `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;height:100%;background:#000}iframe{border:0;width:100%;height:100%;display:block}</style>
<iframe sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-modals" src="${encodeURI(basename(FILE))}"></iframe>`);

const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${OUT}/.chrome`, '--window-size=1920,1080',
  '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required', '--mute-audio', '--no-first-run', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let list; for (let i = 0; i < 60; i++) { try { list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); if (list.length) break; } catch {} await sleep(200); }
if (!list) { console.error('Chrome 에 붙지 못함:', PORT); chrome.kill(); process.exit(1); }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r, { once: true }));

const SPEEDUP = 'const __pn = performance.now.bind(performance); performance.now = () => __pn() * 8;';
let id = 0; const wait = new Map(), logs = [], ctxs = [];
const send = (method, params = {}, sessionId) => new Promise(r => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
ws.addEventListener('message', async ev => {
  const m = JSON.parse(ev.data);
  if (m.id && wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id); return; }
  const s = m.sessionId;
  if (m.method === 'Target.attachedToTarget') {   // 다른 프로세스로 뜬 iframe
    const c = m.params.sessionId;
    await send('Runtime.enable', {}, c); await send('Page.enable', {}, c);
    await send('Page.addScriptToEvaluateOnNewDocument', { source: SPEEDUP }, c);
    await send('Runtime.runIfWaitingForDebugger', {}, c);
  }
  if (m.method === 'Runtime.executionContextCreated') ctxs.push({ s, ...m.params.context });
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type !== 'log') logs.push(`[${m.params.type}] ` + m.params.args.map(a => a.value ?? a.description ?? '').join(' ').slice(0, 300));
  if (m.method === 'Runtime.exceptionThrown') logs.push('[exception] ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).slice(0, 300));
  if (m.method === 'Log.entryAdded' && m.params.entry.level !== 'verbose') logs.push(`[log ${m.params.entry.level}] ${m.params.entry.text.slice(0, 200)}`);
});

await send('Runtime.enable'); await send('Page.enable'); await send('Log.enable');
await send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true, flatten: true });
await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await send('Page.addScriptToEvaluateOnNewDocument', { source: SPEEDUP });
const main = (await send('Page.getFrameTree')).result.frameTree.frame.id;
await send('Page.navigate', { url: pathToFileURL(harness).href });
await sleep(6000);

const deck = ctxs.filter(c => c.auxData?.isDefault && (c.s || c.auxData.frameId !== main)).pop();
const done = async code => { ws.close(); chrome.kill(); try { rmSync(harness); } catch {} await sleep(500); try { rmSync(join(OUT, '.chrome'), { recursive: true, force: true }); } catch {} process.exit(code); };
if (!deck) { console.log('장표 iframe 을 못 찾음\n' + logs.join('\n')); await done(1); }
const ev = async expression => {
  const r = await send('Runtime.evaluate', { expression, contextId: deck.id, returnByValue: true, awaitPromise: true }, deck.s);
  return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description ?? r.error;
};
const KEYS = { Space: [' ', 32], ArrowRight: ['ArrowRight', 39], KeyM: ['m', 77], Digit1: ['1', 49] };
const key = async code => { const [k, vk] = KEYS[code]; for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, code, key: k, windowsVirtualKeyCode: vk }); };
const shot = async file => { const r = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1920, height: 1080, scale: 0.5 } }); writeFileSync(file, Buffer.from(r.result.data, 'base64')); };

await sleep(1000);
const info = await ev(`(async () => {
  let ls; try { localStorage.length; ls = '열림'; } catch (e) { ls = '막힘(' + e.name + ')'; }
  const faces = Array.from(document.fonts).filter(f => /^"?(Ed|Pre)"?$/.test(f.family));
  await Promise.allSettled(faces.map(f => f.load()));
  return { 출처: self.origin, 문서모드: document.compatMode, localStorage: ls,
    서체: faces.filter(f => f.status === 'loaded').length + '/' + faces.length + ' 로드',
    서체확인: document.querySelector('#fontNote').textContent,
    이미지: document.images.length + '개 · 깨짐 ' + [...document.images].filter(i => i.complete && !i.naturalWidth).length };
})()`);
console.log(JSON.stringify(info, null, 1));
const audio = await ev(`Promise.all(DECK.parts.filter(p => p.audio).map(p => new Promise(res => { const a = new Audio(); a.preload = 'metadata';
  a.onloadedmetadata = () => res(p.id + ' ' + a.duration.toFixed(1) + '초'); a.onerror = () => res(p.id + ' 오류 ' + (a.error && a.error.code)); a.src = p.audio; })))`);
console.log('음성:', Array.isArray(audio) && audio.length ? audio.join(' · ') : '없음');
await shot(`${OUT}/00-start.png`);

// 장표 iframe 에 포커스 → 장표만 보기로 처음부터 끝까지 누른다
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 4, y: 4, button: 'left', clickCount: 1 });
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 4, y: 4, button: 'left', clickCount: 1 });
await ev('window.focus()');
if ((await ev(`document.querySelector('#stage').dataset.mode`)) !== 'live') { await key('KeyM'); await sleep(300); }
await key('Space'); await sleep(300);
const holds = await ev('window.__holds && window.__holds.map(h => h.length)');
if (!Array.isArray(holds)) { console.log('장표 엔진이 뜨지 않았습니다(멈춤 정보 없음)\n' + [...new Set(logs)].join('\n')); await done(1); }
const total = holds.reduce((a, b) => a + b, 0);
for (let n = 0; n < total; n++) {
  if (n > 0) await key('ArrowRight');
  await sleep(900);
  await shot(`${OUT}/${String(n + 1).padStart(3, '0')}.png`);
}
console.log(`누름 ${total}번 찍음 → ${OUT}`);
console.log('이미지(전부 넘긴 뒤):', await ev(`document.images.length + '개 · 깨짐 ' + [...document.images].filter(i => i.complete && !i.naturalWidth).length`));
const uniq = [...new Set(logs)];
console.log(uniq.length ? '--- 콘솔\n' + uniq.join('\n') : '콘솔 경고 · 오류 없음');

// 공유본 스펙: 서체가 파일 안에 들어 있어야 한다. local() 이름을 없는 이름으로 바꾼 사본(= 서체가 없는 기기)으로 다시 연다
const nolocal = join(dirname(resolve(FILE)), '.check-nolocal.html');
writeFileSync(nolocal, readFileSync(resolve(FILE), 'utf8').replace(/local\(\s*["'][^"']*["']\s*\)/g, 'local("__jsp_no_font__")'));
await send('Page.navigate', { url: pathToFileURL(nolocal).href });
await sleep(3000);
const fr = (await send('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression: `(async () => {
  const fs = Array.from(document.fonts).filter(f => /^"?(Ed|Pre)"?$/.test(f.family));
  await Promise.allSettled(fs.map(f => f.load()));
  return [fs.filter(f => f.status === 'loaded').length, fs.length];
})()` })).result?.result?.value || [0, 0];
rmSync(nolocal, { force: true });
const fontsOk = fr[1] > 0 && fr[0] === fr[1];
console.log(`서체 내장(설치 서체 없이): ${fr[0]}/${fr[1]} 로드 → ${fontsOk ? '통과' : '실패. 공유본에 서체가 빠졌다(build_single.py 로 다시 만든다)'}`);
await done(fontsOk ? 0 : 1);
