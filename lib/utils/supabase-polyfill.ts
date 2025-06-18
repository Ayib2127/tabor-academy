if (typeof window === 'undefined') {
  (global as any).self = global;
  (global as any).window = global;
  (global as any).document = {
    createElement: () => ({}),
  };
}

export {};
