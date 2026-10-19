import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { LocaleProvider } from '@/contexts/locale-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import PasswordGenerator from '@/pages/password-generator';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('PasswordGenerator with Modern Awwwards Architecture (TDD RED Phase)', () => {
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

  it('renders PasswordSecureField for testing password strength', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(PasswordGenerator)
          )
        )
      );
    });

    const toggleEye = container.querySelector('[data-testid="toggle-visibility"]');
    expect(toggleEye).not.toBeNull();
  });

  it('renders inter-tool handoff action buttons for Hash and QR Code generators', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(PasswordGenerator)
          )
        )
      );
    });

    const hashBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Hacher') || b.textContent?.includes('Hash')
    );
    const qrBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('QR code') || b.textContent?.includes('QR')
    );

    expect(hashBtn).toBeDefined();
    expect(qrBtn).toBeDefined();
  });

  it('renders security presets bar with quick profile options', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(PasswordGenerator)
          )
        )
      );
    });

    const pinPreset = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('PIN 4') || b.textContent?.includes('PIN 4-Digit')
    );
    expect(pinPreset).toBeDefined();
  });
});
