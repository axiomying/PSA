# Repository Scripts

Scripts automate checks that should behave the same locally and in CI.

```bash
# validate required directories, JSON syntax, policy totals, and example weights
npm run validate:repo

# print a compact repository capability catalog
npm run catalog
```

Scripts must remain non-destructive by default. A script that signs, deploys, migrates, or mutates external state requires an explicit command name, a dry-run mode, and separate review.
