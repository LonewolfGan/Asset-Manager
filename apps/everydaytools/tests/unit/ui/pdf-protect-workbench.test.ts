import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PdfProtectWorkbench } from '@/components/pdf-protect/PdfProtectWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleProvider } from '@/contexts/locale-context';

describe('PdfProtectWorkbench integration with @workspace/ui (TDD)', () => {
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

  const sampleFile = new File(['mock-pdf-bytes'], 'secret.pdf', { type: 'application/pdf' });

  const renderWorkbench = async (props: Partial<Parameters<typeof PdfProtectWorkbench>[0]> = {}) => {
    const defaultProps = {
      file: sampleFile,
      isProcessing: false,
      userPassword: 'password123',
      ownerPassword: '',
      showUserPassword: false,
      showOwnerPassword: false,
      showAdvanced: false,
      allowPrinting: true,
      allowCopying: false,
      allowModifying: false,
      passwordError: null,
      strength: null,
      passwordInputRef: { current: null },
      onReset: vi.fn(),
      onConvert: vi.fn(),
      onUserPasswordChange: vi.fn(),
      onOwnerPasswordChange: vi.fn(),
      onToggleShowUserPassword: vi.fn(),
      onToggleShowOwnerPassword: vi.fn(),
      onToggleShowAdvanced: vi.fn(),
      onToggleAllowPrinting: vi.fn(),
      onToggleAllowCopying: vi.fn(),
      onToggleAllowModifying: vi.fn(),
      onGeneratePassword: vi.fn(),
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(PdfProtectWorkbench, defaultProps)
          )
        )
      );
    });

    return defaultProps;
  };

  it('renders StudioCommandBar with file metadata and protect action button', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('secret.pdf');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain('Protéger');
  });

  it('triggers onReset when reset button is clicked', async () => {
    const onReset = vi.fn();
    await renderWorkbench({ onReset });

    const resetBtn = container.querySelector('button[data-testid="studio-reset-btn"]') as HTMLButtonElement;
    expect(resetBtn).not.toBeNull();

    act(() => {
      resetBtn.click();
    });

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('triggers onConvert when primary action button is clicked', async () => {
    const onConvert = vi.fn();
    await renderWorkbench({ onConvert });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();

    act(() => {
      actionBtn.click();
    });

    expect(onConvert).toHaveBeenCalledTimes(1);
  });

  it('renders PasswordSecureField with toggle visibility and generate button', async () => {
    const onGeneratePassword = vi.fn();
    await renderWorkbench({ onGeneratePassword });

    const toggleBtn = container.querySelector('button[data-testid="toggle-visibility"]');
    expect(toggleBtn).not.toBeNull();

    const generateBtn = container.querySelector('button[data-testid="generate-password"]') as HTMLButtonElement;
    expect(generateBtn).not.toBeNull();

    act(() => {
      generateBtn.click();
    });

    expect(onGeneratePassword).toHaveBeenCalled();
  });
});
