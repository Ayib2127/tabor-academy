import { createClient } from '@supabase/supabase-js';

declare global {
  // eslint-disable-next-line no-var
  var supabaseClient: ReturnType<typeof createClient> | undefined;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase =
  globalThis.supabaseClient ??
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'x-application-name': 'tabor-academy',
      },
    },
  });

// Cache the client for this browser tab to avoid duplicate instances
if (!globalThis.supabaseClient) {
  globalThis.supabaseClient = supabase;
}
