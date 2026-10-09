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
