import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse<any>> {
  try {
    const { event, properties } = await request.json();

    if (!event) {
      return NextResponse.json({ 
        error: 'Event name is required' 
      }, { status: 400 });
    }

    // Log the event (in production, you'd send this to your analytics service)
    console.log('Analytics Event:', {
      event,
      properties,
      timestamp: new Date().toISOString()
    });

    // Here you would integrate with your analytics service:
    // - Google Analytics 4
    // - Mixpanel
    // - Amplitude
    // - PostHog
    // etc.

    // Example Google Analytics 4 integration:
    /*
    if (process.env.GA_MEASUREMENT_ID) {
      await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
        method: 'POST',
        body: JSON.stringify({
          client_id: properties.user_id || 'anonymous',
          events: [{
            name: event,
            parameters: properties
          }]
        })
      });
    }
    */

    // Example Mixpanel integration:
    /*
    if (process.env.MIXPANEL_TOKEN) {
      await fetch('https://api.mixpanel.com/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event,
          properties: {
            ...properties,
            token: process.env.MIXPANEL_TOKEN,
            time: Date.now()
          }
        })
      });
    }
    */

    return NextResponse.json({ 
      success: true,
      message: 'Event tracked successfully' 
    });

  } catch (error: any) {
    console.error('Analytics tracking error:', error);
    Sentry.captureException(error);
    return NextResponse.json({ 
      error: 'Failed to track event' 
    }, { status: 500 });
  }
}