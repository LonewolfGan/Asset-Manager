import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  triggerDownload,
  downloadBlob,
  downloadDataUrl,
  downloadText,
} from '@/lib/download';

describe('download utilities', () => {
  let appendChildSpy: any;
  let removeChildSpy: any;
  let clickSpy: any;

  beforeEach(() => {
    clickSpy = vi.fn();
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const el = {
        tagName: tagName.toUpperCase(),
        href: '',
        download: '',
        click: clickSpy,
      } as any;
      return el;
    });

    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any);

    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    } else {
      vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    }

    if (!window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL = vi.fn();
    } else {
      vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => {});
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('triggerDownload creates an anchor, sets attributes, clicks and removes it', () => {
    triggerDownload('https://example.com/test.png', 'test.png');

    expect(appendChildSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });

  it('downloadBlob creates an object URL, clicks download, and schedules revoke', () => {
    vi.useFakeTimers();
    const blob = new Blob(['hello'], { type: 'text/plain' });

    downloadBlob(blob, 'hello.txt');

    expect(window.URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(clickSpy).toHaveBeenCalled();

    vi.advanceTimersByTime(1500);
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    vi.useRealTimers();
  });

  it('downloadDataUrl triggers download directly without creating object URL', () => {
    downloadDataUrl('data:image/png;base64,iVBORw0KGgo...', 'image.png');

    expect(clickSpy).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
  });

  it('downloadText wraps string in a blob and initiates download', () => {
    vi.useFakeTimers();
    downloadText('Sample text', 'sample.txt');

    expect(window.URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
