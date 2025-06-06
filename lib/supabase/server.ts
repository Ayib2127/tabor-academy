import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from './types';

export function createServerClient() {
  const cookieStore = cookies();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: { path: string; maxAge: number; domain?: string; sameSite?: string; secure?: boolean }) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: { path: string; domain?: string; sameSite?: string; secure?: boolean }) {
        cookieStore.set({ name, value: '', ...options, maxAge: 0 });
      },
    },
  });
}