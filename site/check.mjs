import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const html = fs.readFileSync(new URL('index.html', import.meta.url), 'utf8');
const source = fs.readFileSync(new URL('worker.mjs', import.meta.url), 'utf8')
  .replace("import html from './index.html';", 'const html = ' + JSON.stringify(html) + ';');
const worker = (await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'))).default;
const request = (path, method = 'GET') => worker.fetch(new Request('https://reinventit.org' + path, { method }));
const home = await request('/');
const csp = home.headers.get('content-security-policy');
assert(csp, 'Missing CSP');
const directives = new Map(csp.split(';').map(s => {
  const [name, ...values] = s.trim().split(/\s+/);
  return [name, values.join(' ')];
}));
for (const name of ['default-src', 'base-uri', 'form-action', 'frame-ancestors', 'object-src', 'script-src-attr', 'style-src-attr']) {
  assert.equal(directives.get(name), "'none'", name);
}
assert.equal(directives.get('img-src'), 'data:');
assert(!csp.includes('unsafe-inline') && !csp.includes('unsafe-eval'));
for (const tag of ['script', 'style']) {
  const blocks = [...html.matchAll(new RegExp('<' + tag + '>([\\s\\S]*?)</' + tag + '>', 'g'))];
  assert.equal(blocks.length, 1, 'Review CSP before adding more ' + tag + ' blocks');
  // HTML parsers normalize CRLF before evaluating CSP hashes.
  const hash = 'sha256-' + createHash('sha256').update(blocks[0][1].replace(/\r\n?/g, '\n')).digest('base64');
  assert.equal(directives.get(tag + '-src'), "'" + hash + "'", 'Update ' + tag + '-src to: ' + hash);
}
assert(!/<(?:script|style)\s|\son\w+\s*=|\sstyle\s*=/i.test(html), 'Review new inline attributes or external assets');
assert(!/<(?:iframe|form|object|embed)\b/i.test(html), 'Review new interactive content');
assert(!/href="[^"]*gm\.md/.test(html), 'Do not directly link the GM packet');
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
for (const m of html.matchAll(/href="#([^"]+)"/g)) assert(ids.has(m[1]), 'Missing anchor: ' + m[1]);

let cases = 0;
for (const path of ['/', '/index.html', '/robots.txt', '/missing', '/.env', '/.git/config', '/worker.mjs', '/challenges/RI-0001/gm.md', '/%3Cscript%3Eprobe%3C/script%3E']) {
  for (const method of ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS']) {
    const response = await request(path, method);
    const read = method === 'GET' || method === 'HEAD';
    const found = ['/', '/index.html', '/robots.txt'].includes(path);
    assert.equal(response.status, read ? (found ? 200 : 404) : 405, method + ' ' + path);
    assert.equal(response.headers.get('content-security-policy'), csp);
    assert.equal(response.headers.get('x-frame-options'), 'DENY');
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
    assert.equal(response.headers.get('strict-transport-security'), 'max-age=31536000');
    assert(response.headers.get('permissions-policy').includes('clipboard-write=(self)'));
    assert(response.headers.get('permissions-policy').includes('clipboard-read=()'));
    assert(!response.headers.has('set-cookie'));
    if (!read) {
      assert.equal(response.headers.get('allow'), 'GET, HEAD');
      assert.equal(response.headers.get('cache-control'), 'no-store');
    }
    const body = await response.text();
    if (method === 'HEAD') assert.equal(body, '');
    else if (response.status === 200 && path !== '/robots.txt') {
      assert.equal(body, html);
      assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
    } else {
      assert.equal(response.headers.get('content-type'), 'text/plain; charset=utf-8');
      assert(!body.includes('<script>') && !body.includes('GM PACKET'));
    }
    cases++;
  }
}
const probe = await request('/?probe=' + encodeURIComponent('<script>alert(1)</script>'));
assert.equal(await probe.text(), html, 'Query data must never enter page HTML');
for (const url of ['http://reinventit.org/path?q=1', 'https://www.reinventit.org/path?q=1', 'https://www.reinventit.org//example.invalid/?q=1']) {
  for (const method of ['GET', 'HEAD']) {
    const response = await worker.fetch(new Request(url, { method }));
    assert.equal(response.status, 308);
    assert.equal(new URL(response.headers.get('location')).origin, 'https://reinventit.org');
    assert.equal(response.headers.get('content-security-policy'), csp);
    assert.equal(await response.text(), '');
  }
}
const js = html.match(/<script>([\s\S]*?)<\/script>/)[1];
for (const fails of [false, true]) {
  let handler, copied;
  const nodes = {
    copy: { addEventListener: (_, fn) => { handler = fn; } },
    starter: { value: 'TEST PROMPT', focus() {}, select() { this.selected = true; } },
    'copy-status': {}, 'prompt-details': { open: false },
  };
  const context = {
    document: { getElementById: id => nodes[id] },
    navigator: { clipboard: { writeText: async text => { if (fails) throw Error('denied'); copied = text; } } },
  };
  vm.runInNewContext(js, context);
  await handler();
  if (fails) assert(nodes['prompt-details'].open && nodes.starter.selected);
  else assert.equal(copied, 'TEST PROMPT');
}
console.log('PASS: ' + cases + ' route/method cases, security headers, exact CSP hashes, unreflected input, canonical redirects, anchors, and clipboard success/fallback.');

