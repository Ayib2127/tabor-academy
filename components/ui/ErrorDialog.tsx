import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  code: string;
  message: string;
  details?: any;
  courseId?: string;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({ open, onClose, code, message, details, courseId }) => {
  const router = useRouter();

  const handleEnroll = () => {
    if (courseId) {
      router.push(`/courses/${courseId}`);
    } else {
      onClose();
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    } else {
      onClose();
    }
  };

  let title = 'Error';
  let description = message;
  let actions: React.ReactNode = (
    <Button onClick={onClose}>Dismiss</Button>
  );

  if (code === 'ENROLLMENT_REQUIRED') {
    title = 'Enrollment Required';
    description = message || 'You must enroll in this course to access its content.';
    actions = (
      <>
        <Button onClick={handleEnroll} className="bg-[#4ECDC4] text-white">Go to Course Page</Button>
        <Button variant="secondary" onClick={handleGoBack}>Go Back</Button>
      </>
    );
  } else if (code === 'AUTH_REQUIRED') {
    title = 'Login Required';
    description = message || 'Please log in to continue.';
    actions = (
      <>
        <Button onClick={handleLogin} className="bg-[#4ECDC4] text-white">Log In</Button>
        <Button variant="secondary" onClick={handleGoBack}>Go Back</Button>
      </>
    );
  } else if (code === 'FORBIDDEN') {
    title = 'Access Denied';
    description = message || 'You do not have permission to access this resource.';
    actions = (
      <Button onClick={handleGoBack}>Go Back</Button>
    );
  } else if (code === 'NOT_FOUND') {
    title = 'Not Found';
    description = message || 'The requested resource was not found.';
    actions = (
      <Button onClick={handleGoBack}>Go Back</Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 pt-4">{actions}</div>
      </DialogContent>
    </Dialog>
  );
}; 