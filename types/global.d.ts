// Add to your global type declarations
declare global {
    interface Window {
      global: typeof globalThis;
      process?: {
        env: Record<string, string>;
        nextTick: (callback: () => void) => void;
        cwd: () => string;
        version: string;
        platform: string;
      };
    }
  }