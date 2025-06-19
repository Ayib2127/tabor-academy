import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Only allow these transitions
const statusSchema = z.object({
  status: z.enum(['published', 'rejected']),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });

  // 1. verify admin user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2. validate body
  const body = await req.json();
  const parseResult = statusSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const { status } = parseResult.data;
  const courseId = params.id;

  // 3. update course
  const { error } = await supabase
    .from('courses')
    .update({ status, is_published: status === 'published' })
    .eq('id', courseId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: `Course ${status}` });
}
