import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AlertCircle, LogIn, UserPlus, ShieldOff, AlertTriangle, Mail, Info, XCircle, ArrowLeftCircle, CreditCard } from 'lucide-react';
import { SUPPORT_EMAIL, SUPPORT_CONTACT_URL } from "@/lib/config/support";

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

  // Go Back handler
  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  // SVG illustrations for error types
  const illustrations: Record<string, React.ReactNode> = {
    ENROLLMENT_REQUIRED: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto mb-2" aria-hidden="true">
        <circle cx="40" cy="40" r="38" fill="#E0F7FA" />
        <path d="M40 25v20" stroke="#4ECDC4" strokeWidth="3" strokeLinecap="round" />
        <circle cx="40" cy="53" r="2.5" fill="#4ECDC4" />
      </svg>
    ),
    AUTH_REQUIRED: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto mb-2" aria-hidden="true">
        <circle cx="40" cy="40" r="38" fill="#FFF3E0" />
        <rect x="28" y="36" width="24" height="18" rx="4" fill="#FF9800" />
        <circle cx="40" cy="45" r="3" fill="#FFF" />
      </svg>
    ),
    FORBIDDEN: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto mb-2" aria-hidden="true">
        <circle cx="40" cy="40" r="38" fill="#FFFDE7" />
        <rect x="28" y="36" width="24" height="8" rx="4" fill="#FFD600" />
        <rect x="36" y="28" width="8" height="24" rx="4" fill="#FFD600" />
      </svg>
    ),
    NOT_FOUND: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto mb-2" aria-hidden="true">
        <circle cx="40" cy="40" r="38" fill="#ECEFF1" />
        <ellipse cx="40" cy="50" rx="16" ry="6" fill="#B0BEC5" />
        <circle cx="32" cy="38" r="3" fill="#90A4AE" />
        <circle cx="48" cy="38" r="3" fill="#90A4AE" />
      </svg>
    ),
    VALIDATION_ERROR: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto mb-2" aria-hidden="true">
        <circle cx="40" cy="40" r="38" fill="#FFFDE7" />
        <rect x="34" y="28" width="12" height="24" rx="6" fill="#FFD600" />
        <rect x="34" y="54" width="12" height="4" rx="2" fill="#FFD600" />
      </svg>
    ),
    INTERNAL_ERROR: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto mb-2" aria-hidden="true">
        <circle cx="40" cy="40" r="38" fill="#FFEBEE" />
        <rect x="36" y="28" width="8" height="24" rx="4" fill="#E53935" />
        <circle cx="40" cy="56" r="3" fill="#E53935" />
      </svg>
    ),
    RESOURCE_CONFLICT: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto mb-2" aria-hidden="true">
        <circle cx="40" cy="40" r="38" fill="#E3F2FD" />
        <rect x="28" y="36" width="24" height="8" rx="4" fill="#2196F3" />
        <rect x="36" y="28" width="8" height="24" rx="4" fill="#2196F3" />
      </svg>
    ),
    RATE_LIMIT_EXCEEDED: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto mb-2" aria-hidden="true">
        <circle cx="40" cy="40" r="38" fill="#FFFDE7" />
        <rect x="28" y="36" width="24" height="8" rx="4" fill="#FFD600" />
        <rect x="36" y="28" width="8" height="24" rx="4" fill="#FFD600" />
      </svg>
    ),
    PAYMENT_ERROR: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto mb-2" aria-hidden="true">
        <circle cx="40" cy="40" r="38" fill="#F3E5F5" />
        <rect x="28" y="36" width="24" height="14" rx="4" fill="#8E24AA" />
        <rect x="36" y="52" width="8" height="4" rx="2" fill="#8E24AA" />
      </svg>
    ),
  };

  // Icon and color by error code
  let icon = <AlertCircle className="w-8 h-8 text-red-500" aria-hidden="true" />;
  let illustration = null;
  let title = 'Error';
  let description = message;
  let actions: React.ReactNode = (
    <Button onClick={onClose} autoFocus>Dismiss</Button>
  );
  let colorClass = 'text-red-600';

  if (code === 'ENROLLMENT_REQUIRED') {
    illustration = illustrations.ENROLLMENT_REQUIRED;
    icon = <UserPlus className="w-8 h-8 text-cyan-500" aria-hidden="true" />;
    title = 'Enrollment Required';
    description = message || 'You must enroll in this course to access its content.';
    actions = (
      <>
        <Button onClick={handleEnroll} className="bg-[#4ECDC4] text-white">Go to Course Page</Button>
        <Button variant="secondary" onClick={handleGoBack}>Go Back</Button>
      </>
    );
    colorClass = 'text-cyan-600';
  } else if (code === 'AUTH_REQUIRED') {
    illustration = illustrations.AUTH_REQUIRED;
    icon = <LogIn className="w-8 h-8 text-orange-500" aria-hidden="true" />;
    title = 'Login Required';
    description = message || 'Please log in to continue.';
    actions = (
      <>
        <Button onClick={handleLogin} className="bg-[#4ECDC4] text-white">Log In</Button>
        <Button variant="secondary" onClick={handleGoBack}>Go Back</Button>
      </>
    );
    colorClass = 'text-orange-600';
  } else if (code === 'FORBIDDEN') {
    illustration = illustrations.FORBIDDEN;
    icon = <ShieldOff className="w-8 h-8 text-yellow-500" aria-hidden="true" />;
    title = 'Access Denied';
    description = message || 'You do not have permission to access this resource.';
    actions = (
      <Button onClick={handleGoBack}>Go Back</Button>
    );
    colorClass = 'text-yellow-600';
  } else if (code === 'NOT_FOUND') {
    illustration = illustrations.NOT_FOUND;
    icon = <XCircle className="w-8 h-8 text-gray-500" aria-hidden="true" />;
    title = 'Not Found';
    description = message || 'The requested resource was not found.';
    actions = (
      <Button onClick={handleGoBack}>Go Back</Button>
    );
    colorClass = 'text-gray-600';
  } else if (code === 'VALIDATION_ERROR') {
    illustration = illustrations.VALIDATION_ERROR;
    icon = <AlertTriangle className="w-8 h-8 text-yellow-500" aria-hidden="true" />;
    title = 'Validation Error';
    colorClass = 'text-yellow-600';
  } else if (code === 'INTERNAL_ERROR') {
    illustration = illustrations.INTERNAL_ERROR;
    icon = <AlertCircle className="w-8 h-8 text-red-500" aria-hidden="true" />;
    title = 'Something went wrong';
    colorClass = 'text-red-600';
  } else if (code === 'RESOURCE_CONFLICT') {
    illustration = illustrations.RESOURCE_CONFLICT;
    icon = <Info className="w-8 h-8 text-blue-500" aria-hidden="true" />;
    title = 'Resource Conflict';
    colorClass = 'text-blue-600';
  } else if (code === 'RATE_LIMIT_EXCEEDED') {
    illustration = illustrations.RATE_LIMIT_EXCEEDED;
    icon = <AlertTriangle className="w-8 h-8 text-yellow-500" aria-hidden="true" />;
    title = 'Too Many Requests';
    colorClass = 'text-yellow-600';
  } else if (code === 'PAYMENT_ERROR') {
    illustration = illustrations.PAYMENT_ERROR;
    icon = <CreditCard className="w-8 h-8 text-purple-500" aria-hidden="true" />;
    title = 'Payment Error';
    colorClass = 'text-purple-600';
  }

  // Details toggle for advanced users
  const [showDetails, setShowDetails] = React.useState(false);

  // Report error handler
  const handleReportError = () => {
    const subject = encodeURIComponent(`Error Report: ${title}`);
    const body = encodeURIComponent(
      `Error Code: ${code}\nMessage: ${message}\nDetails: ${typeof details === 'string' ? details : JSON.stringify(details, null, 2)}`
    );
    window.open(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`);
  };

  // Retry/Reload handler
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  // Determine if retry is relevant for this error code
  const showRetry = [
    'INTERNAL_ERROR',
    'RATE_LIMIT_EXCEEDED',
    'PAYMENT_ERROR',
    'RESOURCE_CONFLICT',
  ].includes(code);

  // Determine if contact support is relevant for this error code
  const showContactSupport = [
    'INTERNAL_ERROR',
    'PAYMENT_ERROR',
    'FORBIDDEN',
  ].includes(code);

  const handleContactSupport = () => {
    window.open(SUPPORT_CONTACT_URL, '_blank', 'noopener');
  };

  // Determine if Go Back is relevant for this error code
  const showGoBack = [
    'NOT_FOUND',
    'FORBIDDEN',
    'INTERNAL_ERROR',
    'RESOURCE_CONFLICT',
    'VALIDATION_ERROR',
    'RATE_LIMIT_EXCEEDED',
  ].includes(code);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          {illustration}
          <div className="flex items-center gap-3 mb-2">
            {icon}
            <DialogTitle className={`text-lg font-bold ${colorClass}`}>{title}</DialogTitle>
          </div>
          <DialogDescription className="text-base text-gray-700 mb-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        {details && (
          <div className="mb-2">
            <button
              className="text-xs underline text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowDetails((v) => !v)}
              aria-expanded={showDetails}
              aria-controls="error-details"
            >
              {showDetails ? 'Hide technical details' : 'Show technical details'}
            </button>
            {showDetails && (
              <pre
                id="error-details"
                className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600 overflow-x-auto max-h-40"
                tabIndex={0}
                aria-label="Technical error details"
              >
                {typeof details === 'string' ? details : JSON.stringify(details, null, 2)}
              </pre>
            )}
          </div>
        )}
        <div className="flex gap-2 pt-4">
          {actions}
          {showGoBack && (
            <Button variant="outline" onClick={handleGoBack} title="Go back to the previous page">
              Go Back
            </Button>
          )}
          {showRetry && (
            <Button variant="outline" onClick={handleRetry} title="Retry or reload the page">
              Retry
            </Button>
          )}
          {showContactSupport && (
            <Button variant="outline" onClick={handleContactSupport} title="Contact support" className="">
              Contact Support
            </Button>
          )}
          {details && (
            <Button variant="outline" onClick={handleReportError} className="ml-auto" title="Report this error to support">
              Report This Error
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 