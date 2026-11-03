import fs from 'node:fs';
import path from 'node:path';
export function htmlRoutes(root = 'dist') {
  return fs.readdirSync(root, { recursive: true }).filter(file => file.endsWith('.html')).map(file => {
    const route = '/' + file.replaceAll(path.sep, '/').replace(/(?:^|\/)index\.html$/, '').replace(/\.html$/, '');
    return route.replace(/\/+$/, '') || '/';
  }).sort();
}
export function hostingSource(root = 'dist') {
  return `// Generated from built HTML; publish to CloudFront Viewer request.\nvar routes = ${JSON.stringify(htmlRoutes(root), null, 2)};
function queryText(query) {
  var pairs = [];
  Object.keys(query || {}).forEach(function(key) {
    var entry = query[key];
    (entry.multiValue || [entry]).forEach(function(part) { pairs.push(key + '=' + part.value); });
  });
  return pairs.length ? '?' + pairs.join('&') : '';
}
function handler(event) {
  var request = event.request;
  if (request.method !== 'GET' && request.method !== 'HEAD') return request;
  var host = request.headers.host.value;
  var uri = request.uri;
  var clean = uri.replace(/\\/index\\.html$/, '').replace(/\\/+$/, '') || '/';
  if (clean === '/index.html') clean = '/';
  if (host === 'www.ubotcr.com' || clean !== uri) {
    return { statusCode: 301, statusDescription: 'Moved Permanently', headers: {location: {value: 'https://ubotcr.com' + clean + queryText(request.querystring)}} };
  }
  if (uri === '/404.html') {
    return {statusCode: 404, statusDescription: 'Not Found', headers: {'x-robots-tag': {value: 'noindex'}}};
  }
  if (uri === '/sitemap.xml') {
    return { statusCode: 301, statusDescription: 'Moved Permanently', headers: {location: {value: 'https://ubotcr.com/sitemap-index.xml'}} };
  }
  if (routes.indexOf(uri) !== -1 && uri !== '/404') {
    request.uri = uri === '/' ? '/index.html' : uri + '/index.html';
    return request;
  }
  if (uri.split('/').pop().indexOf('.') !== -1) return request;
  return {
    statusCode: 404,
    statusDescription: 'Not Found',
    headers: {
      'content-type': {value: 'text/html; charset=utf-8'},
      'x-robots-tag': {value: 'noindex'}
    },
    body: request.method === 'HEAD' ? '' : [
      '<!doctype html><html lang="es">',
      '<title>Página no encontrada | Ubot</title>',
      '<h1>Página no encontrada</h1>',
      '<a href="/">Volver al inicio</a></html>'
    ].join('')
  };
}
`;
}
if (process.argv[1]?.endsWith('build-hosting.mjs')) {
  fs.mkdirSync('hosting', { recursive: true });
  const source = hostingSource();
  if (Buffer.byteLength(source) > 10000) throw new Error('CloudFront function exceeds 10 KB; split route inventory');
  fs.writeFileSync('hosting/landing-routes.js', source);
}
