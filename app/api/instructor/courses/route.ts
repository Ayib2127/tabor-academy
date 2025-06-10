import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { toast } from 'react-hot-toast';

export async function GET(request: Request) {
    console.log('--- API Call: /api/instructor/courses ---');
    console.log('Request URL:', request.url);

    const res = NextResponse.json({});

    const supabase = createRouteHandlerClient({ cookies }, {
        response: res,
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
        console.error('Supabase getUser Error:', userError.message);
        return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    if (!user) {
        console.warn('Authentication failed: No user found for instructor dashboard API.');
        return NextResponse.json({ error: 'Auth session missing!' }, { status: 401 });
    }

    console.log('User found in API:', user.id, user.email);
    console.log('Instructor ID from request:', user.id);

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

        const processedCourses = await Promise.all(coursesData?.map(async course => {
            const studentCount = course.enrollments ? course.enrollments[0]?.count || 0 : 0;
            const revenue = (course.price || 0) * studentCount;

            const { data: completionRate, error: completionError } = await supabase
                .rpc('get_course_completion_rate', {
                    p_course_id: course.id,
                    p_user_id: user.id
                });

            if (completionError) {
                console.error(`Error fetching completion rate for course ${course.id}:`, completionError.message);
            }

            const currentCourseCompletionRate = completionRate || 0;
            totalStudents += studentCount;
            totalRevenue += revenue;
            totalCompletionRate += currentCourseCompletionRate;

            return {
                id: course.id,
                title: course.title,
                is_published: course.is_published,
                created_at: course.created_at,
                thumbnail_url: course.thumbnail_url,
                price: course.price,
                students: studentCount,
                completionRate: currentCourseCompletionRate
            };
        }) || []);

        const averageCompletionRate = processedCourses.length > 0
            ? totalCompletionRate / processedCourses.length
            : 0;

        console.log('API Response: Courses fetched successfully.');

        return NextResponse.json({
            courses: processedCourses,
            summaryStats: {
                totalStudents,
                totalRevenue,
                averageCompletionRate
            },
        });
    } catch (err: any) {
        console.error('Unexpected error fetching instructor courses:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
} 