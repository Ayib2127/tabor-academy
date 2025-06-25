// Safe implementation without dynamic code evaluation
let globalObject;

if (typeof globalThis !== 'undefined') {
  globalObject = globalThis;
} else if (typeof self !== 'undefined') {
  globalObject = self;
} else if (typeof window !== 'undefined') {
  globalObject = window;
} else if (typeof global !== 'undefined') {
  globalObject = global;
} else {
  // Fallback that doesn't use Function constructor
  globalObject = {};
}

module.exports = globalObject;
module.exports.default = globalObject;