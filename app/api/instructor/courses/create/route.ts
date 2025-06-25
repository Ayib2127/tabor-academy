import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const courseCreationSchema = z.object({
  title: z.string().min(1, 'Course title is required').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional(),
  promoVideoUrl: z.string().url('Invalid promo video URL').optional(),
  deliveryType: z.enum(['self_paced', 'cohort']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  registrationDeadline: z.string().optional(),
  modules: z.array(z.object({
    title: z.string().min(1, 'Module title is required'),
    description: z.string().optional(),
    order: z.number(),
    lessons: z.array(z.object({
      title: z.string().min(1, 'Lesson title is required'),
      type: z.enum(['video', 'text', 'quiz']),
      order: z.number(),
      duration: z.number().optional(),
    })),
  })).min(1, 'At least one module is required'),
});

export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = courseCreationSchema.parse(body);

    // Get user profile to check role
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user profile:', userError);
      return NextResponse.json({ error: 'Failed to verify user permissions' }, { status: 500 });
    }

    // Determine content_type based on user role
    const isStaffOrAdmin = userProfile?.role === 'admin' || userProfile?.role === 'staff';
    const contentType = isStaffOrAdmin ? 'tabor_original' : 'community';

    // Create the course with proper approval workflow
    const courseData = {
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category,
      level: validatedData.level,
      tags: validatedData.tags,
      price: validatedData.price,
      thumbnail_url: validatedData.thumbnailUrl,
      promo_video_url: validatedData.promoVideoUrl,
      delivery_type: validatedData.deliveryType,
      start_date: validatedData.startDate,
      end_date: validatedData.endDate,
      registration_deadline: validatedData.registrationDeadline,
      instructor_id: session.user.id,
      // CRITICAL: Enforce approval workflow
      status: 'draft', // All courses start as draft
      content_type: contentType, // Set based on user role
      is_published: false, // Never published until approved
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single();

    if (courseError) {
      console.error('Error creating course:', courseError);
      return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }

    // Create modules and lessons
    for (const moduleData of validatedData.modules) {
      const { data: module, error: moduleError } = await supabase
        .from('course_modules')
        .insert({
          course_id: course.id,
          title: moduleData.title,
          description: moduleData.description,
          order: moduleData.order,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (moduleError) {
        console.error('Error creating module:', moduleError);
        // Clean up: delete the course if module creation fails
        await supabase.from('courses').delete().eq('id', course.id);
        return NextResponse.json({ error: 'Failed to create course modules' }, { status: 500 });
      }

      // Create lessons for this module
      for (const lessonData of moduleData.lessons) {
        const { error: lessonError } = await supabase
          .from('module_lessons')
          .insert({
            module_id: module.id,
            title: lessonData.title,
            type: lessonData.type,
            order: lessonData.order,
            duration: lessonData.duration,
            is_published: false, // Lessons start unpublished
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (lessonError) {
          console.error('Error creating lesson:', lessonError);
          // Clean up: delete the course if lesson creation fails
          await supabase.from('courses').delete().eq('id', course.id);
          return NextResponse.json({ error: 'Failed to create course lessons' }, { status: 500 });
        }
      }
    }

    // Return success response with workflow information
    return NextResponse.json({
      success: true,
      course: {
        id: course.id,
        title: course.title,
        status: course.status,
        content_type: course.content_type,
        is_published: course.is_published,
      },
      message: isStaffOrAdmin 
        ? 'Course created successfully as Tabor Original content. You can submit it for review when ready.'
        : 'Course created successfully as Community content. You can submit it for review when ready.',
      workflow: {
        currentStatus: 'draft',
        nextStep: 'Add content to your modules and lessons, then submit for review',
        canPublish: false,
        requiresApproval: true,
        contentType: contentType,
      }
    });

  } catch (error: any) {
    console.error('Course creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
    }, { status: 500 });
  }
}