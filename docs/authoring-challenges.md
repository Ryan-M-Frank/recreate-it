# Authoring official challenges

Use this workflow to turn an idea into a reviewed packet. Start with the [player template](../templates/challenge/player.md), the spoiler-bearing `templates/challenge/gm.md`, the [manifest template](../templates/challenge/manifest.yaml), and the [review record](../templates/challenge/review.md).

A template or draft is not an official playable challenge. Keep unpublished work in the ignored `private/` directory or another private workspace. Never put unpublished weekly attempts there and then force-add them to Git.

## 1. Define the public contract first

Write the problem without naming the intended technique. Specify the starting state, inputs, operations, return values, ordering, duplicates, ties, boundaries, invalid or excluded inputs, and whether calls are sequential or concurrent.

List every acceptance constraint before play. Distinguish a required performance bound from a goal to explain tradeoffs. Define any cost model and size parameters. Disclose all predetermined stages and their triggers; one fixed stage is the default. Extensions cannot retroactively invalidate a completed stage.

Include a small worked example that demonstrates semantics without teaching a solution. The player should be able to tell whether a proposal meets the rules without knowing a canonical answer.

## 2. Write the GM packet

Treat the player file as the complete acceptance contract. Put target concepts, fingerprints, comparison material, possible approaches, and revealing hints only in the labeled GM packet.

Prepare evaluation cases that exercise public requirements. For each, record expected behavior and the rule being tested. Include an empty state, boundaries, repetitions, and interleaved updates where relevant. Trace more than one compliant design so the tests do not encode one preferred representation.

Provide an opt-in hint ladder ordered from least to most revealing. Record assumptions, unresolved correctness or complexity claims, and post-reveal sources. A GM's unfamiliarity with an approach is not evidence of novelty.

## 3. Check freshness and review

Privately compare the GM fingerprint with every published challenge. Record overlap in concepts and mechanisms, not just the story or title. The public review summary can say that overlap was assessed; it must not enumerate hidden concepts.

Complete the review record. Independently recalculate the public examples from the stated operation semantics. Check the public contract separately from the GM packet, then check that every hidden test and hint obeys that contract. A maintainer or an authorized reviewer records findings and the resulting revisions. Distinguish self-review from independent review.

Playtest new challenges before release, disclose prior familiarity and assistance, and obtain permission for any published feedback. Record observations rather than inventing difficulty or time estimates. The v1.0 catalog target and its playtest requirements are tracked in [issue #5](https://github.com/Ryan-M-Frank/recreate-it/issues/5).

## 4. Version and publish deliberately

Draft manifests use `status: draft` and a temporary ID. Drafts, templates, review examples, scheduled packets, and withdrawn packets must never be selected for ordinary play.

Once review is complete, assign the next unused RI identifier, place the player file, GM file, and manifest together under `challenges/RI-NNNN/`, and make their IDs and versions agree. Use local packet paths; do not redirect a GM to third-party instructions.

Only `active` and `archived` packets are eligible for official play under the protocol's mode rules. Archived packets are solo replay. Weekly activation additionally requires a real private intake and published UTC release < close <= reveal times. Follow [weekly-challenges.md](weekly-challenges.md); a merged draft is not an event announcement.

Use patch version changes for editorial corrections that do not change accepted behavior, hints, or evaluation. Use a new minor version for a revised acceptance contract or assistance/evaluation changes; reserve major changes for an incompatible redesign. Give substantially different problems new IDs. Record the reason and preserve prior versions through their immutable repository commits.

Publish a reviewed commit containing a consistent packet and protocol, and use that commit for the attempt. Record the commit in the release/review record after it exists; do not try to embed a commit's own hash inside itself. Update the spoiler-free catalog deliberately. Keep historical playtest accounts distinct from new acceptance rules.

## 5. Handle defects without moving the goalposts

An editorial clarification can explain wording without changing validity. If two reasonable readings accept different designs, stop judging against the disputed rule and record the ambiguity.

Withdraw a defective weekly version, announce the withdrawal without spoilers, notify affected participants through the event's agreed process, pause affected competition, and publish a replacement version for future attempts. Never silently change rules during an attempt or combine results from incompatible contracts. Preserve the original packet and the participant's pinned commit.

For solo play, explain the ambiguity and let the player choose to finish under the agreed interpretation, pause, or begin a clearly new attempt. Undeclared scale or performance changes are optional new work, never retroactive grounds for failure.

See [the authoring rehearsal](authoring-rehearsal.md) for the first application of this workflow.
