import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { orpcUtils } from '@/rpc/react';

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(orpcUtils.health.queryOptions());
  },
  component: HomePage,
});

function HomePage() {
  const { data } = useSuspenseQuery(orpcUtils.health.queryOptions());
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center gap-4 px-6">
      <p className="text-sm text-muted-foreground">Status: {data.status}</p>
      <h1 className="text-4xl font-semibold tracking-normal">{{APP_NAME}}</h1>
      <p className="max-w-prose text-muted-foreground">
        TanStack Start, oRPC, React Query, Drizzle, Zod, and Bun are wired for extension.
      </p>
    </main>
  );
}

