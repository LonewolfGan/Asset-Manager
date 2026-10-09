import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleProvider } from '@/contexts/locale-context';
import { ConversionStaging } from '@/components/conversion';
import {
  DelimiterRadioGroup,
  DataPreviewTableLite,
  EncodingSelector,
} from '@workspace/ui/controls';
import { getSourceFormat, getTargetFormat } from '@/lib/csv-to-excel-logic';

describe('CsvToExcel staging optionsSlot with @workspace/ui controls (TDD RED Phase)', () => {
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

  const sampleCsvFile = new File(
    ['col1,col2,col3\nval1,val2,val3'],
    'sample.csv',
    { type: 'text/csv' }
  );

  it('renders DelimiterRadioGroup, EncodingSelector, and DataPreviewTableLite in optionsSlot', async () => {
    const handleDelimiterChange = vi.fn();
    const handleEncodingChange = vi.fn();

    const optionsSlot = React.createElement(
      'div',
      { className: 'space-y-6' },
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
        React.createElement(DelimiterRadioGroup, {
          value: ',',
          onChange: handleDelimiterChange,
          label: 'Séparateur CSV',
          isFr: true,
          allowCustom: true,
        }),
        React.createElement(EncodingSelector, {
          value: 'utf-8',
          onChange: handleEncodingChange,
          label: 'Encodage',
          isFr: true,
        })
      ),
      React.createElement(DataPreviewTableLite, {
        headers: ['col1', 'col2', 'col3'],
        rows: [['val1', 'val2', 'val3']],
        label: 'Aperçu des données',
        isFr: true,
      })
    );

    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(ConversionStaging, {
              sourceFormat: getSourceFormat(true),
              targetFormat: getTargetFormat(),
              sourceFile: sampleCsvFile,
              convertBtnLabel: 'Convertir en Excel',
              changeFileBtnLabel: 'Changer de fichier',
              onConvert: vi.fn(),
              onReset: vi.fn(),
              optionsSlot,
            })
          )
        )
      );
    });

    const commaBtn = container.querySelector('button[data-delimiter=","]');
    expect(commaBtn).not.toBeNull();

    const encodingSelect = container.querySelector('select');
    expect(encodingSelect).not.toBeNull();

    const previewCounter = container.querySelector('[data-testid="data-preview-counter"]');
    expect(previewCounter).not.toBeNull();
  });
});
