# Security Policy

PON Sovereign Agent is currently a research preview with dry-run execution only. That reduces custody risk, but logic, dependency, documentation, and future adapter vulnerabilities are still taken seriously.

## Reporting a vulnerability

Please use GitHub private vulnerability reporting for the repository. Do not open a public issue containing exploit details, credentials, private RPC URLs, or information that could put an external protocol at risk.

Include, when possible:

- affected revision and files;
- threat model and preconditions;
- minimal reproduction or failing test;
- potential impact;
- a suggested mitigation;
- whether any third party may already be affected.

Maintainers should acknowledge a complete report within 72 hours. Acknowledgement is not a promise that a fix will be completed in that period.

## In scope

- bypasses of allocation guardrails;
- incorrect portfolio accounting or basis-point math;
- non-deterministic replay;
- malicious or malformed configuration behavior;
- secret exposure;
- unsafe future signing or execution paths;
- evidence tampering or decision-ID collisions with practical impact.

## Safety rules for contributors

- Never commit a private key, mnemonic, funded test key, or production credential.
- Never connect a funded signer to research code.
- Keep live execution disabled until the relevant adapter has been audited and explicitly governed.
- Use forked state or testnet funds for integration testing.
- Redact third-party secrets and coordinate disclosure when an upstream system is involved.

## Supported versions

Only the latest revision of the default branch is supported during the research phase.
