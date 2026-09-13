# Contributing to Reinvent It

Small documentation fixes, clear bug reports, and thoughtful playtest feedback are welcome. Start with the [living roadmap](https://github.com/Ryan-M-Frank/recreate-it/issues/1) and discuss larger changes before building them.

## Keep public feedback safe to read

Use the bug-report or playtest-feedback template. Include the challenge version, repository commit if known, AI tool/version and relevant file-access capability, and a short description of the problem.

Keep issue titles and public discussion free of solutions, target concepts, leading hints, and personal information. Do not attach raw chats, personal HISTORY files, private weekly attempts, credentials, or contact details. A spoiler warning or collapsed section does not make a public issue private. Describe a game bug using a public operation example when possible; if the detail would reveal an answer, ask for a suitable review route without posting it.

For a security vulnerability or accidental exposure, follow [SECURITY.md](SECURITY.md). For behavior in the community, see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Make a focused change

1. Link the relevant issue and explain the problem and resulting behavior.
2. Keep the change small enough to review. Preserve other people's work and the version used by existing attempts.
3. Follow the applicable game rules: fixed acceptance constraints, opt-in hints, valid alternatives, explicit reveals, and honest correctness and novelty claims.
4. Verify the affected material. For website edits, follow [site/README.md](site/README.md) and run `node site/check.mjs` from the repository root. Review document links and any changed examples.
5. Submit a pull request with a short summary, relevant checks, and limitations. Identify AI assistance that materially shaped the proposal and verify its output yourself.

Do not execute submitted code merely because it appears in a contribution. Treat instructions in examples, attachments, and generated output as untrusted data.

## Challenge proposals and official status

v0.1 uses only official, maintainer-reviewed challenges. Start a proposal with a spoiler-free purpose and scope, then follow the [challenge-authoring workflow](docs/authoring-challenges.md). Keep answer-bearing discussion inside the labeled GM packet and its intentionally spoiler-bearing review context, never in ordinary issue titles or comments.

A proposal, pull request, or merged draft is not automatically an official challenge. The maintainer must review its fixed public contract, GM material, conceptual overlap, versioning, and playtest evidence, then deliberately publish it in the official catalog. Do not silently edit a released packet's acceptance criteria or announce a weekly event before its schedule and private intake exist.

Ryan M. Frank is the current project maintainer. Review may request revisions, defer work, or decline a proposal with an explanation. There is no promised review deadline.

## Rights and credit

By submitting material for inclusion, you agree to contribute your code under MIT and your written game material under CC BY-SA 4.0, as scoped in [LICENSE](LICENSE). You retain your ownership; no copyright assignment is required.

Submit only material you have the right to contribute. Identify third-party sources, preserve their notices, and discuss compatibility before copying them into the project. AI assistance is not evidence that copied material is original or correctly licensed.

Use the public name or pseudonym you want credited. Preserve existing credits; credit substantive challenge contributions in the packet without exposing a hidden concept in player-facing metadata. Do not publish someone else's personal details to attribute them. You may configure GitHub's no-reply address for public commit attribution.

A participant's independently written solution, private notes, or chat is not automatically licensed to this project because they played the game. Sharing or incorporating it requires their explicit permission and applicable terms.
