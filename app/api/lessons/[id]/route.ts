import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { AuthError, ForbiddenError, createErrorResponse } from '@/lib/utils/error-handling';
import { withAuth } from '@/lib/middleware/security';

// Helper function to verify instructor ownership of a lesson
async function verifyLessonOwnership(supabase: any, lessonId: string, userId: string): Promise<boolean> {
    const { data: lessonData, error } = await supabase
        .from('lessons')
        .select('courses ( instructor_id )')
        .eq('id', lessonId)
        .single();

    if (error || !lessonData) {
        return false;
    }

    return lessonData.courses.instructor_id === userId;
}

// --- PUT: Update a specific lesson ---
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (req, user, supabase) => {
    const { id: lessonId } = params;
    // Security Check: Verify the user owns the lesson before allowing an update
    const isOwner = await verifyLessonOwnership(supabase, lessonId, user.id);
    if (!isOwner) {
      return NextResponse.json({ error: 'You do not have permission to edit this lesson.' }, { status: 403 });
    }
    // Get the updated lesson data from the request body
    const { title, content, video_url, duration, is_published } = await request.json();
    // Update the lesson in the database
    const { data: updatedLesson, error: updateError } = await supabase
      .from('lessons')
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
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json(updatedLesson);
  });
}

// --- DELETE: Delete a specific lesson ---
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (req, user, supabase) => {
    const { id: lessonId } = params;
    // Security Check: Verify the user owns the lesson before allowing deletion
    const isOwner = await verifyLessonOwnership(supabase, lessonId, user.id);
    if (!isOwner) {
      return NextResponse.json({ error: 'You do not have permission to delete this lesson.' }, { status: 403 });
    }
    // Delete the lesson
    const { error: deleteError } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Lesson deleted successfully' });
  });
} 