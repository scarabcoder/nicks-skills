---
name: orpc-procedures
description: Create or modify oRPC infrastructure, procedures, middleware, clients, routers, React Query utilities, server-side clients, route handlers, procedure errors, and typed full-stack data flows.
metadata:
  internal: true
---

# oRPC Procedures

Read `../../references/architecture.md` and `../../references/code-patterns.md` before changing RPC contracts.

## Infrastructure

Keep `src/rpc/` organized around:

- `base.ts`: context type, middleware, and base procedure builders.
- `router.ts`: root app router that aggregates domain routers.
- `client.ts`: browser/SSR RPC link.
- `client.server.ts`: SSR direct execution/fetch bridge.
- `react.ts`: `createORPCReactQueryUtils(client)`.
- `server-client.ts`: direct router client for trusted server contexts, when useful.

## Base Procedure Levels

- `pub`: optional session, public-safe.
- `authed`: requires session, no workspace context.
- `withAbility`: authenticated plus platform abilities.
- `workspaceScoped`: authenticated, resolved workspace, membership, scoped ability.

Only add a new base level when there is a repeated context boundary that cannot be expressed by these levels.

## Procedure Rules

- Inputs are Zod object schemas.
- Throw `ORPCError` with stable codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `BAD_REQUEST`, `CONFLICT`.
- Use `NOT_FOUND` for read/update/delete when revealing existence would leak data.
- Keep handlers small: validate related records, authorize, mutate/query, audit if needed, return typed data.
- Do not import client-only code into server procedures.

## Client Usage

- Routes and components call `orpcUtils.domain.procedure.queryOptions`.
- Mutations use `orpcUtils.domain.procedure.mutationOptions`.
- Invalidate specific query keys after mutations; avoid global cache resets except session changes.

## Verification

Run type-check and add focused Bun tests for new middleware or procedure behavior. For SSR-sensitive client changes, verify both refresh and client navigation.

