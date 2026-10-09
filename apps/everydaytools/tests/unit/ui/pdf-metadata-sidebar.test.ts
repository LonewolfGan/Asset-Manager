import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PdfMetadataSidebar } from '@/components/pdf-metadata/PdfMetadataSidebar';

describe('PdfMetadataSidebar with MetadataViewerGrid (TDD RED Phase)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  const mockFile = new File(['%PDF-1.7 mock content'], 'rapport-2026.pdf', {
    type: 'application/pdf',
  });

  it('renders MetadataViewerGrid inside PdfMetadataSidebar', async () => {
    await act(async () => {
      root.render(
        React.createElement(PdfMetadataSidebar, {
          file: mockFile,
          pageCount: 12,
          creationDate: new Date('2026-01-15'),
          originalAuthor: 'Alice Dupont',
          onInferTitle: vi.fn(),
          onWipeMetadata: vi.fn(),
          isFr: true,
        })
      );
    });

    // MetadataViewerGrid renders items with data-testid="metadata-item"
    const items = container.querySelectorAll('[data-testid="metadata-item"]');
    expect(items.length).toBeGreaterThanOrEqual(4);
  });
});
