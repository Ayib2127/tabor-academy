import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { courseCreationSchema } from '@/lib/validations/course';

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = courseCreationSchema.parse(body);

    // Start a transaction
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        level: validatedData.level,
        tags: validatedData.tags,
        price: validatedData.price,
        thumbnail_url: validatedData.thumbnailUrl,
        promo_video_url: validatedData.promoVideoUrl,
        instructor_id: session.user.id,
        status: 'pending_review',
      })
      .select()
      .single();

    if (courseError) {
      throw courseError;
    }

    // Insert modules
    const modulePromises = validatedData.modules.map(async (module, index) => {
      const { data: moduleData, error: moduleError } = await supabase
        .from('modules')
        .insert({
          course_id: course.id,
          title: module.title,
          description: module.description,
          order: index,
        })
        .select()
        .single();

      if (moduleError) {
        throw moduleError;
      }

      // Insert lessons
      const lessonPromises = module.lessons.map(async (lesson, lessonIndex) => {
        const { error: lessonError } = await supabase
          .from('lessons')
          .insert({
            module_id: moduleData.id,
            title: lesson.title,
            type: lesson.type,
            duration: lesson.duration,
            order: lessonIndex,
          });

        if (lessonError) {
          throw lessonError;
        }
      });

      await Promise.all(lessonPromises);
      return moduleData;
    });

    await Promise.all(modulePromises);

    return NextResponse.json({
      courseId: course.id,
      message: 'Course created successfully',
    });
  } catch (error: any) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create course' },
      { status: 500 }
    );
  }
} 