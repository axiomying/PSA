# Scenario Library

Scenario files describe reproducible treasury conditions for research, review, and future replay tooling.

Included scenarios:

- [`calm-market.json`](calm-market.json) — normal confidence and low drawdown;
- [`emergency-drawdown.json`](emergency-drawdown.json) — circuit-breaker threshold reached.

```bash
jq . scenarios/calm-market.json
jq . scenarios/emergency-drawdown.json
npm run --silent psa -- simulate --cycles 24 --seed 42
```

The current CLI uses deterministic generated paths rather than loading these files directly. The scenario format is being staged now so replay support can be added without mixing fixtures into engine code.
