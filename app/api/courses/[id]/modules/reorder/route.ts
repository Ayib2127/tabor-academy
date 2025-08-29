import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    const { moduleIds } = await request.json();

    if (!Array.isArray(moduleIds)) {
      return NextResponse.json({ error: 'Module IDs must be an array' }, { status: 400 });
    }

    // In a real app, you would update the order in your database
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering modules:', error);
    return NextResponse.json({ error: 'Failed to reorder modules' }, { status: 500 });
  }
}