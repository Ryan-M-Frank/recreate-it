# RI-0001 — The Forgetful Elevator

**PLAYER VIEW — safe to open.** Version 0.1.0. Original playtest, preserved as an archived solo challenge.

This is a fixed replay specification reconstructed from the original exercise, not a verbatim transcript. Ambiguities in the original wording have been resolved below. There are no surprise scale changes or mandatory later stages.

## Problem

You control an elevator in a 1,000-floor building, with floors numbered 0–999. Requests arrive in any order. Keep track of the requested floors and find the nearest requested floor in either direction.

Support:
- `REQUEST(floor)`: add a destination. Repeating an outstanding request changes nothing.
- `NEXT(currentFloor, UP)`: return the smallest requested floor strictly above the current floor.
- `NEXT(currentFloor, DOWN)`: return the largest requested floor strictly below the current floor.
- `SERVICE(floor)`: clear the request when that floor is visited. Clearing an absent request changes nothing.

NEXT does not remove a request. Return `NONE` if no requested floor exists in that direction; do not wrap around. A request at the current floor is excluded from NEXT and can be cleared with SERVICE. Floors may be requested again after service.

## Fixed constraints

- Inputs are integer floors 0–999 and directions UP or DOWN. Calls are sequential; concurrent requests and physical elevator scheduling are outside the exercise.
- You may preallocate memory proportional to the 1,000-floor universe.
- NEXT may not inspect each physical floor in sequence to find an outstanding request.
- Do not delegate the problem to a library sorted list, ordered-set container, or sorting routine. You may design and explain your own representation, including ordered links. This is the replay's explicit interpretation of the original ambiguous "no conventional sorted list" rule.
- Aim for fast operations and explain the work each one performs. There is no numeric runtime limit or required asymptotic bound. A slow but compliant design is evaluated honestly rather than rejected for an unstated target.

## Example

Pending requests: 3, 17, 92, 108, 501.

```text
NEXT(100, UP)   -> 108
NEXT(100, DOWN) -> 92
REQUEST(108)   -> pending requests unchanged
SERVICE(108)   -> 108 is no longer requested
NEXT(100, UP)   -> 501
NEXT(501, UP)   -> NONE
```

Describe what you store and what changes when REQUEST(842) arrives. Start with an idea; formal code is optional.

When you finish or explicitly end the round, the GM can reveal comparison material. You can pause without revealing it.
