import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ZoomControlGroup } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('ZoomControlGroup (TDD RED Phase)', () => {
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
          React.createElement(ZoomControlGroup, props)
        )
      );
    });
  };

  it('renders zoom controls with formatted percentage', async () => {
    await renderComponent({
      scale: 1.5,
      onZoomIn: vi.fn(),
      onZoomOut: vi.fn(),
      onResetZoom: vi.fn(),
    });

    expect(container.textContent).toContain('150%');
    expect(container.querySelector('button[data-testid="zoom-in-btn"]')).not.toBeNull();
    expect(container.querySelector('button[data-testid="zoom-out-btn"]')).not.toBeNull();
    expect(container.querySelector('button[data-testid="zoom-reset-btn"]')).not.toBeNull();
  });

  it('calls onZoomIn and onZoomOut callbacks', async () => {
    const handleZoomIn = vi.fn();
    const handleZoomOut = vi.fn();

    await renderComponent({
      scale: 1.0,
      onZoomIn: handleZoomIn,
      onZoomOut: handleZoomOut,
    });

    const zoomInBtn = container.querySelector('button[data-testid="zoom-in-btn"]') as HTMLButtonElement;
    const zoomOutBtn = container.querySelector('button[data-testid="zoom-out-btn"]') as HTMLButtonElement;

    act(() => {
      zoomInBtn.click();
      zoomOutBtn.click();
    });

    expect(handleZoomIn).toHaveBeenCalledTimes(1);
    expect(handleZoomOut).toHaveBeenCalledTimes(1);
  });

  it('disables zoom-out when scale reaches minScale', async () => {
    await renderComponent({
      scale: 0.25,
      minScale: 0.25,
      onZoomIn: vi.fn(),
      onZoomOut: vi.fn(),
    });

    const zoomOutBtn = container.querySelector('button[data-testid="zoom-out-btn"]') as HTMLButtonElement;
    expect(zoomOutBtn.disabled).toBe(true);
  });
});
