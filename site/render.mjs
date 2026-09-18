// Render only reviewed catalog data; escape every inserted value.
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function starter(code) {
  return "Let's play Reinvent It in solo mode.\n\nRead https://reinventit.org/start.md and follow its official discovery instructions.\n\n" +
    (code ? 'Use the exact run code '+code+'. Do not substitute another challenge. Warn me about prior exposure if my HISTORY overlaps.\n\n' : 'Choose a released challenge using my HISTORY.md if I provide it. Avoid conceptual repeats and vary your choice among suitable unseen challenges. If none is fresh, tell me and offer an intentional repeat.\n\n') +
    'Load the pinned game rules and player/GM packets yourself. Keep GM-only material, target names, and answers out of your replies until I finish and request the reveal. Present all fixed requirements, let me invent, and ask before giving hints.\n\nIf any required file cannot be retrieved, name it and stop rather than inventing its contents.';
}
function browserControls() {
  for (const button of document.querySelectorAll('[data-copy]')) {
    button.addEventListener('click', async () => {
      const field=document.getElementById(button.dataset.copy);
      const feedback=document.getElementById(button.dataset.status);
      try {
        await navigator.clipboard.writeText(field.value);
        feedback.textContent='Copied. Paste it into a new conversation with your AI.';
      } catch {
        document.getElementById(button.dataset.details).open=true;
        field.focus(); field.select();
        feedback.textContent='Automatic copy is unavailable. Copy the selected text below.';
      }
    });
  }
  const openButton=document.getElementById('open-code');
  const codeField=document.getElementById('run-code');
  function openCode() {
    const code=codeField.value.trim().toUpperCase();
    const feedback=document.getElementById('code-status');
    if (!knownCodes.includes(code)) {
      feedback.textContent='That code is not in this catalog. Check it or browse the released challenges.';
      codeField.setAttribute('aria-invalid','true');
      codeField.focus();
      return;
    }
    codeField.removeAttribute('aria-invalid');
    window.location.assign('/play/'+encodeURIComponent(code));
  }
  if(openButton) {
    openButton.addEventListener('click',openCode);
    codeField.addEventListener('keydown',event=>{ if(event.key==='Enter') { event.preventDefault(); openCode(); } });
  }
}
export function interactiveScript(codes) {
  return 'const knownCodes = '+JSON.stringify(codes)+';\n('+browserControls.toString()+')();';
}
export function promptBox(code, id='starter') {
  return '<div class="launch"><p class="eyebrow">'+(code?'Play this exact version':'Let your AI choose')+'</p>'+
    '<h2>'+(code?'Bring this challenge to your AI.':'Find your next problem.')+'</h2>'+
    '<p>'+(code?'Copy this prompt to start the same challenge as a friend.':'Your GM uses your history and preferences to choose from the released catalog.')+'</p>'+
    '<button class="primary" type="button" data-copy="'+id+'" data-status="'+id+'-status" data-details="'+id+'-details">Copy game prompt</button>'+
    '<p class="status" id="'+id+'-status" role="status" aria-live="polite">Works with an AI that can read the linked files.</p>'+
    '<details id="'+id+'-details"><summary>Read or manually copy the prompt</summary><label for="'+id+'">Select and copy this text.</label>'+
    '<textarea readonly spellcheck="false" id="'+id+'">'+escapeHtml(starter(code))+'</textarea></details></div>';
}
export function codeBox(code) {
  return '<section class="panel"><p class="eyebrow">Playing with friends?</p><h2>Enter a run code.</h2>'+
    '<p>A code always loads the same released challenge and rules.</p>'+
    '<label for="run-code">Run code</label><div class="code-row"><input id="run-code" type="text" autocomplete="off" spellcheck="false" maxlength="64" placeholder="'+escapeHtml(code)+'" aria-describedby="code-status">'+
    '<button id="open-code" type="button" class="secondary">Open challenge</button></div>'+
    '<p id="code-status" class="status" role="status" aria-live="polite">For example: '+escapeHtml(code)+'</p>'+
    '<p class="small">You can also follow a shared challenge link. With JavaScript disabled, use the catalog links below.</p></section>';
}
export function card(entry) {
  return '<article class="challenge"><div class="challenge-label"><span class="badge">'+escapeHtml(entry.id)+'</span><h3>'+escapeHtml(entry.title)+'</h3>'+
    '<p>'+escapeHtml(entry.area)+' &middot; Solo play</p></div><div class="challenge-body"><p>'+escapeHtml(entry.description)+'</p>'+
    '<p class="small">Difficulty and time: '+(entry.difficulty===null?'not yet calibrated':escapeHtml(entry.difficulty))+'</p>'+
    '<a class="textlink" href="/play/'+encodeURIComponent(entry.code)+'">Explore and play</a>'+
    '<p class="note">Run code: <code>'+escapeHtml(entry.code)+'</code></p></div></article>';
}
export const extraStyles =
'.catalog-head{padding:3.2rem 0 1.5rem;max-width:48rem}.catalog-head h1{max-width:17ch;font-size:clamp(2.5rem,5vw,4rem)}.catalog-head p{font-size:1.1rem}\n'+
'.split{display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:start;margin:1rem 0 3rem}.panel{border:1px solid var(--line);border-radius:1rem;padding:1.8rem;background:white}\n'+
'.panel h2{font-family:Georgia,serif;font-size:1.8rem}.code-row{display:flex;gap:.6rem;margin-top:.5rem}input{font:inherit;width:100%;min-width:0;padding:.8rem;border:1px solid var(--ink);border-radius:.5rem;background:#fffef8}\n'+
'input:focus-visible{outline:3px solid var(--blue);outline-offset:3px}.secondary{border:1px solid var(--ink);border-radius:.5rem;background:var(--ink);color:white;padding:.7rem 1rem;cursor:pointer;white-space:nowrap}\n'+
'.catalog-list{display:grid;gap:1.4rem;margin-bottom:2rem}.packet{white-space:pre-wrap;overflow-wrap:anywhere;font:1rem/1.75 system-ui,sans-serif;background:#fffef8;padding:1.4rem;border:1px solid var(--line);border-radius:.7rem}\n'+
'.run-code{display:inline-block;background:#e9eefb;padding:.35rem .7rem;border-radius:.45rem;font-size:1rem;overflow-wrap:anywhere}.actions{display:flex;gap:1rem;flex-wrap:wrap;margin:1.5rem 0}.run-info{padding-bottom:2.4rem}.run-info details{margin-top:1.6rem}.catalog-note{max-width:50rem;padding:1rem 0 2rem;color:var(--muted)}\n'+
'@media(max-width:740px){.split{grid-template-columns:1fr;gap:1.4rem}.catalog-head{padding-top:2rem}.panel{padding:1.4rem}.code-row{flex-direction:column}.run-code{font-size:.95rem}}';
export function layout({title,description,path,body,css,script=''}) {
  const e=escapeHtml;
  return '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#fbd34b">'+
    '<title>'+e(title)+' — Reinvent It</title><meta name="description" content="'+e(description)+'"><link rel="canonical" href="https://reinventit.org'+e(path)+'">'+
    '<meta property="og:title" content="'+e(title)+' — Reinvent It"><meta property="og:description" content="'+e(description)+'"><meta property="og:type" content="website"><meta property="og:url" content="https://reinventit.org'+e(path)+'">'+
    '<style>'+css+extraStyles+'</style></head><body><a class="skip" href="#main">Skip to content</a><header><div class="wrap nav"><a class="brand" href="/"><span class="mark" aria-hidden="true">R</span> Reinvent It</a><nav aria-label="Main navigation"><a href="/challenges/">Challenges</a><a href="/play/">Play</a><a href="https://github.com/Ryan-M-Frank/recreate-it">GitHub</a></nav></div></header>'+
    '<main id="main" class="wrap">'+body+'</main><footer><div class="wrap footer-row"><p>Created by Ryan M. Frank.</p><p><a href="/start.md">AI starting instructions</a> · <a href="https://github.com/Ryan-M-Frank/recreate-it/blob/main/LICENSE">Licensing</a></p></div></footer>'+
    (script?'<script>'+script+'</script>':'')+'</body></html>\n';
}
