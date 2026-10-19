import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ConversionConduit } from '@/components/conversion/ConversionConduit';
import type { ConversionFormat } from '@/components/conversion/types';

describe('ConversionConduit Component (Synchronized Central Hub & Continuous Fluid Wave)', () => {
  const mockSource: ConversionFormat = {
    id: 'pdf',
    name: 'PDF',
    extension: '.pdf',
    icon: '/icons/pdf.svg',
    color: '#E53E3E',
  };

  const mockTarget: ConversionFormat = {
    id: 'docx',
    name: 'Word',
    extension: '.docx',
    icon: '/icons/word.svg',
    color: '#2B579A',
  };

  it('renders cards and conduit in a dedicated row with identical height for perfect vertical centering', () => {
    const html = renderToString(
      React.createElement(ConversionConduit, {
        sourceFormat: mockSource,
        targetFormat: mockTarget,
        fileName: 'contract_final.pdf',
        statusLabel: 'Conversion en cours...',
      })
    );

    // Cards and conduit must share a dedicated row matching card height (h-32 sm:h-40)
    expect(html).toContain('data-testid="cards-conduit-row"');
    expect(html).toContain('data-testid="format-labels-row"');
    expect(html).toMatch(/h-32 sm:h-40/);
    expect(html).toContain('contract_final.pdf');
    expect(html).toContain('Conversion en cours...');
  });

  it('renders multi-wire synchronized harness with source coloration on left and target on right', () => {
    const html = renderToString(
      React.createElement(ConversionConduit, {
        sourceFormat: mockSource,
        targetFormat: mockTarget,
        statusLabel: 'Conversion en cours...',
      })
    );

    // Checks for multi-wire synchronized streamline
    expect(html).toContain('data-testid="flux-streamline"');
    expect(html).toContain('data-testid="left-wire-bundle"');
    expect(html).toContain('data-testid="right-wire-bundle"');

    // Must have at least 5 wires per bundle (10 wires total)
    const leftWireCount = (html.match(/data-testid="left-wire-/g) || []).length;
    const rightWireCount = (html.match(/data-testid="right-wire-/g) || []).length;
    expect(leftWireCount).toBeGreaterThanOrEqual(5);
    expect(rightWireCount).toBeGreaterThanOrEqual(5);

    // Left uses source color, right uses target color
    expect(html).toContain('#E53E3E');
    expect(html).toContain('#2B579A');
  });

  it('renders synchronized central transformation hub with optical absolute centering', () => {
    const html = renderToString(
      React.createElement(ConversionConduit, {
        sourceFormat: mockSource,
        targetFormat: mockTarget,
        statusLabel: 'Conversion en cours...',
      })
    );

    // Central hub must have testid and explicit absolute centering
    expect(html).toContain('data-testid="central-transform-hub"');
    expect(html).toContain('left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2');
  });

  it('does NOT contain desynchronized floating translate-y pills', () => {
    const html = renderToString(
      React.createElement(ConversionConduit, {
        sourceFormat: mockSource,
        targetFormat: mockTarget,
        statusLabel: 'Conversion en cours...',
      })
    );

    expect(html).not.toContain('translate-y-4');
    expect(html).not.toContain('translate-y-6');
  });
});
