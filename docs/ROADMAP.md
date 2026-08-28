# Roadmap

PSA advances through safety gates. Dates are intentionally omitted; evidence determines promotion.

## v0.1 — Research core

- [x] deterministic CLI and seeded scenario runner;
- [x] risk regimes and confidence threshold;
- [x] capacity-aware portfolio proposal;
- [x] reserve, class, concentration, turnover, and drawdown guardrails;
- [x] inspectable outcome-calibration loop;
- [x] tests and GitHub CI;
- [x] execution locked by default.

## v0.2 — Verifiable decisions

- [ ] stable JSON schemas for observations, policies, decisions, and outcomes;
- [ ] canonical serialization and signed evidence bundles;
- [ ] append-only local decision ledger;
- [ ] deterministic replay from a decision ID;
- [ ] benchmark report across calm, volatile, stale-data, and tail-risk corpora.

Exit gate: an independent process can reproduce every decision from its referenced inputs.

## v0.3 — Read-only adapters

- [ ] multi-source price collection;
- [ ] chain balances and protocol-revenue accounting;
- [ ] RWA issuer, legal, reserve, and redemption evidence;
- [ ] oracle freshness, disagreement, and quality scoring;
- [ ] adapter health monitoring.

Exit gate: PSA can shadow a real treasury for 30 days without custody and reconcile every observation.

## v0.4 — Public testnet shadow treasury

- [ ] governed policy registry;
- [ ] allowlisted adapter interfaces;
- [ ] transaction simulation and bounded calldata;
- [ ] end-to-end receipts and reconciliation;
- [ ] pause, rollback, and incident exercises;
- [ ] invariant and fuzz tests.

Exit gate: all execution paths are bounded, replayed, monitored, and externally reviewed.

## v0.5 — Capped production pilot

- [ ] independent audits closed;
- [ ] public risk disclosures and operating runbooks;
- [ ] timelocked governance and limited emergency roles;
- [ ] low treasury and transaction caps;
- [ ] insurer, legal, accounting, and tax review where applicable;
- [ ] public performance and incident reporting.

Exit gate: the pilot completes its minimum operating period within stated loss, cost, and reliability limits.

## v1.0 — Progressive sovereignty

- [ ] multiple intelligence providers and evaluators;
- [ ] governed model promotion and rollback;
- [ ] decentralized evidence curation;
- [ ] cross-chain accounting without cross-chain arbitrary authority;
- [ ] progressively decentralized policy governance;
- [ ] fully documented `$PSA` necessity and design—or an explicit decision not to issue it.
