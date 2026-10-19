import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import PdfToWord from '@/pages/pdf-to-word';
import PdfToExcel from '@/pages/pdf-to-excel';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('wouter', () => ({
  useLocation: () => ['/pdf-to-word', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

vi.mock('@/components/ToolPageLayout', () => ({
  default: (props: any) =>
    React.createElement('div', { 'data-testid': 'layout' }, [
      React.createElement('h1', { key: 'title' }, props.title),
      props.children,
    ]),
}));

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    locale: 'FR',
    isFr: true,
    t: {
      nav: { breadcrumb: { home: 'Accueil', documents: 'Documents' } },
      tools: {
        'pdf-to-word': { title: 'PDF en Word', description: 'Convertir PDF en Word' },
        'pdf-to-excel': { title: 'PDF en Excel', description: 'Convertir PDF en Excel' },
      },
      pdfToWord: { error: 'Erreur conversion Word' },
      pdfToExcel: { error: 'Erreur conversion Excel' },
    },
  }),
}));

describe('PDF to Word & Excel Workflows (Zero Delay TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('PdfToWord converts without artificial delay timers (>= 1000ms)', async () => {
    const mockBlob = new Blob(['docx-bytes'], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    });
    vi.stubGlobal('fetch', fetchSpy);

    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

    await act(async () => {
      root.render(React.createElement(PdfToWord));
    });

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).not.toBeNull();

    const testFile = new File(['%PDF-1.4 sample content'], 'contract.pdf', {
      type: 'application/pdf',
    });

    await act(async () => {
      const event = new Event('change', { bubbles: true });
      Object.defineProperty(fileInput, 'files', { value: [testFile], configurable: true });
      fileInput.dispatchEvent(event);
    });

    // Find convert button
    const buttons = Array.from(container.querySelectorAll('button'));
    const convertBtn = buttons.find((b) => b.textContent?.includes('Convertir') || b.textContent?.includes('Word'));
    expect(convertBtn).toBeDefined();

    await act(async () => {
      convertBtn?.click();
    });

    // Assert that no simulated 2000ms delay timer was invoked
    const simulatedTimerCalls = setTimeoutSpy.mock.calls.filter(
      (args) => typeof args[1] === 'number' && args[1] >= 1000
    );
    expect(simulatedTimerCalls.length).toBe(0);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('PdfToExcel converts without artificial delay timers (>= 800ms)', async () => {
    const mockBlob = new Blob(['xlsx-bytes'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    });
    vi.stubGlobal('fetch', fetchSpy);

    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

    await act(async () => {
      root.render(React.createElement(PdfToExcel));
    });

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).not.toBeNull();

    const testFile = new File(['%PDF-1.4 spreadsheet table'], 'finances.pdf', {
      type: 'application/pdf',
    });

    await act(async () => {
      const event = new Event('change', { bubbles: true });
      Object.defineProperty(fileInput, 'files', { value: [testFile], configurable: true });
      fileInput.dispatchEvent(event);
    });

    // Find convert button
    const buttons = Array.from(container.querySelectorAll('button'));
    const convertBtn = buttons.find((b) => b.textContent?.includes('Convertir') || b.textContent?.includes('Excel'));
    expect(convertBtn).toBeDefined();

    await act(async () => {
      convertBtn?.click();
    });

    // Assert that no simulated 800ms delay timer was invoked
    const simulatedTimerCalls = setTimeoutSpy.mock.calls.filter(
      (args) => typeof args[1] === 'number' && args[1] >= 800
    );
    expect(simulatedTimerCalls.length).toBe(0);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
