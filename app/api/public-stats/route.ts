import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In production, these would come from your Supabase database
    // For now, we'll return static values that match your landing page
    const stats = {
      totalStudents: 10000,
      countriesServed: 15,
      successRate: 85,
      businessesLaunched: 2500,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}