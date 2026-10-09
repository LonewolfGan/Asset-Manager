import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { MetadataTagsInspector } from '@/components/metadata-cleaner/MetadataTagsInspector';

describe('MetadataTagsInspector with MetadataViewerGrid (TDD RED Phase)', () => {
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

  const mockTags = [
    { key: 'Make', label: 'Appareil photo', value: 'Sony A7IV', isSensitive: false },
    { key: 'GPS', label: 'Coordonnées GPS', value: '48.8584° N, 2.2945° E', isSensitive: true },
  ];

  it('renders MetadataViewerGrid with search filter and items', async () => {
    await act(async () => {
      root.render(
        React.createElement(MetadataTagsInspector, {
          inspection: {
            totalTags: 2,
            sensitiveTagsCount: 1,
            tags: mockTags,
          },
          visibleTags: mockTags,
          activeFilter: 'all',
          isInspecting: false,
          isFr: true,
          onFilterChange: vi.fn(),
        })
      );
    });

    // MetadataViewerGrid has data-testid="metadata-search"
    const searchInput = container.querySelector('[data-testid="metadata-search"]');
    expect(searchInput).not.toBeNull();

    // MetadataViewerGrid has data-testid="metadata-item"
    const items = container.querySelectorAll('[data-testid="metadata-item"]');
    expect(items.length).toBe(2);
  });
});
