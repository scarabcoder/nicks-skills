---
name: bun-testing-pglite
description: Write and run tests for this architecture using Bun test, colocated test files, PGlite-backed database integration tests, real migrations, cleanup, pure unit tests, and RPC/MCP/authorization test scenarios.
metadata:
  internal: true
---

# Bun Testing PGlite

Prefer real behavior over broad mocks.

## Conventions

- Use Bun's test runner.
- Put `*.test.ts` beside the source under test.
- Use pure unit tests for formatters, parsers, permission builders, serialization, and date logic.
- Use PGlite integration tests for database queries, procedures, migrations, and MCP execution.

## Database Tests

- Detect test runtime in the database driver.
- Use an ephemeral PGlite data directory.
- Run migrations automatically for local PGlite test DBs.
- Close the PGlite client in `afterAll` when exposed.

## Procedure Tests

Test:

- Valid input succeeds.
- Invalid Zod input fails.
- Missing auth returns `UNAUTHORIZED`.
- Missing access returns `NOT_FOUND` or `FORBIDDEN` according to leak policy.
- Mutations write audit records when audit is enabled.

## MCP Tests

Test discovery, surface filtering, tool annotations, schema inference, successful execution, and structured error results.

## Commands

```bash
bun test
bun run type-check
```
