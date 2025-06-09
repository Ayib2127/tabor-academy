import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string; lessonId: string } }
) {
  try {
    const courseId = params.id;
    const moduleId = params.moduleId;
    const lessonId = params.lessonId;

    // In a real app, you would delete from your database
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}