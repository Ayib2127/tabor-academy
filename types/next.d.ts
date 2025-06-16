import type { NextRequest } from 'next/server';

declare module 'next/server' {
  export type RouteContext = {
    params: Record<string, string | string[]>;
  };
} 