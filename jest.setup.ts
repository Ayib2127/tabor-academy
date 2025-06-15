import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock jose module
jest.mock('jose', () => ({
  compactDecrypt: jest.fn(),
  SignJWT: jest.fn(),
  jwtVerify: jest.fn(),
  createRemoteJWKSet: jest.fn(),
  decodeJwt: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Request and Response
global.Request = jest.fn().mockImplementation((...args) => {
  const [input, init] = args;
  return {
    ...(typeof input === 'string' ? { url: input } : input),
    ...init,
  };
}) as unknown as typeof Request;

global.Response = jest.fn().mockImplementation((...args) => {
  const [body, init] = args;
  return {
    status: init?.status || 200,
    statusText: init?.statusText || 'OK',
    headers: new Headers(init?.headers),
    ok: (init?.status || 200) >= 200 && (init?.status || 200) < 300,
    json: () => Promise.resolve(JSON.parse(body as string)),
    text: () => Promise.resolve(body as string),
    ...init,
  };
}) as unknown as typeof Response;

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({
      status: init?.status || 200,
      headers: new Headers(init?.headers),
      json: () => Promise.resolve(body),
    })),
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

// Mock Sentry
jest.mock('@sentry/nextjs', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  addBreadcrumb: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  setExtra: jest.fn(),
  withScope: jest.fn((callback) =>
    callback({ setTag: jest.fn(), setExtra: jest.fn() })),
}));

// Mock performance API
global.performance = {
  ...global.performance,
  now: jest.fn(),
  mark: jest.fn(),
  measure: jest.fn(),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  getEntriesByType: jest.fn().mockReturnValue([]),
  getEntriesByName: jest.fn().mockReturnValue([]),
  getEntries: jest.fn().mockReturnValue([]),
  clearResourceTimings: jest.fn(),
  setResourceTimingBufferSize: jest.fn(),
  timeOrigin: Date.now(),
};