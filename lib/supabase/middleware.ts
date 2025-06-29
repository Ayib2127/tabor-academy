import { createSupabaseServerClient } from './standardized-client';

export async function updateSession(request: Request) {
  const supabase = await createSupabaseServerClient();
  // Refresh the session by calling getUser
  await supabase.auth.getUser();
} 