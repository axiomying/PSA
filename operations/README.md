# Operations

Operational safety covers the period after a valid decision is produced. PSA needs observable state, explicit ownership, bounded recovery actions, and rehearsal before any live treasury is connected.

Required production runbooks include:

- emergency halt and signer isolation;
- oracle disagreement and stale data;
- asset depeg or RWA redemption suspension;
- failed or partial rebalance reconciliation;
- adapter compromise;
- governance and model rollback;
- evidence-store outage.

The first runbook, [`runbooks/emergency-halt.md`](runbooks/emergency-halt.md), is written for the current dry-run phase and clearly separates commands that exist from future production actions.

```bash
npm run --silent psa -- status
npm run --silent psa -- rebalance --json | jq '.guardrails'
npm run check
```
