'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// If you have generated types from your Supabase schema, import and pass them:
// import type { Database } from '@/types/database';

// A singleton client for use in Client Components.
export const supabase = createClientComponentClient(); // <Database>()
