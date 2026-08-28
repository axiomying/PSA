# Governance

Governance owns PSA's constitutional boundary: asset allowlists, treasury limits, adapter permissions, signers, timelocks, and emergency roles. The intelligence layer has no authority to change these controls.

Policy changes should use a PON Improvement Proposal (`PIP`) containing:

- an exact machine-readable policy diff;
- motivation and rejected alternatives;
- portfolio simulations under multiple seeds and stress scenarios;
- operational and legal impact;
- activation delay and rollback conditions;
- conflicts of interest;
- accountable proposer and reviewers.

Start from [`proposals/PIP-000-template.md`](proposals/PIP-000-template.md).

```bash
cp governance/proposals/PIP-000-template.md governance/proposals/PIP-001-title.md
git switch -c governance/pip-001-title
```
