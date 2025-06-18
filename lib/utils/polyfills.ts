// Simple polyfill that runs immediately
if (typeof globalThis === 'undefined') {
    (window as any).globalThis = window;
  }
  
  if (typeof self === 'undefined') {
    if (typeof window !== 'undefined') {
      (window as any).self = window;
    }
  }