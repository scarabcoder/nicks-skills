---
name: domain-module
description: Scaffold or extend a feature domain module end-to-end with Drizzle schema, Zod input schemas, oRPC procedures, CASL authorization, router registration, MCP metadata, audit logging, route integration, and optional React components.
metadata:
  internal: true
---

# Domain Module

Use this for new features. Read `../../references/architecture.md`, `../../references/code-patterns.md`, and `../../references/sanitization.md`.

## Required Files

For domain `{name}`:

```text
src/domain/{name}/
  schema.ts
  procedures.ts
  router.ts
  components/        optional
  hooks/             optional
src/database/schema/{name}.ts
```

Register the database schema in `src/database/schema/index.ts` and the domain router in `src/rpc/router.ts`.

## Workflow

1. Model the database table with the Drizzle skill.
2. Create API input schemas in `src/domain/{name}/schema.ts`.
3. Implement procedures using the `validate -> authorize -> query/mutate -> audit -> return` flow.
4. Wrap procedures in `router.ts`; add MCP metadata only for procedures intended for tool use.
5. Add route/component integration if requested.
6. Generate migrations after schema edits.

## Procedure Defaults

- Use `workspaceScoped` for most tenant CRUD.
- Use `authed` for user-owned records outside a workspace.
- Use `pub` only for public data or session probes.
- Scope all workspace queries by `workspaceId`.
- Audit create/update/delete when audit logging is enabled.

## MCP Defaults

- Add `.describe()` to every input schema field that may be exposed to MCP.
- Use concise tool descriptions.
- Add `readOnlyHint`, `idempotentHint`, or `destructiveHint` where accurate.

## Verification

Run type-check, migration generation, and at least one focused test for non-trivial authorization/query behavior.

