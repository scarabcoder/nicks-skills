---
name: better-auth-tanstack-start
description: Implement or modify Better Auth in a TanStack Start app, including Drizzle adapter schemas, session handling, TanStack Start cookies, request middleware, auth clients, email/password, magic links, OTP, passkeys, OAuth, disabled users, and cross-subdomain cookies.
metadata:
  internal: true
---

# Better Auth TanStack Start

Use Better Auth as the app authentication boundary. Keep product-specific invitation or onboarding flows out unless the target project explicitly needs them.

## Server Setup

- Configure `betterAuth` in a server-only domain module such as `src/domain/auth/auth.ts`.
- Use the Drizzle adapter with explicit schema mapping.
- Add `tanstackStartCookies()` to plugins.
- Add a TanStack Start request middleware that wraps requests with Better Auth endpoint context.
- Derive `baseURL`, trusted origins, and cookie settings from `BASE_URL`.

## Auth Methods

Enable only requested methods:

- Email/password with verification.
- Magic link.
- Email OTP.
- Passkeys/WebAuthn.
- OAuth providers when credentials are present.
- MCP OAuth only when the MCP skill is in scope.

## Session Types

- Treat Drizzle select types as ground truth for custom user/session fields.
- Sanitize Better Auth session output before placing it in oRPC context.
- Include server-managed fields such as role/disabled/deleted with `input: false`.

## Middleware Integration

- oRPC auth middleware should accept injected `userSession` for trusted server/MCP calls.
- Otherwise resolve session from request headers via Better Auth.
- Use `UNAUTHORIZED` for missing sessions.

## Verification

Test anonymous, signed-in, disabled/deleted user, cookie refresh, SSR refresh, and cross-tab/session invalidation behavior.

