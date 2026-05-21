---
name: ai-assistant-tools
description: Add optional AI assistant tool execution using TanStack AI or similar adapters, bridging MCP/oRPC tools into model-callable tools with user context, workspace context, streaming chat, run context propagation, and audit attribution.
metadata:
  internal: true
---

# AI Assistant Tools

Use this only when the app needs an in-product assistant or model-driven tool calls.

## Architecture

- Reuse the MCP/oRPC tool registry rather than building a separate tool layer.
- Convert MCP descriptors into model tool definitions.
- Invoke tools through the MCP router with injected `userSession` and workspace context.
- Keep all authorization in oRPC procedures.
- Stream chat responses when the selected adapter supports it.

## Context

Carry assistant run metadata:

- run ID
- actor user/session
- workspace
- tool name
- message/thread IDs when applicable

Use AsyncLocalStorage when deep utilities such as audit logging need attribution without passing parameters through every function.

## Guardrails

- Expose only tools with explicit MCP metadata.
- Prefer read-only tools by default.
- Treat destructive tools as explicit and annotated.
- Keep system prompts product-specific in the target app, not in this reusable skill.

## Verification

Test tool list generation, tool execution with injected context, forbidden tool calls, streaming cancellation/error behavior, and audit attribution.

