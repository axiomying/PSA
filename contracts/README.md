# Contracts

This directory defines the future on-chain boundary; it does not claim a deployed or audited contract system.

The initial interface in [`interfaces/IPSAExecutor.sol`](interfaces/IPSAExecutor.sol) expresses the smallest useful execution surface: validate a complete target allocation, execute an already identified decision, and expose a pause state. A production implementation must add governed asset and adapter allowlists, fixed-point accounting, transaction-value caps, oracle freshness, replay protection, timelocks, and role separation.

## Status

```text
interface specification  available
implementation           not started
testnet deployment       none
mainnet deployment       none
external audit           none
```

Do not infer deployability from the presence of an interface. Contract work begins only after the decision and policy schemas are stable.
