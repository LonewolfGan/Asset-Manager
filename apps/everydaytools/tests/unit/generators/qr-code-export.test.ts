import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportQrPng, exportQrSvg, copyQrImageToClipboard } from '@/lib/qr-code-export';

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
  trackToolError: vi.fn(),
}));

describe('QR Code Export Logic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('exports QR SVG and defers object URL revocation', () => {
    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:http://localhost/mock-svg');
    const mockRevokeObjectURL = vi.fn();
    (globalThis as any).URL.createObjectURL = mockCreateObjectURL;
    (globalThis as any).URL.revokeObjectURL = mockRevokeObjectURL;

    const mockClick = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValue({
      set download(v: string) {},
      set href(v: string) {},
      click: mockClick,
    } as any);

    exportQrSvg(
      {
        content: 'https://everydaytools.qzz.io',
        errLevel: 'H',
        size: 512,
        margin: 2,
        fgColor: '#09090b',
        bgColor: '#ffffff',
        dotStyle: 'rounded',
        eyeStyle: 'rounded',
        logoUrl: null,
        logoScale: 22,
      },
      'url'
    );

    expect(mockClick).toHaveBeenCalledTimes(1);
    expect(mockRevokeObjectURL).not.toHaveBeenCalled();

    // Fast forward 1000ms
    vi.advanceTimersByTime(1000);
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/mock-svg');
  });

  it('exports QR PNG using canvas toDataURL', () => {
    const mockClick = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValue({
      set download(v: string) {},
      set href(v: string) {},
      click: mockClick,
    } as any);

    const mockCanvas = {
      toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mockdata'),
    } as any;

    exportQrPng(mockCanvas, 'url');
    expect(mockClick).toHaveBeenCalledTimes(1);
    expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
  });

  it('rejects copy to clipboard when canvas is empty', async () => {
    const res = await copyQrImageToClipboard(null, true);
    expect(res).toBeUndefined();
  });
});
