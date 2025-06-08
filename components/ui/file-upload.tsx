import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './button';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  preview?: boolean;
  label?: string;
  error?: string;
}

export function FileUpload({
  value,
  onChange,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  preview = true,
  label = 'Upload file',
  error,
}: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onChange(file);
        if (preview && file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
        }
      }
    },
    [onChange, preview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const handleRemove = () => {
    onChange(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="space-y-2">
      {preview && previewUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-cover"
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
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-brand-orange-500 bg-brand-orange-50' : 'border-muted-foreground/25'}
          ${error ? 'border-red-500' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {value ? (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{value.name}</p>
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleRemove(); }}>
                Remove
              </Button>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">
                Drag and drop or click to upload
              </p>
              <p className="text-xs text-muted-foreground">
                Max file size: {maxSize / 1024 / 1024}MB
              </p>
            </>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
} 