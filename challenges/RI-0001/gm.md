# RI-0001 — GM PACKET

**CONTAINS SPOILERS — let the GM retrieve this. Do not display or summarize before reveal.**

Challenge version: 0.1.0. Protocol version: 0.1.0.
Status: archived original playtest, available for solo replay.

## Fixed replay contract

Use player.md as the complete public acceptance contract. Its definitions of strict NEXT, NONE, duplicate and absent operations, sequential calls, and the library restriction are explicit v0.1 replay clarifications. Do not claim all were stated in the historical session.

One stage only: 1,000 floors, O(U) space allowed, no floor-by-floor NEXT scan, no library sorted-container or sorting shortcut. Hand-built ordered structures are allowed. There is no mandatory sublinear insertion bound, billion-location stage, sparse-memory requirement, or fixed branching factor.

Accept a valid alternative even if it differs from all approaches below. Linear traversal of active requests is not the same as scanning every physical floor; evaluate it under the literal public rules. Do not invent a stronger prohibition to reject it.

## Fingerprint — GM only until reveal

- Core concepts: dynamic ordered sets; predecessor and successor; hierarchical indexing.
- Mechanisms: linked active regions; cached neighbor information; radix-style decomposition; sparse allocation.
- Domain: data structures.

Use core overlap to detect conceptual repeats across other stories. Sparse allocation was explored in the historical extension; it is not required by the fixed replay.

## Clarifications and hint ladder

Answer public operation questions directly. Unknown direction or out-of-range input is outside the fixed input contract. Direction selection, passenger routing, motion timing, and fairness are outside scope.

Offer only one hint at a time, on request; record each:
1. What must be known to answer NEXT beyond whether a floor is requested?
2. Could requested destinations keep information about neighboring destinations? How would a new request find its place?
3. Could groups of floor numbers help narrow where you look?
4. How would information about a group change when its last request disappears or its first request arrives?

Hints are assistance, not new requirements. Do not introduce conventional algorithm names or confirm a guessed relationship before reveal.

## Evaluation cases

Trace the player's actual mechanism. These cases exercise public rules; they are not a hidden performance bar.

| State / operations | Required result |
| --- | --- |
| Empty; NEXT(0, UP), NEXT(999, DOWN) | Both NONE |
| REQUEST(842) twice; SERVICE(842) once | Empty |
| Pending {0, 999}; NEXT(0, UP); NEXT(999, DOWN) | 999; 0 |
| Pending {501}; NEXT(501, UP); NEXT(501, DOWN) | NONE; NONE |
| Pending {10, 100, 300, 700, 900}; REQUEST(650); NEXT(301, UP) | 650 |
| Same set after adding 650; SERVICE(650); NEXT(301, UP) | 700 |
| Pending {112, 401, 488, 731}; SERVICE(401); SERVICE(488); NEXT(112, UP) | 731 |
| Previous state; REQUEST(537); NEXT(112, UP); NEXT(731, DOWN) | 537; 537 |
| Pending {112, 731}; REQUEST(537); REQUEST(582); SERVICE(537); NEXT(112, UP) | 582 |
| SERVICE of absent floor; then request that floor again | No-op followed by one outstanding request |

Also test deletion of the only request and reinsertion, updates near both boundaries, and interleaved changes to formerly empty ranges. Inspect stale cached pointers and all repair costs. A pointer splice is constant work only after the required neighbors are found; finding them is part of the operation.

Let U be the universe size (1,000 here), n the active request count, and B any chosen group width. Count actual work in this fixed setting and, if generalizing costs, show dependence on U, n, and B. Updating every inactive group in a gap costs work proportional to the groups touched. Do not infer scalable O(1) bounds from a ten-group example.

## Reveal and comparison

The underlying problem is a dynamic predecessor/successor index over an integer set: insert, delete, and nearest stored value strictly above or below a query.

Possible comparisons include a hand-built balanced search tree, linked ordered active values, indexed bitsets, and radix/trie-based integer indexes. They offer different time, space, and implementation tradeoffs. A library container is outside this replay's design exercise, but remains useful comparison material.

Neighbor links can make movement from a known active node cheap; an arbitrary current floor still needs a way to locate the correct neighbor. Hierarchical groups narrow that search, but group lookup and maintenance must be specified. Sparse allocation can reduce unused storage when generalizing the universe; it is optional here.

Do not identify the player's mechanism as a fully specified Patricia trie or van Emde Boas structure, or assign those structures' bounds, merely because it resembles a hierarchy. They are possible post-reveal relatives to investigate. No single canonical implementation is the required answer.

## Original playtest record

Source: the design conversation "Shrink Array Pointers," including the original setup, elevator discussion, and retrospective. This is a sanitized summary, not a published raw transcript.

The original exercise began with 1,000 floors, duplicate requests, service/removal, directional NEXT, O(U) permitted memory, a ban on floor-by-floor scanning, and an ambiguously worded ban on a conventional sorted list.

The player's progression included:
- A dictionary keyed by requested floor.
- Up/down links among active destinations and state for the last departure and current target.
- Walking active links to locate an insertion point; reconnecting neighbors on service.
- Min/max anchors, then hundreds/tens/ones grouping.
- Links among active groups and cached neighbors for inactive groups.
- Recursive grouping, sparse allocation for a larger universe, and discussion of width versus occupancy.
- Recognition of a trie-like structure before the final comparison.

The GM also suggested mechanisms, prompted optimizations, and supplied terminology during the exercise. Preserve the distinction between player ideas and assisted development; this was not a sealed independent weekly attempt.

What worked: a concrete story made operations accessible, small examples exposed update problems, and the player developed and revised a representation before the final comparison.

What broke: the GM accepted linked ordering despite the ambiguous sorted-list ban, pushed increasingly strict insertion expectations, changed scale from 1,000 floors to a billion locations and then a 32-bit hierarchy, and supplied leading hints. Those changes were not a precommitted challenge. They increased cognitive load and moved the goalposts.

The player eventually requested a pause and description of the underlying algorithm. The GM revealed related structures. The historical outcome was an explored design and reveal, not a complete implementation, correctness proof, benchmark, or established novelty result.

v0.1 repair: disclose the clarified fixed contract upfront; evaluate against it; allow valid alternatives; treat scaling or density experiments as separately agreed future work. Never make them retroactive conditions of success.

## History entry guidance after reveal

For someone who actually participated in the original session, record RI-0001 as ended-incomplete / revealed, with the mechanism summarized as hierarchical numeric groups, linked active regions, and cached neighbors. Record the concepts above and GM assistance; leave unproved bounds and novelty unresolved or not evaluated.

For a new replay, record that player's actual result and exposure. Never copy the original participant's discoveries into a new player's history.
