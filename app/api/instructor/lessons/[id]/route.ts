import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const bodySchema = z.object({
  content: z.string(),
  type: z.string().optional(),
});

export async function PATCH(req: Request, context: Promise<{ params: { id: string } }>) {
  const { params } = await context;
  const lessonId = params.id;
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parse = bodySchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  // Ensure user owns the lesson via join
  const { error } = await supabase
    .from('module_lessons')
    .update({ content: parse.data.content, type: parse.data.type ?? 'text', updated_at: new Date().toISOString() })
    .eq('id', lessonId)
    .eq('instructor_id', session.user.id); // assumes column exists or RLS enforces

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
