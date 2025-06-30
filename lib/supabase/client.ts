'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/supabase/types';

// A singleton client for use in Client Components.
export const supabase = createClientComponentClient<Database>();
