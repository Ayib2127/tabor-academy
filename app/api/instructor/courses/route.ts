import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs'; // Ensure Sentry is imported

export async function GET() {
    try {
        // --- Placeholder for fetching instructor-specific courses from database ---
        // In a real application, you would fetch courses associated with the logged-in instructor.
        // For demonstration, we'll return some simulated data.
        const instructorCourses = [
            { id: 'instr-course-001', title: 'Advanced React Patterns', is_published: true, created_at: '2023-01-15T10:00:00Z' },
            { id: 'instr-course-002', title: 'Node.js Backend Development (Draft)', is_published: false, created_at: '2023-03-20T14:30:00Z' },
            { id: 'instr-course-003', title: 'Fullstack with Next.js', is_published: true, created_at: '2023-05-01T09:15:00Z' },
        ];
        // --- End of placeholder ---

        return NextResponse.json(instructorCourses, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching instructor courses:', error);
        Sentry.captureException(error); // Capture error with Sentry
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
} 