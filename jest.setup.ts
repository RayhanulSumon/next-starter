// jest.setup.ts
// Add any global setup for Jest here, e.g. extending expect, configuring test libraries, etc.

import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from 'util';
import fetch, { Request, Response, Headers } from 'cross-fetch';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder as unknown as typeof global.TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;
}

if (typeof global.fetch === 'undefined') {
  global.fetch = fetch;
}
if (typeof global.Request === 'undefined') {
  global.Request = Request;
}
if (typeof global.Response === 'undefined') {
  global.Response = Response;
}
if (typeof global.Headers === 'undefined') {
  global.Headers = Headers;
}

// Mock window.matchMedia for jsdom environment
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = function (query: string): MediaQueryList {
    let listeners: EventListenerOrEventListenerObject[] = [];
    return {
      matches: false,
      media: query,
      onchange: null,
      addEventListener: function (
        _type: string,
        listener: EventListenerOrEventListenerObject,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _options?: boolean | AddEventListenerOptions
      ) {
        listeners.push(listener);
      },
      removeEventListener: function (
        _type: string,
        listener: EventListenerOrEventListenerObject,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _options?: boolean | EventListenerOptions
      ) {
        listeners = listeners.filter(l => l !== listener);
      },
      dispatchEvent: function () {
        return false;
      },
      // Deprecated methods for backward compatibility
      addListener(listener: EventListenerOrEventListenerObject) {
        // Deprecated: use addEventListener instead
        this.addEventListener('change', listener);
      },
      removeListener(listener: EventListenerOrEventListenerObject) {
        // Deprecated: use removeEventListener instead
        this.removeEventListener('change', listener);
      },
    } as MediaQueryList;
  };
}