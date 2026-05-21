---
name: react-email-sendgrid
description: Implement transactional email with React Email and SendGrid, including typed templates, shared container templates, dynamic subject and preview text, plaintext rendering, auth email hooks, and send logging.
metadata:
  internal: true
---

# React Email SendGrid

Use a single email service as the only sending path.

## Service Pattern

- Configure SendGrid from `SENDGRID_API_KEY`.
- Use `FROM_EMAIL`, `APP_NAME`, and optional `APP_LOGO_URL`.
- Render both HTML and plaintext with `@react-email/render`.
- Wrap all templates in a shared container automatically.
- Log structured send attempts and failures.

## Template Type

```ts
export interface BaseTemplateProps {
  children?: ReactNode;
  logoUrl: string;
  applicationName: string;
  preview?: string;
}

export type EmailTemplate<TProps = {}> = {
  component: FC<TProps & BaseTemplateProps>;
  subject: ((props: TProps & BaseTemplateProps) => string) | string;
  preview: ((props: TProps & BaseTemplateProps) => string) | string;
};

export const createTemplate = <TProps>(template: EmailTemplate<TProps>) => template;
```

## Template Rules

- Do not include the container/logo/footer in individual templates.
- Use shared email components for headings, paragraphs, buttons, and dividers.
- Keep props typed and explicit.
- Subject and preview may be static strings or functions.
- Auth hooks may use fire-and-forget only when failure should not block the auth flow.

## Verification

Render templates in tests or preview, inspect plaintext output, and test missing SendGrid config behavior.

