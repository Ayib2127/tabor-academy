// types/app.d.ts
import type { NextRequest } from 'next/server';

declare global {
  namespace App {
    interface RouteContext {
      params: Record<string, string | string[]>;
      searchParams: URLSearchParams;
    }
  }
}