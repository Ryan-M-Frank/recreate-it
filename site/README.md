# Reinvent It website

Public site: https://reinventit.org. Created by Ryan M. Frank.

The site distributes official Markdown game material. It has a landing page, a released challenge library, permanent run pages, and an AI discovery entry point. There is no AI runtime, database, sign-in, analytics script, browser storage, or submission service.

## Build and check

Use Node 22 or newer. From the repository root:

    node site/build.mjs
    node site/check.mjs

The dependency-free build verifies each release against its recorded SHA-256 and original Git blob hashes, checks packet metadata, and generates the catalog and the server-only asset module. It refuses to overwrite a catalog snapshot with different contents. The checks cover route methods and headers, CSP hashes, file integrity, code resolution, clipboard fallback behavior, withdrawals, and rejection of private paths.

Build before testing or deploying. Do not publish site/generated-assets.mjs as a downloadable file: it includes GM material for the Worker to serve only through labeled routes. It is ignored by Git and regenerated from the committed sources.

## Source map

- index.html: landing-page copy and shared styles.
- render.mjs: escaped HTML templates, copy controls, and exact run-code navigation.
- catalog-lib.mjs: release validation and code-resolution helpers.
- build.mjs: generates the catalog, pages, sitemap, and explicit public route map.
- generated-assets.mjs: generated server module; never a public browser script.
- worker.mjs: Cloudflare request handling, security headers, caching, and canonical redirects.
- check.mjs: regression and failure-path checks.
- wrangler.jsonc: Worker configuration and automatic build command.
- ../catalog/registry.json: deliberately approved releases and current catalog version.
- ../runs/: permanent run records.
- ../releases/: exact packet and protocol snapshots from their original source commits.

See [catalog and run codes](../docs/catalog-and-run-codes.md) for the publishing contract. Preserve released run records, snapshots, and catalog archives. A new release needs a new code; a changed catalog needs a new catalog version. Update catalog/status.json to withdraw a defective run without changing its historical meaning.

## Public routes

| Route | Purpose |
| --- | --- |
| / | Introduction and starter prompt |
| /play/ | AI-selected play or exact run-code entry |
| /challenges/ | Human-readable released library |
| /play/RI-0001@0.1.0 | Fixed challenge page and copyable prompt |
| /start.md | AI discovery and retrieval instructions |
| /catalog.json | Current spoiler-free catalog |
| /catalog/v1.json | Preserved catalog snapshot |
| /catalog/status.json | Current availability and withdrawal reasons |
| /catalog/catalog.schema.json | Public catalog format |
| /runs/CODE.json | Permanent packet and protocol file list |
| /releases/COMMIT/PATH | Exact official file mirror |
| /gm/catalog.json | Spoiler-bearing selection fingerprints |
| /sitemap.xml | Discoverable human pages |
| /robots.txt | Crawl guidance and sitemap location |

GM routes are fetchable but carry noindex, nofollow and an explicit spoiler header. Raw snapshots and run metadata also carry noindex. These are indexing requests, not access controls. Public pages contain no GM text or fingerprints. Unknown paths, private drafts, histories, and the generated module return 404.

Only allowlisted collection and catalog documentation is served under /docs/. This is not a general filesystem server. Adding a file to GitHub does not automatically make it a website route.

## Preview and publication

The homepage can be opened directly for a basic content preview. Full routing, generated pages, CSP and headers require a Worker-compatible preview. If using an already installed authenticated Wrangler, run wrangler dev from this directory, then test the displayed local address.

Before publishing, build and check; inspect desktop and narrow layouts; use keyboard navigation; test a valid and unknown code; and verify the copy button and manual prompt. Confirm that only reviewed public files enter the GitHub commit. Never include private/, local histories, credentials, or unpublished packets.

A GitHub commit does not deploy this site. There is no automatic deployment pipeline. Commit the reviewed source, then deploy that same build.

The Worker is reinventit-site with custom domains reinventit.org and www.reinventit.org. Deploy from this directory using an authenticated Wrangler deployment, or upload through the Cloudflare Workers script API as multipart/form-data with:

- metadata: main_module worker.mjs, compatibility date 2026-09-13, no bindings, and the existing observability settings.
- worker.mjs: application/javascript+module.
- generated-assets.mjs: application/javascript+module.

The API deployment must include both JavaScript modules. The old index.html text-module deployment no longer applies. Preserve query-string redaction, 10% diagnostic sampling, custom-domain mappings, and disabled development/preview URLs. Cloudflare crawler policy is managed separately; publication must not change it.

After deployment, check HTTPS and the www redirect; catalog, start, run record, and player/GM mirrors; code entry; CSP/HEAD/ETag behavior; a missing/private path; and the current Cloudflare settings. Verify remote packet hashes against the committed run record. Record the deployed version and source commit privately.

Before deployment, record the current Cloudflare version. If the new deployment breaks retrieval, exposes unintended files, or fails routing, roll back to that version and verify the public routes again. Preserve the old source commit for reconstruction. A source revert alone does not roll back Cloudflare.

## Security and operational limits

The Worker uses an explicit route map and accepts GET and HEAD only. It redirects HTTP and www to the canonical HTTPS address. Request text is never inserted into HTML. CSP hashes are calculated from the exact generated scripts and styles; do not add unsafe-inline or unsafe-eval to work around errors.

Responses include CSP, one-year HSTS, anti-framing and MIME-sniffing protections, no-referrer, and a Permissions Policy disabling unused device access. HSTS omits includeSubDomains and preload. Current status is cached for at most 60 seconds; immutable snapshots can be cached for a year. Withdrawn challenge pages return 410 with no-store.

The page has no cookies or third-party scripts. Its clipboard interaction writes the displayed prompt after a click. Cloudflare's sampled diagnostic logs are not a promise of zero provider logs.

The build has a conservative compressed-module size budget of 2.5 MB. As the collection grows, migrate public files to Cloudflare Static Assets before approaching that budget, while preserving URLs, hashes, spoiler headers and the explicit publication boundary.

Credentials, private histories, and drafts stay outside public commits. The ignored private/ directory helps prevent accidental publication, but cannot remove information already committed or detect every secret. Protocol versions and historical challenge constraints must not change as a side effect of website edits.
