# Reinvent It website

Public site: https://reinventit.org

Created by Ryan M. Frank. This is the small v0.1 onboarding site: a copyable game prompt, instructions, and links to the official game files. No AI runtime, database, sign-in, analytics script, or submission service is included.

## Files

- `index.html`: all page content, responsive styles, and the clipboard interaction. Open this directly for a basic preview or serve this directory locally for clipboard testing.
- `worker.mjs`: the Cloudflare module that serves the page, handles HEAD and missing paths, and redirects HTTP and www to the canonical HTTPS address.
- `wrangler.jsonc`: the deployment configuration. Run an authenticated `npx wrangler deploy` from this directory to deploy with Wrangler; it imports HTML as a Text module.

The initial publication used Cloudflare's Worker upload API with `worker.mjs` as the JavaScript module and `index.html` as a text/plain module. Metadata specifies `main_module: worker.mjs`, the compatibility date, and the observability settings from the configuration. The Worker is named `reinventit-site`, with custom domains `reinventit.org` and `www.reinventit.org`.

## Editing

Keep links to game files on the official repository. The starter prompt tells the GM to pin one repository commit for the attempt. Do not embed the GM packet, fingerprints, answers, or active weekly submissions in the public page.

Before publishing edits, verify the copy button and manual fallback, keyboard access, mobile and desktop layout, and links. After deployment, verify HTTPS, the www redirect, and the published prompt. A GitHub commit alone does not deploy the site; there is no automatic deployment pipeline yet.

Protocol versions and historical challenge constraints must not change as a side effect of website edits.
