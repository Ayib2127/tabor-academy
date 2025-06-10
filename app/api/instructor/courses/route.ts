import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    console.log('--- API Call: /api/instructor/courses ---');
    console.log('Request URL:', request.url);

    // Explicitly inspect cookies before creating the client
    const allCookies = cookies().getAll();
    console.log('SERVER-SIDE: All Request Cookies (Courses):', JSON.stringify(allCookies, null, 2));

    const supabase = createRouteHandlerClient();
    console.log('SERVER-SIDE: Supabase Route Handler Client initialized (Courses).');

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error('SERVER-SIDE: Supabase getUser Error (Courses):', userError.message, userError);
            return NextResponse.json({ error: userError.message || 'Supabase user error' }, { status: 500 });
        }

        if (!user) {
            console.warn('SERVER-SIDE: Authentication failed (Courses): No user object found from session.');
            return NextResponse.json({ error: 'Auth session missing!' }, { status: 401 });
        }

        console.log('SERVER-SIDE: User found in Courses API:', user.id, user.email);

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

        console.log('SERVER-SIDE: API Response: Courses fetched successfully.');
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