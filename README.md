# Recreate It

A portable game of independent invention. **Markdown is the game**: load the rules into a capable AI tool, let it act as Game Master, and build a solution before seeing established approaches.

> The goal isn't to guess the known algorithm. The goal is to invent a solution before you know what everyone else invented.

## Start playing

1. Load [GAME.md](GAME.md) into your AI tool. It contains the starting instructions and points the GM to the remaining protocol.
2. Copy [HISTORY_TEMPLATE.md](HISTORY_TEMPLATE.md) to your own private `HISTORY.md` and provide it in future sessions.
3. Say: "Run official challenge RI-0001. Read the GM material yourself; keep spoilers out of your replies."
4. The GM retrieves the protocol and challenge files from this repository at one pinned commit. With no retrieval capability, use a previously obtained official local copy supplied without reading the GM packet.

**PLAYER VIEW — safe to open:** [RI-0001: The Forgetful Elevator](challenges/RI-0001/player.md).

**GM PACKET — contains spoilers; let your AI fetch this:** `challenges/RI-0001/gm.md`. Do not preview it during independent play. Tool interfaces may display retrieved content; the separation is an honor-system convention, not access control.

## v0.1 scope

- AI-tool-neutral [GM protocol](GM_PROTOCOL.md); no required vendor, account, application, or runtime.
- Official, maintainer-reviewed challenges only. This repository is the current official source.
- Fixed constraints and predetermined stages. A valid alternative is a success; never move the goalposts to force convergence.
- Personal HISTORY tracks concepts and mechanisms, preventing the same problem from returning in a different story.
- [Weekly independent attempts](docs/weekly-challenges.md), with submissions held until the deadline and reveal.
- [Sanitized solution summaries](SUBMISSION_TEMPLATE.md), reviewed by their authors before upload.
- [Novelty flags](NOVELTY_PROTOCOL.md) require formal analysis and prior-art review; independent discovery alone is not novelty.
- [Spoiler and trust boundaries](SECURITY.md) without cryptographic secrecy.

RI-0001 records the **original playtest** and provides a fixed replay specification. It is an archived solo challenge, not an active weekly event. Its GM packet documents what worked, where the original GM changed the requirements, and what remains unproved.

A future website may distribute challenges, collect submissions, and host post-deadline reveals. It is the clubhouse, not the game engine. This initial release implements the Markdown protocol only; no submission service or weekly schedule is live.

## Files

| File | Purpose |
| --- | --- |
| [GAME.md](GAME.md) | Portable rules and session flow |
| [GM_PROTOCOL.md](GM_PROTOCOL.md) | Retrieval, evaluation, hints, and reveal |
| [HISTORY_TEMPLATE.md](HISTORY_TEMPLATE.md) | Private cross-session memory |
| [SUBMISSION_TEMPLATE.md](SUBMISSION_TEMPLATE.md) | Shareable solution artifact |
| [NOVELTY_PROTOCOL.md](NOVELTY_PROTOCOL.md) | Evidence and review process |
| [SECURITY.md](SECURITY.md) | Spoilers, untrusted content, and privacy |
| [docs/weekly-challenges.md](docs/weekly-challenges.md) | Weekly lifecycle |
| [challenges/RI-0001/manifest.yaml](challenges/RI-0001/manifest.yaml) | Public challenge metadata |
| [challenges/RI-0001/player.md](challenges/RI-0001/player.md) | Public setup and fixed requirements |
| `challenges/RI-0001/gm.md` | Spoiler-bearing evaluation and playtest record |

Personal histories, raw conversations, and unpublished submissions do not belong in this public repository.
