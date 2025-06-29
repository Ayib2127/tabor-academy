'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Megaphone,
  Send,
  Users,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface CourseAnnouncementsProps {
  courseId: string;
  studentCount: number;
}

export function CourseAnnouncements({ courseId, studentCount }: CourseAnnouncementsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSendAnnouncement = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Please provide both a title and message');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(`/api/instructor/courses/${courseId}/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send announcement');
      }

      const result = await response.json();
      
      setIsSuccess(true);
      toast.success('Announcement sent successfully!');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setTitle('');
        setMessage('');
        setIsSuccess(false);
        setIsOpen(false);
      }, 2000);
      
    } catch (error: any) {
      console.error('Error sending announcement:', error);
      toast.error(error.message || 'Failed to send announcement');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
          <Megaphone className="w-4 h-4 mr-2" />
          Send Announcement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#4ECDC4]" />
            Send Course Announcement
          </DialogTitle>
        </DialogHeader>
        
        {isSuccess ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Announcement Sent!</h3>
            <p className="text-[#2C3E50]/60">
              Your announcement has been sent to all enrolled students.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">
                  This announcement will be sent to {studentCount} enrolled students
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="announcement-title" className="text-[#2C3E50] font-semibold">
                Announcement Title
              </Label>
              <Input
                id="announcement-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Important Course Update"
                className="border-[#E5E8E8] focus:border-[#4ECDC4]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="announcement-message" className="text-[#2C3E50] font-semibold">
                Message
              </Label>
              <Textarea
                id="announcement-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your announcement message..."
                className="border-[#E5E8E8] focus:border-[#4ECDC4]"
                rows={5}
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSendAnnouncement}
                disabled={isSending || !title.trim() || !message.trim()}
                className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Announcement
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}