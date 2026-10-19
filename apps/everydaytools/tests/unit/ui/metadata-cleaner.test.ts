import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import MetadataCleaner from '@/pages/metadata-cleaner';

vi.mock('wouter', () => ({
  useLocation: () => ['/metadata-cleaner', vi.fn()],
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
          privacy: 'Privacy',
        },
      },
      tools: {
        'metadata-cleaner': {
          title: 'Metadata Cleaner',
          description: 'Purge hidden EXIF, GPS, and metadata from your documents and photos.',
        },
      },
      common: {
        copied: 'Copied',
      },
    },
    isFr: false,
    locale: 'en',
  }),
}));

describe('MetadataCleaner Page (Tool 56 TDD RED Phase)', () => {
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

  it('renders page layout with proper title, breadcrumbs and canonical dropzone', async () => {
    await act(async () => {
      root.render(React.createElement(MetadataCleaner));
    });

    const h1 = container.querySelector('h1');
    expect(h1?.textContent).toBe('Metadata Cleaner');
    expect(lastToolPageLayoutProps?.seoSlug).toBe('metadata-cleaner');

    // Scene 1: Dropzone is present by default
    const dropzone = container.querySelector('[data-testid="dropzone"], [role="presentation"], input[type="file"]');
    expect(dropzone).not.toBeNull();
  });

  it('contains zero transition-all in rendered dropzone scene', async () => {
    await act(async () => {
      root.render(React.createElement(MetadataCleaner));
    });

    expect(container.innerHTML).not.toContain('transition-all');
  });
});
