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
  const courseId = formData.get('courseId') as string;
  const assignmentId = formData.get('assignmentId') as string;
  const files = formData.getAll('files') as File[];

  if (!courseId || !assignmentId || files.length === 0) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Validate and upload each file
  const allowedTypes = [
    'application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg', 'image/png', 'image/webp', 'text/plain'
  ];
  const maxSize = 20 * 1024 * 1024; // 20MB per file

  const uploadedFiles = [];
  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File size exceeds 20MB: ${file.name}` }, { status: 400 });
    }
    const fileUuid = uuidv4();
    const fileName = `${assignmentId}-${fileUuid}-${file.name}`;
    const folder = `tabor_academy/assignments/${courseId}/${userId}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    try {
      const result = await uploadToCloudinary({
        fileBuffer: buffer,
        folder,
        publicId: fileName,
        resourceType: 'auto',
        fileName,
      });
      uploadedFiles.push({
        url: result.secure_url,
        public_id: result.public_id,
        resource_type: result.resource_type,
        original_name: file.name,
      });
    } catch (error: any) {
      console.error('Cloudinary assignment upload error:', error);
      return NextResponse.json({ error: `Failed to upload file: ${file.name}` }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, files: uploadedFiles });
} 