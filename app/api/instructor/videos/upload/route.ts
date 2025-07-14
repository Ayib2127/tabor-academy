import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { uploadToCloudinary } from '@/lib/utils/cloudinary-upload';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse<any>> {
  const supabase = await createApiSupabaseClient();

  // Authenticate user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  // Parse form data
  const formData = await request.formData();
  const file = formData.get('video') as File;
  if (!file) {
    return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
  }

  // Validate file type and size (max 500MB)
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported video format' }, { status: 400 });
  }
  if (file.size > 500 * 1024 * 1024) {
    return NextResponse.json({ error: 'File size exceeds 500MB' }, { status: 400 });
  }

  // Prepare Cloudinary upload
  const videoId = uuidv4();
  const fileExtension = file.name.split('.').pop();
  const fileName = `${videoId}-${file.name}`;
  const folder = `tabor_academy/videos/${userId}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await uploadToCloudinary({
      fileBuffer: buffer,
      folder,
      publicId: fileName,
      resourceType: 'video',
      fileName,
    });
    // Optionally: Save video metadata to DB here
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
    });
  } catch (error: any) {
    console.error('Cloudinary video upload error:', error);
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
  }
} 