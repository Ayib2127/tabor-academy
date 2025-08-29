import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const { id: courseId, moduleId } = await params;
    const { lessonIds } = await request.json();

    if (!Array.isArray(lessonIds)) {
      return NextResponse.json({ error: 'Lesson IDs must be an array' }, { status: 400 });
    }

    // In a real app, you would update the order in your database
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering lessons:', error);
    return NextResponse.json({ error: 'Failed to reorder lessons' }, { status: 500 });
  }
}