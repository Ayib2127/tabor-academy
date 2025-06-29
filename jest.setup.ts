// @ts-nocheck
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

// Mock NextResponse and NextRequest
jest.mock('next/server', () => {
  class NextResponse {
    status: number;
    headers: Headers;
    constructor(body?: any, init: ResponseInit = {}) {
      this.status = init.status || 200;
      this.headers = new Headers(init.headers);
      Object.assign(this, body);
    }
    static json(body: any, init: ResponseInit = {}) {
      return new NextResponse(body, init);
    }
  }
  class NextRequest extends Request {
    constructor(url: string, init: RequestInit = {}) {
      super(url, init);
    }
  }
  return { __esModule: true, NextResponse, NextRequest, default: { NextResponse, NextRequest } };
});

// Canvas stub for Chart.js
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => null,
});

// Mock @supabase/auth-helpers-nextjs to provide a controllable client
jest.mock('@supabase/auth-helpers-nextjs', () => {
  const mockClient = {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
      getSession: jest.fn().mockImplementation(() => ({ data: { session: null }, error: null })),
      // keep async version alias for code that awaits it
      getSessionAsync: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: jest.fn().mockImplementation((cb) => {
        const subscription = { unsubscribe: jest.fn() };
        cb('INITIAL_SESSION', null);
        return { data: { subscription }, error: null };
      }),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
    })),
  };

  return {
    __esModule: true,
    createRouteHandlerClient: jest.fn(() => mockClient),
    createServerComponentClient: jest.fn(() => mockClient),
    createClientComponentClient: jest.fn(() => mockClient),
  };
});

// Mock Supabase client to avoid ESM parsing issues
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      user: () => null,
      getSession: jest.fn().mockImplementation(() => ({ data: { session: null }, error: null })),
      getUser: jest.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
      onAuthStateChange: jest.fn().mockImplementation((cb) => {
        const subscription = { unsubscribe: jest.fn() };
        cb('INITIAL_SESSION', null);
        return { data: { subscription }, error: null };
      }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
    storage: {
      from: () => ({ upload: () => ({ data: null, error: null }) }),
    },
  }),
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

// Expose sanitizeInput globally for tests that rely on it
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { sanitizeInput } = require('./lib/utils/security');
  (global as any).sanitizeInput = sanitizeInput;
} catch (e) {
  // ignore if path not resolvable at compile time
}

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

// Mock window.matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});