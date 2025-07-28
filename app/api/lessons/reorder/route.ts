import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { NextResponse } from 'next/server';
import { handleApiError, ForbiddenError, ValidationError } from '@/lib/utils/error-handling';

export async function PATCH(request: Request) {
  try {
    const supabase = await createApiSupabaseClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new ForbiddenError('Unauthorized');
    }

    const { lessons } = await request.json(); // Expects an array of { id: string, position: number }

    if (!Array.isArray(lessons) || lessons.length === 0) {
      throw new ValidationError('Invalid input: lessons array is required');
    }

    // Verify ownership of all lessons to prevent unauthorized updates
    const lessonIds = lessons.map((l: { id: string }) => l.id);
    const { data: ownedLessons, error: ownershipError } = await supabase
      .from('lessons')
      .select('id, course_id')
      .in('id', lessonIds);

    if (ownershipError) {
      console.error('Error verifying lesson ownership:', ownershipError);
      throw ownershipError;
    }

    if (ownedLessons.length !== lessons.length) {
      throw new ForbiddenError('Unauthorized: Some lessons do not exist or you do not own them');
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
      throw new ForbiddenError('Unauthorized: You do not own all associated courses');
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
      throw updateError;
    }

    return NextResponse.json({ message: 'Lesson positions updated successfully' });
  } catch (err: any) {
    console.error('Unexpected error reordering lessons:', err);
    const apiError = handleApiError(err);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'FORBIDDEN' ? 403 : apiError.code === 'VALIDATION_ERROR' ? 400 : 500 });
  }
} 