import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  ActionTooltip,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

if (typeof globalThis.ResizeObserver === 'undefined') {
  (globalThis as any).ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

describe('Tooltip and Popover Arrow & Spacing (TDD RED Phase)', () => {
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
    // Clean up any Radix portals
    document.querySelectorAll('[data-radix-popper-content-wrapper]').forEach((el) => el.remove());
  });

  it('renders TooltipContent with generous sideOffset and an arrow element', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(
            Tooltip,
            { open: true },
            React.createElement(TooltipTrigger, null, 'Trigger'),
            React.createElement(TooltipContent, { 'data-testid': 'tooltip-content' }, 'Tooltip text')
          )
        )
      );
    });

    const content = document.querySelector('[data-testid="tooltip-content"]');
    expect(content).not.toBeNull();

    // Check that an arrow SVG element is rendered inside the content
    const arrow = content?.querySelector('svg');
    expect(arrow).not.toBeNull();

    // Check that overflow-hidden is NOT present to prevent clipping the arrow
    expect(content?.className).not.toContain('overflow-hidden');
  });

  it('renders ActionTooltip with generous spacing and arrow', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(
            ActionTooltip,
            { label: 'Help text', open: true },
            React.createElement('button', null, 'Hover me')
          )
        )
      );
    });

    const content = document.body.querySelector('[role="tooltip"]');
    expect(content).not.toBeNull();

    const arrow = content?.querySelector('svg');
    expect(arrow).not.toBeNull();
  });

  it('renders PopoverContent with generous sideOffset and an arrow element', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          Popover,
          { open: true },
          React.createElement(PopoverTrigger, null, 'Open'),
          React.createElement(PopoverContent, { 'data-testid': 'popover-content' }, 'Popover details')
        )
      );
    });

    const content = document.querySelector('[data-testid="popover-content"]');
    expect(content).not.toBeNull();

    const arrow = content?.querySelector('svg');
    expect(arrow).not.toBeNull();
  });
});
