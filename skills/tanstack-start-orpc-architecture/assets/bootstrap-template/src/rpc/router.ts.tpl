import { pub } from '@/rpc/base';

export const health = pub.handler(() => {
  return { status: 'ok' as const };
});

export const appRouter = {
  health,
};

export type AppRouter = typeof appRouter;

