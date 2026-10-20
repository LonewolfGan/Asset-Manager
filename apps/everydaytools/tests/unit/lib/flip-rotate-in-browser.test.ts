import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// Test unitaire pour flipRotateImageInBrowser
import { flipRotateImageInBrowser } from '@/lib/flip-rotate-logic';

describe('flipRotateImageInBrowser', () => {
  let mockCtx: {
    translate: ReturnType<typeof vi.fn>;
    rotate: ReturnType<typeof vi.fn>;
    scale: ReturnType<typeof vi.fn>;
    drawImage: ReturnType<typeof vi.fn>;
  };
  let mockCanvas: {
    width: number;
    height: number;
    getContext: ReturnType<typeof vi.fn>;
    toBlob: ReturnType<typeof vi.fn>;
  };
  let originalImage: typeof Image;
  let originalCreateElement: typeof document.createElement;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCtx = {
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      drawImage: vi.fn(),
    };

    mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn((type: string) => (type === '2d' ? (mockCtx as any) : null)),
      toBlob: vi.fn((callback: (blob: Blob | null) => void, mime: string) => {
        const dummyBlob = new Blob(['mock-binary-data'], { type: mime || 'image/png' });
        callback(dummyBlob);
      }),
    };

    originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as any;
      }
      return originalCreateElement(tagName);
    });

    originalImage = globalThis.Image;
    class MockImage {
      naturalWidth = 400;
      naturalHeight = 300;
      onload: (() => void) | null = null;
      onerror: ((err: any) => void) | null = null;
      private _src = '';

      get src() {
        return this._src;
      }
      set src(val: string) {
        this._src = val;
        queueMicrotask(() => {
          if (this._src.includes('broken-file')) {
            this.onerror?.(new Error('Load error'));
          } else {
            this.onload?.();
          }
        });
      }
    }
    globalThis.Image = MockImage as any;
  });

  afterEach(() => {
    globalThis.Image = originalImage;
    vi.restoreAllMocks();
  });

  it('génère un Blob valide PNG à 0 degré avec dimensions originales', async () => {
    const file = new File(['valid'], 'sample.png', { type: 'image/png' });
    const result = await flipRotateImageInBrowser(file, 0, false, false);

    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe('image/png');
    expect(mockCanvas.width).toBe(400);
    expect(mockCanvas.height).toBe(300);
    expect(mockCtx.translate).toHaveBeenCalledWith(200, 150);
    expect(mockCtx.rotate).toHaveBeenCalledWith(0);
    expect(mockCtx.scale).toHaveBeenCalledWith(1, 1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
  });

  it('inverse la largeur et la hauteur lors des rotations de 90° et 270°', async () => {
    const file = new File(['valid'], 'sample.png', { type: 'image/png' });

    await flipRotateImageInBrowser(file, 90, false, false);
    expect(mockCanvas.width).toBe(300);
    expect(mockCanvas.height).toBe(400);
    expect(mockCtx.rotate).toHaveBeenCalledWith(Math.PI / 2);

    await flipRotateImageInBrowser(file, 270, false, false);
    expect(mockCanvas.width).toBe(300);
    expect(mockCanvas.height).toBe(400);
    expect(mockCtx.rotate).toHaveBeenCalledWith((3 * Math.PI) / 2);
  });

  it('préserve le ratio dimensionnel lors d une rotation de 180°', async () => {
    const file = new File(['valid'], 'sample.png', { type: 'image/png' });
    await flipRotateImageInBrowser(file, 180, false, false);

    expect(mockCanvas.width).toBe(400);
    expect(mockCanvas.height).toBe(300);
    expect(mockCtx.rotate).toHaveBeenCalledWith(Math.PI);
  });

  it('normalise les angles négatifs et supérieurs à 360°', async () => {
    const file = new File(['valid'], 'sample.png', { type: 'image/png' });

    await flipRotateImageInBrowser(file, -90, false, false);
    expect(mockCanvas.width).toBe(300);
    expect(mockCanvas.height).toBe(400);

    await flipRotateImageInBrowser(file, 450, false, false);
    expect(mockCanvas.width).toBe(300);
    expect(mockCanvas.height).toBe(400);
  });

  it('applique correctement les inversions horizontales et verticales', async () => {
    const file = new File(['valid'], 'sample.png', { type: 'image/png' });

    // Flip Horizontal
    await flipRotateImageInBrowser(file, 0, true, false);
    expect(mockCtx.scale).toHaveBeenCalledWith(-1, 1);

    // Flip Vertical
    await flipRotateImageInBrowser(file, 0, false, true);
    expect(mockCtx.scale).toHaveBeenCalledWith(1, -1);

    // Double Flip
    await flipRotateImageInBrowser(file, 0, true, true);
    expect(mockCtx.scale).toHaveBeenCalledWith(-1, -1);
  });

  it('supporte les types MIME variés et le paramètre qualité', async () => {
    const file = new File(['valid'], 'sample.jpg', { type: 'image/jpeg' });

    await flipRotateImageInBrowser(file, 0, false, false, 'image/jpeg', 0.85);
    expect(mockCanvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg', 0.85);

    await flipRotateImageInBrowser(file, 0, false, false, 'image/webp', 0.9);
    expect(mockCanvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/webp', 0.9);
  });

  it('rejette et libère l URL d objet si le chargement de l image échoue', async () => {
    const brokenFile = new File(['broken'], 'broken-file.png', { type: 'image/png' });

    await expect(flipRotateImageInBrowser(brokenFile, 0, false, false)).rejects.toThrow();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
  });

  it('rejette et libère l URL d objet si le contexte canvas 2D est indisponible', async () => {
    mockCanvas.getContext.mockReturnValue(null);
    const file = new File(['valid'], 'sample.png', { type: 'image/png' });

    await expect(flipRotateImageInBrowser(file, 0, false, false)).rejects.toThrow();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
  });

  it('rejette si toBlob renvoie null', async () => {
    mockCanvas.toBlob.mockImplementation((cb: (blob: Blob | null) => void) => cb(null));
    const file = new File(['valid'], 'sample.png', { type: 'image/png' });

    await expect(flipRotateImageInBrowser(file, 0, false, false)).rejects.toThrow();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
  });
});
