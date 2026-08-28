# Schemas

Schemas are the stable boundary between collectors, intelligence, policy, execution, accounting, dashboards, and auditors.

Available drafts:

- [`decision.schema.json`](decision.schema.json) — policy-checked decision envelope;
- [`policy.schema.json`](policy.schema.json) — governed treasury limits.

```bash
jq empty schemas/*.json
npm run validate:repo
```

Schema changes should be backward compatible within a major version. A production artifact should name its schema version and must not rely on undocumented fields for authorization.
