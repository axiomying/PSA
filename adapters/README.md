# Adapter Registry

Adapters isolate PSA's decision engine from data providers, chains, venues, custodians, and model vendors. The core engine consumes normalized observations and produces target weights; it never constructs arbitrary external calls.

Every production adapter must declare:

- whether it is read-only or execution-capable;
- the assets, networks, and methods it supports;
- freshness, capacity, and failure semantics;
- its permission boundary and emergency owner;
- the evidence attached to every response;
- audit status and an exact implementation version.

The machine-readable catalog is [`registry.json`](registry.json). Only fixture and deterministic-policy adapters are active in this research release. Live execution remains disabled.

## Adapter acceptance checklist

```bash
npm run validate:repo
npm test
npm run --silent psa -- rebalance --json | jq '.guardrails'
```

An adapter is not allocatable merely because it appears in this folder. Governance must separately allowlist its assets and capabilities.
