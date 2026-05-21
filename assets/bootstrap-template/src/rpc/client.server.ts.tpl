import { RPCHandler } from '@orpc/server/fetch';
import { getRequest } from '@tanstack/react-start/server';
import { appRouter } from '@/rpc/router';

export function getServerUrl(): string {
  const request = getRequest();
  const url = new URL(request.url);
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') ?? url.protocol.replace(':', '');
  return host ? `${proto}://${host}/api/rpc` : new URL('/api/rpc', process.env.BASE_URL || url.origin).toString();
}

const serverRpcHandler = new RPCHandler(appRouter);

export async function serverRpcFetch(input: RequestInfo | URL, init?: RequestInit) {
  const request = input instanceof Request ? input : new Request(input.toString(), init);
  const { response, matched } = await serverRpcHandler.handle(request, {
    prefix: '/api/rpc',
    context: { headers: request.headers, request },
  });
  return matched
    ? response
    : new Response(JSON.stringify({ error: 'No route was found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
}

