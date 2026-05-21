---
name: audit-logging-observability
description: Add or update structured logging and audit trails, including Pino named loggers, audit log schemas, create/update/delete audit utilities, field-level changed data, impersonation attribution, assistant/tool attribution, and procedure audit calls.
metadata:
  internal: true
---

# Audit Logging Observability

Use structured logs for operators and audit logs for user-visible/business-relevant changes.

## Pino Logging

- Create named loggers with `createLogger(name)`.
- Use JSON logs in production and `pino-pretty` only when `PRETTY_LOGGING=true`.
- Always log structured context objects:

```ts
logger.info({ userId, workspaceId, entityId }, 'Entity created');
logger.error({ err, requestId }, 'Request failed');
```

## Audit Schema

Audit records should capture:

- Actor user ID.
- Optional impersonating user ID.
- Optional workspace ID.
- Entity type and entity ID.
- Action: create, update, delete.
- Changed fields as `{ field: { old, new } }`.
- Optional message.
- Timestamp with timezone.

Index by entity, actor, workspace/time, and creation time.

## Utilities

- `auditCreate`: stores non-excluded fields as `old: null`.
- `auditUpdate`: computes field-level diffs and skips no-op updates.
- `auditDelete`: records a deletion marker.
- Exclude generated fields such as `id`, `createdAt`, and `updatedAt`.

## Assistant/Tool Attribution

If AI/MCP tools can mutate data, use AsyncLocalStorage or injected context to decorate audit messages with tool/run attribution.

## Verification

Test changed-field computation, no-op update skip, impersonation fields, assistant attribution, and procedure audit calls.

