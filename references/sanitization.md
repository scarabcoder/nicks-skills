# Source Sanitization

When adapting examples from an existing project:

- Replace business nouns with neutral names: `workspace`, `entity`, `record`, `member`, `membership`, `resource`.
- Do not reference the source app, its customers, domain model, personas, update cadence, generated design docs, or product-specific workflows.
- Preserve implementation patterns only: middleware shape, file layout, query patterns, schema conventions, validation, permissions, tool metadata, testing style.
- If a snippet contains a business-specific rule, remove the rule and keep only the extension point.
- For UI, include implementation libraries and component ergonomics only. Leave visual direction to the target project or Impeccable.

