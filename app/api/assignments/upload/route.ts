import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { uploadToCloudinary } from '@/lib/utils/cloudinary-upload';
import { v4 as uuidv4 } from 'uuid';
import { handleApiError, ForbiddenError, ValidationError } from '@/lib/utils/error-handling';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse<any>> {
  try {
    const supabase = await createApiSupabaseClient();

    // Authenticate user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new ForbiddenError('Unauthorized');
    }
    const userId = session.user.id;

    // Parse form data
    const formData = await request.formData();
    const courseId = formData.get('courseId') as string;
    const assignmentId = formData.get('assignmentId') as string;
    const files = formData.getAll('files') as File[];

    if (!courseId || !assignmentId || files.length === 0) {
      throw new ValidationError('Missing required fields');
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
        throw new ValidationError(`Unsupported file type: ${file.type}`);
      }
      if (file.size > maxSize) {
        throw new ValidationError(`File size exceeds 20MB: ${file.name}`);
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
        throw new ValidationError(`Failed to upload file: ${file.name}`);
      }
    }

    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch (error) {
    console.error('Assignments Upload API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
} 