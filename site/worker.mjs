import assets from './generated-assets.mjs';
const commonHeaders = {
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), clipboard-read=(), clipboard-write=(self)',
};
const closedCsp = "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; object-src 'none'";
function basicHeaders() {
  return {...commonHeaders,'Content-Type':'text/plain; charset=utf-8','Content-Security-Policy':closedCsp,'Cache-Control':'no-store'};
}
// A static allowlist, never a workspace file server. No request data is rendered.
export default {
  async fetch(request) {
    const url=new URL(request.url);
    if(request.method!=='GET'&&request.method!=='HEAD') return new Response('Method not allowed',{status:405,headers:{...basicHeaders(),Allow:'GET, HEAD'}});
    if(url.hostname==='www.reinventit.org'||url.protocol==='http:')return new Response(null,{status:308,headers:{...basicHeaders(),Location:'https://reinventit.org'+url.pathname+url.search}});
    let route;
    try { route=decodeURIComponent(url.pathname); } catch {
      return new Response(request.method==='HEAD'?null:'Invalid path',{status:400,headers:basicHeaders()});
    }
    if(route==='/play'||route==='/challenges')return new Response(null,{status:308,headers:{...basicHeaders(),Location:'https://reinventit.org'+route+'/'}});
    if(route==='/index.html')route='/';
    if(!Object.hasOwn(assets,route))return new Response(request.method==='HEAD'?null:'Page not found. Browse challenges at https://reinventit.org/challenges/',{status:404,headers:basicHeaders()});
    const asset=assets[route];
    const headers={...commonHeaders,'Content-Type':asset.type,'Content-Security-Policy':asset.csp,'ETag':asset.etag,'Cache-Control':asset.immutable?'public, max-age=31536000, immutable':'public, max-age='+(asset.maxAge??300)};
    if(asset.spoilers||asset.noindex)headers['X-Robots-Tag']='noindex, nofollow';
    if(asset.spoilers)headers['X-Reinvent-It-Content']='gm-spoilers';
    if(asset.status===410){headers['Cache-Control']='no-store';headers['X-Robots-Tag']='noindex, nofollow';}
    if(!asset.status||asset.status===200) {
      const validators=request.headers.get('if-none-match')?.split(',').map(v=>v.trim().replace(/^W\//,''));
      if(validators?.includes(asset.etag)||validators?.includes('*'))return new Response(null,{status:304,headers});
    }
    return new Response(request.method==='HEAD'?null:asset.body,{status:asset.status??200,headers});
  }
};
