---
name: mcp-orpc-tools
description: Expose oRPC procedures as Model Context Protocol tools, add MCP metadata, tool annotations, surfaces, user-facing tool catalogs, OAuth-aware context resolution, and direct tool execution for AI assistants or external MCP clients.
metadata:
  internal: true
---

# MCP oRPC Tools

Use this when procedures should be callable by AI agents or external MCP clients.

## Metadata Pattern

- Attach metadata through a wrapper such as `withMcpTool(procedure, meta)`.
- Default tools to an internal surface unless explicitly exposed to user-connected clients.
- Keep a central catalog for user-facing tools.
- Generate MCP names from dotted procedure paths using kebab-case.

## Metadata Fields

Required:

- `description`: action-oriented and specific.

Optional:

- `title`
- `annotations`: `readOnlyHint`, `idempotentHint`, `destructiveHint`
- `inputSchema` override
- `outputSchema`
- `surfaces`

## Procedure Requirements

- Opted-in procedures must have object input schemas or explicit MCP input schema overrides.
- Every exposed input field should have a Zod `.describe()`.
- Tool execution must reuse oRPC context, auth, workspace resolution, and CASL permissions.

## Error Handling

Return MCP error results with structured content for `ORPCError`:

```json
{ "code": "FORBIDDEN", "message": "..." }
```

Stringify unknown errors without leaking internals beyond the target app's policy.

## Verification

Test tool discovery, duplicate name rejection, surface filtering, successful calls, auth failures, validation failures, and structured error output.
