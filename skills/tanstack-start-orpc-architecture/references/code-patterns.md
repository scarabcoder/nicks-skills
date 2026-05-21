# Code Patterns

## oRPC Procedure Levels

```ts
export const pub = o.use(authMiddleware);
export const authed = pub.use(requireAuthMiddleware);
export const withAbility = authed.use(abilityMiddleware);
export const workspaceScoped = authed
  .use(workspaceMiddleware)
  .use(requireWorkspaceMiddleware)
  .use(workspaceAbilityMiddleware);
```

Use `pub` for optional session, `authed` for logged-in user only, `withAbility` for platform-level abilities, and `workspaceScoped` for most tenant CRUD.

## Drizzle Enum Derivation

```ts
export const EntityStatuses = ['draft', 'active', 'archived'] as const;
export const entityStatusEnum = pgEnum('entity_status', EntityStatuses);
export type EntityStatus = (typeof EntityStatuses)[number];
export const entityStatusSchema = z.enum(EntityStatuses);
```

## Domain Procedure Flow

```ts
export const updateEntity = workspaceScoped
  .input(updateEntitySchema)
  .handler(async ({ input, context: { workspace, ability, userSession } }) => {
    const entity = await selectOne(
      database.select().from(entityTable).where(and(
        eq(entityTable.id, input.entityId),
        eq(entityTable.workspaceId, workspace.id),
      )),
    );

    if (!entity || ability.cannot('edit', subject('Entity', entity))) {
      throw new ORPCError('NOT_FOUND', { message: 'Entity not found' });
    }

    const [updated] = await database
      .update(entityTable)
      .set({ name: input.name, updatedAt: new Date() })
      .where(eq(entityTable.id, entity.id))
      .returning();

    await auditUpdate({
      userId: userSession.user.id,
      workspaceId: workspace.id,
      entityType: 'ENTITY',
      entityId: entity.id,
      oldData: entity,
      newData: updated,
      impersonatedBy: userSession.session.impersonatedBy,
    });

    return updated;
  });
```

## Route Loading

```tsx
export const Route = createFileRoute('/_authenticated/entities')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      orpcUtils.entity.listEntities.queryOptions({ input: {} }),
    );
  },
  component: EntitiesPage,
});

function EntitiesPage() {
  const { data } = useSuspenseQuery(
    orpcUtils.entity.listEntities.queryOptions({ input: {} }),
  );
  return <EntityList items={data.items} />;
}
```

## Form Hook

```ts
export const { useAppForm, withForm } = createFormHook({
  fieldComponents: { FormInput, FormSelect, FormTextarea, FormDatePicker },
  formComponents: { FormSubmitButton },
  fieldContext,
  formContext,
});
```

