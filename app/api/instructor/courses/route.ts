import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    console.log('--- API Call: /api/instructor/courses ---');
    console.log('Request URL:', request.url);

    console.log('Incoming cookies (courses API):', cookies().getAll());
    const supabase = createRouteHandlerClient({ cookies });

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
        console.error('Error getting user session:', userError);
        return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    if (!user) {
        console.log('Authentication failed: No user found for instructor courses API.');
        return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
    }

    try {
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

        const processedCourses = await Promise.all(
            coursesData?.map(async (course) => {
                const studentCount = course.enrollments ? course.enrollments[0]?.count || 0 : 0;
                const revenue = (course.price || 0) * studentCount;

                totalStudents += studentCount;
                totalRevenue += revenue;

                const { data: completionRateData, error: completionRateError } = await supabase.rpc('get_course_completion_rate', {
                    p_course_id: course.id,
                    p_user_id: user.id
                });

                let completionRate = 0;
                if (completionRateError) {
                    console.error('Error fetching completion rate:', completionRateError);
                } else {
                    completionRate = completionRateData || 0;
                    if (completionRate > 0) {
                        totalCompletionRate += completionRate;
                        coursesWithCompletion++;
                    }
                }

                return {
                    id: course.id,
                    title: course.title,
                    is_published: course.is_published,
                    created_at: course.created_at,
                    thumbnail_url: course.thumbnail_url,
                    price: course.price,
                    students: studentCount,
                    completionRate: completionRate
                };
            }) || []
        );

        const averageCompletionRate = coursesWithCompletion > 0 ? totalCompletionRate / coursesWithCompletion : 0;

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