import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface LessonData {
  id: number; // Client-side ID, will be ignored by DB insert but useful for mapping
  title: string;
}

interface ModuleData {
  id: number; // Client-side ID, will be ignored by DB insert but useful for mapping
  title: string;
  lessons: LessonData[];
}

interface CourseCreationData {
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  tags: string[];
  price: number;
  thumbnailUrl: string;
  promoVideoUrl: string;
  modules: ModuleData[];
}

export async function POST(request: Request) {
  console.log('--- API Call: /api/instructor/courses/create ---');
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error getting user session:', userError);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    if (!user) {
      console.log('Authentication failed: No user found for course creation API.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courseData: CourseCreationData = await request.json();
    console.log('Received course data:', courseData.title);

    // Fetch the category ID
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', courseData.category)
      .single();

    if (categoryError || !categoryData) {
      console.error('Error fetching category ID or category not found:', categoryError?.message || 'Category not found');
      return NextResponse.json({ error: 'Invalid category selected.' }, { status: 400 });
    }

    // 1. Insert into courses table
    const { data: newCourse, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: courseData.title,
        description: courseData.description,
        level: courseData.level,
        price: courseData.price,
        thumbnail_url: courseData.thumbnailUrl,
        promo_video_url: courseData.promoVideoUrl,
        instructor_id: user.id, // Link to the current instructor
        is_published: false, // Default to draft
        tags: courseData.tags, // Assuming tags column is of type JSONB or text[]
      })
      .select()
      .single();

    if (courseError) {
      console.error('Error inserting course:', courseError);
      return NextResponse.json({ error: courseError.message }, { status: 500 });
    }

    // 2. Insert into course_categories table
    const { error: courseCategoryError } = await supabase
      .from('course_categories')
      .insert({
        course_id: newCourse.id,
        category_id: categoryData.id,
      });

    if (courseCategoryError) {
      console.error('Error inserting course category:', courseCategoryError);
      return NextResponse.json({ error: courseCategoryError.message }, { status: 500 });
    }

    // 2. Insert modules and lessons
    for (const moduleData of courseData.modules) {
      const { data: newModule, error: moduleError } = await supabase
        .from('course_modules')
        .insert({
          course_id: newCourse.id,
          title: moduleData.title,
        })
        .select()
        .single();

      if (moduleError) {
        console.error('Error inserting module:', moduleError);
        return NextResponse.json({ error: moduleError.message }, { status: 500 });
      }

      for (const lessonData of moduleData.lessons) {
        const { error: lessonError } = await supabase
          .from('module_lessons')
          .insert({
            module_id: newModule.id,
            title: lessonData.title,
            is_published: false, // Lessons also default to draft
          });

        if (lessonError) {
          console.error('Error inserting lesson:', lessonError);
          return NextResponse.json({ error: lessonError.message }, { status: 500 });
        }
      }
    }

    console.log('Course and content saved successfully!');
    return NextResponse.json({ message: 'Course created successfully', courseId: newCourse.id }, { status: 201 });

  } catch (err: any) {
    console.error('Unexpected error in course creation API:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
} 