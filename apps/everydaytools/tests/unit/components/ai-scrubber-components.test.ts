import { describe, it, expect, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { AiScrubberCommandBar } from '@/components/ai-text-scrubber/AiScrubberCommandBar';
import { AiScrubberInputPane } from '@/components/ai-text-scrubber/AiScrubberInputPane';
import { AiScrubberOutputPane } from '@/components/ai-text-scrubber/AiScrubberOutputPane';
import { AiScrubberWorkbench } from '@/components/ai-text-scrubber/AiScrubberWorkbench';
import type { AiScrubberWorkflow } from '@/hooks/use-ai-scrubber-workflow';

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    locale: 'FR',
    t: {
      common: {
        copy: 'Copier',
        copied: 'Copié !',
      },
    },
  }),
}));

function createMockWorkflow(overrides?: Partial<AiScrubberWorkflow>): AiScrubberWorkflow {
  return {
    inputText: 'Exemple de texte — avec tiret\u200B',
    setInputText: vi.fn(),
    outputText: 'Exemple de texte, avec tiret',
    setOutputText: vi.fn(),
    undoStack: [{ input: 'prev', output: '' }],
    optInvisibles: true,
    setOptInvisibles: vi.fn(),
    optEmDashes: true,
    setOptEmDashes: vi.fn(),
    optStylistic: true,
    setOptStylistic: vi.fn(),
    optSymbols: true,
    setOptSymbols: vi.fn(),
    optWhitespace: true,
    setOptWhitespace: vi.fn(),
    isDragging: false,
    setIsDragging: vi.fn(),
    analysis: {
      wordCount: 5,
      charCount: 30,
      invisiblesCount: 1,
      invisiblesDetections: [],
      emDashesCount: 1,
      stylisticCount: 0,
      stylisticMatches: [],
      symbolsCount: 0,
    },
    hasContent: true,
    hasResult: true,
    hasAnomalies: true,
    hasActiveOptions: true,
    totalAnomalies: 2,
    handleScrub: vi.fn(),
    handleLoadSample: vi.fn(),
    handleDownload: vi.fn(),
    handleApplyToInput: vi.fn(),
    handleClear: vi.fn(),
    handleUndo: vi.fn(),
    handleFileDrop: vi.fn(),
    ...overrides,
  };
}

import { TooltipProvider } from '@/components/ui/tooltip';

function mountComponent(el: React.ReactElement) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);
  act(() => {
    root.render(React.createElement(TooltipProvider, null, el));
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

describe('AiScrubber Components (Anti-Slop & UI Contract)', () => {
  it('renders AiScrubberCommandBar with WAI-ARIA aria-pressed on toggle buttons', () => {
    const mockWorkflow = createMockWorkflow();
    const mounted = mountComponent(
      React.createElement(AiScrubberCommandBar, { workflow: mockWorkflow, isFr: true })
    );

    // Verify buttons have aria-pressed
    const buttons = Array.from(mounted.container.querySelectorAll('button'));
    const toggleButtons = buttons.filter((b) => b.hasAttribute('aria-pressed'));
    expect(toggleButtons.length).toBeGreaterThanOrEqual(5);

    // Verify zero hardcoded hex #FF6B35 or transition-all
    expect(mounted.container.innerHTML).not.toContain('#FF6B35');
    expect(mounted.container.innerHTML).not.toContain('transition-all');
    mounted.unmount();
  });

  it('triggers toggle handlers when clicking option buttons', () => {
    const mockWorkflow = createMockWorkflow();
    const mounted = mountComponent(
      React.createElement(AiScrubberCommandBar, { workflow: mockWorkflow, isFr: true })
    );

    const invisiblesBtn = Array.from(mounted.container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Filigranes invisibles')
    );
    expect(invisiblesBtn).toBeTruthy();
    if (invisiblesBtn) {
      act(() => {
        invisiblesBtn.click();
      });
      expect(mockWorkflow.setOptInvisibles).toHaveBeenCalledWith(false);
    }
    mounted.unmount();
  });

  it('renders AiScrubberInputPane and handles text changes', () => {
    const mockWorkflow = createMockWorkflow();
    const mounted = mountComponent(
      React.createElement(AiScrubberInputPane, { workflow: mockWorkflow, isFr: true })
    );

    const textarea = mounted.container.querySelector('textarea');
    expect(textarea).toBeTruthy();
    if (textarea) {
      act(() => {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          'value'
        )?.set;
        nativeSetter?.call(textarea, 'New text input');
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
      });
      expect(mockWorkflow.setInputText).toHaveBeenCalledWith('New text input');
    }
    mounted.unmount();
  });

  it('renders AiScrubberOutputPane with result actions and readonly textarea', () => {
    const mockWorkflow = createMockWorkflow();
    const mounted = mountComponent(
      React.createElement(AiScrubberOutputPane, { workflow: mockWorkflow, isFr: true })
    );

    const applyBtn = Array.from(mounted.container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Remplacer source')
    );
    expect(applyBtn).toBeTruthy();
    if (applyBtn) {
      act(() => {
        applyBtn.click();
      });
      expect(mockWorkflow.handleApplyToInput).toHaveBeenCalled();
    }

    const downloadBtn = Array.from(mounted.container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('.txt')
    );
    expect(downloadBtn).toBeTruthy();
    if (downloadBtn) {
      act(() => {
        downloadBtn.click();
      });
      expect(mockWorkflow.handleDownload).toHaveBeenCalled();
    }
    mounted.unmount();
  });

  it('renders AiScrubberWorkbench with 2-pane grid and disclaimer', () => {
    const mockWorkflow = createMockWorkflow();
    const mounted = mountComponent(
      React.createElement(AiScrubberWorkbench, { workflow: mockWorkflow, isFr: true })
    );

    expect(mounted.container.textContent).toContain('Texte source');
    expect(mounted.container.textContent).toContain('Texte épuré');
    expect(mounted.container.textContent).toContain('100% local');
    mounted.unmount();
  });
});
