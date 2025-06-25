// types/next.d.ts
import 'next';

declare module 'next/server' {
  export interface NextRequestContext {
    params: Record<string, string | string[]>;
  }
  
  export type RouteContext = {
    params: Record<string, string | string[]>;
  };
}

declare module 'next' {
  export interface PageProps {
    params: Record<string, string | string[]>;
  }
}