import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { videoId } = await req.json();

    // Get the video file path
    const { data: videoData, error: videoError } = await supabase
      .from('videos')
      .select('file_path')
      .eq('id', videoId)
      .single();

    if (videoError || !videoData) {
      throw new Error('Video not found');
    }

    // Generate video URL
    const { data: urlData } = await supabase.storage
      .from('course-videos')
      .createSignedUrl(videoData.file_path, 31536000); // 1 year expiry

    if (!urlData?.signedUrl) {
      throw new Error('Failed to generate video URL');
    }

    // Update video status
    await supabase
      .from('videos')
      .update({
        status: 'processed',
        url: urlData.signedUrl,
      })
      .eq('id', videoId);

    return NextResponse.json({
      videoUrl: urlData.signedUrl,
    });
  } catch (error: any) {
    console.error('Error processing video:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process video' },
      { status: 500 }
    );
  }
} 