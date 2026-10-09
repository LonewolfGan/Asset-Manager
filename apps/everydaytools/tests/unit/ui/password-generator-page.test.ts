import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { LocaleProvider } from '@/contexts/locale-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import PasswordGenerator from '@/pages/password-generator';

describe('PasswordGenerator with PasswordSecureField (TDD RED Phase)', () => {
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
});
