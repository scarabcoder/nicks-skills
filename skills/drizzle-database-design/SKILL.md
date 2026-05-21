---
name: drizzle-database-design
description: Design or modify Drizzle ORM database schemas, PostgreSQL tables, PGlite local fallback, migrations, indexes, enum derivation, drizzle-zod schemas, database helpers, and persistence tests.
metadata:
  internal: true
---

# Drizzle Database Design

Read `../../references/architecture.md` and `../../references/code-patterns.md`.

## Driver Pattern

- Use Postgres when `DATABASE_URL` is set.
- Use PGlite when `DATABASE_URL` is absent.
- Use branch-scoped `.database/{git-branch}` for local persistence.
- Use temporary PGlite directories in tests.
- Export a top-level awaited `database` singleton for app code.

## Table Rules

- Primary keys: `uuid('id').defaultRandom().primaryKey()` for app-owned entities.
- Better Auth user IDs are text; references to users use `text(...)`.
- Timestamps: `timestamp(..., { withTimezone: true }).notNull().defaultNow()`.
- Foreign keys: explicit `onDelete`; use cascade for ownership, set-null for historical user references.
- Index foreign keys and common filters/sorts.
- Use singular snake_case table names and snake_case column names.

## Enum Rules

Use one const array as the source for database enum, TypeScript type, and Zod schema:

```ts
export const EntityStatuses = ['draft', 'active', 'archived'] as const;
export const entityStatusEnum = pgEnum('entity_status', EntityStatuses);
export type EntityStatus = (typeof EntityStatuses)[number];
export const entityStatusSchema = z.enum(EntityStatuses);
```

## drizzle-zod

- Export `createSelectSchema(table)` for row validation.
- Export `createInsertSchema(table, overrides).omit(...)` for insert payloads.
- Add custom validators in overrides rather than duplicating table fields manually.

## Verification

Run:

```bash
bun run drizzle:generate
bun run drizzle:migrate
bun test
```

Review generated migrations before applying them to shared environments.

