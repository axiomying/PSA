# Deployments

Deployment manifests are authoritative only when they include a network identifier, code revision, policy hash, contract addresses, creation transactions, and explorer links.

There are currently **no live PSA deployments**. [`simulation.json`](simulation.json) exists to make that absence explicit and machine-readable.

When deployments begin, use one manifest per chain or environment:

```text
deployments/
├── simulation.json
├── 11155111.json     # example: testnet chain ID
└── 1.json            # example: mainnet chain ID, only after review
```

Never add a production address without its verification status and the exact source revision used to build it.
