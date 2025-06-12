"use client";

import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PreviewBannerProps {
  onExit?: () => void;
}

const PreviewBanner: FC<PreviewBannerProps> = ({ onExit }) => {
  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <p className="text-yellow-800 font-medium">Preview Mode</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={onExit}
          className="text-yellow-800 hover:bg-yellow-100"
        >
          <X className="h-4 w-4 mr-2" />
          Exit Preview
        </Button>
      </div>
    </div>
  );
};

export default PreviewBanner; 