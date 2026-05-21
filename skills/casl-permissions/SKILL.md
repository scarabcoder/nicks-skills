---
name: casl-permissions
description: Design or update CASL authorization rules, actions, subjects, ability context, role and membership permissions, condition-based checks, React ability context, and oRPC authorization behavior.
metadata:
  internal: true
---

# CASL Permissions

Use CASL for attribute-based authorization. Keep the ability model generic and target-project owned.

## Model

- Define an `actions` const array.
- Define a `Subject` union with app entities and `all`.
- Export `AppAbility` and `createAppAbility`.
- Build abilities through layered helper functions, not one large inline block.

## Layers

Typical layers:

- Platform rules: user-level/global capabilities.
- Workspace rules: permissions based on workspace membership role.
- Resource membership rules: access to specific records or nested scopes.

## Procedure Checks

- Use `subject('Entity', entity)` when checking condition-based rules.
- For reads, updates, and deletes, prefer `NOT_FOUND` when the user cannot access the record.
- Use `FORBIDDEN` when the user is authenticated but lacks permission for a visible action.
- Never rely on client-side checks for enforcement.

## React Usage

- Provide ability context at the root after loading session/user context.
- Use React checks to hide unavailable actions, but keep server procedures authoritative.

## Verification

Add tests for each role/membership boundary and at least one negative case per sensitive procedure.

