import { FC, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { showApiErrorToast } from "@/lib/utils/showApiErrorToast";

interface ImageUploaderProps {
  onUploadComplete: (imageUrl: string) => void;
  onUploadError: (error: Error) => void;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
}

const ImageUploader: FC<ImageUploaderProps> = ({
  onUploadComplete,
  onUploadError,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload image to backend (Cloudinary)
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('/api/instructor/images/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        showApiErrorToast({
          code: data.code || 'INTERNAL_ERROR',
          error: data.error || 'Failed to upload image',
        });
        throw new Error(data.error || 'Failed to upload image');
      }
      const data = await response.json();
      onUploadComplete(data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError(error as Error);
      showApiErrorToast({
        code: (error as any).code || 'INTERNAL_ERROR',
        error: (error as any).message || 'Failed to upload image',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: false,
  });

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <input {...getInputProps()} disabled={isUploading} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <ImageIcon className="h-12 w-12 text-gray-400" />
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop your image here' : 'Drag & drop your image here'}
              </p>
              <p className="text-sm text-gray-500">
                or click to select a file
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supported formats: JPEG, PNG, GIF, WebP
                <br />
                Max size: {Math.round(maxSize / (1024 * 1024))}MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => setPreview(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-sm text-gray-500 text-center">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 