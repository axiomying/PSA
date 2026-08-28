# Examples

Examples show the shape of PSA artifacts without implying live execution. [`decision-envelope.json`](decision-envelope.json) mirrors a policy-checked dry-run decision and can be used by dashboard, indexing, or audit-log prototypes.

```bash
jq '.allocation.targetWeights' examples/decision-envelope.json
jq -e '.guardrails.passed == true' examples/decision-envelope.json
npm run validate:repo
```

Example identifiers and timestamps are synthetic. Production consumers must verify signatures, policy hashes, observation references, and chain receipts rather than trusting a JSON file by location.
