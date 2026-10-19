import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UuidInspectorWorkbench } from '@/components/uuid-generator/UuidInspectorWorkbench';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    isFr: true,
  }),
}));

describe('UuidInspectorWorkbench', () => {
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

  it('renders quick sample buttons when empty and handles sample selection', async () => {
    const onInputChange = vi.fn();
    const onClearInput = vi.fn();

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(UuidInspectorWorkbench, {
            inspectInput: '',
            inspectedData: { valid: false, cleanHex: '', formatted: '' },
            isFr: true,
            copiedLabel: 'Copié',
            onInputChange,
            onClearInput,
          })
        )
      );
    });

    const sampleButtons = container.querySelectorAll('button[data-uuid-sample]');
    expect(sampleButtons.length).toBeGreaterThanOrEqual(2);

    const firstSampleBtn = sampleButtons[0] as HTMLButtonElement;
    firstSampleBtn.click();
    expect(onInputChange).toHaveBeenCalled();
  });

  it('renders inspection details when a valid UUID is provided', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(UuidInspectorWorkbench, {
            inspectInput: 'c86326d9-f521-4f36-9e90-2e452601da19',
            inspectedData: {
              valid: true,
              version: 4,
              versionLabel: 'Version 4 (Généré aléatoirement)',
              variant: 'RFC 4122 / Leach-Salz',
              cleanHex: 'c86326d9f5214f369e902e452601da19',
              formatted: 'c86326d9-f521-4f36-9e90-2e452601da19',
            },
            isFr: true,
            copiedLabel: 'Copié',
            onInputChange: vi.fn(),
            onClearInput: vi.fn(),
          })
        )
      );
    });

    expect(container.textContent).toContain('Version 4');
    expect(container.textContent).toContain('RFC 4122');
  });
});
