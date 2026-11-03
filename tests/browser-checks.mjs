// Real Chrome and generated hosting rules, with third-party requests blocked.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {hostingSource} from '../scripts/build-hosting.mjs';
const routing = vm.createContext({}); vm.runInContext(hostingSource(),routing);
const server = http.createServer((req,res) => {
  const url = new URL(req.url,'http://localhost');
  const response = routing.handler({request:{uri:url.pathname,method:req.method,headers:{host:{value:'ubotcr.com'}},querystring:{}}});
  if(response.statusCode) {
    res.writeHead(response.statusCode,Object.fromEntries(Object.entries(response.headers).map(([k,v])=>[k,v.value]))); res.end(response.body); return;
  }
  const file = path.resolve('dist','.'+response.uri);
  if(!file.startsWith(path.resolve('dist') + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {res.writeHead(404); res.end(); return;}
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png'};
  res.setHeader('Content-Type',types[path.extname(file)] || 'application/octet-stream'); res.end(fs.readFileSync(file));
});
server.listen(0,'127.0.0.1'); await once(server,'listening');
const base = `http://127.0.0.1:${server.address().port}`;
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'ubot-seo-chrome-'));
const proc=spawn(process.env.CHROME_BIN || '/usr/bin/google-chrome',['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
const browserExited = new Promise(resolve => { proc.once('exit', resolve); proc.once('error', resolve); });
const hasExited = () => proc.exitCode !== null || proc.signalCode !== null;
let socket;
try {
  for(let i=0;i<100 && !fs.existsSync(path.join(profile,'DevToolsActivePort'));i++) await new Promise(r=>setTimeout(r,100));
  const port=fs.readFileSync(path.join(profile,'DevToolsActivePort'),'utf8').split('\n')[0];
  const target=await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'})).json();
  socket=new WebSocket(target.webSocketDebuggerUrl); await once(socket,'open');
  let next=0; const pending=new Map();
  socket.addEventListener('message',event=>{const data=JSON.parse(event.data); if(data.id) {const p=pending.get(data.id); pending.delete(data.id); if(data.error) p?.reject(new Error(JSON.stringify(data.error))); else p?.resolve(data.result);}});
  function send(method,params={}) {return new Promise((resolve,reject)=>{const id=++next;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});}
  const evaluate=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true})).result.value;
  await send('Page.enable'); await send('Network.enable');
  await send('Network.setBlockedURLs',{urls:['*googletagmanager.com*','*google-analytics.com*','*googlesyndication.com*','*doubleclick.net*','*fonts.googleapis.com*','*fonts.gstatic.com*']});
  for(const mobile of [false,true]) {
    await send('Emulation.setDeviceMetricsOverride',{width:mobile?390:1280,height:mobile?844:900,deviceScaleFactor:1,mobile});
    for(const route of ['/','/admision','/estandarizadas','/estandarizadas/matematicas','/estandarizadas/matematicas/pendiente-de-una-recta','/blog','/blog/matematicas-estandarizadas-como-prepararse','/terms-of-service']) {
      await send('Page.navigate',{url:base+route});
      let ready=false;
      for(let i=0;i<100;i++) {
        ready=await evaluate(`location.pathname === ${JSON.stringify(route)} && document.readyState === 'complete' && !!document.querySelector('main h1')`);
        if(ready) break; await new Promise(r=>setTimeout(r,50));
      }
      assert.ok(ready,`Page did not load: ${route}`);
      const metrics=await evaluate(`({canonical:document.querySelector('link[rel=canonical]').href, title:document.title, width:innerWidth, contentWidth:document.documentElement.scrollWidth, h1:document.querySelector('main h1').textContent.trim()})`);
      assert.equal(metrics.canonical,'https://ubotcr.com'+route);
      assert.ok(metrics.title && metrics.h1);
      assert.ok(metrics.contentWidth<=metrics.width+2,`Horizontal overflow: ${route}: ${JSON.stringify(metrics)}`);
      if(mobile) {
        await evaluate(`document.querySelector('#menu-toggle').click()`);
        assert.equal(await evaluate(`document.querySelector('#menu-toggle').getAttribute('aria-expanded')`),'true');
        assert.equal(await evaluate(`document.querySelector('#mobile-menu').inert`),false);
      }
    }
  }
  // Exercise the public quizzes rather than only inspecting their initial HTML.
  for (const width of [320, 390, 1280]) {
    await send('Emulation.setDeviceMetricsOverride', {width, height: 844, deviceScaleFactor: 1, mobile: width < 600});
    await send('Emulation.setEmulatedMedia', {features: [{name: 'prefers-reduced-motion', value: 'reduce'}]});
    for (const [product, slug] of [['estandarizadas','pendiente'], ['estandarizadas','funciones-lineales'], ['estandarizadas','porcentajes'], ['admision','planteamiento'], ['admision','patrones'], ['admision','inferencias']]) {
      const route = `/${product}/practica/${slug}`;
      await send('Page.navigate', {url: base + route});
      let ready = false;
      for (let i = 0; i < 100; i++) {
        ready = await evaluate(`location.pathname === ${JSON.stringify(route)} && document.readyState === 'complete' && !!document.querySelector('[data-check]:not([hidden])')`);
        if (ready) break;
        await new Promise(r => setTimeout(r, 50));
      }
      assert.ok(ready, `Quiz failed to initialize: ${route}`);
      await evaluate(`document.querySelector('#ubot-consent')?.remove()`);
      const assertNoOverflow = async () => assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth + 2'), `Quiz overflow: ${width} ${route}`);
      await assertNoOverflow();
      assert.equal(await evaluate(`document.querySelectorAll('[data-question]:not([hidden])').length`), 1);
      await evaluate(`document.querySelector('[data-check]').click()`);
      assert.ok(await evaluate(`document.querySelector('[data-result]').textContent.includes('Elegí')`));
      for (let question = 0; question < 5; question++) {
        await evaluate(`document.querySelector('[data-question]:not([hidden]) input[data-correct="${question === 0 ? 'false' : 'true'}"]').click(); document.querySelector('[data-check]').click()`);
        assert.ok(await evaluate(`document.activeElement.matches('[data-feedback]')`), 'Feedback must receive focus');
        assert.ok(await evaluate(`document.querySelector('[data-question]:not([hidden]) details').open`));
        assert.equal(await evaluate(`document.querySelectorAll('[data-question]:not([hidden]) input:not(:disabled)').length`), 0);
        await assertNoOverflow();
        // A second submission cannot change the score.
        await evaluate(`document.querySelector('[data-practice]').requestSubmit(); document.querySelector('[data-next]').click()`);
        if (question < 4) {
          assert.ok(await evaluate(`document.activeElement.tagName === 'LEGEND'`));
          const visible = await evaluate(`new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(document.activeElement.getBoundingClientRect().top >= document.querySelector('header').getBoundingClientRect().bottom))))`);
          assert.ok(visible, 'Question must remain below the sticky header');
        }
      }
      assert.ok(await evaluate(`document.querySelector('[data-result]').textContent.startsWith('4 de 5')`));
      assert.equal(await evaluate(`document.querySelectorAll('[data-question]:not([hidden])').length`), 5);
      await assertNoOverflow();
      await evaluate(`document.querySelector('[data-restart]').click()`);
      assert.equal(await evaluate(`document.querySelectorAll('[data-practice] input:checked').length`), 0);
      assert.equal(await evaluate(`document.querySelectorAll('[data-question]:not([hidden])').length`), 1);
      assert.equal(await evaluate(`document.querySelector('progress').value`), 0);
    }
  }
  await send('Emulation.setScriptExecutionDisabled', {value: true});
  await send('Page.navigate', {url: base + '/admision/practica/inferencias'});
  for (let i = 0; i < 100; i++) {
    if (await evaluate(`location.pathname === '/admision/practica/inferencias' && document.readyState === 'complete' && document.querySelectorAll('[data-question]').length === 5`)) break;
    await new Promise(r => setTimeout(r, 50));
  }
  assert.equal(await evaluate(`document.querySelectorAll('[data-question]:not([hidden])').length`), 5);
  assert.equal(await evaluate(`document.querySelectorAll('[data-question] details').length`), 5);
  await send('Emulation.setScriptExecutionDisabled', {value: false});
  console.log('PASS quizzes: six units at 320/390/1280px, validation, feedback, locking, score, restart, focus, overflow and no-JS content');
  console.log('PASS Chrome: 8 pages desktop/mobile, rendered metadata, content, overflow and mobile menu; analytics blocked');
} finally {
  // Let Chrome flush its profile and stop its children before removing the directory.
  if (socket?.readyState === WebSocket.OPEN) {
    try { socket.send(JSON.stringify({id: -1, method: 'Browser.close'})); } catch { }
  }
  await Promise.race([browserExited, new Promise(resolve => setTimeout(resolve, 2000))]);
  if (!hasExited()) {
    proc.kill('SIGTERM');
    await Promise.race([browserExited, new Promise(resolve => setTimeout(resolve, 1000))]);
    if (!hasExited()) proc.kill('SIGKILL');
  }
  socket?.close(); server.close(); server.closeAllConnections();
  try {
    await fs.promises.rm(profile,{recursive:true,force:true,maxRetries:10,retryDelay:200});
  } catch (error) {
    // Child processes may briefly recreate profile files even after the launcher exits.
    // The runner removes temporary files; preserve the actual test result in this case.
    if (!['ENOTEMPTY', 'EBUSY'].includes(error.code)) throw error;
    console.warn(`Chrome profile cleanup deferred to runner: ${profile} (${error.code})`);
  }
}
