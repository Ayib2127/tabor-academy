import { FC, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Video, Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { showApiErrorToast } from "@/lib/utils/showApiErrorToast";

interface VideoUploaderProps {
  onUploadComplete: (videoUrl: string) => void;
  onUploadError: (error: Error) => void;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
}

const VideoUploader: FC<VideoUploaderProps> = ({
  onUploadComplete,
  onUploadError,
  maxSize = 500 * 1024 * 1024, // 500MB default
  acceptedTypes = ['video/mp4', 'video/webm', 'video/quicktime'],
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Upload video to backend (Cloudinary)
      const formData = new FormData();
      formData.append('video', file);
      const response = await fetch('/api/instructor/videos/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        showApiErrorToast({
          code: data.code || 'INTERNAL_ERROR',
          error: data.error || 'Failed to upload video',
        });
        throw new Error(data.error || 'Failed to upload video');
      }
      const data = await response.json();
      setUploadedVideo(data.url);
      onUploadComplete(data.url);
      toast.success('Video uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError(error as Error);
      showApiErrorToast({
        code: (error as any).code || 'INTERNAL_ERROR',
        error: (error as any).message || 'Failed to upload video',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [onUploadComplete, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: false,
  });

  const handleRemove = () => {
    setUploadedVideo(null);
    onUploadComplete('');
  };

  return (
    <div className="space-y-4">
      {!uploadedVideo ? (
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
            <Video className="h-12 w-12 text-gray-400" />
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop your video here' : 'Drag & drop your video here'}
              </p>
              <p className="text-sm text-gray-500">
                or click to select a file
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supported formats: MP4, WebM, QuickTime
                <br />
                Max size: {Math.round(maxSize / (1024 * 1024))}MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
          <video
            src={uploadedVideo}
            controls
            className="w-full h-full"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
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

export default VideoUploader; 