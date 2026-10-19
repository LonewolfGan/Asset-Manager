import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { RemoverStudioViewport } from '@/components/background-remover/RemoverStudioViewport';
import { FiltersViewport } from '@/components/image-filters/FiltersViewport';
import { ImageUpscaleResultView } from '@/components/image-upscale/ImageUpscaleResultView';
import type { QueueItem } from '@/lib/background-remover-logic';

describe('CompareReveal - Harmonization of Before/After labels', () => {
  describe('RemoverStudioViewport', () => {
    const dummyItem: QueueItem = {
      id: 'test-1',
      file: new File([''], 'photo.png', { type: 'image/png' }),
      previewUrl: 'blob:preview-url',
      resultUrl: 'blob:result-url',
      status: 'done',
    };

    it('renders "Avant" and "Après" labels in French mode', () => {
      const html = renderToString(
        React.createElement(RemoverStudioViewport, {
          item: dummyItem,
          viewMode: 'split',
          stageBackgroundStyle: {},
          onRetry: vi.fn(),
          isFr: true,
        })
      );

      expect(html).toContain('Avant');
      expect(html).toContain('Après');
      expect(html).not.toContain('Détouré');
    });

    it('renders "Before" and "After" labels in English mode', () => {
      const html = renderToString(
        React.createElement(RemoverStudioViewport, {
          item: dummyItem,
          viewMode: 'split',
          stageBackgroundStyle: {},
          onRetry: vi.fn(),
          isFr: false,
        })
      );

      expect(html).toContain('Before');
      expect(html).toContain('After');
      expect(html).not.toContain('Cutout');
    });
  });

  describe('FiltersViewport', () => {
    it('renders "Avant" and "Après" labels in French mode', () => {
      const html = renderToString(
        React.createElement(FiltersViewport, {
          previewUrl: 'blob:preview-filter',
          cssFilterString: 'grayscale(1)',
          viewMode: 'split',
          isHoldingOriginal: false,
          setIsHoldingOriginal: vi.fn(),
          error: null,
          isFr: true,
        })
      );

      expect(html).toContain('Avant');
      expect(html).toContain('Après');
      expect(html).not.toContain('Étalonné');
    });

    it('renders "Before" and "After" labels in English mode', () => {
      const html = renderToString(
        React.createElement(FiltersViewport, {
          previewUrl: 'blob:preview-filter',
          cssFilterString: 'grayscale(1)',
          viewMode: 'split',
          isHoldingOriginal: false,
          setIsHoldingOriginal: vi.fn(),
          error: null,
          isFr: false,
        })
      );

      expect(html).toContain('Before');
      expect(html).toContain('After');
      expect(html).not.toContain('Graded');
    });
  });

  describe('ImageUpscaleResultView', () => {
    it('renders standard "Avant" and "Après" without embedded scale tags in French mode', () => {
      const html = renderToString(
        React.createElement(ImageUpscaleResultView, {
          viewMode: 'split',
          previewUrl: 'blob:preview-upscale',
          resultUrl: 'blob:result-upscale',
          origDims: { w: 100, h: 100 },
          targetDims: { width: 200, height: 200 },
          scale: 2,
          isFr: true,
        })
      );

      expect(html).toContain('Avant');
      expect(html).toContain('Après');
      expect(html).not.toContain('Après (2x)');
    });

    it('renders standard "Before" and "After" without embedded scale tags in English mode', () => {
      const html = renderToString(
        React.createElement(ImageUpscaleResultView, {
          viewMode: 'split',
          previewUrl: 'blob:preview-upscale',
          resultUrl: 'blob:result-upscale',
          origDims: { w: 100, h: 100 },
          targetDims: { width: 200, height: 200 },
          scale: 2,
          isFr: false,
        })
      );

      expect(html).toContain('Before');
      expect(html).toContain('After');
      expect(html).not.toContain('After (2x)');
    });
  });
});
