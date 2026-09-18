# Challenge discovery and permanent run codes

The public entry point is https://reinventit.org/start.md. The website and GitHub distribute the same reviewed files. Discovery selects an official packet; it does not add requirements to it.

## Two ways to start

- **Pick for me:** load the released catalog and privately compare the GM fingerprints with the player's HISTORY. Consider preferences, then vary selection among suitable unseen challenges. If no fresh challenge remains, say so and offer an intentional repeat. Missing history means freshness is unknown. Do not always choose the first entry.
- **Use a code:** resolve the exact code, such as `RI-0001@0.1.0`. Load that immutable run record and its exact protocol and packet. History may warn of overlap but must not substitute a different challenge. Never interpret an unknown code as permission to generate a challenge.

Both modes can be used by any AI capable of reading the files. A code fixes the task and rule snapshot, not the model's wording, hints requested, player solution, or conversational randomness.

## Public data

`catalog.json` is the current spoiler-free catalog. Its schema is `catalog/catalog.schema.json`. `catalog/v1.json` preserves the first catalog snapshot. `catalog/registry.json` is the maintainer input; `site/build.mjs` validates it and produces the public views.

Each entry includes ID, version, code, title, premise, broad area, release status, supported modes, source commit, protocol version, and links to the immutable run and player page. Difficulty and duration remain null until measurements support them. They are not fabricated from a model's guess.

`gm/catalog.json` is a separately labeled spoiler-bearing index generated from `catalog/gm-fingerprints.json`. Only the GM should retrieve it. It is excluded from public pages, prompts, and sitemaps. Fingerprints are not acceptance requirements and must not be shown while explaining why another challenge was selected.

The first catalog deliberately contains only RI-0001. Drafts, templates, withdrawn packets, review examples, and the 100-challenge idea inventory are ineligible for ordinary selection.

## Permanent code contract

Code grammar: `RI-NNNN@MAJOR.MINOR.PATCH`, with a four-digit official ID and numeric version components without leading zeros. Input may be trimmed and the RI prefix normalized to uppercase. The canonical example is `RI-0001@0.1.0`.

`runs/<code>.json` permanently binds the code to one challenge version, one protocol version, one original repository commit, and an explicit set of content hashes and source/mirror URLs. The original commit is already known before a release is registered, avoiding a self-referential commit hash.

`releases/<source-commit>/` stores exact UTF-8 copies from that original commit. Packet-relative paths are preserved. All protocol and challenge files in a run share its original source commit. Mirrors are official file distribution of that repository snapshot, not newly invented packet content. Tools enforcing repository-only retrieval can use the pinned `source_url` for each file.

Once published, never change a run mapping, asset hash, archived catalog, or snapshot file. A changed packet, assistance/evaluation behavior, or attached protocol needs a new version/code under the authoring version policy. Adding other challenges cannot remap old codes. Build checks verify the locked hashes; release checks also compare locks against the previous GitHub revision.

Current eligibility is separate: `catalog/status.json` can withdraw a defective run without changing its identity. A code for a withdrawn run must explain the withdrawal and stop, never silently redirect to a replacement. Historical bytes remain accessible. Check current status immediately before starting even when selecting from an archived catalog.

Arbitrary word/number seeds and procedural variations are not part of this first implementation. A future seed must identify its catalog snapshot, selector version, and any data-generator version/parameters. Hashing a seed against the changing latest catalog would violate reproducibility.

## Publication and mirrors

The human catalog is `/challenges/`; `/play/` provides a general starter and code entry; `/play/<code>` is a shareable run page. Each released player packet is linked from its run page. `/sitemap.xml` lists human pages, never GM files or run records. GM copies use `X-Robots-Tag: noindex, nofollow` while remaining fetchable. This reduces accidental search exposure but is not access control; GitHub GM files are also public.

The build uses an explicit release allowlist and file hashes. It never recursively publishes the workspace, drafts, private histories, test submissions, or credentials. Unknown paths return 404. Plain Markdown and JSON are available without executing browser JavaScript. Clipboard controls have selectable text fallbacks.

## Adding a release

1. Complete the authoring/review/playtest process and publish a consistent packet/protocol commit.
2. Copy the required files from that commit into its release snapshot; preserve their exact bytes and relative paths. Include applicable license files.
3. Add the registry entry, GM fingerprint, status entry, and reviewed permanent run record. Record hashes before building. Never modify an existing run record to publish different content.
4. Allocate the next catalog snapshot version, then build and check the catalog/site. Earlier catalog versions remain available.
5. Verify the source diff, immutable records, spoiler separation, code resolution, history exhaustion, withdrawal behavior, and GET/HEAD retrieval. Publish GitHub and the website, then smoke-test the live URLs.

Weekly selection stays disabled until a real event has its required schedule and private submission destination. A shared solo code is not a weekly competition or a submission receipt.
