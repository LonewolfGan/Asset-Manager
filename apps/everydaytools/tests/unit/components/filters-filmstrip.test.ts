import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { FiltersFilmstrip } from '@/components/image-filters/FiltersFilmstrip';

describe('FiltersFilmstrip (TDD - Absolute Zero Double Ring)', () => {
  it('renders selected preset card with clean single border and NO double ring ring-offset', () => {
    const html = renderToString(
      React.createElement(FiltersFilmstrip, {
        previewUrl: 'data:image/png;base64,test',
        activePresetId: 'vintage-70',
        presetIntensity: 100,
        onSelectPreset: vi.fn(),
        onIntensityChange: vi.fn(),
        filmstripRef: vi.fn(),
        scrollState: { canLeft: false, canRight: true },
        onScrollFilmstrip: vi.fn(),
        onUpdateScrollState: vi.fn(),
        isFr: true,
      })
    );

    // Absolute Zero Double-Ring: must not have ring-offset or ring-2
    expect(html).not.toContain('ring-offset');
    expect(html).not.toContain('ring-2');

    // Targeted GPU transitions (Design System Contract Rule 8)
    expect(html).not.toContain('transition-all');
    expect(html).toContain('transition-transform');
  });
});
