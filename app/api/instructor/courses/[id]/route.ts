import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies as getCookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { courseCreationSchema } from '@/lib/validations/course';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';

// Helper to always resolve cookies
async function resolveCookies() {
  const maybePromise = getCookies();
  if (typeof (maybePromise as any)?.then === 'function') {
    return await maybePromise;
  }
  return maybePromise;
}

// --- Enhanced GET endpoint for fetching course details ---
export async function GET(
  req: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  // Await params if it's a Promise
  const params = typeof (context.params as any)?.then === 'function' ? await (context.params as Promise<{ id: string }>) : (context.params as { id: string });
  const courseId = params.id;

  try {
    const cookieStore = await resolveCookies();
    // Log all cookies for debugging
    console.log('All cookies:', cookieStore.getAll());
    const sessionCookie = cookieStore.get('sb-fmbakckfxuabratissxg-auth-token');
    console.log('Session cookie:', sessionCookie);

    // Use standardized client for robust SSR/API support
    const supabase = await createApiSupabaseClient(cookieStore);

    // Use getUser for more reliable SSR session handling
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('DEBUG: user:', user, 'userError:', userError);

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const instructorId = user.id;
    console.log("DEBUG: params:", params);
    console.log("DEBUG: courseId:", courseId);
    console.log("DEBUG: instructorId from user:", instructorId);

    // Verify course ownership
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        subtitle,
        description,
        language,
        subtitles,
        video_hours,
        resources,
        certificate,
        community,
        lifetime_access,
        status,
        is_published,
        created_at,
        updated_at,
        thumbnail_url,
        price,
        rejection_reason,
        reviewed_at,
        reviewed_by,
        instructor_id,
        learning_outcomes,
        requirements,
        success_stories,
        faq,
        course_modules (
          id,
          title,
          description,
          order,
          module_lessons (
            id,
            title,
            type,
            content,
            order,
            is_published,
            content_json,
            instructor_id,
            created_at,
            updated_at
          )
        )
      `)
      .eq('id', courseId)
      .eq('instructor_id', instructorId)
      .single();

    console.log("DEBUG: course:", course, "courseError:", courseError);

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

    // Transform course_modules to modules for API response
    const modules = (course.course_modules || []).map((mod) => ({
      ...mod,
      description: mod.description ?? "",
      lessons: (mod.module_lessons || []),
    }));

    const courseDetails = {
      ...course,
      students_count: students_count || 0,
      rating: averageRating || 0,
      completion_rate: completion_rate || 0,
      learningOutcomes: course.learning_outcomes ?? [],
      requirements: course.requirements ?? [],
      successStories: course.success_stories ?? [],
      faq: course.faq ?? [],
      modules,
    };

    console.log("GET course details:", courseDetails);
    return NextResponse.json(courseDetails);

  } catch (error: any) {
    console.error('Course details API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
    }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: { id: string } | Promise<{ id: string }> }) {
  const cookieStore = await resolveCookies();
  // Await params if it's a Promise
  const params = typeof (context.params as any)?.then === 'function' ? await (context.params as Promise<{ id: string }>) : (context.params as { id: string });
  const courseId = params.id;

  try {
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

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
    let body;
    try {
      body = await req.json();
      console.log("PATCH body received:", body);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    let validatedData;
    try {
      validatedData = courseCreationSchema.parse(body);
    } catch (validationError: any) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { error: `Validation failed: ${validationError.message}` },
        { status: 400 }
      );
    }

    // Only update new fields if present in the request
    const updateFields: any = {};
    if ('subtitle' in body) updateFields.subtitle = body.subtitle;
    if ('language' in body) updateFields.language = body.language;
    if ('subtitles' in body) updateFields.subtitles = body.subtitles;
    if ('video_hours' in body) updateFields.video_hours = body.video_hours;
    if ('resources' in body) updateFields.resources = body.resources;
    if ('certificate' in body) updateFields.certificate = body.certificate;
    if ('community' in body) updateFields.community = body.community;
    if ('lifetime_access' in body) updateFields.lifetime_access = body.lifetime_access;
    if ('learning_outcomes' in body) updateFields.learning_outcomes = body.learning_outcomes;
    if ('requirements' in body) updateFields.requirements = body.requirements;
    if ('success_stories' in body) updateFields.success_stories = body.success_stories;
    if ('faq' in body) updateFields.faq = body.faq;
    console.log("PATCH updateFields:", updateFields);

    // Update course
    const { error: updateError } = await supabase
      .from('courses')
      .update({
        ...updateFields,
        updated_at: new Date().toISOString(),
        edited_since_rejection: false, // Assuming no rejection means no edit since rejection
      })
      .eq('id', courseId);

    if (updateError) {
      console.error('Error updating course:', updateError);
      return NextResponse.json(
        { error: `Database error: ${updateError.message}` },
        { status: 500 }
      );
    }

    // Update modules and lessons with better error handling
    try {
      const resolvedCookieStore = await resolveCookies();
      await updateModulesAndLessons(courseId, validatedData.modules, resolvedCookieStore);
    } catch (modErr: any) {
      console.error('Error updating modules/lessons:', modErr);
      return NextResponse.json(
        { error: `Failed to update course structure: ${modErr.message}` },
        { status: 500 }
      );
    }

    console.log('Course updated successfully:', {
      courseId,
      requiresReapproval: false, // No re-approval needed for this update
    });

    return NextResponse.json({
      message: 'Course updated successfully',
      requiresReapproval: false,
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

async function updateModulesAndLessons(courseId: string, modules: any[], cookieStore: any) {
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    // Validate modules array
    if (!Array.isArray(modules)) {
      throw new Error('Modules must be an array');
    }

    // 1. Fetch all existing modules for this course
    const { data: existingModules, error: fetchModulesError } = await supabase
      .from('course_modules')
      .select('id')
      .eq('course_id', courseId);

    if (fetchModulesError) {
      console.error('Error fetching existing modules:', fetchModulesError);
      throw new Error(`Failed to fetch existing modules: ${fetchModulesError.message}`);
    }

    const moduleIds = (existingModules || []).map((m: any) => m.id);

    // 2. Delete all lessons for these modules (if any exist)
    if (moduleIds.length > 0) {
      const { error: deleteLessonsError } = await supabase
        .from('module_lessons')
        .delete()
        .in('module_id', moduleIds);

      if (deleteLessonsError) {
        console.error('Error deleting module lessons:', deleteLessonsError);
        throw new Error(`Failed to delete existing lessons: ${deleteLessonsError.message}`);
      }

      // 3. Delete all modules for this course
      const { error: deleteModulesError } = await supabase
        .from('course_modules')
        .delete()
        .in('id', moduleIds);

      if (deleteModulesError) {
        console.error('Error deleting course modules:', deleteModulesError);
        throw new Error(`Failed to delete existing modules: ${deleteModulesError.message}`);
      }
    }

    // 4. Insert new modules and lessons
    for (const courseModule of modules) {
      // Validate module data
      if (!courseModule.title?.trim()) {
        throw new Error('Module title is required');
      }

      const { data: moduleData, error: moduleError } = await supabase
        .from('course_modules')
        .insert({
          course_id: courseId,
          title: courseModule.title.trim(),
          description: courseModule.description?.trim() || '',
          order: courseModule.order || 0,
        })
        .select()
        .single();

      if (moduleError) {
        console.error('Error creating course module:', moduleError);
        throw new Error(`Failed to create module "${courseModule.title}": ${moduleError.message}`);
      }

      // Insert lessons for this module
      if (moduleData && courseModule.lessons && Array.isArray(courseModule.lessons)) {
        const lessonsToInsert = courseModule.lessons
          .filter((lesson: any) => lesson.title?.trim()) // Only insert lessons with titles
          .map((lesson: any) => ({
            module_id: moduleData.id,
            title: lesson.title.trim(),
            type: lesson.type || 'text',
            duration: lesson.duration || 0,
            order: lesson.order || 0,
            content: lesson.content || '',
            is_published: lesson.is_published || false,
          }));

        if (lessonsToInsert.length > 0) {
          const { error: lessonsError } = await supabase
            .from('module_lessons')
            .insert(lessonsToInsert);

          if (lessonsError) {
            console.error('Error creating module lessons:', lessonsError);
            throw new Error(`Failed to create lessons for module "${courseModule.title}": ${lessonsError.message}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in updateModulesAndLessons:', error);
    throw error;
  }
}
