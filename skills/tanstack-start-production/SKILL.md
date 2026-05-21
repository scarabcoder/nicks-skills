---
name: tanstack-start-production
description: Configure production deployment for TanStack Start on Bun, including build/start scripts, Bun.serve server entry, static asset serving, cache headers, ETags, gzip, environment variables, process error handling, and deployment verification.
metadata:
  internal: true
---

# TanStack Start Production

Use Bun as the production runtime unless the target deployment requires another adapter.

## Build Output

Expected build output:

```text
dist/client/   static assets
dist/server/   TanStack Start server bundle
```

## Server Pattern

- Import `./dist/server/server.js`.
- Serve static assets from `dist/client`.
- Route all non-static requests to `handler.fetch(request)`.
- Catch request-level errors and return a generic 500.
- Install `unhandledRejection` and `uncaughtException` handlers.

## Static Assets

For richer servers, support:

- Preloading small assets into memory.
- Serving large assets on demand.
- Immutable cache headers for hashed assets.
- Shorter cache headers for unhashed assets.
- ETag and `If-None-Match`.
- Optional gzip for text, JS, JSON, XML, and SVG.

Keep background jobs or cron tasks target-project specific and opt-in.

## Environment

Common vars:

- `PORT`
- `BASE_URL`
- `DATABASE_URL`
- `PRETTY_LOGGING`
- static asset preload/cache settings if implemented

## Verification

Run `bun run build`, `bun run start`, request static assets, refresh app routes, and verify 500 logging with a controlled failure if practical.

