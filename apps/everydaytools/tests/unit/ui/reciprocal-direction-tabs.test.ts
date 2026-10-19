import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ReciprocalDirectionTabs } from '@/components/conversion/ReciprocalDirectionTabs';
import {
  hasHandoffFile,
  consumeHandoffFile,
  hasHandoffText,
  consumeHandoffText,
} from '@/lib/file-handoff';

const mockNavigate = vi.fn();
vi.mock('wouter', () => ({
  useLocation: () => ['/csv-to-json', mockNavigate],
}));

describe('ReciprocalDirectionTabs (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    mockNavigate.mockClear();
    consumeHandoffFile();
    consumeHandoffText();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  const renderComponent = async (props: any) => {
    await act(async () => {
      root.render(React.createElement(ReciprocalDirectionTabs, props));
    });
  };

  it('renders both direction tabs with active highlight on current tool and format icons', async () => {
    await renderComponent({ currentSlug: 'csv-to-json', isFr: false });
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('CSV → JSON');
    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
    expect(buttons[0].querySelector('svg')).not.toBeNull();
    expect(buttons[1].textContent).toContain('JSON → CSV');
    expect(buttons[1].getAttribute('aria-selected')).toBe('false');
    expect(buttons[1].querySelector('svg')).not.toBeNull();
  });

  it('does nothing when clicking already active tab', async () => {
    await renderComponent({ currentSlug: 'csv-to-json', isFr: false });
    const buttons = container.querySelectorAll('button');
    await act(async () => {
      buttons[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(hasHandoffFile()).toBe(false);
  });

  it('stages file and navigates to mirror path when clicking inactive mirror tab', async () => {
    const testFile = new File(['1,2,3'], 'numbers.csv', { type: 'text/csv' });
    await renderComponent({
      currentSlug: 'csv-to-json',
      isFr: false,
      getCurrentFile: () => testFile,
    });
    const buttons = container.querySelectorAll('button');
    await act(async () => {
      buttons[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(hasHandoffFile()).toBe(true);
    const staged = consumeHandoffFile();
    expect(staged?.name).toBe('numbers.csv');
    expect(mockNavigate).toHaveBeenCalledWith('/json-to-csv');
  });

  it('stages text when clicking inactive mirror tab with text', async () => {
    await renderComponent({
      currentSlug: 'csv-to-json',
      isFr: false,
      getCurrentText: () => 'header\nval',
    });
    const buttons = container.querySelectorAll('button');
    await act(async () => {
      buttons[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(hasHandoffText()).toBe(true);
    const staged = consumeHandoffText();
    expect(staged).toBe('header\nval');
    expect(mockNavigate).toHaveBeenCalledWith('/json-to-csv');
  });

  it('returns null if no reciprocal tool exists for currentSlug', async () => {
    await renderComponent({ currentSlug: 'pdf-compress', isFr: true });
    expect(container.querySelector('button')).toBeNull();
  });
});
