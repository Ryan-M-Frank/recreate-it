# Reinvent It website

Public site: https://reinventit.org

Created by Ryan M. Frank. This is the small v0.1 onboarding site: a copyable game prompt, instructions, and links to the official game files. No AI runtime, database, sign-in, analytics script, or submission service is included.

## Files

- `index.html`: all page content, responsive styles, and the clipboard interaction. Open this directly for a basic preview or serve this directory locally for clipboard testing.
- `worker.mjs`: the Cloudflare module that serves the page, handles HEAD and missing paths, and redirects HTTP and www to the canonical HTTPS address.
- `check.mjs`: dependency-free regression checks. Run `node check.mjs` with Node 22 or newer before deploying.
- `wrangler.jsonc`: the deployment configuration. Run an authenticated `npx wrangler deploy` from this directory to deploy with Wrangler; it imports HTML as a Text module.

The initial publication used Cloudflare's Worker upload API with `worker.mjs` as the JavaScript module and `index.html` as a text/plain module. Metadata specifies `main_module: worker.mjs`, the compatibility date, and the observability settings from the configuration. The Worker is named `reinventit-site`, with custom domains `reinventit.org` and `www.reinventit.org`.

## Editing

Keep links to game files on the official repository. The starter prompt tells the GM to pin one repository commit for the attempt. Do not embed the GM packet, fingerprints, answers, or active weekly submissions in the public page.

Before publishing edits, verify the copy button and manual fallback, keyboard access, mobile and desktop layout, and links. After deployment, verify HTTPS, the www redirect, and the published prompt. A GitHub commit alone does not deploy the site; there is no automatic deployment pipeline yet.

The Worker uses a strict Content Security Policy with hashes for the single inline script and stylesheet. If either block changes, `node check.mjs` reports the replacement hash: review the change, update the matching hash in `worker.mjs`, and rerun the check. Never weaken the policy to `unsafe-inline` to work around a mismatch.

## Security and hosting settings

The Worker sends CSP, one-year HSTS, anti-framing and MIME-sniffing protections, no-referrer, and a Permissions Policy disabling unused device access. HSTS deliberately omits `includeSubDomains` and preload so it does not commit future subdomains to HTTPS. Only GET and HEAD are accepted; unknown paths return plain-text 404s. Request data is never interpolated into HTML.

Keep Workers development and preview URLs disabled. Preserve query-string redaction in observability metadata during API uploads. Diagnostic logs are sampled at 10%; this is not a promise of zero hosting-provider logs. The page itself has no cookies, browser storage, analytics, or third-party scripts. Its only clipboard operation writes the displayed starter prompt after a click.

Cloudflare zone settings are managed separately from this Worker configuration: minimum TLS 1.2, TLS 1.3 enabled, and Always Use HTTPS enabled. DNSSEC activation was requested on 2026-09-13; verify it reaches confirmed status in DNS settings. [Cloudflare Registrar's automatic registry update](https://developers.cloudflare.com/registrar/get-started/enable-dnssec/) can take one to two days. Domain transfer lock is enabled.

Keep credentials, private histories, and unreviewed drafts out of commits. `.gitignore` excludes common local secret files, personal HISTORY.md files, and a `private/` folder; this cannot remove previously committed information or detect every secret.

Protocol versions and historical challenge constraints must not change as a side effect of website edits.
