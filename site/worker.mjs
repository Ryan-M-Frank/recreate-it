import html from './index.html';

// The only page is static. There is no account, submission, or AI backend.
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    if (url.hostname === 'www.reinventit.org' || url.protocol === 'http:') {
      return Response.redirect('https://reinventit.org' + url.pathname + url.search, 308);
    }
    const headers = {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
    };
    if (url.pathname === '/robots.txt') {
      return new Response(request.method === 'HEAD' ? null : 'User-agent: *\nAllow: /\n', {
        headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
    if (url.pathname !== '/' && url.pathname !== '/index.html') {
      return new Response(request.method === 'HEAD' ? null : 'Page not found. Visit https://reinventit.org/', {
        status: 404,
        headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
    return new Response(request.method === 'HEAD' ? null : html, { headers });
  },
};
