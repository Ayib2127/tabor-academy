import { useCallback, useRef } from 'react';

/**
 * Creates a stable callback that doesn't change on every render
 * This prevents infinite loops in useEffect dependencies
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef<T>(callback);
  
  // Update the ref with the latest callback
  callbackRef.current = callback;
  
  // Return a stable function that calls the latest callback
  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []) as T;
}
