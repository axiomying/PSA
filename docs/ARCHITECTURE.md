# Architecture

PON Sovereign Agent separates adaptive intelligence from treasury authority. The design assumes that market data, model output, and external evidence can all be wrong. Safety therefore depends on narrow permissions and deterministic validation—not on a model being correct every time.

## Trust boundaries

| Boundary | Responsibility | Authority |
|---|---|---|
| Observation | Normalize market, chain, RWA, liquidity, and protocol-revenue data | Read only |
| Intelligence | Estimate risk, forecast regimes, explain a proposal | May propose |
| Policy | Validate assets, weights, confidence, turnover, and drawdown | May approve or quarantine |
| Execution | Translate an approved target into bounded adapter calls | May execute approved deltas only |
| Accounting | Reconcile balances, receipts, costs, and realized outcomes | Read and attest |
| Governance | Change allowlists, limits, adapters, and emergency roles | Timelocked authority |

The current repository implements observation fixtures, intelligence, policy, accounting feedback, and a dry-run terminal. Execution is deliberately absent.

## Decision lifecycle

```text
1. snapshot     capture timestamped, quality-scored observations
2. assess       derive stress regime and calibrated confidence
3. propose      optimize utility subject to capacity assumptions
4. project      cap the transition by normal-cycle turnover
5. validate     run deterministic invariants over the full target
6. quarantine   stop if any invariant fails
7. execute      future: submit bounded calls through allowlisted adapters
8. attest       bind inputs, policy version, rationale, and receipts
9. evaluate     compare predicted risk and realized outcome
10. learn       update calibration without changing constitutional policy
```

## Data contracts

An asset observation contains:

- canonical symbol and economic class;
- expected yield in basis points;
- volatility estimate;
- liquidity score;
- composite risk score;
- data-quality score;
- allocatable capacity in USD.

A decision contains:

- unique content-derived identifier;
- timestamp and model version;
- stress regime, confidence, and reasons;
- complete target weights;
- turnover and class totals;
- individual guardrail results;
- human-readable rationale;
- execution mode.

Production evidence should additionally include chain ID, block number, oracle timestamps, source hashes, policy hash, code revision, signatures, transaction receipts, fees, and reconciliation results.

## Emergency precedence

Normal decisions respect the turnover cap. A circuit-breaker transition is different: when drawdown or confidence triggers `HALTED`, the target becomes 100% reserve and the emergency path may exceed normal turnover. This precedence must be explicit in both contract logic and monitoring.

An execution implementation should still enforce slippage, venue, capacity, nonce, and transaction-value bounds during emergency transitions. “Emergency” is not permission for arbitrary calls.

## Production decomposition

The recommended production topology is:

```text
read-only collectors ─► immutable observation store ─► isolated inference worker
                                                        │
                                                        ▼
governed policy registry ───────────────────────► deterministic evaluator
                                                        │ signed approval
                                                        ▼
                                                limited execution signer
                                                        │
                                                        ▼
                                                  chain adapters
```

The inference worker should never hold the governance key. The execution signer should not accept arbitrary calldata. Adapters should be asset- and venue-specific, independently pausable, and governed through a delay.

## Next architecture gates

Before live execution, the project needs:

1. canonical asset identifiers and decimal-safe fixed-point math;
2. quorum-based price and RWA evidence with freshness rules;
3. replayable decision bundles with stable schemas;
4. contract-level allowlists and per-adapter value caps;
5. independent simulation, invariant, fork, and fuzz testing;
6. monitoring that reconciles intent, transaction, and final balance;
7. external security review and an incident response drill.
