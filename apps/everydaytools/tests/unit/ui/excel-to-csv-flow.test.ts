import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleProvider } from '@/contexts/locale-context';
import { ConversionStaging } from '@/components/conversion';
import { DelimiterRadioGroup, DataPreviewTableLite } from '@workspace/ui/controls';
import { getSourceFormat, getTargetFormat } from '@/lib/excel-to-csv-logic';

describe('ExcelToCsv staging optionsSlot with @workspace/ui controls (TDD RED Phase)', () => {
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

  const sampleExcelFile = new File(['mock-excel-content'], 'classeur.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  it('renders DelimiterRadioGroup and DataPreviewTableLite in optionsSlot', async () => {
    const handleDelimiterChange = vi.fn();

    const optionsSlot = React.createElement(
      'div',
      { className: 'space-y-6' },
      React.createElement(DelimiterRadioGroup, {
        value: ';',
        onChange: handleDelimiterChange,
        label: 'Séparateur CSV de sortie',
        isFr: true,
        allowCustom: true,
      }),
      React.createElement(DataPreviewTableLite, {
        headers: ['Produit', 'Prix', 'Stock'],
        rows: [['Pomme', '2€', '50']],
        label: 'Aperçu de la feuille',
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
              targetFormat: getTargetFormat(true),
              sourceFile: sampleExcelFile,
              convertBtnLabel: 'Convertir en CSV',
              changeFileBtnLabel: 'Changer de classeur',
              onConvert: vi.fn(),
              onReset: vi.fn(),
              optionsSlot,
            })
          )
        )
      );
    });

    const semicolonBtn = container.querySelector('button[data-delimiter=";"]');
    expect(semicolonBtn).not.toBeNull();

    const previewCounter = container.querySelector('[data-testid="data-preview-counter"]');
    expect(previewCounter).not.toBeNull();
  });
});
