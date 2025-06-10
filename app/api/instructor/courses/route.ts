import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface CourseData {
  id: string;
  title: string;
  is_published: boolean;
  created_at: string;
  thumbnail_url?: string;
  price?: number;
  enrollments?: { count: number }[];
}

export async function GET(request: Request) {
    console.log('--- API Call: /api/instructor/courses ---');
    console.log('Request URL:', request.url);

    console.log('Incoming cookies (courses API):', cookies().getAll());
    const supabase = createRouteHandlerClient({ cookies });

    try {
        // Get the current user from the session
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error('Error getting user session:', userError);
            return NextResponse.json({ error: userError.message }, { status: 500 });
        }

        if (!user) {
            console.log('Authentication failed: No user found for instructor courses API.');
            return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
        }

        // Fetch courses from the database
        const { data: coursesData, error: coursesError } = await supabase
            .from('courses')
            .select('id, title, is_published, created_at, thumbnail_url, price, enrollments(count)')
            .eq('instructor_id', user.id);

        if (coursesError) {
            console.error('Error fetching instructor courses:', coursesError);
            return NextResponse.json({ error: coursesError.message }, { status: 500 });
        }

        let totalStudents = 0;
        let totalRevenue = 0;
        let totalCompletionRate = 0;
        let coursesWithCompletion = 0;

        const processedCourses = await Promise.all(coursesData?.map(async (course: CourseData) => {
            const studentCount = course.enrollments ? course.enrollments[0]?.count || 0 : 0;
            const revenue = (course.price || 0) * studentCount;

            // Fetch completion rate for the current user and course
            const { data: completionRate, error: completionError } = await supabase.rpc('get_course_completion_rate', {
                p_course_id: course.id,
                p_user_id: user.id // Assuming the instructor is also a user whose completion rate we want to see for their own courses
            });

            if (completionError) {
                console.error(`Error fetching completion rate for course ${course.id}:`, completionError.message);
                // Optionally handle error, maybe set completionRate to 0 or null
            }

            const currentCourseCompletionRate = completionRate || 0;

            totalStudents += studentCount;
            totalRevenue += revenue;
            // Only add to totalCompletionRate if it's a valid number
            if (typeof currentCourseCompletionRate === 'number' && !isNaN(currentCourseCompletionRate)) {
                totalCompletionRate += currentCourseCompletionRate;
                coursesWithCompletion++;
            }

            return {
                id: course.id,
                title: course.title,
                is_published: course.is_published,
                created_at: course.created_at,
                thumbnail_url: course.thumbnail_url,
                price: course.price,
                students: studentCount,
                completionRate: currentCourseCompletionRate // Add the completion rate here
            };
        }) || []);

        const averageCompletionRate = coursesWithCompletion > 0
            ? totalCompletionRate / coursesWithCompletion
            : 0;

        console.log('API Response: Courses fetched successfully.');

        return NextResponse.json({
            courses: processedCourses,
            summaryStats: {
                totalStudents,
                totalRevenue,
                averageCompletionRate,
            },
        });
    } catch (err: any) {
        console.error('Unexpected error fetching instructor courses:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}