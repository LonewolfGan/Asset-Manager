import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ProcessingAperture } from '@/components/conversion/ProcessingAperture';

describe('ProcessingAperture Component (TDD Phase RED)', () => {
  it('renders the 3 optical concentric circles and kinetic arc with formatColor', () => {
    const html = renderToString(
      React.createElement(ProcessingAperture, {
        formatIcon: '/icons/pdf.svg',
        formatColor: '#EC1C24',
        formatAlt: 'PDF',
        stageLabel: 'Découpe en cours',
        title: 'Création du document PDF',
        detail: 'Page 1 sur 12',
        progress: 45,
      })
    );

    // Checks for concentric SVGs and kinetic rotation
    expect(html).toContain('animate-[spin_16s_linear_infinite]');
    expect(html).toContain('animate-[spin_1.8s_cubic-bezier(0.4,0,0.2,1)_infinite]');
    expect(html).toContain('stroke="#EC1C24"');
    expect(html).toContain('/icons/pdf.svg');
    expect(html).toContain('Découpe en cours');
    expect(html).toContain('Création du document PDF');
    expect(html).toContain('Page 1 sur 12');
    expect(html).toContain('45%');
  });

  it('renders correctly with custom formatColor for non-PDF files', () => {
    const html = renderToString(
      React.createElement(ProcessingAperture, {
        formatIcon: '/icons/png.svg',
        formatColor: '#0066FF',
        stageLabel: 'Compression',
        title: 'Traitement en cours',
      })
    );

    expect(html).toContain('/icons/png.svg');
    expect(html).toContain('Compression');
    expect(html).toContain('Traitement en cours');
    expect(html).toContain('stroke="#0066FF"');
  });

  it('falls back automatically to #EC1C24 when formatIcon is PDF and no formatColor is specified', () => {
    const html = renderToString(
      React.createElement(ProcessingAperture, {
        formatIcon: '/icons/pdf.svg',
        stageLabel: 'Optimisation',
        title: 'Traitement PDF',
      })
    );

    expect(html).toContain('stroke="#EC1C24"');
  });
});
