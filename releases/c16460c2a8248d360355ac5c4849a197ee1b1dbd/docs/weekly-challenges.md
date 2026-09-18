# Weekly challenges v0.1

Weekly play uses the same Markdown game and any capable AI GM. Each player works independently on the same fixed official challenge. "Sealed" means attempts are withheld from other participants, not a cryptographic commitment scheme.

## Publication contract

Before release, the organizer publishes:
- Challenge ID, version, pinned repository commit, and protocol version.
- Player and spoiler-labeled GM packet locations from the official source.
- Exact UTC release, submission-close, and reveal timestamps, with release < close <= reveal.
- The complete fixed requirements and any predetermined stage triggers.
- A nonpublic submission destination, revision policy, and eventual publication terms.

Do not announce an active weekly without an actual intake destination and schedule. This initial repository has neither. RI-0001 is an archived original playtest for solo replay, not a scheduled weekly.

## Lifecycle

1. **Scheduled:** review and freeze the packet. Public metadata omits fingerprints and answers.
2. **Active:** release the challenge; each GM retrieves the identical pinned version and evaluates only its stated constraints. Do not inspect other attempts or search for solutions.
3. **Frozen/submitted:** the player freezes a design and approves a sanitized summary for the announced intake. The organizer returns a receipt with revision and timestamp. No public issues, pull requests, or solution commits before reveal.
4. **Closed:** submissions stop at the stated close time. Retain the latest accepted revision before close; earlier revisions remain in the private audit record. Late attempts are separate practice attempts.
5. **Revealed:** at or after the reveal time, publish comparison material and only author-approved sanitized submissions. Community solution browsing unlocks now.
6. **Archived:** preserve the original version and schedule for reproducibility; mark later attempts as post-reveal practice.

The GM does not promise submission storage, delivery, or a receipt unless the intake actually confirms it. Freezing locally is not submitting.

## Independence and exceptions

A frozen submission does not authorize early comparison. Keep the GM's canonical discussion and other solutions out of the session until reveal. A player can request early reveal, but the attempt becomes exposed and must be labeled separately from independent submissions.

Prior familiarity, external references, hints, and AI co-design must be disclosed. GM questioning and adversarial testing are normal assistance; do not pretend model-supplied design ideas originated with the player. An honor system can document these differences without promising to detect cheating.

A clarification must not change validity. If a defect changes the requirements, mark the version withdrawn, explain the issue without leaking answers, and publish a replacement version with a fresh schedule. Do not silently edit active constraints or combine results across incompatible versions.

After reveal, compare solution families and tradeoffs without ranking closeness to a canonical answer. Novelty flags follow the formal analysis and prior-art review protocol. Automatic clustering, accounts, and a submission backend are future website work.
