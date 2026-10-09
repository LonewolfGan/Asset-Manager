import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StudioExportBar } from '@/components/ui/studio-export-bar';

describe('StudioExportBar Component (TDD Phase RED)', () => {
  it('renders the download button with canonical h-11 height and text', () => {
    const html = renderToString(
      React.createElement(StudioExportBar, {
        onDownload: () => {},
        downloadLabel: "Télécharger l'image",
      })
    );

    expect(html).toContain('Télécharger l&#x27;image');
    expect(html).toContain('h-11');
  });

  it('renders format selector when formats are provided', () => {
    const html = renderToString(
      React.createElement(StudioExportBar, {
        formats: [
          { id: 'png', label: 'PNG' },
          { id: 'jpg', label: 'JPG' },
        ],
        selectedFormat: 'png',
        onFormatChange: () => {},
        onDownload: () => {},
        downloadLabel: 'Exporter',
      })
    );

    expect(html).toContain('PNG');
    expect(html).toContain('JPG');
  });

  it('displays loading state when isDownloading is true', () => {
    const html = renderToString(
      React.createElement(StudioExportBar, {
        onDownload: () => {},
        downloadLabel: 'Télécharger',
        isDownloading: true,
      })
    );

    expect(html).toContain('animate-spin');
  });
});
