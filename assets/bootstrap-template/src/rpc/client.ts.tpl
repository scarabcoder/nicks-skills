import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { RouterClient } from '@orpc/server';
import type { AppRouter } from '@/rpc/router';

async function getRpcUrl(): Promise<string> {
  if (import.meta.env.SSR) {
    const { getServerUrl } = await import('@/rpc/client.server');
    return getServerUrl();
  }
  return `${window.location.origin}/api/rpc`;
}

async function rpcFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (import.meta.env.SSR) {
    const { serverRpcFetch } = await import('@/rpc/client.server');
    return serverRpcFetch(input, init);
  }
  return globalThis.fetch(input, init);
}

const link = new RPCLink({
  url: () => getRpcUrl(),
  fetch: (request, init) => rpcFetch(request, init),
});

export const client = createORPCClient<RouterClient<AppRouter>>(link);

