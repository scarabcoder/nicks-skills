# TanStack Start oRPC Architecture Skill

Universal Agent Skill package for building React TanStack Start + oRPC applications.

## Install With Skills CLI

From a local checkout:

```bash
bunx skills add . --skill tanstack-start-orpc-architecture -a codex -y
```

From GitHub:

```bash
bunx skills add https://github.com/scarabcoder/nicks-skills --skill tanstack-start-orpc-architecture -a codex -y
```

Repository: https://github.com/scarabcoder/nicks-skills

List installable skills:

```bash
bunx skills add . --list
```

Install to every detected agent:

```bash
bunx skills add . --skill tanstack-start-orpc-architecture --all
```

## Usage Examples

After installing, ask your agent to use the skill by name:

```text
Use tanstack-start-orpc-architecture to bootstrap a new TanStack Start + oRPC app in ./apps/workbench.
Use Bun, Drizzle, PGlite fallback, Better Auth email/password, CASL permissions, and shadcn/Base UI.
```

```text
Use tanstack-start-orpc-architecture to add a new invoices domain.
Include a Drizzle schema, Zod input schemas, oRPC procedures, router registration, CASL checks, and MCP metadata for read-only list/get tools.
```

```text
Use tanstack-start-orpc-architecture to review this app's oRPC setup and align it with the recommended middleware levels.
Do not change business logic; only identify architecture gaps and propose the patch.
```

```text
Use tanstack-start-orpc-architecture to add workspace subdomain tenancy.
Resolve workspaces from subdomain, x-workspace-slug, or ?workspace=, and ensure procedures are workspace-scoped.
```

```text
Use tanstack-start-orpc-architecture to create a React Email + SendGrid password-reset template and wire it into Better Auth.
```

The installed skill also includes a bootstrap generator. Agents can run it from
the installed skill directory when creating a brand-new app:

```bash
node .agents/skills/tanstack-start-orpc-architecture/scripts/bootstrap-tanstack-orpc-app.mjs \
  --target ./apps/workbench \
  --config app.json
```

## What It Includes

- A single public universal skill: `tanstack-start-orpc-architecture`
- Bundled references, bootstrap templates, and a generator script inside the skill directory
- Existing granular skills retained as internal source material for maintainers
