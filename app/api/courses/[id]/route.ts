import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Get the course with related data
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        users!courses_instructor_id_fkey (id, full_name, avatar_url),
        lessons (id, title, description, duration, position, is_published),
        course_categories (
          categories (id, name)
        ),
        course_tags (
          tags (id, name)
        ),
        reviews (
          id, 
          rating, 
          comment, 
          created_at,
          users (id, full_name, avatar_url)
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    // Calculate average rating
    let avgRating = 0;
    if (data.reviews && data.reviews.length > 0) {
      const sum = data.reviews.reduce((acc, review) => acc + review.rating, 0);
      avgRating = sum / data.reviews.length;
    }
    
    // Format the response
    const formattedCourse = {
      ...data,
      average_rating: avgRating,
      reviews_count: data.reviews?.length || 0,
      categories: data.course_categories?.map(cc => cc.categories) || [],
      tags: data.course_tags?.map(ct => ct.tags) || [],
      lessons: data.lessons?.sort((a, b) => a.position - b.position) || []
    };
    
    return NextResponse.json({ course: formattedCourse });
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { title, description, level, price, thumbnailUrl, isPublished } = await request.json();
    
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if the user is the instructor of this course
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', id)
      .single();
      
    if (courseError || courseData.instructor_id !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to update this course' },
        { status: 403 }
      );
    }
    
    // Update the course
    const { data, error } = await supabase
      .from('courses')
      .update({
        title,
        description,
        level,
        price: price || 0,
        thumbnail_url: thumbnailUrl,
        is_published: isPublished,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ course: data });
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
    
    // Check if the user is the instructor of this course
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', id)
      .single();
      
    if (courseError || courseData.instructor_id !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this course' },
        { status: 403 }
      );
    }
    
    // Delete the course
    const { error } = await supabase
      .from('courses')
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