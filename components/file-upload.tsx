import * as React from "react"

import { cn } from "@/lib/utils"

export interface FileUploadProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    endpoint?: string;
    onUrlChange?: (url: string) => void;
  }

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ className, type, onUrlChange, ...props }, ref) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        const fileUrl = URL.createObjectURL(file);
        if (onUrlChange) {
          onUrlChange(fileUrl);
        }
      }
    };

    return (
      <input
        type="file"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onChange={handleFileChange}
        {...props}
      />
    )
  }
)
FileUpload.displayName = "FileUpload"

export { FileUpload }