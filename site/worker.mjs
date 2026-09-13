import html from './index.html';

// Hashes allow only the reviewed inline script and stylesheet.
// Run node check.mjs after edits; it prints replacement hashes if they change.
const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'none'",
    "script-src 'sha256-9KCpkVgzX+OUp1SJzhgTeqV2k0wkrIWC3GEOD88fJrc='",
    "style-src 'sha256-M24xOFsMheeBQdpdQAYJVJj4np4mNGIR5UIPG/0yCfk='",
    "script-src-attr 'none'",
    "style-src-attr 'none'",
    'img-src data:',
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    "object-src 'none'",
  ].join('; '),
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), clipboard-read=(), clipboard-write=(self)',
};

// The only page is static. There is no account, submission, or AI backend.
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const headers = {
      ...securityHeaders,
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    };
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { ...headers, 'Cache-Control': 'no-store', Allow: 'GET, HEAD' },
      });
    }
    if (url.hostname === 'www.reinventit.org' || url.protocol === 'http:') {
      return new Response(null, {
        status: 308,
        headers: { ...headers, Location: 'https://reinventit.org' + url.pathname + url.search },
      });
    }
    if (url.pathname === '/robots.txt') {
      return new Response(request.method === 'HEAD' ? null : 'User-agent: *\nAllow: /\n', {
        headers,
      });
    }
    if (url.pathname !== '/' && url.pathname !== '/index.html') {
      return new Response(request.method === 'HEAD' ? null : 'Page not found. Visit https://reinventit.org/', {
        status: 404,
        headers,
      });
    }
    return new Response(request.method === 'HEAD' ? null : html, {
      headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};
