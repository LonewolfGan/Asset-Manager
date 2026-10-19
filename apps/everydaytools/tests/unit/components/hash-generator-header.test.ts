import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { HashGeneratorHeader } from '@/components/hash-generator/HashGeneratorHeader';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    isFr: true,
  }),
}));

describe('HashGeneratorHeader', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('renders mode switch and HMAC controls without arbitrary hex', async () => {
    const onSelectMode = vi.fn();
    const onToggleHmac = vi.fn();
    const onHmacSecretChange = vi.fn();

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(HashGeneratorHeader, {
            inputMode: 'text',
            inputText: 'Sample text',
            textByteLength: 11,
            fileInfo: null,
            enableHmac: true,
            hmacSecret: 'mysecret',
            onSelectMode,
            onToggleHmac,
            onHmacSecretChange,
          })
        )
      );
    });

    expect(container.innerHTML).not.toContain('#FF6B35');
    expect(container.innerHTML).not.toContain('#e85a26');

    const hmacInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    expect(hmacInput).toBeTruthy();
    expect(hmacInput.value).toBe('mysecret');
  });
});
