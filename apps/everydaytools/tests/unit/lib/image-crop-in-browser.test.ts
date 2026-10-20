import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cropImageInBrowser, type CropRect } from '@/lib/image-crop-logic';
// TDD Tests for in-browser image crop canvas logic
describe('image-crop-logic: cropImageInBrowser (in-browser Canvas)', () => {
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
        callback(new Blob(['cropped-binary-data'], { type: mime || 'image/jpeg' }));
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
      naturalWidth = 1600;
      naturalHeight = 1200;
      width = 1600;
      height = 1200;
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

  it('recadre correctement selon les coordonnées CropRect fournies', async () => {
    const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });
    const crop: CropRect = { x: 100, y: 150, w: 400, h: 300 };

    const resultBlob = await cropImageInBrowser(file, crop, 'image/jpeg', 0.9);

    expect(resultBlob).toBeInstanceOf(Blob);
    expect(mockCanvas.width).toBe(400);
    expect(mockCanvas.height).toBe(300);
    expect(mockCtx.drawImage).toHaveBeenCalledTimes(1);
    expect(mockCtx.drawImage).toHaveBeenCalledWith(
      expect.anything(),
      100,
      150,
      400,
      300,
      0,
      0,
      400,
      300
    );
    expect(mockCanvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/jpeg',
      0.9
    );
  });

  it('conserve le type MIME d’origine si aucun format cible n’est spécifié', async () => {
    const file = new File(['img'], 'image.webp', { type: 'image/webp' });
    const crop: CropRect = { x: 0, y: 0, w: 200, h: 200 };

    await cropImageInBrowser(file, crop);

    expect(mockCanvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/webp',
      expect.anything()
    );
  });

  it('rejette si les dimensions de recadrage w ou h sont <= 0', async () => {
    const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });

    await expect(cropImageInBrowser(file, { x: 0, y: 0, w: 0, h: 100 })).rejects.toThrow();
    await expect(cropImageInBrowser(file, { x: 0, y: 0, w: 100, h: -20 })).rejects.toThrow();
    expect(mockCtx.drawImage).not.toHaveBeenCalled();
  });

  it('rejette si l’image source ne peut pas être décodée', async () => {
    const corrupt = new File(['corrupt'], 'error-trigger.jpg', { type: 'image/jpeg' });
    const crop: CropRect = { x: 10, y: 10, w: 100, h: 100 };

    await expect(cropImageInBrowser(corrupt, crop)).rejects.toThrow();
  });

  it('rejette si le contexte 2D est introuvable', async () => {
    mockCanvas.getContext = vi.fn().mockReturnValue(null);
    const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });
    const crop: CropRect = { x: 0, y: 0, w: 100, h: 100 };

    await expect(cropImageInBrowser(file, crop)).rejects.toThrow();
  });

  it('révoque les URLs d’objets créées en mémoire', async () => {
    const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });
    const crop: CropRect = { x: 0, y: 0, w: 100, h: 100 };

    await cropImageInBrowser(file, crop);
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });
});
