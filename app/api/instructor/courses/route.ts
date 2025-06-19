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
  // Removed enrollments? field as we're fetching count separately
}

export async function GET(request: Request) {
    console.log('--- API Call: /api/instructor/courses ---');
    console.log('Request URL:', request.url);

        // Use Supabase Auth Helpers to read session from cookies
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error('Error getting user session:', userError);
            return NextResponse.json({ error: userError.message }, { status: 500 });
        }

        if (!user) {
            console.log('Authentication failed: No user found for instructor courses API.');
            return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
        }

        const { data: coursesData, error: coursesError } = await supabase
            .from('courses')
            .select('id, title, is_published, created_at, thumbnail_url, price') // Removed enrollments(count) here
            .eq('instructor_id', user.id);

        if (coursesError) {
            console.error('Error fetching instructor courses:', coursesError);
            return NextResponse.json({ error: coursesError.message }, { status: 500 });
        }

        let totalStudentsDashboard = 0; // Renamed to avoid conflict with course.students
        let totalRevenueDashboard = 0; // Renamed to avoid conflict
        let totalCompletionRateSum = 0; // Sum for overall average
        let coursesCountForAverage = 0;

        const processedCourses = await Promise.all(coursesData?.map(async (course: CourseData) => {
            // Fetch student count for each course explicitly
            const { count: studentCount, error: studentCountError } = await supabase
                .from('enrollments')
                .select('*', { count: 'exact', head: true })
                .eq('course_id', course.id);

            if (studentCountError) {
                console.error(`Error fetching student count for course ${course.id}:`, studentCountError.message);
            }

            const currentStudentCount = studentCount || 0;
            const revenue = (course.price || 0) * currentStudentCount;

            // Fetch average completion rate for the course
            const { data: averageCompletionRateForCourse, error: completionError } = await supabase.rpc('get_course_average_completion_rate', {
                p_course_id: course.id,
            });

            if (completionError) {
                console.error(`Error fetching average completion rate for course ${course.id}:`, completionError.message);
            }

            const currentCourseAverageCompletionRate = averageCompletionRateForCourse || 0;

            totalStudentsDashboard += currentStudentCount;
            totalRevenueDashboard += revenue;

            if (typeof currentCourseAverageCompletionRate === 'number' && !isNaN(currentCourseAverageCompletionRate)) {
                totalCompletionRateSum += currentCourseAverageCompletionRate;
                coursesCountForAverage++;
            }

            return {
                id: course.id,
                title: course.title,
                is_published: course.is_published,
                created_at: course.created_at,
                thumbnail_url: course.thumbnail_url,
                price: course.price,
                students: currentStudentCount, // Use the fetched student count
                completionRate: parseFloat(currentCourseAverageCompletionRate.toFixed(2)) // Format to 2 decimal places
            };
        }) || []);

        const overallAverageCompletionRate = coursesCountForAverage > 0
            ? totalCompletionRateSum / coursesCountForAverage
            : 0;

        console.log('API Response: Courses fetched successfully.');

        return NextResponse.json({
            courses: processedCourses,
            summaryStats: {
                totalStudents: totalStudentsDashboard,
                totalRevenue: totalRevenueDashboard,
                averageCompletionRate: parseFloat(overallAverageCompletionRate.toFixed(2)),
            },
        });
    } catch (err: any) {
        console.error('Unexpected error fetching instructor courses:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}