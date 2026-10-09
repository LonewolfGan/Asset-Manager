import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { MetadataViewerGrid } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('MetadataViewerGrid (TDD RED Phase)', () => {
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

  const renderComponent = async (props: any) => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(MetadataViewerGrid, props)
        )
      );
    });
  };

  it('renders key-value metadata entries', async () => {
    const data = {
      Camera: 'Sony A7 IV',
      ISO: 400,
      Aperture: 'f/2.8',
    };

    await renderComponent({
      data,
      isFr: true,
      label: 'Métadonnées EXIF',
    });

    const rows = container.querySelectorAll('[data-testid="metadata-item"]');
    expect(rows.length).toBe(3);
    expect(container.textContent).toContain('Sony A7 IV');
    expect(container.textContent).toContain('f/2.8');
  });

  it('filters metadata entries when typing in search input', async () => {
    const data = {
      Camera: 'Sony A7 IV',
      ISO: 400,
      GPSLatitude: '48.8566 N',
    };

    await renderComponent({
      data,
      allowSearch: true,
      isFr: true,
    });

    const searchInput = container.querySelector('input[data-testid="metadata-search"]') as HTMLInputElement;
    expect(searchInput).not.toBeNull();

    act(() => {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeSetter?.call(searchInput, 'gps');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const rows = container.querySelectorAll('[data-testid="metadata-item"]');
    expect(rows.length).toBe(1);
    expect(container.textContent).toContain('GPSLatitude');
  });

  it('calls onRemoveTag when remove button is clicked', async () => {
    const handleRemove = vi.fn();
    const data = {
      Author: 'John Doe',
      Title: 'Document 1',
    };

    await renderComponent({
      data,
      allowRemove: true,
      onRemoveTag: handleRemove,
      isFr: true,
    });

    const removeBtn = container.querySelector('button[data-testid="remove-tag-Author"]') as HTMLButtonElement;
    expect(removeBtn).not.toBeNull();

    act(() => {
      removeBtn.click();
    });

    expect(handleRemove).toHaveBeenCalledWith('Author');
  });

  it('renders list flat without card slop container borders or background', async () => {
    await renderComponent({
      data: { Camera: 'Sony' },
      isFr: true,
    });

    const listContainer = container.querySelector('[data-testid="metadata-item"]')?.parentElement;
    expect(listContainer).not.toBeNull();
    // Must NOT have card-slop classes
    expect(listContainer?.className).not.toContain('border');
    expect(listContainer?.className).not.toContain('bg-white');
  });

  it('renders search input with high-contrast text color and adequate icon padding', async () => {
    await renderComponent({
      data: { Camera: 'Sony' },
      allowSearch: true,
      isFr: true,
    });

    const searchInput = container.querySelector('input[data-testid="metadata-search"]') as HTMLInputElement;
    expect(searchInput).not.toBeNull();
    expect(searchInput.className).toContain('text-zinc-900');
    expect(searchInput.className).toContain('dark:text-zinc-100');
    expect(searchInput.className).toContain('pl-8');
  });
});
