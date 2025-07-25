import { createServerClient } from '@supabase/ssr';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/supabase/types';

// Migration flag - set to true when ready to switch
const USE_NEW_SSR = process.env.NEXT_PUBLIC_USE_NEW_SSR === 'true';

// Environment validation
function validateEnvironment() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined');
  }
}

// New SSR client for server components
export async function createSupabaseServerClient() {
  validateEnvironment();
  
  try {
    const cookieStore = await cookies();
    
    if (USE_NEW_SSR) {
      // New SSR approach (recommended for Next.js 15+)
      return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get: async (name: string) => {
              const cookie = await cookieStore.get(name);
              if (!cookie?.value) return undefined;
              try {
                // Try to parse as JSON array and return the first non-null, non-empty string
                const arr = JSON.parse(cookie.value);
                if (Array.isArray(arr)) {
                  const token = arr.find((v) => typeof v === 'string' && v.length > 0);
                  if (token) return token;
                }
              } catch {
                // Not a JSON array, return as is
                return cookie.value;
              }
              return cookie.value;
            },
            set: async (name: string, value: string, options: any) => {
              try {
                await cookieStore.set(name, value, options);
              } catch (error) {
                console.warn('Failed to set cookie:', name, error);
              }
            },
            remove: async (name: string, options: any) => {
              try {
                await cookieStore.set(name, '', { ...options, maxAge: 0 });
              } catch (error) {
                console.warn('Failed to remove cookie:', name, error);
              }
            },
          },
        }
      );
    } else {
      // Legacy approach (current behavior)
      return createServerComponentClient<Database>({ 
        cookies: () => cookieStore 
      });
    }
  } catch (error) {
    console.error('Failed to create server client:', error);
    throw new Error('Database connection failed');
  }
}

// New SSR client for API routes
export async function createApiSupabaseClient(passedCookies?: any) {
  validateEnvironment();
  
  try {
    let cookieStore;
    if (passedCookies) {
      cookieStore = typeof passedCookies.then === 'function' ? await passedCookies : passedCookies;
    } else {
      cookieStore = await cookies();
    }
    
    if (USE_NEW_SSR) {
      // New SSR approach for API routes
      return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get: async (name: string) => {
              const cookie = await cookieStore.get(name);
              if (!cookie?.value) return undefined;
              try {
                // Try to parse as JSON array and return the first non-null, non-empty string
                const arr = JSON.parse(cookie.value);
                if (Array.isArray(arr)) {
                  const token = arr.find((v) => typeof v === 'string' && v.length > 0);
                  if (token) return token;
                }
              } catch {
                // Not a JSON array, return as is
                return cookie.value;
              }
              return cookie.value;
            },
            set: async (name: string, value: string, options: any) => {
              try {
                await cookieStore.set(name, value, options);
              } catch (error) {
                console.warn('Failed to set cookie:', name, error);
              }
            },
            remove: async (name: string, options: any) => {
              try {
                await cookieStore.set(name, '', { ...options, maxAge: 0 });
              } catch (error) {
                console.warn('Failed to remove cookie:', name, error);
              }
            },
          },
        }
      );
    } else {
      // Legacy approach (current behavior)
      return createRouteHandlerClient<Database>({ 
        cookies: () => cookieStore 
      });
    }
  } catch (error) {
    console.error('Failed to create API client:', error);
    throw new Error('Database connection failed');
  }
}

// Client component client (unchanged for now)
export function createClientSupabaseClient() {
  validateEnvironment();
  
  return createClientComponentClient<Database>();
}

// Authentication helper with error handling
export async function getAuthenticatedUser() {
  try {
    const supabase = await createApiSupabaseClient();
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session error:', error);
      throw new Error('Authentication failed');
    }
    
    if (!session) {
      throw new Error('Unauthorized');
    }
    
    return { session, supabase };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

// Migration status helper
export function getMigrationStatus() {
  return {
    usingNewSSR: USE_NEW_SSR,
    environment: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }
  };
} 