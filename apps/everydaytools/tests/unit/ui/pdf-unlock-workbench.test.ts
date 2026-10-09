import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PdfUnlockWorkbench } from '@/components/pdf-unlock/PdfUnlockWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('PdfUnlockWorkbench integration with @workspace/ui (TDD)', () => {
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

  const sampleFile = new File(['mock-pdf-bytes'], 'protected.pdf', { type: 'application/pdf' });

  const renderWorkbench = async (workflowOverrides = {}, propsOverrides = {}) => {
    const defaultWorkflow = {
      file: sampleFile,
      password: '',
      showPassword: false,
      isProcessing: false,
      isSuccess: false,
      unlockedBlob: null,
      error: null,
      passwordInputRef: { current: null },
      setPassword: vi.fn(),
      setShowPassword: vi.fn(),
      handleReset: vi.fn(),
      handleConvert: vi.fn(),
      handleDownload: vi.fn(),
      ...workflowOverrides,
    };

    const defaultProps = {
      workflow: defaultWorkflow as any,
      isFr: true,
      unlockBtnLabel: 'Déverrouiller le PDF',
      passwordLabel: 'Mot de passe du document',
      passwordPlaceholder: 'Entrez le mot de passe...',
      passwordHelp: 'Saisissez le mot de passe',
      unlockingLabel: 'Déverrouillage en cours...',
      ...propsOverrides,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(PdfUnlockWorkbench, defaultProps)
        )
      );
    });

    return { workflow: defaultWorkflow, props: defaultProps };
  };

  it('renders StudioCommandBar with file metadata and unlock action button', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('protected.pdf');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain('Déverrouiller le PDF');
  });

  it('triggers handleReset when reset button is clicked', async () => {
    const handleReset = vi.fn();
    await renderWorkbench({ handleReset });

    const resetBtn = container.querySelector('button[data-testid="studio-reset-btn"]') as HTMLButtonElement;
    expect(resetBtn).not.toBeNull();

    act(() => {
      resetBtn.click();
    });

    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('triggers handleConvert when primary action button is clicked', async () => {
    const handleConvert = vi.fn();
    await renderWorkbench({ handleConvert });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();

    act(() => {
      actionBtn.click();
    });

    expect(handleConvert).toHaveBeenCalledTimes(1);
  });

  it('renders PasswordSecureField component with toggle visibility button and responds to input', async () => {
    const setPassword = vi.fn();
    await renderWorkbench({ setPassword });

    const toggleBtn = container.querySelector('button[data-testid="toggle-visibility"]');
    expect(toggleBtn).not.toBeNull();

    const input = container.querySelector('input') as HTMLInputElement;
    expect(input).not.toBeNull();

    act(() => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeInputValueSetter?.call(input, 'Secret123!');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // When integrated with PasswordSecureField, setPassword should be called
    expect(setPassword).toHaveBeenCalledWith('Secret123!');
  });
});
