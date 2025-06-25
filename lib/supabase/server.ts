import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Create a safe global object
const globalObject = typeof window !== 'undefined' ? window : global;

// Create a single instance of the server client
export const createServerClient = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          cookie: cookieString,
          'x-application-name': 'tabor-academy'
        },
      },
    }
  );
};

// Export both functions
export const createClient = createServerClient;
