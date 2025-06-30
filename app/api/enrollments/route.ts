import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
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
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
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
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { courseId } = await request.json();
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if the user is already enrolled
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('course_id', courseId)
      .maybeSingle();
      
    if (checkError) {
      return NextResponse.json(
        { error: checkError.message },
        { status: 500 }
      );
    }
    
    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'You are already enrolled in this course' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ enrollment: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}