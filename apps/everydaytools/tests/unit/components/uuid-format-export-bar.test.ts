import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UuidFormatExportBar } from '@/components/uuid-generator/UuidFormatExportBar';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    isFr: true,
  }),
}));

describe('UuidFormatExportBar', () => {
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

  it('renders formatting and export options without arbitrary hex or transition-all on export button', async () => {
    const onHyphensChange = vi.fn();
    const onUppercaseChange = vi.fn();
    const onEnclosureChange = vi.fn();
    const onDownloadTxt = vi.fn();
    const onExportJson = vi.fn();
    const onExportCsv = vi.fn();

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(UuidFormatExportBar, {
            hyphens: true,
            uppercase: false,
            enclosure: 'none',
            uuids: ['c86326d9-f521-4f36-9e90-2e452601da19'],
            isFr: true,
            onHyphensChange,
            onUppercaseChange,
            onEnclosureChange,
            onDownloadTxt,
            onExportJson,
            onExportCsv,
          })
        )
      );
    });

    expect(container.innerHTML).not.toContain('#FF6B35');
    expect(container.innerHTML).not.toContain('#e85a26');

    const exportBtn = container.querySelector('button[aria-haspopup="menu"]') as HTMLButtonElement;
    expect(exportBtn).toBeTruthy();
    expect(exportBtn.className).not.toContain('transition-all');
    expect(exportBtn.className).toContain('transition-colors');
  });
});
