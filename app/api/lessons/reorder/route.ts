import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { lessons } = await request.json(); // Expects an array of { id: string, position: number }

    if (!Array.isArray(lessons) || lessons.length === 0) {
      return NextResponse.json({ error: 'Invalid input: lessons array is required' }, { status: 400 });
    }

    // Verify ownership of all lessons to prevent unauthorized updates
    const lessonIds = lessons.map((l: { id: string }) => l.id);
    const { data: ownedLessons, error: ownershipError } = await supabase
      .from('lessons')
      .select('id, course_id')
      .in('id', lessonIds);

    if (ownershipError) {
      console.error('Error verifying lesson ownership:', ownershipError);
      return NextResponse.json({ error: ownershipError.message }, { status: 500 });
    }

    if (ownedLessons.length !== lessons.length) {
      return NextResponse.json({ error: 'Unauthorized: Some lessons do not exist or you do not own them' }, { status: 403 });
    }

    // Get the course IDs associated with these lessons to verify instructor ownership of courses
    const courseIds = [...new Set(ownedLessons.map(ol => ol.course_id))];
    const { data: ownedCourses, error: coursesOwnershipError } = await supabase
      .from('courses')
      .select('id')
      .in('id', courseIds)
      .eq('instructor_id', user.id);

    if (coursesOwnershipError || ownedCourses.length !== courseIds.length) {
      console.error('Error verifying course ownership:', coursesOwnershipError);
      return NextResponse.json({ error: 'Unauthorized: You do not own all associated courses' }, { status: 403 });
    }

    // Perform batch updates for lesson positions
    const updates = lessons.map((lesson: { id: string, position: number }) => ({
      id: lesson.id,
      position: lesson.position,
    }));

    const { error: updateError } = await supabase
      .from('lessons')
      .upsert(updates, { onConflict: 'id' }); // Use upsert to update based on id

    if (updateError) {
      console.error('Error updating lesson positions:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Lesson positions updated successfully' });
  } catch (err: any) {
    console.error('Unexpected error reordering lessons:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
} 