import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const supabase = await createApiSupabaseClient();
    
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

    const { fileName, fileType } = await req.json();
    const videoId = uuidv4();
    const filePath = `videos/${session.user.id}/${videoId}/${fileName}`;

    // Get presigned URL for upload
    const { data, error } = await supabase.storage
      .from('course-videos')
      .createSignedUploadUrl(filePath);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      uploadUrl: data.signedUrl,
      videoId,
      filePath,
    });
  } catch (error: any) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
} 