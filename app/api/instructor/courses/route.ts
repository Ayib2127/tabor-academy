import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = createRouteHandlerClient({ cookies });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

        const processedCourses = coursesData?.map(course => {
            const studentCount = course.enrollments ? course.enrollments[0]?.count || 0 : 0;
            const revenue = (course.price || 0) * studentCount;

            totalStudents += studentCount;
            totalRevenue += revenue;

            return {
                id: course.id,
                title: course.title,
                is_published: course.is_published,
                created_at: course.created_at,
                thumbnail_url: course.thumbnail_url,
                price: course.price,
                students: studentCount,
            };
        }) || [];

        return NextResponse.json({
            courses: processedCourses,
            summaryStats: {
                totalStudents,
                totalRevenue,
            },
        });
    } catch (err: any) {
        console.error('Unexpected error fetching instructor courses:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
} 