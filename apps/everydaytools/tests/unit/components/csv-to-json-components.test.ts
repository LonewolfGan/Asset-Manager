import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleProvider } from '@/contexts/locale-context';
import { CsvJsonModeSelector } from '@/components/csv-to-json/CsvJsonModeSelector';
import { CsvJsonResultActions } from '@/components/csv-to-json/CsvJsonResultActions';
import { CsvJsonPasteWorkspace } from '@/components/csv-to-json/CsvJsonPasteWorkspace';
import { getCsvFormat } from '@/lib/csv-json-conversion-logic';

describe('csv-to-json components anti-slop & WAI-ARIA (TDD RED Phase)', () => {
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

  describe('CsvJsonModeSelector', () => {
    it('renders input mode buttons with aria-pressed and no transition-all', async () => {
      await act(async () => {
        root.render(
          React.createElement(CsvJsonModeSelector, {
            direction: 'csv-to-json',
            inputMode: 'upload',
            onSetInputMode: vi.fn(),
            isFr: true,
          })
        );
      });

      const buttons = container.querySelectorAll('button');
      const uploadBtn = buttons[0];
      const pasteBtn = buttons[1];

      expect(uploadBtn.getAttribute('aria-pressed')).toBe('true');
      expect(pasteBtn.getAttribute('aria-pressed')).toBe('false');

      expect(container.innerHTML).not.toContain('transition-all');
    });
  });

  describe('CsvJsonResultActions', () => {
    it('renders preview button with targeted transitions and no transition-all', async () => {
      await act(async () => {
        root.render(
          React.createElement(
            LocaleProvider,
            null,
            React.createElement(
              TooltipProvider,
              null,
              React.createElement(CsvJsonResultActions, {
                onOpenPreview: vi.fn(),
                textOutput: '{"test": 1}',
                targetFormatName: 'JSON',
                isFr: true,
              })
            )
          )
        );
      });

      const previewBtn = container.querySelector('button');
      expect(previewBtn).not.toBeNull();
      expect(previewBtn?.className).not.toContain('transition-all');
      expect(previewBtn?.className).toContain('transition-colors');
    });
  });

  describe('CsvJsonPasteWorkspace', () => {
    it('renders submit button with targeted transitions and no transition-all', async () => {
      await act(async () => {
        root.render(
          React.createElement(
            LocaleProvider,
            null,
            React.createElement(
              TooltipProvider,
              null,
              React.createElement(CsvJsonPasteWorkspace, {
                rawText: 'a,b\n1,2',
                onTextChange: vi.fn(),
                onSubmit: vi.fn(),
                direction: 'csv-to-json',
                sourceFormat: getCsvFormat(true),
                isFr: true,
              })
            )
          )
        );
      });

      const buttons = container.querySelectorAll('button');
      const submitBtn = buttons[buttons.length - 1];
      expect(submitBtn).not.toBeNull();
      expect(submitBtn.className).not.toContain('transition-all');
      expect(submitBtn.className).toContain('transition-colors');
    });
  });
});
