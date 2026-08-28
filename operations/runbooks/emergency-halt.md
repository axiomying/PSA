# Runbook: Emergency Halt

## Trigger conditions

- treasury drawdown reaches the governed circuit breaker;
- decision confidence falls below policy minimum;
- balance reconciliation fails;
- an oracle, adapter, signer, venue, or governed asset is suspected compromised;
- actual execution diverges from the approved target.

## Research-release response

The current release cannot execute live transactions. Confirm that the lock remains effective:

```bash
npm run --silent psa -- status
npm run --silent psa -- rebalance --execute

# expected: non-zero exit with "Execution is locked"
```

Capture a diagnostic bundle without secrets:

```bash
node --version
npm run --silent psa -- policy --json
npm run --silent psa -- rebalance --json
npm test
git rev-parse --verify HEAD 2>/dev/null || true
```

## Future production response

1. Pause the execution adapter using the independently controlled emergency role.
2. Revoke or isolate the limited execution signer.
3. Stop schedulers without deleting observation or decision evidence.
4. Reconcile approved intent, submitted transactions, receipts, and final balances.
5. Notify governance and named incident owners through an authenticated channel.
6. Preserve logs, source hashes, policy version, and timestamps.
7. Resume only through the governed recovery procedure after root-cause review.

Never paste private keys, signing payloads, or non-public vulnerability details into a public issue.
