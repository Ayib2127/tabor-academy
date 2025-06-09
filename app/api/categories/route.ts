import { NextRequest, NextResponse } from 'next/server';

// Mock categories data
const categories = [
  { id: '1', name: 'Development' },
  { id: '2', name: 'Design' },
  { id: '3', name: 'Marketing' },
  { id: '4', name: 'Business' },
  { id: '5', name: 'Data Science' },
  { id: '6', name: 'Photography' },
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}