import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { StudioViewport } from '@workspace/ui';

describe('StudioViewport (TDD)', () => {
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
      root.render(React.createElement(StudioViewport, props));
    });
  };

  it('renders children centered inside the viewport canvas container', async () => {
    await renderComponent({
      children: React.createElement('img', { src: 'blob:test', alt: 'preview', 'data-testid': 'viewport-img' }),
    });

    const img = container.querySelector('[data-testid="viewport-img"]');
    expect(img).not.toBeNull();
    const viewport = container.querySelector('[data-testid="studio-viewport"]');
    expect(viewport).not.toBeNull();
    expect(viewport?.className).toContain('items-center');
    expect(viewport?.className).toContain('justify-center');
  });

  it('renders floating overlay slot when provided', async () => {
    await renderComponent({
      children: React.createElement('div', null, 'Canvas Content'),
      overlaySlot: React.createElement('div', { 'data-testid': 'viewport-badge' }, '1920×1080 · 90°'),
    });

    const badge = container.querySelector('[data-testid="viewport-badge"]');
    expect(badge).not.toBeNull();
    expect(badge?.textContent).toBe('1920×1080 · 90°');
  });
});
