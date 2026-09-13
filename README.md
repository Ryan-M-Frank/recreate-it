# Reinvent It

**Invent a solution before you discover how other people solved the problem.**

Reinvent It is a thinking game you play with an AI acting as your Game Master (GM). It gives you a practical problem, lets you develop an idea, and helps test it. When you end the round, you compare your design with established approaches.

> The goal isn't to guess the known algorithm. The goal is to invent a solution before you know what everyone else invented.

You can play through conversation, sketches, or pseudocode. Writing and running code is optional. There is no app to install: **Markdown is the game.**

## What is available now?

This is the initial **v0.1** release.

| Available today | Status |
| --- | --- |
| Game rules and AI-tool-neutral GM protocol | Ready to use |
| RI-0001 — The Forgetful Elevator | Available for solo play; original playtest with a fixed replay specification |
| Personal history and solution templates | Ready to copy |
| Weekly challenge rules | Documented; no event scheduled |
| Official domain | [reinventit.org](https://reinventit.org) |
| Website | [Live: start playing at reinventit.org](https://reinventit.org) |
| Online submissions and community gallery | Not available |

Start at **[reinventit.org](https://reinventit.org)** to copy the starter prompt and find the first challenge. The [GitHub repository](https://github.com/Ryan-M-Frank/recreate-it) remains the official source for the versioned game files. You do not need a Reinvent It account or a GitHub account to read or download the public game files. Your chosen AI service may have its own access requirements.

## What you need

- An AI tool that can follow a multi-file Markdown protocol and retain enough context for a round.
- Either the ability to retrieve the official repository files or a way to attach/paste local text files.
- Somewhere private to save your personal `HISTORY.md`.

No particular AI vendor is required. File access and instruction-following vary by tool; the GM should say if it cannot read a required file, rather than invent its contents.

## Quick start: an AI tool with repository access

### 1. Start a new conversation

Copy this prompt into your AI tool:

```text
Let's play Reinvent It in solo mode.

Official repository:
https://github.com/Ryan-M-Frank/recreate-it

Read GAME.md, GM_PROTOCOL.md, and SECURITY.md. Resolve the current
repository commit and use that same commit for all protocol and
challenge files throughout this attempt.

Run RI-0001, The Forgetful Elevator. Retrieve its manifest.yaml,
player.md, and gm.md yourself. Keep GM-only content, target concepts,
algorithm names, and comparison material out of your replies until
I explicitly finish the round and request the reveal.

I am a new player and have no HISTORY.md yet. Help me create one
from HISTORY_TEMPLATE.md. Present the public setup and all fixed
requirements, then let me propose an idea. Ask before giving hints.

If you cannot access a required file, tell me which one is missing.
Do not substitute an invented challenge.
```

If you already have a history, attach it and replace the "new player" paragraph with: "Use my attached HISTORY.md and disclose whether this challenge repeats concepts I have already encountered."

### 2. Let the GM load the game

The GM should confirm the challenge ID, version, and pinned commit, then present the public problem and fixed requirements. A pinned commit simply means the exact saved repository version used for your round; you do not need to manage it yourself.

**Safe to read:** [The Forgetful Elevator player page](challenges/RI-0001/player.md).

**Contains spoilers:** `challenges/RI-0001/gm.md`. Let your AI retrieve it. Avoid opening that file or expanding its retrieval preview while playing.

### 3. Describe your first idea

Explain what information you would store and how your proposed solution behaves. It does not need to be complete. The GM will ask questions and test examples against the requirements you were given.

A different solution is welcome. You are not trying to reproduce a hidden answer.

## Alternative: use downloaded files

If your AI cannot retrieve the repository:

1. Open the [repository](https://github.com/Ryan-M-Frank/recreate-it) and download a copy using **Code → Download ZIP**. Extract it.
2. Keep that download together so the files all come from the same repository version. Record its source commit if available; if the GM cannot verify it, have it record that limitation rather than guess.
3. Give your AI `GAME.md`, `GM_PROTOCOL.md`, `SECURITY.md`, and `HISTORY_TEMPLATE.md`, plus all three files in `challenges/RI-0001/`: `manifest.yaml`, `player.md`, and `gm.md`.
4. Attach the GM file without reading its contents. Use the quick-start prompt, replacing the retrieval instructions with: "Use the attached official files. Tell me if anything required is missing."
5. Provide `SUBMISSION_TEMPLATE.md` or `NOVELTY_PROTOCOL.md` later if you want a solution summary or post-reveal investigation.

If your tool cannot accept files, you can paste the public rules. Have someone else supply the GM packet if copying it would expose the answers to you. If there is no way to load the packet without seeing it, use a tool with file access for an unspoiled attempt.

GM files are publicly accessible. This is **spoiler-resistant, not cheat-proof**; your tool may display attachments or retrieved text in its interface.

## What happens during a round?

1. **Setup:** receive the premise, operations, examples, and complete fixed requirements.
2. **Invent:** propose a mechanism in your own words.
3. **Test:** work through edge cases, revise your idea, and examine its costs.
4. **Freeze:** capture your design and unresolved questions before comparison.
5. **Reveal:** end independent invention and learn how your approach relates to known work.
6. **Save:** update your history so another session knows what you have already encountered.

There is no requirement to reach a perfect solution before finishing. Useful commands include:

| What you want | What to say |
| --- | --- |
| Clarify a rule | "Explain that requirement without giving me a solution hint." |
| Get help | "Give me one small hint and record it in my history." |
| Check an idea | "Test my current design against the stated constraints." |
| Pause | "Pause without revealing anything. Save a spoiler-free progress summary." |
| Resume | "Resume this attempt using my saved progress and the same challenge version." |
| Finish | "Freeze my current design, end the round, and show the comparison." |

The GM must not add new constraints just to steer you toward a known algorithm. Scaling the problem or imposing a new performance target is separately agreed exploration, not a retroactive reason to reject your solution.

## Save your progress across AI tools and sessions

Copy [HISTORY_TEMPLATE.md](HISTORY_TEMPLATE.md) into a private file named `HISTORY.md`. At the end of a session, ask the GM to provide the updated file, then save it yourself unless your tool has actually confirmed that it saved it.

For a paused round, keep the proposed design, open questions, challenge version, and spoiler-free progress. Do not add unrevealed target concepts. After reveal, record the concepts and mechanisms you encountered, including those from incomplete attempts.

Next time, provide your history and say:

```text
Load the Reinvent It rules and my HISTORY.md. Choose an official solo
challenge with low overlap in underlying concepts and mechanisms.
Do not reveal candidate fingerprints. If none is fresh, say so and
ask before offering an intentional repeat.
```

Only RI-0001 is included initially, so a second fresh challenge may not yet be available. History helps avoid the same problem in a different story; it cannot guarantee freshness when prior exposure is missing.

Keep your history private. It may contain personal notes and post-reveal spoilers.

## Share a solution

Ask the GM to create a standalone summary using [SUBMISSION_TEMPLATE.md](SUBMISSION_TEMPLATE.md). Review the exact draft and remove personal details before sharing.

Share your mechanism, reasoning, tests, weaknesses, and assistance received. Do not export your entire conversation, personal history, or the GM packet.

**There is currently no official submission form or destination.** Keep your draft locally until an intake is announced. For a future weekly event, do not post solutions in public issues, pull requests, or repository files before the scheduled reveal.

## Weekly challenges — planned

Weekly events will give everyone the same fixed challenge to attempt independently. Players will submit approved, sanitized summaries to a nonpublic intake before the deadline. Community solutions will become available at the scheduled reveal.

A submitted or frozen attempt does not unlock early comparison. An explicit early reveal ends that attempt's independent status.

See [the weekly rules](docs/weekly-challenges.md) for the full lifecycle.

**Website and weekly-event status:**

| Item | Current status |
| --- | --- |
| Official domain | [reinventit.org](https://reinventit.org) — registered through Cloudflare |
| Website / getting-started page | [Live at reinventit.org](https://reinventit.org) |
| Challenge catalog | RI-0001 on the website; source packets in this repository |
| Current weekly challenge | None scheduled |
| Release, close, and reveal times | To be announced in UTC for each event |
| Private submission destination | Not implemented |
| Post-reveal solution gallery | Not implemented |

The website is live. Weekly events and submission services are still planned. No weekly event should launch until its fixed packet, schedule, and private intake are available. The website helps players get started and links to the official challenge files; the game itself remains portable Markdown.

## What makes this game different?

- **The canonical solution is not the objective.** A valid alternative counts.
- **No moving goalposts.** Evaluate against the requirements disclosed at the start.
- **Official challenges only in v0.1.** Arbitrary custom challenge ingestion is out of scope.
- **Discovery before comparison.** Avoid solution searches and prior-art research during independent invention.
- **Honest novelty claims.** An unfamiliar idea can receive an unresolved flag. Formal analysis and prior-art review are required before advancing a novelty assessment; independently reinventing something known is still a worthwhile result.

RI-0001 preserves the original elevator playtest. Its spoiler-bearing GM packet records both the ideas explored and where the original GM changed the requirements. The playable v0.1 version explicitly separates that history from its fixed replay rules.

## File guide

| File | When you need it |
| --- | --- |
| [GAME.md](GAME.md) | Every session: the game rules |
| [GM_PROTOCOL.md](GM_PROTOCOL.md) | The AI's facilitation and evaluation instructions |
| [SECURITY.md](SECURITY.md) | Spoiler handling, privacy, and untrusted content |
| [HISTORY_TEMPLATE.md](HISTORY_TEMPLATE.md) | Create your private cross-session memory |
| [SUBMISSION_TEMPLATE.md](SUBMISSION_TEMPLATE.md) | Prepare a shareable solution summary |
| [NOVELTY_PROTOCOL.md](NOVELTY_PROTOCOL.md) | Investigate a possible contribution after reveal |
| [docs/weekly-challenges.md](docs/weekly-challenges.md) | Understand future weekly events |
| [RI-0001/player.md](challenges/RI-0001/player.md) | Read the public challenge |
| [RI-0001/manifest.yaml](challenges/RI-0001/manifest.yaml) | Let the GM check challenge metadata |
| `challenges/RI-0001/gm.md` | GM-only spoilers, tests, comparison, and playtest record |

## Website source

The landing page and Cloudflare deployment configuration live in [site/](site/README.md). The site is a small public guide with a copyable starter prompt; it does not run an AI backend or accept submissions.

Created by **Ryan M. Frank**.

## Feedback and contributions

Use [repository issues](https://github.com/Ryan-M-Frank/recreate-it/issues) for unclear rules, documentation problems, and playtest feedback. Include the challenge version and a spoiler-free description. Keep answers out of issue titles.

Documentation fixes and protocol feedback are welcome. v0.1 supports only official, maintainer-reviewed challenge releases; a submitted file does not become an approved challenge automatically. Keep personal histories, raw conversations, and unpublished solutions out of public contributions.

For sensitive reports, follow [SECURITY.md](SECURITY.md).
