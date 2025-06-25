const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

// Add Supabase environment validation
export function validateEnv() {
  // Skip strict validation when running unit tests to avoid unnecessary failures
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`${envVar} is not defined`);
    }
  }
}
