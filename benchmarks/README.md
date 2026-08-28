# Benchmarks

Benchmarks define promotion gates for PSA intelligence and policy revisions. They are not marketing performance claims.

The first suite focuses on safety properties:

- every portfolio sums to exactly 10,000 basis points;
- every normal decision stays under the turnover limit;
- reserve, asset, RWA, and crypto limits hold after projection;
- the drawdown circuit breaker targets the reserve asset;
- identical inputs and seeds produce identical decisions;
- lower observation quality cannot increase execution authority.

[`baselines.json`](baselines.json) records acceptance thresholds. Future benchmark reports should be immutable artifacts keyed by code revision, dataset hash, policy hash, and model version.

```bash
npm test
npm run --silent psa -- simulate --cycles 100 --seed 7 --json \
  | jq -e 'all(.[]; .decision.guardrails.passed == true)'
```
