import { ImageLoaderProps } from 'next/image';

export const imageLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  // If the image is from Unsplash, use their image optimization API
  if (src.includes('images.unsplash.com')) {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', (quality || 75).toString());
    url.searchParams.set('auto', 'format');
    return url.toString();
  }

  // If using Cloudinary (recommended for production)
  if (src.includes('res.cloudinary.com')) {
    return src
      .replace('/upload/', `/upload/w_${width},q_${quality || 75}/`)
      .replace(/\.[^/.]+$/, '.webp');
  }

  // For local images, return as is
  return src;
};

export const getImagePlaceholder = async (src: string): Promise<string> => {
  try {
    const response = await fetch(src);
    const buffer = await response.arrayBuffer();
    // Generate a tiny placeholder (implementation depends on your needs)
    return `data:image/jpeg;base64,...`;
  } catch (error) {
    console.error('Error generating image placeholder:', error);
    return '';
  }
};