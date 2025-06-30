import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { NextResponse } from 'next/server';

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

    const { imageId } = await req.json();

    // Get the image file path
    const { data: imageData, error: imageError } = await supabase
      .from('images')
      .select('file_path')
      .eq('id', imageId)
      .single();

    if (imageError || !imageData) {
      throw new Error('Image not found');
    }

    // Get public URL
    const { data: urlData } = await supabase.storage
      .from('course-images')
      .getPublicUrl(imageData.file_path);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to generate image URL');
    }

    return NextResponse.json({
      publicUrl: urlData.publicUrl,
    });
  } catch (error: any) {
    console.error('Error getting image URL:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get image URL' },
      { status: 500 }
    );
  }
} 