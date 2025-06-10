import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './types';

// Create a single supabase client for interacting with your database from client components
export const supabase = createClientComponentClient<Database>({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  options: {
    global: {
      fetch: fetch.bind(globalThis),
    },
  },
});