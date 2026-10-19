import { describe, it, expect, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import AiTextScrubber from '@/pages/ai-text-scrubber';

vi.mock('wouter', () => ({
  useLocation: () => ['/ai-text-scrubber', vi.fn()],
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
    locale: 'FR',
    t: {
      nav: {
        breadcrumb: {
          home: 'Accueil',
          privacy: 'Confidentialité',
        },
      },
      tools: {
        'ai-text-scrubber': {
          title: 'Purificateur de texte IA',
          description:
            'Supprimez les caractères invisibles, tirets cadratins, clichés et symboles IA.',
        },
      },
      common: {
        copied: 'Copié',
      },
      aiTextScrubber: {
        placeholder: 'Collez votre texte...',
        cleanedOutput: 'Texte épuré',
        copy: 'Copier',
        disclaimer: 'Traitement 100% local dans votre navigateur.',
      },
    },
  }),
}));

import { TooltipProvider } from '@/components/ui/tooltip';

function mountPage() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);
  act(() => {
    root.render(
      React.createElement(TooltipProvider, null, React.createElement(AiTextScrubber))
    );
  });
  return {
    container,
    unmount() {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe('AiTextScrubber Page (Tool 57 TDD RED Phase)', () => {
  it('renders page layout with proper title, breadcrumbs and workbench', () => {
    const mounted = mountPage();

    expect(mounted.container.textContent).toContain('Purificateur de texte IA');
    expect(mounted.container.textContent).toContain('Texte source');
    expect(mounted.container.textContent).toContain('Texte épuré');
    expect(lastToolPageLayoutProps.seoSlug).toBe('ai-text-scrubber');

    // Verify zero transition-all in rendered page
    expect(mounted.container.innerHTML).not.toContain('transition-all');
    // Verify zero raw hex #FF6B35
    expect(mounted.container.innerHTML).not.toContain('#FF6B35');

    mounted.unmount();
  });
});
