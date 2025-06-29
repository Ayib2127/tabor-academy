'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

interface GlobalAnnouncementProps {
  className?: string;
}

interface Announcement {
  enabled: boolean;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export function GlobalAnnouncement({ className = '' }: GlobalAnnouncementProps) {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Load announcement from localStorage (in production, this would come from an API)
    const savedSettings = localStorage.getItem('platformSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.globalAnnouncement?.enabled && settings.globalAnnouncement?.message) {
          setAnnouncement(settings.globalAnnouncement);
        }
      } catch (error) {
        console.error('Error loading announcement:', error);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    // In production, you might want to save the dismissal state per user
    sessionStorage.setItem('announcementDismissed', 'true');
  };

  // Check if announcement was already dismissed in this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('announcementDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  if (!announcement || isDismissed) {
    return null;
  }

  const getAnnouncementStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: <AlertCircle className="w-5 h-5 text-red-600" />,
        };
      default:
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: <Info className="w-5 h-5 text-blue-600" />,
        };
    }
  };

  const styles = getAnnouncementStyles(announcement.type);

  return (
    <div className={`border-b ${styles.container} ${className}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {styles.icon}
            <div>
              <h4 className="font-semibold text-sm">{announcement.title}</h4>
              <p className="text-sm">{announcement.message}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="text-current hover:bg-black/10 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 