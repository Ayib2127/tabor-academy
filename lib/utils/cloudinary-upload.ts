import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  url: string;
  resource_type: string;
  [key: string]: any;
}

/**
 * Uploads a file or buffer to Cloudinary.
 * @param fileBuffer - The file as a Buffer (Node.js) or ArrayBuffer (browser)
 * @param folder - The Cloudinary folder (e.g., 'tabor_academy/payment')
 * @param publicId - Optional public_id for the file
 * @param resourceType - Optional resource_type (default: 'auto')
 * @returns Cloudinary upload result
 */
export async function uploadToCloudinary({
  fileBuffer,
  folder,
  publicId,
  resourceType = 'auto',
  fileName,
}: {
  fileBuffer: Buffer;
  folder: string;
  publicId?: string;
  resourceType?: 'auto' | 'image' | 'video' | 'raw';
  fileName?: string;
}): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId || fileName,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as CloudinaryUploadResult);
      }
    );
    stream.end(fileBuffer);
  });
} 