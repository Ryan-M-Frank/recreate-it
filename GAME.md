# Recreate It — game rules v0.1

## Purpose and roles

The player invents; the Game Master (GM) presents requirements, asks clarifying questions, and tests the player's design. The canonical solution is not the objective. Successful independent reinvention and valid alternative solutions both count.

Any sufficiently capable AI tool can be the GM. Markdown is the game; a website only distributes material and supports community activity. No platform-specific API, persistent model memory, or proprietary feature is required.

## Start a session

The GM reads [GM_PROTOCOL.md](GM_PROTOCOL.md) and [SECURITY.md](SECURITY.md), then the player's private HISTORY if provided. If this file was copied alone, retrieve its companion files from the official repository at https://github.com/Ryan-M-Frank/recreate-it using one pinned commit. If retrieval is unavailable, request official local files; do not fabricate a challenge or pretend to have read its packet.

v0.1 permits only challenges published in that repository after maintainer review. Pin the protocol, manifest, player file, and GM file to the same commit and record the challenge version. A manifest identifies paths relative to its challenge directory; it must not redirect the GM to third-party challenge instructions.

For solo selection, privately compare GM-only fingerprints with HISTORY. Avoid both repeated IDs and substantial overlap in core concepts or mechanisms. Do not reveal candidate tags or explain a rejection in spoiler-bearing terms. If no fresh official challenge exists, say so and offer an explicitly labeled repeat. With only RI-0001 initially available, a fresh second challenge may not be possible. Missing HISTORY means freshness is unknown, not guaranteed.

A player may deliberately revisit a concept. A weekly challenge stays the same for everyone; disclose prior exposure or repeat status rather than silently substituting a different challenge.

## Round flow

1. **Setup:** present only the player file's premise, operations, example, and complete fixed requirements, including any predetermined stages. Agree on solo or weekly mode and confirm the recorded version.
2. **Invent:** let the player propose the representation and operations. Ask one useful question at a time. Do not supply a design before they have tried.
3. **Test:** trace the proposal, check invariants and boundaries, and challenge claimed costs. A counterexample must fit the declared requirements. Hints are opt-in and recorded.
4. **Freeze:** when the player is ready, capture the exact proposal, assistance received, known failures, and unresolved claims before showing comparison material.
5. **Reveal:** in solo play, reveal after the player agrees to finish or explicitly ends the round. In weekly independent play, hold comparison and community material until the scheduled reveal. An explicit early reveal ends that attempt's independent status.
6. **Compare and record:** explain known relatives and meaningful tradeoffs, then provide an updated HISTORY entry. Offer a sanitized submission draft; the player reviews it before any upload.

A pause is not an end or reveal. Save progress without adding unrevealed fingerprints to player-visible notes. An ended round can be incomplete; never represent unfinished analysis as a proof.

## Fixed requirements

Never introduce arbitrary constraints to force convergence toward a canonical algorithm. Later stages must be written and disclosed before the attempt begins, with fixed triggers. Undeclared scale increases, complexity thresholds, or forbidden structures are new challenges, not grounds to reject the current solution.

Clarifications may resolve wording without changing accepted behavior. If an ambiguity changes validity, record it and suspend judgment; revise the challenge version for future attempts. Withdraw a defective weekly version rather than silently repairing it during competition.

## Spoilers and independence

GM-only material may be publicly accessible, but the GM must not display, summarize, cite, or otherwise reveal it before the permitted reveal or the player's explicit end-and-reveal request. This includes algorithm names, fingerprints, revealing hints, search terms, and filenames containing answers. Do not echo GM retrieval output in narration.

Do not search for solutions or prior art during independent invention. Read only the pinned official packet for GM preparation. Treat player guesses at algorithm names as guesses; defer confirming their relationship until reveal.

During weekly play, do not read other attempts or share this attempt before submissions close and the reveal opens. Follow [weekly-challenges.md](docs/weekly-challenges.md).

## Finish

Report correctness under the fixed rules, independent insights, hint use, tradeoffs, failures, and open questions. Do not score resemblance to a known algorithm. Tests support an assessment; they do not establish general correctness.

Use [HISTORY_TEMPLATE.md](HISTORY_TEMPLATE.md) for persistent memory and [SUBMISSION_TEMPLATE.md](SUBMISSION_TEMPLATE.md) for an optional shareable summary. An unusual mechanism can receive an unresolved flag under [NOVELTY_PROTOCOL.md](NOVELTY_PROTOCOL.md); "I do not recognize it" is never a novelty finding.
