import { useEffect, useRef, DependencyList } from 'react';

/**
 * A useEffect hook that prevents infinite loops by deeply comparing dependencies
 * and providing stable callback execution
 */
export function useStableEffect(
  effect: () => void | (() => void),
  deps?: DependencyList
) {
  const effectRef = useRef(effect);
  const depsRef = useRef<DependencyList | undefined>(deps);
  const cleanupRef = useRef<(() => void) | void>();

  // Update the effect ref with the latest effect
  effectRef.current = effect;

  // Deep compare dependencies to prevent unnecessary re-runs
  const depsChanged = !deps || !depsRef.current || 
    deps.length !== depsRef.current.length ||
    deps.some((dep, index) => {
      const prevDep = depsRef.current![index];
      return !Object.is(dep, prevDep);
    });

  useEffect(() => {
    if (depsChanged) {
      // Clean up previous effect
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = undefined;
      }

      // Run the new effect
      cleanupRef.current = effectRef.current();
      depsRef.current = deps;
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = undefined;
      }
    };
  }, deps);
}
