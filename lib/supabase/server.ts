import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from './types';

// Create a client for server components
export function createClient() {
  const cookieStore = cookies();
  
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
}

// Create a client specifically for route handlers
export function createRouteHandlerClient() {
  const cookieStore = cookies();
  
  return createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
}

// Create a server client for direct use
export function createServerClient() {
  const cookieStore = cookies();
  
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
}