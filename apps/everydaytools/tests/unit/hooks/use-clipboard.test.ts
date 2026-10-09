import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyToClipboard } from '@/hooks/use-clipboard';

describe('copyToClipboard utility', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns false when empty or falsy text is passed', async () => {
    const res = await copyToClipboard('');
    expect(res).toBe(false);
  });

  it('uses navigator.clipboard.writeText in secure context', async () => {
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextSpy },
      configurable: true,
    });

    const success = await copyToClipboard('Hello Clipboard');
    expect(success).toBe(true);
    expect(writeTextSpy).toHaveBeenCalledWith('Hello Clipboard');
  });

  it('falls back to execCommand when clipboard is unavailable', async () => {
    Object.defineProperty(window, 'isSecureContext', { value: false, configurable: true });
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });

    const execCommandMock = vi.fn().mockReturnValue(true);
    (document as any).execCommand = execCommandMock;
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(document.body, 'removeChild');

    const success = await copyToClipboard('Fallback Text');
    expect(success).toBe(true);
    expect(appendSpy).toHaveBeenCalled();
    expect(execCommandMock).toHaveBeenCalledWith('copy');
    expect(removeSpy).toHaveBeenCalled();
  });
});
