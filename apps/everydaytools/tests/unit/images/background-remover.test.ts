import { describe, it, expect } from 'vitest';
import {
  COLOR_PRESETS,
  getOutputFilename,
} from '../../../src/lib/background-remover-logic';

describe('background-remover-logic', () => {
  it('defines comprehensive color presets including neutral, pastel and vibrant gradients', () => {
    expect(COLOR_PRESETS.length).toBeGreaterThanOrEqual(8);
    expect(COLOR_PRESETS.some((p) => p.id === 'white')).toBe(true);
    expect(COLOR_PRESETS.some((p) => p.type === 'gradient')).toBe(true);
  });

  it('generates appropriate output filenames according to background mode', () => {
    expect(getOutputFilename('portrait.jpg', 'transparent')).toBe('portrait_nobg.png');
    expect(getOutputFilename('product.png', 'color')).toBe('product_colored.png');
    expect(getOutputFilename('avatar.webp', 'gradient')).toBe('avatar_gradient.png');
    expect(getOutputFilename('photo.jpeg', 'blur')).toBe('photo_portrait_blur.png');
  });

  it('computes correct stage background style according to backdrop type and view mode', async () => {
    const { getStageBackgroundStyle } = await import('../../../src/lib/background-remover-logic');
    // Original viewMode always returns neutral background
    expect(getStageBackgroundStyle('original', 'transparent', '#ffffff', null)).toEqual({
      backgroundColor: '#f8f9fa',
    });

    // White backdrop
    expect(getStageBackgroundStyle('cutout', 'white', '#ffffff', null)).toEqual({
      backgroundColor: '#ffffff',
    });

    // Dark backdrop
    expect(getStageBackgroundStyle('cutout', 'dark', '#ffffff', null)).toEqual({
      backgroundColor: '#18181b',
    });

    // Custom color
    expect(getStageBackgroundStyle('cutout', 'custom', '#2563eb', null)).toEqual({
      backgroundColor: '#2563eb',
    });

    // Image background
    expect(getStageBackgroundStyle('cutout', 'image', '#ffffff', 'blob:http://localhost/custom')).toEqual({
      backgroundImage: 'url(blob:http://localhost/custom)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    });

    // Transparent checkerboard
    const transparentStyle = getStageBackgroundStyle('cutout', 'transparent', '#ffffff', null);
    expect(transparentStyle.backgroundImage).toContain('repeating-conic-gradient');
  });
});
