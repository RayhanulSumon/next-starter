// jest.setup.ts
// Add any global setup for Jest here, e.g. extending expect, configuring test libraries, etc.

import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from 'util';
import fetch, { Request, Response, Headers } from 'node-fetch';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

if (typeof global.fetch === 'undefined') {
  global.fetch = fetch as any;
}
if (typeof global.Request === 'undefined') {
  global.Request = Request as any;
}
if (typeof global.Response === 'undefined') {
  global.Response = Response as any;
}
if (typeof global.Headers === 'undefined') {
  global.Headers = Headers as any;
}

// Mock window.matchMedia for jsdom environment
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {
        return false;
      },
    };
  };
}