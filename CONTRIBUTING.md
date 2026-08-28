# Contributing

Contributions should make PSA safer, more reproducible, more observable, or easier to evaluate.

## Local workflow

```bash
git clone https://github.com/OWNER/pon-sovereign-agent.git
cd pon-sovereign-agent
npm ci

git switch -c feat/short-description
npm test
npm run check
```

Before opening a pull request:

```bash
npm run --silent psa -- status
npm run --silent psa -- rebalance --json | jq empty
npm run --silent psa -- simulate --cycles 24 --seed 42 >/tmp/psa-sim.txt

git diff --check
git status --short
```

## Change expectations

- Add deterministic tests for behavior changes.
- State the treasury invariant or trust boundary affected.
- Keep execution locked unless the pull request is explicitly part of an approved adapter milestone.
- Use basis points for weights and percentages in core logic.
- Do not add an asset fixture without documenting its economic role and risk assumptions.
- Avoid model calls for facts that deterministic code can establish.
- Update the README or relevant design document when a public command or policy changes.

## Commit style

Short conventional prefixes keep history legible:

```text
feat: add replayable decision envelope
fix: preserve reserve floor after turnover projection
test: cover stale oracle fail-closed path
docs: clarify RWA redemption risk
chore: update CI runtime
```

## Pull requests

A focused pull request is easier to review. Describe the problem, the chosen boundary, the tests, and any residual risk. Screenshots are useful for terminal or documentation changes; machine-readable test output is preferred for engine changes.

Security issues should follow [SECURITY.md](SECURITY.md), not the public issue tracker.
