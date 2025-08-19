// jest.setup.ts
// Add any global setup for Jest here, e.g. extending expect, configuring test libraries, etc.

import '@testing-library/jest-dom';

// Mock window.matchMedia for jsdom environment
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = function(query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: function() {},
      removeListener: function() {},
      addEventListener: function() {},
      removeEventListener: function() {},
      dispatchEvent: function() { return false; }
    };
  };
}