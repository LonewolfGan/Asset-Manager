import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ImageCompressWorkbench } from '@/components/image-compress/ImageCompressWorkbench';
import { ImageCompressResultView } from '@/components/image-compress/ImageCompressResultView';
import { getCompressionPresets } from '@/lib/image-compress-logic';

describe('ImageCompress Modular Components (TDD Phase RED)', () => {
  const dummyFile = {
    name: 'photo-paysage.jpg',
    size: 2048576,
  } as unknown as File;

  const dummyFormat = {
    name: 'Image',
    extension: 'jpg',
    icon: '/icons/image.svg',
    color: '#FF6B35',
    subLabel: 'JPEG, PNG, WebP, AVIF',
  };

  const presets = getCompressionPresets(true);

  it('renders ImageCompressWorkbench with file details, preset cards, and action buttons', () => {
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(ImageCompressWorkbench, {
          file: dummyFile,
          format: dummyFormat,
          presets,
          level: 'balanced',
          isFr: true,
          onLevelChange: vi.fn(),
          onReset: vi.fn(),
          onCompress: vi.fn(),
        })
      )
    );

    expect(html).toContain('photo-paysage.jpg');
    expect(html).toContain('Équilibrée');
    expect(html).toContain('-60%');
    expect(html).toContain('Compresser l&#x27;image');
  });

  it('renders ImageCompressResultView with decisive actions and metrics', () => {
    const dummyBlob = new Blob(['compressed content'], { type: 'image/jpeg' });
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(ImageCompressResultView, {
          result: {
            blob: dummyBlob,
            filename: 'photo-paysage_compressed.jpg',
            sizeBefore: 2048576,
            sizeAfter: 819430,
            gain: 60,
          },
          formatIcon: dummyFormat.icon,
          isFr: true,
          t: { imageCompress: {} },
          onReset: vi.fn(),
          onOpenNextAction: vi.fn(),
        })
      )
    );

    expect(html).toContain('photo-paysage_compressed.jpg');
    expect(html).toContain('Gain effectif');
    expect(html).toContain('-60%');
    expect(html).toContain('Télécharger l’image');
    expect(html).toContain('Compresser une autre image');
  });
});
