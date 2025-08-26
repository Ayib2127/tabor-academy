import { toast } from "@/components/ui/use-toast";

interface ApiError {
  code: string;
  error: string;
  details?: string;
}

export const showApiErrorToast = ({ code, error, details }: ApiError) => {
  toast({
    title: `Error: ${code}`,
    description: error,
    variant: "destructive",
  });
  
  // Log additional details if available
  if (details) {
    console.error('API Error Details:', details);
  }
};