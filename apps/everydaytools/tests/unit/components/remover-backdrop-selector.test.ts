import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TooltipProvider } from '@/components/ui/tooltip';
import { RemoverBackdropSelector } from '@/components/background-remover/RemoverBackdropSelector';

describe('RemoverBackdropSelector (TDD)', () => {
  it('renders Transparent button with single clean border and NO double border ring-offset', () => {
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(RemoverBackdropSelector, {
          backdropType: 'transparent',
          onBackdropTypeChange: vi.fn(),
          customColor: '',
          onCustomColorChange: vi.fn(),
          customBgUrl: null,
          customBgInputRef: { current: null },
          onCustomBgChange: vi.fn(),
          isFr: true,
        })
      )
    );

    expect(html).toContain('aria-label="Fond transparent sans arrière-plan"');
    expect(html).toContain('aria-pressed="true"');
    // Must NOT have double border ring-offset
    expect(html).not.toContain('ring-offset');
    expect(html).not.toContain('ring-2');

    // Must NOT contain external color presets in front of ColorPickerField
    expect(html).not.toContain('aria-label="Fond blanc pur"');
    expect(html).not.toContain('aria-label="Fond noir studio profond"');
    expect(html).not.toContain('aria-label="Fond gris clair catalogue"');

    // Must contain canonical ColorPickerField
    expect(html).toContain('data-testid="color-picker-trigger"');
    expect(html).toContain('Couleur');
  });

  it('renders Image backdrop button with single clean border and NO ring-offset when active', () => {
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(RemoverBackdropSelector, {
          backdropType: 'image',
          onBackdropTypeChange: vi.fn(),
          customColor: '',
          onCustomColorChange: vi.fn(),
          customBgUrl: 'blob:http://localhost/test',
          customBgInputRef: { current: null },
          onCustomBgChange: vi.fn(),
          isFr: true,
        })
      )
    );

    expect(html).toContain('aria-label="Activer l&#x27;image de fond importée"');
    expect(html).toContain('aria-pressed="true"');
    // Must NOT have double border ring-offset or ring-2
    expect(html).not.toContain('ring-offset');
    expect(html).not.toContain('ring-2');
  });

  it('renders Custom Color as active with single clean border and NO double ring', () => {
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(RemoverBackdropSelector, {
          backdropType: 'custom',
          onBackdropTypeChange: vi.fn(),
          customColor: '#FF6B35',
          onCustomColorChange: vi.fn(),
          customBgUrl: null,
          customBgInputRef: { current: null },
          onCustomBgChange: vi.fn(),
          isFr: true,
        })
      )
    );

    expect(html).toContain('data-testid="color-picker-trigger"');
    // Must NOT have double border ring-offset or ring-2 when custom color is active
    expect(html).not.toContain('ring-offset');
    expect(html).not.toContain('ring-2');
  });

  it('renders Image backdrop button when no image uploaded yet with clean border and NO ring-offset', () => {
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(RemoverBackdropSelector, {
          backdropType: 'transparent',
          onBackdropTypeChange: vi.fn(),
          customColor: '',
          onCustomColorChange: vi.fn(),
          customBgUrl: null,
          customBgInputRef: { current: null },
          onCustomBgChange: vi.fn(),
          isFr: true,
        })
      )
    );

    expect(html).toContain('Image de fond');
    expect(html).not.toContain('ring-offset');
    expect(html).not.toContain('ring-2');
  });
});
