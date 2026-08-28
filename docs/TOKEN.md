# `$PSA` Token Design

`$PSA` is a proposed coordination primitive for PON Sovereign Agent. This document defines design questions and guardrails; it does not announce a deployed token, contract address, supply, sale, or financial return.

## Candidate utility

| Function | Possible role | Required safeguard |
|---|---|---|
| Policy governance | Signal or vote on treasury-policy changes | Timelock, quorum, emergency separation |
| Curator bonding | Back asset and evidence curators with slashable stake | Objective faults and appeal process |
| Evaluator rewards | Reward reproducible risk and outcome evaluation | Sybil resistance and benchmark transparency |
| Delegation | Delegate specialist review without transferring custody | Scoped, revocable permissions |
| Alignment | Connect protocol participation with long-term treasury health | No guaranteed yield or undisclosed claim |

## Design constraints

The token should not:

- bypass policy checks or directly control an execution key;
- let stake substitute for correct evidence;
- make the agent's model unchallengeable;
- promise revenue share without explicit legal and governance analysis;
- hide treasury liabilities, vesting, emissions, or insider permissions;
- launch before monitoring and emergency governance exist.

## Questions that remain open

- What decisions genuinely benefit from token governance?
- Which decisions should remain risk-council or multisig responsibilities?
- What creates measurable work for curators and evaluators?
- How are conflicts of interest disclosed?
- How are attacks on thin governance participation contained?
- Is a token necessary at all for the first live treasury?

Answers should precede token parameters. Supply and distribution numbers inserted before those answers would be theater rather than design.
