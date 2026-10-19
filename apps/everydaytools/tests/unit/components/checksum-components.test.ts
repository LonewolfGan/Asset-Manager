import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleProvider } from '@/contexts/locale-context';
import { ChecksumRow } from '@/components/checksum/ChecksumRow';
import { ChecksumWorkbench } from '@/components/checksum/ChecksumWorkbench';
import { ChecksumIntegrityVerifier } from '@/components/checksum/ChecksumIntegrityVerifier';
import { ALGO_METAS, getSourceDropzoneFormat } from '@/lib/checksum-logic';
import type { ChecksumWorkflow } from '@/hooks/use-checksum-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('Checksum UI Components & Design System Invariants', () => {
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

  const mockFile = new File(['content'], 'archive.iso', { type: 'application/octet-stream' });

  const mockWorkflow: ChecksumWorkflow = {
    file: mockFile,
    hashes: {
      'SHA-256': '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      'SHA-512': 'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff',
      'SHA-1': '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed',
      'MD5': '5eb63bbbe01eeed093cb22bb8f5acdc3',
      'SHA-384': 'fdbd8e75a67f29f701a4e0429a3056bc25fde78f501b97f5909c0acc649209417628630c16617934a99ac36120272196',
    },
    isProcessing: false,
    error: null,
    expectedHash: '',
    setExpectedHash: vi.fn(),
    copiedAll: false,
    matchedAlgo: null,
    isInvalidMatch: false,
    handleFileSelected: vi.fn(),
    handleReset: vi.fn(),
    handleDragOver: vi.fn(),
    handleDragLeave: vi.fn(),
    handleDrop: vi.fn(),
    handleDownloadSha256: vi.fn(),
    handleDownloadMd5: vi.fn(),
    handleDownloadReport: vi.fn(),
    handleCopyAll: vi.fn(),
  };

  it('ChecksumRow has ZERO transition-all and ZERO #FF6B35 hex codes', async () => {
    const sha256Meta = ALGO_METAS.find((a) => a.id === 'SHA-256')!;

    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(ChecksumRow, {
              isFr: true,
              algo: sha256Meta,
              value: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
              isMatched: false,
              isDimmed: false,
              isProcessing: false,
              copiedLabel: 'Copié',
            })
          )
        )
      );
    });

    const rowDiv = container.firstElementChild as HTMLElement;
    expect(rowDiv).not.toBeNull();
    expect(rowDiv.className).not.toContain('transition-all');
    expect(container.innerHTML).not.toContain('#FF6B35');
    expect(container.innerHTML).toContain('var(--accent');
  });

  it('ChecksumWorkbench export button has ZERO #FF6B35, ZERO #E85A24, and ZERO transition-all', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(ChecksumWorkbench, {
              isFr: true,
              workflow: mockWorkflow,
              copiedLabel: 'Copié',
            })
          )
        )
      );
    });

    const exportBtn = container.querySelector('[data-testid="checksum-export-btn"]');
    expect(exportBtn).not.toBeNull();
    const btnClass = exportBtn?.className ?? '';
    expect(btnClass).not.toContain('transition-all');
    expect(btnClass).not.toContain('#FF6B35');
    expect(btnClass).not.toContain('#E85A24');
    expect(btnClass).toContain('var(--accent');
  });

  it('ChecksumIntegrityVerifier renders match indicator and clear button', async () => {
    const setExpectedHash = vi.fn();
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(ChecksumIntegrityVerifier, {
            isFr: true,
            expectedHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
            setExpectedHash,
            matchedAlgo: 'SHA-256',
            isInvalidMatch: false,
          })
        )
      );
    });

    expect(container.textContent).toContain('SHA-256');
    const clearBtn = container.querySelector('button');
    expect(clearBtn).not.toBeNull();
    act(() => {
      clearBtn?.click();
    });
    expect(setExpectedHash).toHaveBeenCalledWith('');
  });

  it('getSourceDropzoneFormat uses design system token instead of #FF6B35', () => {
    const fmt = getSourceDropzoneFormat(true);
    expect(fmt.color).not.toBe('#FF6B35');
    expect(fmt.color).toContain('var(--accent');
  });
});
