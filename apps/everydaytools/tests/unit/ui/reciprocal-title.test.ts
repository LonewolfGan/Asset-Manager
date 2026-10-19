import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ReciprocalTitle } from '@/components/conversion/ReciprocalTitle';
import * as fileHandoff from '@/lib/file-handoff';

const mockNavigate = vi.fn();

vi.mock('wouter', () => ({
  useLocation: () => ['/tool/csv-to-json', mockNavigate],
}));

describe('ReciprocalTitle Component (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.clearAllMocks();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('renders source and target labels with a tactile swap button in between', async () => {
    await act(async () => {
      root.render(
        React.createElement(ReciprocalTitle, {
          currentSlug: 'csv-to-json',
          isFr: false,
        })
      );
    });

    expect(container.textContent).toContain('CSV');
    expect(container.textContent).toContain('JSON');
    const swapBtn = container.querySelector('button');
    expect(swapBtn).not.toBeNull();
    expect(swapBtn?.getAttribute('aria-label')).toBe('Swap: JSON to CSV');
  });

  it('renders French labels and accessible ActionTooltip without native title attribute when isFr is true', async () => {
    await act(async () => {
      root.render(
        React.createElement(ReciprocalTitle, {
          currentSlug: 'word-to-text',
          isFr: true,
        })
      );
    });

    expect(container.textContent).toContain('Word');
    expect(container.textContent).toContain('Texte');
    const swapBtn = container.querySelector('button');
    expect(swapBtn).not.toBeNull();
    // Must NOT have native browser title attribute (which displays clunky native tooltips)
    expect(swapBtn?.getAttribute('title')).toBeNull();
    // Must have accessible aria-label for assistive tech
    expect(swapBtn?.getAttribute('aria-label')).toBe('Inverser : Texte en Word');
  });

  it('stages file and text into memory handoff and invokes onSwap when clicked', async () => {
    const setFileSpy = vi.spyOn(fileHandoff, 'setHandoffFile');
    const setTextSpy = vi.spyOn(fileHandoff, 'setHandoffText');
    const onSwapMock = vi.fn();

    const fakeFile = new File(['col1,col2\n1,2'], 'data.csv', { type: 'text/csv' });
    const fakeText = 'col1,col2\n1,2';

    await act(async () => {
      root.render(
        React.createElement(ReciprocalTitle, {
          currentSlug: 'csv-to-json',
          isFr: false,
          getCurrentFile: () => fakeFile,
          getCurrentText: () => fakeText,
          onSwap: onSwapMock,
        })
      );
    });

    const swapBtn = container.querySelector('button');
    expect(swapBtn).not.toBeNull();

    await act(async () => {
      swapBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(setFileSpy).toHaveBeenCalledWith(fakeFile, 'data.csv');
    expect(setTextSpy).toHaveBeenCalledWith(fakeText);
    expect(onSwapMock).toHaveBeenCalledWith('json-to-csv');
    expect(mockNavigate).toHaveBeenCalledWith('/json-to-csv');
  });

  it('renders fallback plain title when slug has no reciprocal mirror', async () => {
    await act(async () => {
      root.render(
        React.createElement(ReciprocalTitle, {
          currentSlug: 'non-existent-tool',
          isFr: false,
          fallbackTitle: 'Custom Tool Title',
        })
      );
    });

    expect(container.textContent).toContain('Custom Tool Title');
    expect(container.querySelector('button')).toBeNull();
  });
});
