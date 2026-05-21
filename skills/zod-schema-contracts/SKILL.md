---
name: zod-schema-contracts
description: Create or refine Zod v4 schemas for API inputs, outputs, Drizzle integration, form validation, MCP tool parameter documentation, runtime parsing, nullability, defaults, coercion, and schema reuse boundaries.
metadata:
  internal: true
---

# Zod Schema Contracts

Use Zod at runtime boundaries: oRPC inputs, form validators, environment parsing, serialized payloads, and MCP tool schemas.

## Rules

- Prefer object schemas for procedure inputs.
- Keep API schemas separate from database insert schemas when the public contract differs from row shape.
- Add `.describe()` to every field that may become an MCP parameter.
- Use `.nullable()` when `null` is a meaningful explicit value.
- Use `.optional()` when omission means "leave unchanged" or "server chooses default".
- Use `.default()` for query/list filters when the server should normalize missing values.
- Use `z.coerce.*` only at external/string boundaries, not for already typed internal values.

## Update Schemas

For patch/update procedures:

- Require the entity ID.
- Make changed fields optional.
- Use nullable optional fields for clearable values, for example `description: z.string().nullable().optional()`.
- Reject empty updates in the procedure when necessary.

## List Schemas

Use consistent pagination fields:

```ts
cursor: z.string().optional().describe('Opaque pagination cursor from a previous response.'),
limit: z.number().int().min(1).max(100).default(25).describe('Max results per page.'),
```

## Verification

Add tests for schemas with tricky coercion, nullability, defaults, and invalid inputs. For MCP-exposed schemas, inspect generated tool descriptions.

