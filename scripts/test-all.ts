import { execSync } from 'child_process';
import { validateEnv } from '../lib/utils/env-validation';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runTests() {
  console.log('🔍 Running all tests...\n');

  // 1. Test environment variables
  console.log('Testing environment variables...');
  try {
    validateEnv();
    console.log('✅ Environment variables: PASSED\n');
  } catch (error) {
    console.error('❌ Environment variables: FAILED');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error occurred');
    }
    process.exit(1);
  }

  // 2. Run Jest tests
  console.log('Running Jest tests...');
  try {
    execSync('npm test', { stdio: 'inherit' });
    console.log('✅ Jest tests: PASSED\n');
  } catch (error) {
    console.error('❌ Jest tests: FAILED');
    process.exit(1);
  }

  // 3. Run type checking
  console.log('Running TypeScript type checking...');
  try {
    execSync('tsc --noEmit', { stdio: 'inherit' });
    console.log('✅ TypeScript: PASSED\n');
  } catch (error) {
    console.error('❌ TypeScript: FAILED');
    process.exit(1);
  }

  console.log('🎉 All tests passed!');
}

runTests().catch(console.error); 