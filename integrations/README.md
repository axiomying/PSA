# Integrations

Integrations connect PSA to external systems while preserving the adapter boundary. This folder is a capability map, not a list of endorsed or active vendors.

Integration classes:

| Class | Data direction | Default permission |
|---|---|---|
| Chain reader | Inbound | Read-only |
| Market data | Inbound | Read-only |
| RWA evidence | Inbound | Read-only, source-attested |
| Model provider | Inbound/outbound data | Proposal only |
| Alerting | Outbound | Notification only |
| Treasury execution | Outbound | Disabled |

Current and planned capabilities are listed in [`capability-matrix.json`](capability-matrix.json). Provider-specific credentials must remain outside the repository.
