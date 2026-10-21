import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import PdfToExcel from '@/pages/pdf-to-excel';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('wouter', () => ({
  useLocation: () => ['/pdf-to-excel', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'PDF to Excel');
  },
}));

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    t: {
      nav: {
        breadcrumb: {
          home: 'Home',
          pdf: 'PDF',
        },
      },
      tools: {
        'pdf-to-excel': {
          title: 'PDF to Excel',
          description: 'Extract tabular data and spreadsheets from your PDF into editable Excel sheets.',
        },
      },
      pdfToExcel: {
        convertBtn: 'Convert to Excel (XLSX)',
        converting: 'Extracting tabular data...',
        convertAnother: 'Convert another document',
        downloadXlsx: 'Download Excel workbook',
        error: 'Extraction failed',
      },
    },
    isFr: false,
    locale: 'en',
  }),
}));

describe('PdfToExcel Page UI & Workflow (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    lastTitleProps = null;
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

  it('renders Scene 1 (Dropzone) on initial idle state', async () => {
    await act(async () => {
      root.render(React.createElement(PdfToExcel));
    });

    const dropzone = container.querySelector('[role="region"]') || container.querySelector('button');
    expect(dropzone).toBeTruthy();
    expect(lastTitleProps).toBeTruthy();
    expect(lastTitleProps.currentSlug).toBe('pdf-to-excel');
  });
});
