import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface AutoSaveConfig<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  debounceTime?: number;
  onError?: (error: Error) => void;
}

export function useAutoSave<T>({
  data,
  onSave,
  debounceTime = 1000,
  onError,
}: AutoSaveConfig<T>) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const save = useCallback(async (dataToSave: T) => {
    try {
      setIsSaving(true);
      await onSave(dataToSave);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save error:', error);
      if (onError) {
        onError(error as Error);
      } else {
        toast.error('Failed to save changes');
      }
    } finally {
      setIsSaving(false);
    }
  }, [onSave, onError]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      save(data);
    }, debounceTime);

    return () => clearTimeout(timeoutId);
  }, [data, debounceTime, save]);

  return {
    isSaving,
    lastSaved,
  };
} 