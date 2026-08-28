# Environment Configuration

This directory contains non-secret environment profiles. Treasury limits remain in the governed root [`psa.config.json`](../psa.config.json); credentials belong in a local `.env` and must never be committed.

The simulation profile explicitly disables execution and selects fixture observations:

```bash
jq . config/environments/simulation.json
PSA_CONFIG=./psa.config.json npm run --silent psa -- status
```

Future network profiles may select read-only RPCs, evidence sources, persistence, and telemetry destinations. They must not silently loosen treasury policy.
