import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { AuthError, ForbiddenError, ValidationError, NotFoundError, handleApiError } from '@/lib/utils/error-handling';

// Helper function to verify instructor ownership of a lesson
async function verifyLessonOwnership(supabase: any, lessonId: string, userId: string): Promise<boolean> {
    const { data: lessonData, error } = await supabase
        .from('module_lessons')
        .select('courses ( instructor_id )')
        .eq('id', lessonId)
        .single();

    if (error || !lessonData) {
        return false;
    }

    return lessonData.courses.instructor_id === userId;
}

// --- PUT: Update a specific lesson ---
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServerClient();
  const { id: lessonId } = await params;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new AuthError();
    }

    // Security Check: Verify the user owns the lesson before allowing an update
    const isOwner = await verifyLessonOwnership(supabase, lessonId, session.user.id);
    if (!isOwner) {
        throw new ForbiddenError('You do not have permission to edit this lesson.');
    }

    // Get the updated lesson data from the request body
    const { title, content, video_url, duration, is_published } = await request.json();
    if (!title) {
      throw new ValidationError('Lesson title is required');
    }
    // Update the lesson in the database
    const { data: updatedLesson, error: updateError } = await supabase
      .from('module_lessons')
      .update({
        title,
        content,
        video_url,
        duration,
        is_published,
        updated_at: new Date().toISOString()
      })
      .eq('id', lessonId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(updatedLesson);

  } catch (error) {
    const apiError = await handleApiError(error, 'PUT /api/lessons/[id]');
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'NOT_FOUND' ? 404 : apiError.code === 'FORBIDDEN' ? 403 : apiError.code === 'VALIDATION_ERROR' ? 400 : 500 });
  }
}

// --- DELETE: Delete a specific lesson ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createSupabaseServerClient();
    const { id: lessonId } = await params;

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            throw new AuthError();
        }

        // Security Check: Verify the user owns the lesson before allowing deletion
        const isOwner = await verifyLessonOwnership(supabase, lessonId, session.user.id);
        if (!isOwner) {
            throw new ForbiddenError('You do not have permission to delete this lesson.');
        }

        // Delete the lesson
        const { error: deleteError } = await supabase
            .from('module_lessons')
            .delete()
            .eq('id', lessonId);

        if (deleteError) {
            throw deleteError;
        }

        return NextResponse.json({ message: 'Lesson deleted successfully' });

    } catch (error) {
        const apiError = await handleApiError(error, 'DELETE /api/lessons/[id]');
        return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'NOT_FOUND' ? 404 : apiError.code === 'FORBIDDEN' ? 403 : apiError.code === 'VALIDATION_ERROR' ? 400 : 500 });
    }
} 