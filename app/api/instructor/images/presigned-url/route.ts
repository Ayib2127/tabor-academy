import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

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

    const { fileName, fileType } = await req.json();
    const imageId = uuidv4();
    const filePath = `images/${session.user.id}/${imageId}/${fileName}`;

    // Get presigned URL for upload
    const { data, error } = await supabase.storage
      .from('course-images')
      .createSignedUploadUrl(filePath);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      uploadUrl: data.signedUrl,
      imageId,
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