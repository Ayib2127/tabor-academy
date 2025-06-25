import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the enrollment
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
          users!courses_instructor_id_fkey (id, full_name, avatar_url),
          lessons (id, title, description, duration, position, video_url, is_published)
        )
      `)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Enrollment not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    // Get progress for each lesson
    const { data: progressData, error: progressError } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', session.user.id)
      .in('lesson_id', data.courses.lessons.map(lesson => lesson.id));
      
    if (progressError) {
      console.error('Error fetching progress:', progressError);
    }
    
    // Add progress to each lesson
    const lessonsWithProgress = data.courses.lessons
      .map(lesson => {
        const lessonProgress = progressData?.find(p => p.lesson_id === lesson.id);
        return {
          ...lesson,
          completed: lessonProgress?.completed || false,
          last_position: lessonProgress?.last_position || 0
        };
      })
      .sort((a, b) => a.position - b.position);
    
    // Calculate overall progress
    const completedLessons = lessonsWithProgress.filter(l => l.completed).length;
    const totalLessons = lessonsWithProgress.length;
    const progressPercentage = totalLessons ? (completedLessons / totalLessons) * 100 : 0;
    
    const formattedEnrollment = {
      ...data,
      courses: {
        ...data.courses,
        lessons: lessonsWithProgress
      },
      progress: progressPercentage,
      completed_lessons: completedLessons,
      total_lessons: totalLessons
    };
    
    return NextResponse.json({ enrollment: formattedEnrollment });
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if the enrollment belongs to the user
    const { data: enrollmentData, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('user_id')
      .eq('id', id)
      .single();
      
    if (enrollmentError || enrollmentData.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to unenroll from this course' },
        { status: 403 }
      );
    }
    
    // Delete the enrollment
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('id', id);
      
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}