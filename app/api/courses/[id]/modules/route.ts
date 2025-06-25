import { NextRequest, NextResponse } from 'next/server';

// Mock modules data
const mockModules = [
  {
    id: 1,
    title: 'Introduction to the Course',
    lessons: [
      { id: 1, title: 'Welcome and Overview' },
      { id: 2, title: 'Course Structure' },
    ],
  },
  {
    id: 2,
    title: 'Getting Started',
    lessons: [
      { id: 3, title: 'Setting up your environment' },
      { id: 4, title: 'Basic concepts' },
    ],
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    
    // In a real app, you would fetch modules from your database
    // For now, return mock data
    return NextResponse.json(mockModules);
  } catch (error) {
    console.error('Error fetching course modules:', error);
    return NextResponse.json({ error: 'Failed to fetch course modules' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    const { title } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Module title is required' }, { status: 400 });
    }

    // In a real app, you would save to your database
    const newModule = {
      id: Date.now(),
      title,
      lessons: [],
    };

    return NextResponse.json(newModule, { status: 201 });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
  }
}