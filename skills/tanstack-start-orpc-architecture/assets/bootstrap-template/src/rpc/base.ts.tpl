import { ORPCError } from '@orpc/client';
import { os } from '@orpc/server';

export type UserSession = {
  session: { id: string; userId: string; impersonatedBy?: string | null };
  user: { id: string; email: string; role?: string };
};

export type ORPCContext = {
  headers: Headers;
  request?: Request;
  userSession?: UserSession | null;
};

const o = os.$context<ORPCContext>();

const authMiddleware = o.middleware(async ({ context, next }) => {
  return next({ context: { userSession: context.userSession ?? null } });
});

const requireAuthMiddleware = o.middleware(async ({ context, next }) => {
  if (!context.userSession) {
    throw new ORPCError('UNAUTHORIZED', { message: 'You must be logged in.' });
  }
  return next({ context: { userSession: context.userSession } });
});

export const pub = o.use(authMiddleware);
export const authed = pub.use(requireAuthMiddleware);

