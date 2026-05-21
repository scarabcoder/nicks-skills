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
node scripts/bootstrap-tanstack-orpc-app.mjs \
  --target blank-app \
  --app-name "Blank App" \
  --package-name blank-app \
  --preset blank-local
```

Presets:

- `blank-local`: single tenant, PGlite, no email/MCP/AI/audit.
- `workspace-local`: workspace tenancy, PGlite, audit.
- `platform-full`: workspaces, PGlite, MCP, AI, email, audit.

Default blank app assumptions:

- target: `./blank-app` unless cwd is empty and app-like
- app name: `Blank App`
- base URL: `http://localhost:3000`
- single tenant
- PGlite fallback
- optional modules off
- run `--install --verify` unless blocked

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
bun run routes:generate
bun run type-check
bun run lint
bun test
bun run build
```

If dependency installation is intentionally skipped, say so and validate with dry-run plus static inspection.
