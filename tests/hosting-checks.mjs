import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {hostingSource, htmlRoutes} from '../scripts/build-hosting.mjs';
const ctx = vm.createContext({});
const source = hostingSource();
assert.ok(Buffer.byteLength(source) <= 10000);
vm.runInContext(source, ctx);
const run = (uri, host = 'ubotcr.com', method = 'GET') => ctx.handler({request: {uri, method, headers: {host: {value: host}}, querystring: {utm_source: {value:'a%20b'}}}});
for (const method of ['GET','HEAD']) {
  for (const route of htmlRoutes().filter(r => r !== '/404')) {
    assert.equal(run(route, undefined, method).uri, route === '/' ? '/index.html' : route + '/index.html');
  }
}
assert.equal(run('/estandarizadas/').headers.location.value, 'https://ubotcr.com/estandarizadas?utm_source=a%20b');
assert.equal(run('/estandarizadas/index.html','www.ubotcr.com').headers.location.value, 'https://ubotcr.com/estandarizadas?utm_source=a%20b');
assert.equal(run('/index.html').headers.location.value, 'https://ubotcr.com/?utm_source=a%20b');
assert.equal(run('/no-existe').statusCode,404);
assert.equal(run('/404').statusCode,404);
assert.equal(run('/404.html').statusCode,404);
assert.equal(run('/no-existe', undefined, 'HEAD').body, '');
assert.equal(run('/sitemap.xml').headers.location.value,'https://ubotcr.com/sitemap-index.xml');
for (const uri of ['/robots.txt','/sitemap-index.xml','/images/missing.png']) assert.equal(run(uri).uri, uri);
const headers = vm.createContext({}); vm.runInContext(fs.readFileSync('docs/aws/landing-headers.js','utf8'),headers);
for (const host of ['ubotcr.com','preview.azurestaticapps.net','test.cloudfront.net']) {
  const result = headers.handler({request:{headers:{host:{value:host}}},response:{headers:{'content-type':{value:'text/html'}}}});
  assert.equal(result.headers['x-robots-tag']?.value, host === 'ubotcr.com' ? undefined : 'noindex');
}
console.log('PASS landing routing, canonical redirects, queries, 404s and preview headers');
