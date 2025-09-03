import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { showApiErrorToast } from "@/lib/utils/showApiErrorToast";
import { useStableCallback } from './useStableCallback';

interface AutoSaveConfig<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  debounceTime?: number;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

export function useAutoSave<T>({
  data,
  onSave,
  debounceTime = 1000,
  onError,
  enabled = true,
}: AutoSaveConfig<T>) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastDataRef = useRef<T>(data);

  const stableOnSave = useStableCallback(onSave);
  const stableOnError = useStableCallback(onError || (() => {}));

  const save = useCallback(async (dataToSave: T) => {
    // Skip if data hasn't actually changed
    if (JSON.stringify(lastDataRef.current) === JSON.stringify(dataToSave)) {
      return;
    }

    try {
      setIsSaving(true);
      await stableOnSave(dataToSave);
      lastDataRef.current = dataToSave;
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (onError) {
        stableOnError(error as Error);
      } else {
        if ((error as any).code) {
          showApiErrorToast({
            code: (error as any).code,
            error: (error as any).message,
            details: (error as any).details,
          });
        } else {
          toast.error(`Failed to save changes: ${errorMessage}`);
        }
      }
    } finally {
      setIsSaving(false);
    }
  }, [stableOnSave, stableOnError, onError]);

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      save(data);
    }, debounceTime);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debounceTime, enabled, save]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isSaving,
    lastSaved,
    save: () => save(data), // Manual save function
  };
} 