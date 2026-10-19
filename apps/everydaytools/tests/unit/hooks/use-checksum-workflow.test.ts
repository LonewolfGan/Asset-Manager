import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useChecksumWorkflow, ChecksumWorkflow } from '@/hooks/use-checksum-workflow';
import { LocaleProvider } from '@/contexts/locale-context';
import * as checksumLogic from '@/lib/checksum-logic';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
  trackToolError: vi.fn(),
}));

let mockHandoffFile: File | null = null;
let mockHandoffText: string | null = null;

vi.mock('@/lib/file-handoff', () => ({
  consumeHandoffFile: () => {
    const file = mockHandoffFile;
    mockHandoffFile = null;
    return file;
  },
  consumeHandoffText: () => {
    const text = mockHandoffText;
    mockHandoffText = null;
    return text;
  },
}));

describe('useChecksumWorkflow (TDD RED Phase)', () => {
  let container: HTMLDivElement;
  let root: Root;
  let hookValue: ChecksumWorkflow;

  const TestConsumer: React.FC<{ isFr?: boolean }> = ({ isFr = true }) => {
    hookValue = useChecksumWorkflow(isFr);
    return null;
  };

  const renderComponent = async (isFr = true) => {
    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(TestConsumer, { isFr })
        )
      );
    });
  };

  const mockFile = new File(['test content'], 'archive.zip', { type: 'application/zip' });

  beforeEach(() => {
    mockHandoffFile = null;
    mockHandoffText = null;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    vi.spyOn(checksumLogic, 'computeAllChecksums').mockResolvedValue({
      'SHA-256': '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      'SHA-512': 'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff',
      'MD5': '5eb63bbbe01eeed093cb22bb8f5acdc3',
      'SHA-1': '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed',
      'SHA-384': 'fdbd8e75a67f29f701a4e0429a3056bc25fde78f501b97f5909c0acc649209417628630c16617934a99ac36120272196',
    });
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.restoreAllMocks();
  });

  it('initializes with default empty state', async () => {
    await renderComponent();
    expect(hookValue.file).toBeNull();
    expect(hookValue.hashes).toBeNull();
    expect(hookValue.isProcessing).toBe(false);
    expect(hookValue.error).toBeNull();
    expect(hookValue.expectedHash).toBe('');
    expect(hookValue.matchedAlgo).toBeNull();
    expect(hookValue.isInvalidMatch).toBe(false);
  });

  it('computes hashes when handleFileSelected is called', async () => {
    await renderComponent();

    await act(async () => {
      hookValue.handleFileSelected(mockFile);
    });

    expect(hookValue.file).toBe(mockFile);
    expect(hookValue.hashes).not.toBeNull();
    expect(hookValue.hashes?.['SHA-256']).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
  });

  it('matches expected hash and detects algorithm', async () => {
    await renderComponent();

    await act(async () => {
      hookValue.handleFileSelected(mockFile);
    });

    act(() => {
      hookValue.setExpectedHash('9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08');
    });

    expect(hookValue.matchedAlgo).toBe('SHA-256');
    expect(hookValue.isInvalidMatch).toBe(false);

    act(() => {
      hookValue.setExpectedHash('abcdef0123456789nonexistent');
    });

    expect(hookValue.matchedAlgo).toBeNull();
    expect(hookValue.isInvalidMatch).toBe(true);
  });

  it('resets state on handleReset', async () => {
    await renderComponent();

    await act(async () => {
      hookValue.handleFileSelected(mockFile);
    });
    expect(hookValue.file).not.toBeNull();

    act(() => {
      hookValue.handleReset();
    });

    expect(hookValue.file).toBeNull();
    expect(hookValue.hashes).toBeNull();
    expect(hookValue.expectedHash).toBe('');
  });

  it('handles Escape key to reset file', async () => {
    await renderComponent();

    await act(async () => {
      hookValue.handleFileSelected(mockFile);
    });
    expect(hookValue.file).not.toBeNull();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(hookValue.file).toBeNull();
  });

  it('consumes both handoff file and text concurrently if both are present', async () => {
    mockHandoffFile = mockFile;
    mockHandoffText = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';

    await renderComponent();

    await act(async () => {
      await Promise.resolve();
    });

    expect(hookValue.file).toBe(mockFile);
    expect(hookValue.hashes).not.toBeNull();
    expect(hookValue.expectedHash).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
  });

  it('preserves existing expectedHash when handleFileSelected is called', async () => {
    await renderComponent();

    act(() => {
      hookValue.setExpectedHash('already-entered-hash-value');
    });

    await act(async () => {
      hookValue.handleFileSelected(mockFile);
    });

    expect(hookValue.expectedHash).toBe('already-entered-hash-value');
  });

  it('triggers download actions correctly', async () => {
    const downloadSpy = vi.spyOn(checksumLogic, 'downloadTextFile').mockImplementation(() => {});

    await renderComponent();
    await act(async () => {
      hookValue.handleFileSelected(mockFile);
    });

    act(() => {
      hookValue.handleDownloadSha256();
      hookValue.handleDownloadMd5();
      hookValue.handleDownloadReport();
    });

    expect(downloadSpy).toHaveBeenCalledTimes(3);
  });
});
