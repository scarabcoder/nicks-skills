---
name: tanstack-start-orpc-architecture
description: Universal full-stack TypeScript architecture skill for bootstrapping and extending React TanStack Start + oRPC apps. Use for new app scaffolding, domain modules, oRPC procedures, Drizzle/Postgres/PGlite, Zod schemas, Better Auth, CASL permissions, workspace tenancy, TanStack Form, shadcn/Base UI, Tailwind v4, MCP tools, AI assistant tools, React Email/SendGrid, audit logging, Bun tests, and production deployment.
---

# TanStack Start oRPC Architecture

Build and extend full-stack React apps with the reusable architecture in this bundled skill. This is a portable Agent Skills package: all references, templates, and scripts needed by this skill live inside this directory so it can be installed by `bunx skills`.

## First Steps

1. Inspect the target repo before changing files.
2. Read `references/architecture.md` for the baseline stack and directory shape.
3. Read `references/sanitization.md` when adapting examples from an existing app.
4. Read `references/code-patterns.md` when writing routes, procedures, schemas, forms, or domain modules.
5. Use the section below that matches the task.

Do not carry source-project business concepts into the target project. Keep names generic unless the user supplies target-domain language.

<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `pnpm dlx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## Bootstrap A New App

### Default Blank App

When the user says "initialize a blank app" or gives no stronger preferences,
assume:

- target: `./blank-app` unless the current directory is empty and already app-like
- app name: `Blank App`
- package name: `blank-app`
- base URL: `http://localhost:3000`
- preset: `blank-local`
- single tenant
- PGlite fallback
- optional email/MCP/AI/audit modules off
- run install and verification unless blocked by environment, time, or credentials

Shortest path:

```bash
node <this-skill-dir>/scripts/bootstrap-tanstack-orpc-app.mjs \
  --target ./blank-app \
  --app-name "Blank App" \
  --package-name blank-app \
  --preset blank-local \
  --install \
  --verify
```

Ask only for decisions not discoverable from the target environment:

- app/package name and target directory
- `BASE_URL` and local host mode
- single tenant or workspace/subdomain tenancy
- auth methods
- Postgres immediately or PGlite fallback first
- optional email, MCP, AI tools, audit logging, and Bun production server

Use the bundled generator:

```bash
node <this-skill-dir>/scripts/bootstrap-tanstack-orpc-app.mjs \
  --target /path/to/app \
  --app-name "Workspace App" \
  --package-name workspace-app \
  --preset workspace-local \
  --dry-run
```

Presets:

- `blank-local`: single tenant, PGlite, optional modules off.
- `workspace-local`: workspace tenancy, PGlite, audit on.
- `platform-full`: workspace tenancy, PGlite, email, MCP, AI, and audit on.

Use `--json` with `--dry-run` when another agent needs machine-readable output.

Use latest-compatible dependency ranges in new apps unless the user explicitly asks for pinned versions.

## Routing

- Use TanStack Start file-based route groups: `_authenticated`, `_auth`, `_public`, and `api`.
- Use `ensureQueryData` in loaders and matching `useSuspenseQuery` calls in components.
- Keep app data behind oRPC. Do not use `createServerFn` for ordinary app workflows.
- Register the router type with TanStack Router's `Register` module augmentation.

## oRPC

- Keep RPC infrastructure in `src/rpc`.
- Use base procedure levels: `pub`, `authed`, `withAbility`, and `workspaceScoped` when tenancy is enabled.
- Procedure flow: validate input, load related records, authorize, query/mutate, audit if needed, return typed data.
- Throw `ORPCError` with stable codes. Use `NOT_FOUND` when revealing existence would leak data.

## Domain Modules

For domain `{name}`, create:

```text
src/domain/{name}/schema.ts
src/domain/{name}/procedures.ts
src/domain/{name}/router.ts
src/database/schema/{name}.ts
```

Register the database schema barrel and root app router. Add optional components/hooks only when the feature needs UI.

## Database And Zod

- Use Drizzle with Postgres and PGlite fallback.
- Use one const array to derive pgEnum, TypeScript type, and Zod schema.
- Generate `createSelectSchema` and `createInsertSchema` with `drizzle-zod`.
- Keep API input schemas separate from row insert schemas when the public contract differs.
- Add `.describe()` to Zod fields that may become MCP parameters.

## Auth And Permissions

- Use Better Auth with Drizzle adapter and `tanstackStartCookies`.
- Wrap TanStack Start requests in Better Auth endpoint context when session cookies are needed server-side.
- Use CASL for attribute-based authorization.
- Build abilities in layers: platform, workspace, and resource membership.
- Enforce permissions in procedures; React checks only hide unavailable UI.

## Workspaces

When multi-tenancy is enabled:

- Resolve workspace from subdomain, header, query param, or injected context.
- Scope every workspace query by workspace ID.
- Configure trusted origins and cross-subdomain cookies from `BASE_URL`.
- Test root domain, workspace subdomain, local host, and unauthorized workspace cases.

## Forms And UI Foundations

- Use TanStack Form with app-registered field and form components.
- Use shadcn/ui `base-nova`, Base UI primitives, Tailwind v4 CSS config, and lucide icons.
- This skill covers component mechanics, not brand or visual art direction.
- Use Impeccable separately for frontend design critique and polish.

## Optional Platform Modules

- MCP: expose only explicitly opted-in oRPC procedures; use metadata, surfaces, and annotations.
- AI tools: bridge the MCP/oRPC tool registry into model-callable tools with injected user/workspace context.
- Email: use one React Email + SendGrid service with typed templates, dynamic subject/preview, and plaintext rendering.
- Audit/logging: use Pino structured logs and audit utilities for create/update/delete diffs and tool attribution.
- Production: use Bun server entry, static asset cache headers, ETag/gzip where needed, and process error handlers.

## Testing

- Use Bun test with colocated `*.test.ts`.
- Prefer PGlite-backed integration tests over database mocks.
- Test auth, permission, validation, tenancy, MCP discovery/execution, and audit behavior at the right boundary.

## Verification Commands

Run what applies:

```bash
bun install
bun run routes:generate
bun run type-check
bun run lint
bun test
bun run build
bun run drizzle:generate
bun run drizzle:migrate
```

If a command is skipped because it would install a fresh dependency tree or needs credentials, say so clearly.
