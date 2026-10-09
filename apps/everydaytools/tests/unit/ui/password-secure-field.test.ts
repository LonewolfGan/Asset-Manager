import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PasswordSecureField } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('PasswordSecureField (TDD RED Phase)', () => {
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

  const renderComponent = async (props: any) => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(PasswordSecureField, props)
        )
      );
    });
  };

  it('renders input with password type and toggles visibility on eye click', async () => {
    await renderComponent({
      value: 'secret123',
      onChange: vi.fn(),
      label: 'Mot de passe',
      isFr: true,
    });

    const input = container.querySelector('input') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.type).toBe('password');
    expect(input.value).toBe('secret123');

    const toggleBtn = container.querySelector('button[data-testid="toggle-visibility"]') as HTMLButtonElement;
    expect(toggleBtn).not.toBeNull();

    act(() => {
      toggleBtn.click();
    });

    expect(input.type).toBe('text');

    act(() => {
      toggleBtn.click();
    });

    expect(input.type).toBe('password');
  });

  it('renders strength meter when showStrength is true', async () => {
    await renderComponent({
      value: 'VerySecureP@ssw0rd!2026',
      onChange: vi.fn(),
      showStrength: true,
      isFr: true,
    });

    const strengthIndicator = container.querySelector('[data-testid="password-strength"]');
    expect(strengthIndicator).not.toBeNull();
    expect(strengthIndicator?.textContent?.toLowerCase()).toMatch(/fort|strong/);
  });

  it('invokes onGenerate callback or emits password when generate button is clicked', async () => {
    const handleGenerate = vi.fn();
    await renderComponent({
      value: '',
      onChange: vi.fn(),
      allowGenerate: true,
      onGenerate: handleGenerate,
      isFr: true,
    });

    const generateBtn = container.querySelector('button[data-testid="generate-password"]') as HTMLButtonElement;
    expect(generateBtn).not.toBeNull();

    act(() => {
      generateBtn.click();
    });

    expect(handleGenerate).toHaveBeenCalled();
  });
});
