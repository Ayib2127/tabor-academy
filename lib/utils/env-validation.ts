import { z } from 'zod';

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'GOOGLE_API_KEY',
] as const;

export const serverSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  GOOGLE_API_KEY: z.string(),
  OPENAI_API_KEY: z.string().optional(),
});

// Add Supabase environment validation
export function validateEnv() {
  // Skip strict validation when running unit tests to avoid unnecessary failures
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  serverSchema.parse(process.env);
}
