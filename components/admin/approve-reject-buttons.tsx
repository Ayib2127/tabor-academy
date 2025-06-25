'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

type Props = { courseId: string };

export default function ApproveRejectButtons({ courseId }: Props) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);
  const router = useRouter();

  const handleAction = async (status: 'published' | 'rejected') => {
    try {
      setLoading(status === 'published' ? 'approve' : 'reject');
      const res = await fetch(`/api/admin/courses/${courseId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Request failed');
      }

      toast({
        title: status === 'published' ? 'Course approved!' : 'Course rejected',
      });
      router.push('/dashboard/admin/approvals');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-4 mt-6">
      <Button
        disabled={loading !== null}
        onClick={() => handleAction('published')}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {loading === 'approve' ? 'Approving…' : 'Approve'}
      </Button>
      <Button
        variant="outline"
        disabled={loading !== null}
        onClick={() => handleAction('rejected')}
        className="border-red-600 text-red-600 hover:bg-red-50"
      >
        {loading === 'reject' ? 'Rejecting…' : 'Reject'}
      </Button>
    </div>
  );
}
