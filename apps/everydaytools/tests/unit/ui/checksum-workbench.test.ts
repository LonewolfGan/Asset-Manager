import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ChecksumWorkbench } from '@/components/checksum/ChecksumWorkbench';
import type { ChecksumWorkflow } from '@/hooks/use-checksum-workflow';

import { LocaleProvider } from '@/contexts/locale-context';

describe('ChecksumWorkbench with HashAlgorithmPills (TDD RED Phase)', () => {
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

  const mockFile = new File(['hello world'], 'sample.iso', { type: 'application/octet-stream' });

  const mockWorkflow: ChecksumWorkflow = {
    file: mockFile,
    hashes: {
      'SHA-256': 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
      'SHA-512': 'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff',
      'SHA-1': '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed',
      'MD5': '5eb63bbbe01eeed093cb22bb8f5acdc3',
      'CRC-32': 'd87f7e0c',
    },
    isProcessing: false,
    error: null,
    expectedHash: '',
    setExpectedHash: vi.fn(),
    copiedAll: false,
    matchedAlgo: null,
    isInvalidMatch: false,
    handleReset: vi.fn(),
    handleDownloadSha256: vi.fn(),
    handleDownloadMd5: vi.fn(),
    handleDownloadReport: vi.fn(),
    handleCopyAll: vi.fn(),
  };

  it('renders HashAlgorithmPills inside ChecksumWorkbench', async () => {
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

    const sha256Pill = container.querySelector('button[data-algorithm="sha-256"]');
    expect(sha256Pill).not.toBeNull();
  });
});
