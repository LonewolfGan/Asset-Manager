import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resizeImageInBrowser } from '@/lib/image-resize-logic';
// TDD Tests for in-browser image resize canvas logic
describe('image-resize-logic: resizeImageInBrowser (in-browser Canvas)', () => {
  let mockCtx: {
    drawImage: ReturnType<typeof vi.fn>;
    imageSmoothingEnabled: boolean;
    imageSmoothingQuality: string;
  };
  let mockCanvas: {
    width: number;
    height: number;
    getContext: ReturnType<typeof vi.fn>;
    toBlob: ReturnType<typeof vi.fn>;
  };
  let originalCreateElement: typeof document.createElement;
  let originalImage: typeof global.Image;

  beforeEach(() => {
    mockCtx = {
      drawImage: vi.fn(),
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'low',
    };

    mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn((type: string) => (type === '2d' ? mockCtx : null)),
      toBlob: vi.fn((callback: (blob: Blob | null) => void, mime?: string) => {
        callback(new Blob(['resized-binary-data'], { type: mime || 'image/jpeg' }));
      }),
    };

    originalCreateElement = document.createElement.bind(document);
    document.createElement = vi.fn((tagName: string) => {
      if (tagName.toLowerCase() === 'canvas') {
        return mockCanvas as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    });

    originalImage = global.Image;
    global.Image = class MockImage {
      naturalWidth = 1920;
      naturalHeight = 1080;
      width = 1920;
      height = 1080;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      private _src = '';

      set src(value: string) {
        this._src = value;
        if (value.includes('error-trigger')) {
          setTimeout(() => this.onerror?.(), 0);
        } else {
          setTimeout(() => this.onload?.(), 0);
        }
      }
      get src() {
        return this._src;
      }
    } as unknown as typeof global.Image;
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
    global.Image = originalImage;
    vi.clearAllMocks();
  });

  it('redimensionne avec succès une image vers les dimensions cibles', async () => {
    const file = new File(['image-data'], 'sample.jpg', { type: 'image/jpeg' });
    const targetW = 800;
    const targetH = 600;

    const resultBlob = await resizeImageInBrowser(file, targetW, targetH, 'image/jpeg', 0.85);

    expect(resultBlob).toBeInstanceOf(Blob);
    expect(resultBlob.type).toBe('image/jpeg');
    expect(mockCanvas.width).toBe(targetW);
    expect(mockCanvas.height).toBe(targetH);
    expect(mockCtx.drawImage).toHaveBeenCalledTimes(1);
    expect(mockCtx.drawImage).toHaveBeenCalledWith(
      expect.anything(),
      0,
      0,
      targetW,
      targetH
    );
    expect(mockCanvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/jpeg',
      0.85
    );
  });

  it('active le lissage haute qualité (imageSmoothingQuality: high)', async () => {
    const file = new File(['image-data'], 'sample.png', { type: 'image/png' });

    await resizeImageInBrowser(file, 400, 300);

    expect(mockCtx.imageSmoothingEnabled).toBe(true);
    expect(mockCtx.imageSmoothingQuality).toBe('high');
  });

  it('utilise par défaut le type MIME du fichier source si non précisé', async () => {
    const file = new File(['png-data'], 'logo.png', { type: 'image/png' });

    await resizeImageInBrowser(file, 500, 500);

    expect(mockCanvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/png',
      expect.anything()
    );
  });

  it('rejette avec une erreur explicite si les dimensions sont <= 0', async () => {
    const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' });

    await expect(resizeImageInBrowser(file, 0, 500)).rejects.toThrow();
    await expect(resizeImageInBrowser(file, 500, -10)).rejects.toThrow();
    expect(mockCtx.drawImage).not.toHaveBeenCalled();
  });

  it('rejette si le décodage de l’image échoue (img.onerror)', async () => {
    const badFile = new File(['corrupt'], 'error-trigger.jpg', { type: 'image/jpeg' });

    await expect(resizeImageInBrowser(badFile, 400, 400)).rejects.toThrow();
  });

  it('rejette si le contexte 2D du canvas est indisponible', async () => {
    mockCanvas.getContext = vi.fn().mockReturnValue(null);
    const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' });

    await expect(resizeImageInBrowser(file, 400, 400)).rejects.toThrow();
  });

  it('rejette si canvas.toBlob échoue ou retourne null', async () => {
    mockCanvas.toBlob = vi.fn((cb: (blob: Blob | null) => void) => cb(null));
    const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' });

    await expect(resizeImageInBrowser(file, 400, 400)).rejects.toThrow();
  });

  it('révoque l’URL objet après exécution pour éviter les fuites mémoire', async () => {
    const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' });
    await resizeImageInBrowser(file, 400, 400);

    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });
});
