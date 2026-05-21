---
name: bootstrap-tanstack-orpc-app
description: "Bootstrap a new React TanStack Start + oRPC application or generate a starter architecture. Use when creating a new project or adding the baseline stack: Bun, TanStack Start, React Query, oRPC, Drizzle, Zod, Better Auth, CASL, TanStack Form, shadcn/Base UI, Tailwind v4, MCP, email, audit logging, AI tools, or Bun production server."
metadata:
  internal: true
---

# Bootstrap TanStack oRPC App

Use this skill to create the baseline app architecture. Read `../../references/architecture.md` and `../../references/sanitization.md` before generating or editing files.

## Discovery

Inspect the target repo first:

- `package.json`, lockfiles, Vite/TanStack configs.
- Existing `src/routes`, `src/rpc`, `src/database`, `src/domain`, `components.json`, `src/styles`.
- Current package manager and TypeScript strictness.

Only ask questions that cannot be answered from the repo. Minimum decisions:

- App/package name and target directory.
- `BASE_URL` and local host mode.
- Single-tenant or workspace/subdomain multi-tenancy.
- Auth methods: email/password, magic link, OTP, passkeys, OAuth.
- Database mode: Postgres immediately or PGlite fallback first.
- Optional modules: email, MCP tools, AI assistant tools, audit logging, Bun production server.

## Generator

Use the bundled generator for new apps:

```bash
node scripts/bootstrap-tanstack-orpc-app.mjs --target /path/to/app --config app.json --dry-run
node scripts/bootstrap-tanstack-orpc-app.mjs --target /path/to/app --config app.json
```

Config example:

```json
{
  "appName": "Acme Workbench",
  "packageName": "acme-workbench",
  "baseUrl": "http://localhost:3000",
  "enableWorkspaces": true,
  "enableEmail": false,
  "enableMcp": true,
  "enableAi": false,
  "enableAudit": true
}
```

The generator writes a generic starter. After generation, layer in optional modules using the focused skills in this pack.

## Implementation Rules

- Use latest-compatible dependency ranges in new `package.json` files unless the user asks for pinned versions.
- Keep `createServerFn` out of app data workflows; use oRPC procedures.
- Keep generated names generic. Do not preserve business-specific names from source projects.
- Use PGlite fallback when `DATABASE_URL` is absent.
- Use Tailwind v4 CSS config and shadcn `base-nova`/Base UI defaults.

## Verification

Run, as applicable:

```bash
bun install
bun run type-check
bun run build
bun test
```

If dependency installation is intentionally skipped, say so and validate with dry-run plus static inspection.
