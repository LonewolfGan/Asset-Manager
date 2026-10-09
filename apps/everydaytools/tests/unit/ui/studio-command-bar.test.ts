import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { StudioCommandBar } from '@workspace/ui';

describe('StudioCommandBar (TDD RED Phase)', () => {
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
      root.render(React.createElement(StudioCommandBar, props));
    });
  };

  it('renders file name, formatted size, and dimensions in metadata section', async () => {
    await renderComponent({
      meta: {
        name: 'document-test.pdf',
        size: 2048576, // ~1.95 MB
        dimensions: { width: 1920, height: 1080 },
      },
      onReset: vi.fn(),
      primaryAction: {
        label: 'Télécharger',
        onClick: vi.fn(),
      },
    });

    expect(container.textContent).toContain('document-test.pdf');
    expect(container.textContent).toContain('1.95 Mo');
    expect(container.textContent).toContain('(1920×1080)');
  });

  it('triggers onReset callback when the return button is clicked', async () => {
    const handleReset = vi.fn();
    await renderComponent({
      meta: {
        name: 'photo.jpg',
        size: 500000,
      },
      onReset: handleReset,
      resetLabel: 'Changer d\'image',
      primaryAction: {
        label: 'Sauvegarder',
        onClick: vi.fn(),
      },
    });

    const resetButton = container.querySelector('button[data-testid="studio-reset-btn"]') as HTMLButtonElement;
    expect(resetButton).not.toBeNull();

    act(() => {
      resetButton.click();
    });

    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('shows undo button only when isModified is true and triggers onResetChanges', async () => {
    const handleResetChanges = vi.fn();
    await renderComponent({
      meta: { name: 'canvas.png', size: 1000 },
      isModified: false,
      onReset: vi.fn(),
      primaryAction: { label: 'Exporter', onClick: vi.fn() },
    });

    expect(container.querySelector('[data-testid="studio-undo-btn"]')).toBeNull();

    await renderComponent({
      meta: { name: 'canvas.png', size: 1000 },
      isModified: true,
      onResetChanges: handleResetChanges,
      onReset: vi.fn(),
      primaryAction: { label: 'Exporter', onClick: vi.fn() },
    });

    const undoBtn = container.querySelector('button[data-testid="studio-undo-btn"]') as HTMLButtonElement;
    expect(undoBtn).not.toBeNull();

    act(() => {
      undoBtn.click();
    });

    expect(handleResetChanges).toHaveBeenCalledTimes(1);
  });

  it('disables primary action and displays loading state when isLoading is true', async () => {
    const handleClick = vi.fn();
    await renderComponent({
      meta: { name: 'image.png', size: 500 },
      onReset: vi.fn(),
      primaryAction: {
        label: 'Traiter',
        loadingLabel: 'Traitement en cours...',
        isLoading: true,
        onClick: handleClick,
      },
    });

    const primaryBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(primaryBtn).not.toBeNull();
    expect(primaryBtn.disabled).toBe(true);
    expect(container.textContent).toContain('Traitement en cours...');

    act(() => {
      primaryBtn.click();
    });

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders center controls without card wrapper or box-slop', async () => {
    await renderComponent({
      meta: { name: 'icon.svg', size: 250 },
      onReset: vi.fn(),
      centerControls: React.createElement('div', { 'data-testid': 'custom-center-controls' }, 'Rotations: 90°'),
      primaryAction: {
        label: 'Terminer',
        onClick: vi.fn(),
      },
    });

    const controls = container.querySelector('[data-testid="custom-center-controls"]');
    expect(controls).not.toBeNull();
    expect(controls?.textContent).toBe('Rotations: 90°');
  });

  it('renders return button completely flat without box container border or background', async () => {
    await renderComponent({
      meta: { name: 'photo.jpg', size: 500000 },
      onReset: vi.fn(),
      primaryAction: { label: 'Save', onClick: vi.fn() },
    });

    const resetButton = container.querySelector('button[data-testid="studio-reset-btn"]') as HTMLButtonElement;
    expect(resetButton).not.toBeNull();
    expect(resetButton.className).not.toContain('border');
    expect(resetButton.className).not.toContain('bg-zinc-100');
  });
});
