import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import CsvToJson from '@/pages/csv-to-json';

vi.mock('wouter', () => ({
  useLocation: () => ['/csv-to-json', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastToolPageLayoutProps: any = null;
vi.mock('@/components/ToolPageLayout', () => ({
  default: (props: any) => {
    lastToolPageLayoutProps = props;
    return React.createElement('div', { 'data-testid': 'layout' }, [
      React.createElement('h1', { key: 'title' }, props.title),
      props.children,
    ]);
  },
}));

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    t: {
      nav: {
        breadcrumb: {
          home: 'Home',
          excelSpreadsheets: 'Spreadsheets',
        },
      },
      tools: {
        'csv-to-json': {
          title: 'CSV to JSON',
          description: 'Convert CSV to JSON.',
        },
        'json-to-csv': {
          title: 'JSON to CSV',
          description: 'Convert JSON to CSV.',
        },
      },
    },
    isFr: false,
    locale: 'en',
  }),
}));

describe('CsvToJson Page Directional Titles & Dedicated SEO (TDD Phase)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    lastToolPageLayoutProps = null;
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

  it('renders directional title without double-arrow for csv-to-json and passes csv-to-json seoSlug', async () => {
    await act(async () => {
      root.render(React.createElement(CsvToJson, { toolSlug: 'csv-to-json' }));
    });
    const h1 = container.querySelector('h1');
    expect(h1?.textContent).toBe('CSV to JSON');
    expect(lastToolPageLayoutProps?.seoSlug).toBe('csv-to-json');
  });

  it('renders directional title without double-arrow for json-to-csv and passes json-to-csv seoSlug', async () => {
    await act(async () => {
      root.render(
        React.createElement(CsvToJson, { toolSlug: 'json-to-csv', initialDirection: 'json-to-csv' })
      );
    });
    const h1 = container.querySelector('h1');
    expect(h1?.textContent).toBe('JSON to CSV');
    expect(lastToolPageLayoutProps?.seoSlug).toBe('json-to-csv');
  });
});
