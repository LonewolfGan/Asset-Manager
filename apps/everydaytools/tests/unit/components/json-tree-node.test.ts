import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { JsonTreeNode } from '@/components/json-formatter/JsonTreeNode';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('JsonTreeNode Component (TDD)', () => {
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

  it('renders boolean nodes with valid dark text class dark:text-orange-400', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(JsonTreeNode, {
            data: true,
            keyName: 'isActive',
            path: 'root',
            search: '',
            expandAll: true,
            isFr: true,
          })
        )
      );
    });

    const valSpan = container.querySelector('.text-orange-600');
    expect(valSpan).not.toBeNull();
    expect(valSpan?.className).toContain('dark:text-orange-400');
    expect(valSpan?.className).not.toContain('dark:orange-400 ');
  });

  it('renders strings and numbers with appropriate styling', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(JsonTreeNode, {
            data: 42,
            keyName: 'count',
            path: 'root',
            search: '',
            expandAll: true,
            isFr: true,
          })
        )
      );
    });

    const valSpan = container.querySelector('.text-blue-600');
    expect(valSpan).not.toBeNull();
    expect(valSpan?.textContent).toBe('42');
  });
});
