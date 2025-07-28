import type { JestConfigWithTsJest } from 'ts-jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: JestConfigWithTsJest = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^jose$': '<rootDir>/__mocks__/jose.js',
    '^@supabase/supabase-js$': '<rootDir>/__mocks__/supabase.js'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(jose|@panva|oidc-token-hash|@supabase|@supabase/realtime-js)/)'
  ],
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/components/dashboard/quick-stats.test.tsx'
  ],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx'
  ],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};

export default createJestConfig(config);