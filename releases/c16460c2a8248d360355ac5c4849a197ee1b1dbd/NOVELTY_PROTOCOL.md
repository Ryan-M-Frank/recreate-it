# Novelty review protocol v0.1

Independent invention is valuable even when the result is already known. The GM's inability to recognize a design establishes neither originality nor novelty. Comparison to one canonical approach is insufficient.

## Statuses

| Status | Meaning |
| --- | --- |
| Not evaluated | No novelty investigation performed |
| Unresolved flag | A specified difference warrants investigation |
| Known relation | Evidence connects the mechanism to existing work |
| Candidate after review | A precise difference survives the documented review so far; not a definitive novelty claim |

A flag records the proposed difference, current evidence, missing evidence, and next steps. Do not label a flagged idea "new algorithm," "first," or "novel" as an established result.

## Review after the round

Freeze the player's design and assistance record before reveal. Conduct prior-art searches only after independent invention ends; weekly independent attempts wait until reveal.

1. **Formalize:** define the problem, input domain, machine model, state, operations, invariants, and exact proposed contribution.
2. **Analyze correctness:** provide a proof or clearly bounded argument. Seek adversarial examples; log counterexamples and repairs as new revisions.
3. **Analyze complexity:** derive time and space bounds, including initialization, cache repairs, allocation, and all update costs. State assumptions and distinguish worst-case, expected, and amortized bounds.
4. **Review prior art:** search across alternate terminology, neighboring problem formulations, papers, books, implementations, and other relevant prior-art sources. Record search date, queries, coverage, citations, and limitations. Compare mechanisms and guarantees directly, not names alone.
5. **Prototype and measure when warranted:** compare against appropriate known baselines on disclosed workloads, including adversarial ones. Retain reproducible methods and results; do not use benchmarks as proof of asymptotic superiority.
6. **Review the difference:** seek independent technical review. State precisely which claim survived and which known techniques it relies on.

Do not advance to candidate-after-review without a formal specification, correctness and complexity analysis, and documented prior-art review. If any part is missing or inconclusive, remain unresolved. A search finding nothing is limited evidence, not proof of absence.

## Review record

- Frozen submission revision and assistance:
- Exact claim and difference from closest known work:
- Formal specification:
- Correctness evidence and limitations:
- Complexity derivation and computational model:
- Adversarial cases:
- Prior-art search log and cited comparisons:
- Prototype / benchmark evidence, or why not applicable:
- Reviewer and review date:
- Status and unresolved questions:

Known reinvention remains a successful game outcome. Novelty review is optional follow-up work and never a requirement for completing a round.
