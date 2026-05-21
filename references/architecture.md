# Architecture Reference

Use this as the shared app shape for all skills in this pack. Keep product and business concepts generic.

## Stack

- Runtime/package manager: Bun.
- Framework: TanStack Start with file-based routing and SSR.
- Frontend: React, React Query, Tailwind CSS v4, shadcn/ui using the Base UI style, lucide icons.
- RPC: oRPC as the only application RPC layer. Do not use `createServerFn` for app data workflows.
- Database: Drizzle ORM with PostgreSQL in production and optional PGlite fallback for local development/tests.
- Validation: Zod v4 and `drizzle-zod`.
- Auth: Better Auth with TanStack Start cookies and request middleware.
- Authorization: CASL attribute-based abilities.
- Forms: TanStack Form with app-registered field/form components.
- Optional platform modules: subdomain workspaces, MCP tool exposure, AI assistant tooling, React Email/SendGrid, structured logging/audit trails, Bun production server.

## Directory Shape

```text
src/
  routes/                 TanStack Start routes
    _authenticated/       protected app routes
    _auth/                public auth routes
    _public/              public marketing/docs routes
    api/                  route handlers such as rpc/auth/mcp
  domain/{name}/          feature-owned schema/procedures/router/components/hooks
  rpc/                    oRPC infrastructure, clients, MCP bridge
  database/               Drizzle driver, schema, helpers, migrations wrapper
  common/                 email, observability, shared services
  components/ui/          shadcn-generated components
  lib/                    utilities, form setup, logger
  styles/                 Tailwind v4 global CSS
```

## Non-Negotiables

- Keep server data access behind oRPC procedures unless the route is a true protocol endpoint.
- Scope tenant/workspace data in every query when tenancy is enabled.
- Use Zod input schemas at API boundaries and `.describe()` on fields that may become MCP tool parameters.
- Use `ensureQueryData` in route loaders and matching `useSuspenseQuery` calls in components.
- Use real database-backed integration tests when testing persistence behavior; prefer PGlite over mocks.
- Keep UI guidance about libraries and component mechanics only. Do not encode product-specific design direction.

