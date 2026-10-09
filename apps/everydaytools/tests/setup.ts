import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock File API
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock crypto.getRandomValues
const originalGetRandomValues = global.crypto?.getRandomValues?.bind(global.crypto);
if (!originalGetRandomValues) {
  Object.defineProperty(global, 'crypto', {
    value: {
      getRandomValues: (arr: Uint32Array) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 4294967296);
        }
        return arr;
      },
      randomUUID: () => 'mock-uuid-' + Math.random().toString(36).slice(2),
    },
    writable: true,
  });
}

// Mock ResizeObserver for Radix UI popper & useSize
if (typeof globalThis.ResizeObserver === 'undefined') {
  (globalThis as any).ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Mock window.matchMedia
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as any;
}

