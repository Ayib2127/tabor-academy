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
  const file = formData.get('image') as File;
  if (!file) {
    return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
  }

  // Validate file type and size (max 5MB)
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported image format' }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File size exceeds 5MB' }, { status: 400 });
  }

  // Prepare Cloudinary upload
  const imageId = uuidv4();
  const fileExtension = file.name.split('.').pop();
  const fileName = `${imageId}-${file.name}`;
  const folder = `tabor_academy/images/${userId}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await uploadToCloudinary({
      fileBuffer: buffer,
      folder,
      publicId: fileName,
      resourceType: 'image',
      fileName,
    });
    // Optionally: Save image metadata to DB here
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
    });
  } catch (error: any) {
    console.error('Cloudinary image upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
} 