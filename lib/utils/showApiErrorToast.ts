import { toast } from "@/components/ui/use-toast";

export function showApiErrorToast(error: any, defaultMessage: string = "An error occurred") {
  let message = defaultMessage;
  
  if (error?.message) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error?.error) {
    message = error.error;
  }
  
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
}