# Treasury Policy

The treasury policy is PSA's constitution. Intelligence can search within it; only governance can change it.

## Default invariants

| Invariant | Default | Purpose |
|---|---:|---|
| Reserve floor | 20% | Preserve liquidity and operational runway |
| RWA class cap | 50% | Limit legal, issuer, custody, and redemption concentration |
| Crypto class cap | 45% | Limit correlated market beta |
| Single non-reserve cap | 35% | Prevent asset-specific concentration |
| Normal turnover cap | 25% | Bound execution cost and model instability |
| Minimum confidence | 65% | Fail closed when observation quality degrades |
| Drawdown circuit breaker | 12% | Prioritize capital preservation under loss |

All weights are represented in basis points. A valid target sums to exactly `10_000`.

## Allocation order

1. Evaluate drawdown and confidence. If either breaker fires, set the reserve target to 100%.
2. Select the risk-regime reserve buffer.
3. Score only allowlisted, observable, non-reserve assets.
4. Enforce capacity, single-asset, and economic-class ceilings.
5. Allocate the remaining budget by risk-adjusted utility.
6. Return unused capacity to the reserve.
7. Project the current portfolio toward the target under the normal turnover cap.
8. Validate the complete post-decision portfolio.

## Changes requiring governance

- adding or removing an asset, chain, custodian, issuer, or venue;
- changing a risk cap, reserve asset, oracle rule, or breaker;
- installing or upgrading an execution adapter;
- granting or rotating a signer;
- changing the source-of-revenue definition;
- enabling live execution.

Production changes should be proposed with a machine-readable diff, impact simulation, review delay, activation time, rollback path, and public decision reference.

## Risks not solved by weights

Portfolio limits do not remove:

- smart-contract exploits;
- stablecoin or oracle failure;
- RWA bankruptcy remoteness and legal enforceability;
- sanctions, transfer restrictions, or redemption gates;
- custody and key compromise;
- liquidity disappearance under stress;
- governance capture;
- model or data-supply-chain attacks.

These risks require adapter isolation, evidence verification, incident response, legal review, monitoring, and conservative capacity—not merely portfolio optimization.
