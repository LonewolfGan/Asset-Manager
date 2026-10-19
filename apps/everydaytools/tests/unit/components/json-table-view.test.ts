import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { JsonTableView } from '@/components/json-formatter/JsonTableView';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('JsonTableView Component (TDD)', () => {
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

  it('renders a table for array data and extracts unique columns', async () => {
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, email: 'bob@example.com' },
    ];

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(JsonTableView, { data, isFr: true })
        )
      );
    });

    const headers = Array.from(container.querySelectorAll('th')).map((th) => th.textContent?.trim());
    expect(headers).toContain('id');
    expect(headers).toContain('name');
    expect(headers).toContain('email');

    const cells = Array.from(container.querySelectorAll('td')).map((td) => td.textContent?.trim());
    expect(cells).toContain('Alice');
    expect(cells).toContain('bob@example.com');
  });

  it('renders an empty notice if data is not an array', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(JsonTableView, { data: { foo: 'bar' }, isFr: true })
        )
      );
    });

    expect(container.textContent).toContain("Les données ne sont pas un tableau d'objets");
  });
});
