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
  console.log('PASS Chrome: 8 pages desktop/mobile, rendered metadata, content, overflow and mobile menu; analytics blocked');
} finally {
  socket?.close(); proc.kill(); server.close();
  await new Promise(resolve=>{if(proc.exitCode !== null) resolve(); else proc.once('exit',resolve);});
  fs.rmSync(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}
