import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { courseCreationSchema } from '@/lib/validations/course';

// --- Enhanced GET endpoint for fetching course details ---
export async function GET(
  req: Request,
  context: Promise<{ params: { id: string } }>
) {
  const { params } = await context;
  const courseId = params.id;

  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Check authentication
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const instructorId = session.user.id;

    // Verify course ownership
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        status,
        is_published,
        created_at,
        updated_at,
        thumbnail_url,
        price,
        rejection_reason,
        reviewed_at,
        reviewed_by,
        instructor_id
      `)
      .eq('id', courseId)
      .eq('instructor_id', instructorId)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    // Get enrollment count
    const { count: students_count } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId);

    // Get average rating
    const { data: averageRating } = await supabase.rpc(
      'get_course_average_rating',
      { p_course_id: courseId }
    );

    // Get completion rate
    const { data: completion_rate } = await supabase.rpc(
      'get_course_average_completion_rate',
      { p_course_id: courseId }
    );

    const courseDetails = {
      ...course,
      students_count: students_count || 0,
      rating: averageRating || 0,
      completion_rate: completion_rate || 0,
    };

    return NextResponse.json(courseDetails);

  } catch (error: any) {
    console.error('Course details API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
    }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  console.log('--- API Call: /api/instructor/courses/[id] PATCH ---');
  console.log('Course ID:', params.id);

  try {
    const supabase = createRouteHandlerClient({ cookies });
    const courseId = params.id;

    // Get session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 401 }
      );
    }

    if (!session) {
      console.log('No active session found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify course ownership
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('instructor_id, status')
      .eq('id', courseId)
      .single();

    if (courseError) {
      console.error('Error fetching course:', courseError);
      return NextResponse.json(
        { error: 'Failed to fetch course' },
        { status: 500 }
      );
    }

    if (!course || course.instructor_id !== session.user.id) {
      console.log('Unauthorized access attempt:', {
        courseId,
        userId: session.user.id,
        courseInstructorId: course?.instructor_id,
      });
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = courseCreationSchema.parse(body);

    // Check if changes require re-approval
    const requiresReapproval = checkIfRequiresReapproval(course, validatedData);

    // Update course
    const { error: updateError } = await supabase
      .from('courses')
      .update({
        ...validatedData,
        status: requiresReapproval ? 'pending_review' : course.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', courseId);

    if (updateError) {
      console.error('Error updating course:', updateError);
      throw updateError;
    }

    // Update modules and lessons
    await updateModulesAndLessons(courseId, validatedData.modules);

    console.log('Course updated successfully:', {
      courseId,
      requiresReapproval,
    });

    return NextResponse.json({
      message: 'Course updated successfully',
      requiresReapproval,
    });
  } catch (error: any) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update course' },
      { status: 500 }
    );
  }
}

function checkIfRequiresReapproval(currentCourse: any, newData: any): boolean {
  // Define what changes require re-approval
  const majorChanges = [
    'title',
    'description',
    'category',
    'level',
    'price',
  ];

  return majorChanges.some((field) => currentCourse[field] !== newData[field]);
}

async function updateModulesAndLessons(courseId: string, modules: any[]) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Delete existing modules and lessons
    const { error: deleteLessonsError } = await supabase
      .from('lessons')
      .delete()
      .eq('module_id', courseId);

    if (deleteLessonsError) {
      console.error('Error deleting lessons:', deleteLessonsError);
      throw deleteLessonsError;
    }

    const { error: deleteModulesError } = await supabase
      .from('modules')
      .delete()
      .eq('course_id', courseId);

    if (deleteModulesError) {
      console.error('Error deleting modules:', deleteModulesError);
      throw deleteModulesError;
    }

    // Insert new modules and lessons
    for (const courseModule of modules) {
      const { data: moduleData, error: moduleError } = await supabase
        .from('modules')
        .insert({
          course_id: courseId,
          title: courseModule.title,
          description: courseModule.description,
          order: courseModule.order,
        })
        .select()
        .single();

      if (moduleError) {
        console.error('Error creating module:', moduleError);
        throw moduleError;
      }

      if (moduleData) {
        const { error: lessonsError } = await supabase
          .from('lessons')
          .insert(
            courseModule.lessons.map((lesson: any) => ({
              module_id: moduleData.id,
              title: lesson.title,
              type: lesson.type,
              duration: lesson.duration,
              order: lesson.order,
            }))
          );

        if (lessonsError) {
          console.error('Error creating lessons:', lessonsError);
          throw lessonsError;
        }
      }
    }
  } catch (error) {
    console.error('Error in updateModulesAndLessons:', error);
    throw error;
  }
}
