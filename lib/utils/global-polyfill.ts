declare global {
  var global: typeof globalThis;
}

if (typeof globalThis === 'undefined') {
  (window as any).globalThis = window;
}

if (typeof self === 'undefined') {
  (globalThis as any).self = globalThis;
}

if (typeof global === 'undefined') {
  (globalThis as any).global = globalThis;
}

export {};
