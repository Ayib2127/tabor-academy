import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ValidationError, ForbiddenError, handleApiError } from '@/lib/utils/error-handling';

export const courseCreationSchema = z.object({
  title: z.string().min(1, 'Course title is required').max(100),
  subtitle: z.string().max(150).optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  language: z.string().max(50).optional(),
  subtitles: z.array(z.string().max(50)).optional(),
  video_hours: z.number().min(0).optional(),
  resources: z.number().min(0).optional(),
  certificate: z.boolean().optional(),
  community: z.boolean().optional(),
  lifetime_access: z.boolean().optional(),
  learning_outcomes: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  success_stories: z.array(z.object({
    name: z.string(),
    photo: z.string().optional(),
    outcome: z.string().optional(),
    story: z.string(),
  })).optional(),
  faq: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
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
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new ForbiddenError('Unauthorized');
  }

  try {
    let validatedData;
    try {
      const body = await req.json();
      validatedData = courseCreationSchema.parse(body);
    } catch (err) {
      throw new ValidationError('Validation failed', err instanceof z.ZodError ? err.errors : undefined);
    }

    // Get user profile to check role
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (userError) {
      throw userError;
    }

    // Determine content_type based on user role
    const isStaffOrAdmin = userProfile?.role === 'admin' || userProfile?.role === 'staff';
    const contentType = isStaffOrAdmin ? 'tabor_original' : 'community';

    // Create the course with proper approval workflow
    const courseData = {
      title: validatedData.title,
      subtitle: validatedData.subtitle,
      description: validatedData.description,
      language: validatedData.language,
      subtitles: validatedData.subtitles,
      video_hours: validatedData.video_hours,
      resources: validatedData.resources,
      certificate: validatedData.certificate,
      community: validatedData.community,
      lifetime_access: validatedData.lifetime_access,
      learning_outcomes: validatedData.learning_outcomes,
      requirements: validatedData.requirements,
      success_stories: validatedData.success_stories,
      faq: validatedData.faq,
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
      status: 'draft',
      content_type: contentType,
      is_published: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single();

    if (courseError) {
      throw courseError;
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
        // Clean up: delete the course if module creation fails
        await supabase.from('courses').delete().eq('id', course.id);
        throw moduleError;
      }

      // Create lessons for this module
      for (const lessonData of moduleData.lessons) {
        let quizId = null;
        if (lessonData.type === 'quiz') {
          // 1. Create the quiz
          const { data: quiz, error: quizError } = await supabase
            .from('quizzes')
            .insert({
              title: lessonData.title,
              // Add other quiz metadata as needed
              passingScore: 70,
              attemptsAllowed: 3,
              shuffleQuestions: false,
              showCorrectAnswers: true,
              showExplanations: true,
              questions: [], // or null/empty
            })
            .select()
            .single();
          if (quizError) {
            // handle error, maybe cleanup
            throw quizError;
          }
          quizId = quiz.id;
        }

        // 2. Insert the lesson, linking quiz_id if present
        const { error: lessonError } = await supabase
          .from('module_lessons')
          .insert({
            module_id: module.id,
            title: lessonData.title,
            type: lessonData.type,
            order: lessonData.order,
            duration: lessonData.duration,
            is_published: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            quiz_id: quizId, // will be null for non-quiz lessons
          });

        if (lessonError) {
          // Clean up: delete the course if lesson creation fails
          await supabase.from('courses').delete().eq('id', course.id);
          throw lessonError;
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
    const apiError = handleApiError(error);
    return NextResponse.json({
      code: apiError.code,
      error: apiError.message,
      details: apiError.details,
    }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
}