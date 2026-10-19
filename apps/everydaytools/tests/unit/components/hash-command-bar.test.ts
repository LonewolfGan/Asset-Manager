import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { HashIntegrityCommandBar } from '@/components/hash-generator/HashIntegrityCommandBar';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    isFr: true,
  }),
}));

describe('HashIntegrityCommandBar', () => {
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

  it('renders integrity input and export controls without arbitrary hex or transition-all', async () => {
    const onCompareHashChange = vi.fn();
    const onClearCompareHash = vi.fn();
    const onToggleUppercase = vi.fn();
    const onUndo = vi.fn();
    const onClear = vi.fn();
    const onCopyAll = vi.fn();
    const onDownloadManifest = vi.fn();
    const onExportJson = vi.fn();

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(HashIntegrityCommandBar, {
            compareHash: '5d41402abc4b2a76b9719d911017c592',
            compareResult: { matched: true, algorithm: 'MD5' },
            isUppercase: false,
            inputMode: 'text',
            historyLength: 2,
            hasData: true,
            manifestContent: '# Manifest\nMD5 5d41402abc4b2a76b9719d911017c592',
            onCompareHashChange,
            onClearCompareHash,
            onToggleUppercase,
            onUndo,
            onClear,
            onCopyAll,
            onDownloadManifest,
            onExportJson,
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

    const matchBadge = container.querySelector('.bg-emerald-500\\/10');
    expect(matchBadge).toBeTruthy();
    expect(matchBadge?.textContent).toContain('MD5');
  });
});
