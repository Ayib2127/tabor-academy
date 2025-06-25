import { validateEnv } from '../lib/utils/env-validation';

console.log('Testing environment variables...');
try {
  validateEnv();
  console.log('✅ All required environment variables are present');
} catch (error: unknown) {
  console.error('❌ Environment validation failed:', (error as Error).message);
  process.exit(1);
} 