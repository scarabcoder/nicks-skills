---
name: tanstack-form-shadcn-ui
description: Build forms and component foundations with TanStack Form, shadcn/ui using Base UI primitives, Tailwind CSS v4, lucide icons, reusable field components, form validation, and app-wide UI component conventions without prescribing product-specific visual design.
metadata:
  internal: true
---

# TanStack Form Shadcn UI

This skill covers implementation mechanics, not visual art direction. Use Impeccable or target-project design docs for aesthetics.

## Form Hook

- Create form contexts with `createFormHookContexts`.
- Create `useAppForm` and `withForm` with app-registered field/form components.
- Components call `useFieldContext<T>()` internally.
- Do not pass value/onChange manually to registered field components.

## Field Components

Common registered components:

- `FormInput`
- `FormTextarea`
- `FormSelect`
- `FormDatePicker`
- `FormOTPInput`
- `FormFieldErrors`
- `FormSubmitButton`

Use Zod schemas in `validators.onChange` or `validators.onSubmit` when appropriate.

## shadcn/Base UI

- Use `components.json` with `style: "base-nova"`, `rsc: false`, `tsx: true`, `iconLibrary: "lucide"`.
- Install UI primitives with `bun run shadcn add <component>`.
- Use Tailwind v4 CSS config, not a Tailwind v3 JS config.
- Use `cn()` with `clsx` and `tailwind-merge`.

## UI Rules

- Use icons for icon-sized controls when a known lucide icon exists.
- Use real form labels, error text, focus states, and disabled/loading states.
- Keep reusable UI components low-level; put domain decisions in domain components.

## Verification

Check keyboard navigation, labels, validation errors, loading states, mobile layout, and type inference from `defaultValues`.

