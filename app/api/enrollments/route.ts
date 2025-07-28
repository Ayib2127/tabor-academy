import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { handleApiError, ForbiddenError, ValidationError } from '@/lib/utils/error-handling';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createApiSupabaseClient();
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new ForbiddenError('Unauthorized');
    }
    
    // Check for courseId query param
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    if (courseId) {
      try {
        // Get all published, valid lessons for the course
        const { data: modules, error: modulesError } = await supabase
          .from('course_modules')
          .select('id')
          .eq('course_id', courseId);
        if (modulesError) throw modulesError;
        const moduleIds = (modules || []).map(m => m.id);
        let { data: lessons, error: lessonsError } = await supabase
          .from('module_lessons')
          .select('id, type, content, is_published')
          .in('module_id', moduleIds);
        if (lessonsError) throw lessonsError;
        // Only count published lessons with valid content
        lessons = (lessons || []).filter(lesson => {
          if (!lesson.is_published) return false;
          switch (lesson.type) {
            case 'video':
              return lesson.content && JSON.parse(lesson.content)?.src;
            case 'text':
              return lesson.content && lesson.content.length > 0;
            case 'quiz':
              try {
                const quizContent = typeof lesson.content === 'string' ? JSON.parse(lesson.content) : lesson.content;
                return quizContent && Array.isArray(quizContent.questions) && quizContent.questions.length > 0;
              } catch { return false; }
            case 'assignment':
              return lesson.content && lesson.content.length > 0;
            default:
              return false;
          }
        });
        const lessonIds = lessons.map(l => l.id);
        // Get completed lessons for the user
        const { data: progressRows, error: progressError } = await supabase
          .from('progress')
          .select('lesson_id, completed')
          .eq('user_id', session.user.id)
          .in('lesson_id', lessonIds);
        if (progressError) throw progressError;
        const completedLessons = (progressRows || []).filter(p => p.completed).length;
        // Get enrollment as before
        const { data: enrollment, error } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('course_id', courseId)
          .maybeSingle();
        if (error) {
          console.error('Supabase error in enrollments GET:', error);
          throw handleApiError(error);
        }
        return NextResponse.json({
          enrollment,
          completedLessons,
          totalValidLessons: lessons.length
        });
      } catch (err) {
        console.error('Unexpected error in enrollments GET:', err);
        const apiError = handleApiError(err);
        return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'FORBIDDEN' ? 403 : apiError.code === 'VALIDATION_ERROR' ? 400 : 500 });
      }
    }
    
    // Get the user's enrollments
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (
          id, 
          title, 
          description, 
          thumbnail_url, 
          level,
          duration,
          users!courses_instructor_id_fkey (id, full_name)
        )
      `)
      .eq('user_id', session.user.id);
      
    if (error) {
      throw handleApiError(error);
    }
    
    // Get progress for each enrollment
    const enrollmentsWithProgress = await Promise.all(
      data.map(async (enrollment) => {
        const { data: progressData, error: progressError } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('lesson_id', supabase.from('lessons').select('id').eq('course_id', enrollment.course_id));
          
        if (progressError) {
          console.error('Error fetching progress:', progressError);
          return enrollment;
        }
        
        // Calculate progress percentage
        const totalLessons = await supabase
          .from('lessons')
          .select('id', { count: 'exact', head: true })
          .eq('course_id', enrollment.course_id)
          .eq('is_published', true);
          
        const completedLessons = progressData.filter(p => p.completed).length;
        const progressPercentage = totalLessons.count ? (completedLessons / totalLessons.count) * 100 : 0;
        
        return {
          ...enrollment,
          progress: progressPercentage,
          completed_lessons: completedLessons,
          total_lessons: totalLessons.count
        };
      })
    );
    
    return NextResponse.json({ enrollments: enrollmentsWithProgress });
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'FORBIDDEN' ? 403 : apiError.code === 'VALIDATION_ERROR' ? 400 : 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createApiSupabaseClient();
    const { courseId } = await request.json();
    
    if (!courseId) {
      throw new ValidationError('Course ID is required');
    }
    
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new ForbiddenError('Unauthorized');
    }
    
    // Check if the user is already enrolled
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('course_id', courseId)
      .maybeSingle();
      
    if (checkError) {
      throw handleApiError(checkError);
    }
    
    if (existingEnrollment) {
      throw new ValidationError('You are already enrolled in this course');
    }
    
    // Create the enrollment
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: session.user.id,
        course_id: courseId
      })
      .select()
      .single();
      
    if (error) {
      throw handleApiError(error);
    }
    
    return NextResponse.json({ enrollment: data });
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'FORBIDDEN' ? 403 : apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'RESOURCE_CONFLICT' ? 409 : 500 });
  }
}