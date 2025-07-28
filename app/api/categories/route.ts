import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/utils/error-handling';

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
    const apiError = handleApiError(error);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: 500 });
  }
}