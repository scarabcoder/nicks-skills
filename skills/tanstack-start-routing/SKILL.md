---
name: tanstack-start-routing
description: Build or modify TanStack Start routing, layouts, route guards, root route setup, SSR data loading, React Query integration, route loaders with ensureQueryData, and file-based route organization.
metadata:
  internal: true
---

# TanStack Start Routing

Read `../../references/architecture.md` and `../../references/code-patterns.md` when changing route structure or data loading.

## Route Groups

Use pathless route groups consistently:

- `_authenticated`: protected app routes.
- `_auth`: login, registration, recovery, and auth-only pages that redirect away when signed in.
- `_public`: public pages that may be session-aware.
- `api`: protocol endpoints and oRPC/Auth/MCP handlers.

## Data Loading

- Use `loader` or `beforeLoad` with `context.queryClient.ensureQueryData(...)`.
- In the component, use `useSuspenseQuery(...)` with the same `orpcUtils.*.queryOptions(...)`.
- Use `Route.useParams()` and validated search params instead of parsing URLs manually.
- Do not fetch app data directly from route handlers when an oRPC procedure should own it.

## Router Setup

- Create a `QueryClient` in router construction.
- Disable retries for intentional client/server errors such as 401, 403, and 404.
- Exclude unserializable query data from dehydration when needed.
- Register the router type with TanStack Router's `Register` module augmentation.

## Guards

- Auth guard: load `auth.getUserSession`; redirect anonymous users to login.
- Workspace guard: resolve active workspace through oRPC, request context, or subdomain skill patterns.
- Invitation/public exceptions must be explicit in the route group, not scattered through leaf components.

## Verification

Run type-check and navigate the affected routes. For UI route work, start the dev server and inspect SSR navigation, refresh behavior, redirects, and loader cache hits.
