# Intelligence

PSA treats intelligence as a versioned decision service, not as a source of authority. Its job is to improve forecasts and allocation proposals inside a fixed treasury constitution.

## Current learning contract

The research implementation deliberately uses an inspectable state:

| Field | Meaning |
|---|---|
| `modelVersion` | Version attached to every decision |
| `observations` | Count of verified feedback samples |
| `calibrationErrorBps` | Exponentially weighted prediction error |
| `explorationBudgetBps` | Shrinking research budget, never an exposure override |

For each cycle:

```text
error_t       = realized_stress_t - predicted_stress_t
calibration_t = 0.8 × calibration_(t-1) + 0.2 × error_t
```

Calibration affects confidence. Confidence affects whether a proposal may advance. A low-confidence model therefore receives less authority, not more freedom to compensate.

## Evidence before inference

A future model may interpret unstructured inputs—issuer reports, legal changes, governance proposals, reserve attestations, or security disclosures. Those outputs should be stored as claims with source references and timestamps. Deterministic facts such as balances, prices, oracle age, and policy limits should not be delegated to a language model.

Recommended evidence envelope:

```json
{
  "source": "canonical-uri-or-chain-reference",
  "observedAt": "2026-01-01T00:00:00.000Z",
  "contentHash": "sha256:...",
  "claim": "structured machine-readable claim",
  "confidenceBps": 8400,
  "expiresAt": "2026-01-02T00:00:00.000Z"
}
```

## Promotion criteria

An intelligence version should advance from research to shadow mode only when it has:

- a frozen dataset or replay corpus;
- benchmark results against the current production version;
- calibration, drawdown, turnover, and cost metrics;
- adversarial tests for missing, stale, and contradictory evidence;
- a rollback artifact and an explicit owner;
- no ability to alter policy or execution permissions.

Shadow mode must run beside the incumbent without custody. Live promotion should be gradual, capped, reversible, and observable.

## What “autonomous” means here

Autonomous means PSA can complete the approved observe–decide–validate–execute–evaluate loop without a human signing every normal allocation. It does not mean immutable governance, unlimited self-modification, arbitrary code deployment, or freedom from accountability.
