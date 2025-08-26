"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Module {
  id: string;
  title: string;
  description?: string;
  order: number;
  weekly_sprint_goal?: string;
  unlocks_on_week?: number;
}

interface EditModuleModalProps {
  module: { module: Module };
  onSave: (updatedModule: Module) => void;
  onClose: () => void;
}

export default function EditModuleModal({ module, onSave, onClose }: EditModuleModalProps) {
  const [title, setTitle] = useState(module.module.title);
  const [description, setDescription] = useState(module.module.description || '');
  const [week, setWeek] = useState(module.module.unlocks_on_week || 1);

  const handleSave = () => {
    onSave({
      ...module.module,
      title,
      description,
      unlocks_on_week: week,
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Module</DialogTitle>
          <DialogDescription>
            Update the module details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Enter module description (optional)"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="week" className="text-right">
              Unlock Week
            </Label>
            <Input
              id="week"
              type="number"
              min={1}
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 