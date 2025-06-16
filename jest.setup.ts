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
  const typedInit = init as RequestInit;
  const inputObj = typeof input === 'string' ? { url: input } : (input as object);
  return {
    ...inputObj,
    ...typedInit,
  };
}) as unknown as typeof Request;

global.Response = jest.fn().mockImplementation((...args) => {
  const [body, init] = args;
  const typedInit = init as ResponseInit;
  return {
    status: typedInit?.status || 200,
    statusText: typedInit?.statusText || 'OK',
    headers: new Headers(typedInit?.headers),
    ok: (typedInit?.status || 200) >= 200 && (typedInit?.status || 200) < 300,
    json: () => Promise.resolve(JSON.parse(body as string)),
    text: () => Promise.resolve(body as string),
    ...typedInit,
  };
}) as unknown as typeof Response;

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => {
      const typedInit = init as ResponseInit;
      return {
        status: typedInit?.status || 200,
        headers: new Headers(typedInit?.headers),
        json: () => Promise.resolve(body),
      };
    }),
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
  withScope: jest.fn((callback: (scope: { setTag: jest.Mock; setExtra: jest.Mock }) => void) =>
    callback({ setTag: jest.fn(), setExtra: jest.fn() })),
}));

// Mock performance API
global.performance = {
  ...global.performance,
  now: jest.fn().mockReturnValue(0) as unknown as () => number,
  mark: jest.fn().mockReturnValue({} as PerformanceMark) as unknown as (markName: string, markOptions?: PerformanceMarkOptions) => PerformanceMark,
  measure: jest.fn().mockReturnValue({} as PerformanceMeasure) as unknown as (measureName: string, startOrMeasureOptions?: string | PerformanceMeasureOptions, endMark?: string) => PerformanceMeasure,
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  getEntriesByType: jest.fn().mockReturnValue([]) as unknown as (type: string) => PerformanceEntryList,
  getEntriesByName: jest.fn().mockReturnValue([]) as unknown as (name: string, type?: string) => PerformanceEntryList,
  getEntries: jest.fn().mockReturnValue([]) as unknown as () => PerformanceEntryList,
  clearResourceTimings: jest.fn(),
  setResourceTimingBufferSize: jest.fn(),
  timeOrigin: Date.now(),
};