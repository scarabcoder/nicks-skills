---
name: multi-tenant-workspaces
description: Add or modify optional workspace/tenant isolation using subdomains, workspace resolution from requests, trusted origins, cross-subdomain auth cookies, workspace-scoped oRPC context, local HTTPS, and route-level workspace redirects.
metadata:
  internal: true
---

# Multi-Tenant Workspaces

Use only when the app needs workspace/tenant isolation. Keep terms generic: workspace, tenant, organization, or account as chosen by the target project.

## Resolution Order

Resolve active workspace from:

1. Subdomain, for example `{slug}.example.com`.
2. Header such as `x-workspace-slug`.
3. Query parameter such as `?workspace=`.
4. Injected oRPC/MCP context.

## Subdomain Extraction

Support local and production hosts:

```ts
export function extractWorkspaceSlug(hostname: string): string | null {
  const host = hostname.split(':')[0]!;
  if (host.endsWith('.localhost') || host.endsWith('.local')) {
    const slug = host.split('.')[0]!;
    return slug === 'localhost' || slug === 'local' ? null : slug;
  }
  if (host === 'localhost' || host === '127.0.0.1') return null;
  const parts = host.split('.');
  return parts.length > 2 ? parts[0]! : null;
}
```

## Auth Cookies

When subdomains share sessions, configure Better Auth cross-subdomain cookies and dynamic trusted origins from `BASE_URL`.

## Route Behavior

Protected route layouts should:

- Require session.
- Resolve workspace.
- Redirect to a known workspace subdomain when the user has exactly one obvious workspace.
- Redirect to onboarding or workspace picker when no workspace is available.

## Verification

Test root domain, workspace subdomain, localhost subdomain, header fallback, query fallback, unauthorized workspace, and cookie sharing.

