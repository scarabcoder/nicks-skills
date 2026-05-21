/* eslint-disable */

// @ts-nocheck

// This file is a bootstrap-safe TanStack Router route tree.
// It can be regenerated with `bun run routes:generate`.

import { Route as rootRouteImport } from './routes/__root';
import { Route as IndexRouteImport } from './routes/index';
import { Route as ApiRpcSplatRouteImport } from './routes/api/rpc/$';

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any);

const ApiRpcSplatRoute = ApiRpcSplatRouteImport.update({
  id: '/api/rpc/$',
  path: '/api/rpc/$',
  getParentRoute: () => rootRouteImport,
} as any);

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute;
  '/api/rpc/$': typeof ApiRpcSplatRoute;
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute;
  '/api/rpc/$': typeof ApiRpcSplatRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRouteImport;
  '/': typeof IndexRoute;
  '/api/rpc/$': typeof ApiRpcSplatRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths: '/' | '/api/rpc/$';
  fileRoutesByTo: FileRoutesByTo;
  to: '/' | '/api/rpc/$';
  id: '__root__' | '/' | '/api/rpc/$';
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  ApiRpcSplatRoute: typeof ApiRpcSplatRoute;
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/';
      path: '/';
      fullPath: '/';
      preLoaderRoute: typeof IndexRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    '/api/rpc/$': {
      id: '/api/rpc/$';
      path: '/api/rpc/$';
      fullPath: '/api/rpc/$';
      preLoaderRoute: typeof ApiRpcSplatRouteImport;
      parentRoute: typeof rootRouteImport;
    };
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute,
  ApiRpcSplatRoute,
};

export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

declare module '@tanstack/react-start' {
  interface Register {
    ssr: true;
  }
}
