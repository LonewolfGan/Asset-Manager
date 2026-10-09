import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { CsvJsonFlow } from '@/components/csv-to-json/CsvJsonFlow';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getCsvFormat, getJsonFormat } from '@/lib/csv-json-conversion-logic';

describe('CsvJsonFlow integration with @workspace/ui controls (TDD RED Phase)', () => {
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
    ['id,name,role\n1,Alice,Admin\n2,Bob,User'],
    'data.csv',
    { type: 'text/csv' }
  );

  const renderFlow = async (workflowOverrides = {}) => {
    const defaultWorkflow = {
      direction: 'csv-to-json' as const,
      inputMode: 'upload' as const,
      setInputMode: vi.fn(),
      rawText: 'id,name,role\n1,Alice,Admin\n2,Bob,User',
      setRawText: vi.fn(),
      isPastedStaged: false,
      setIsPastedStaged: vi.fn(),
      result: null,
      isProcessing: false,
      isDragging: false,
      previewOpen: false,
      setPreviewOpen: vi.fn(),
      isNextActionOpen: false,
      setIsNextActionOpen: vi.fn(),
      file: sampleCsvFile,
      sourceFormat: getCsvFormat(true),
      targetFormat: getJsonFormat(true),
      isStaged: true,
      stagedFile: sampleCsvFile,
      delimiter: ',',
      setDelimiter: vi.fn(),
      encoding: 'utf-8',
      setEncoding: vi.fn(),
      previewData: {
        headers: ['id', 'name', 'role'],
        rows: [
          ['1', 'Alice', 'Admin'],
          ['2', 'Bob', 'User'],
        ],
      },
      validateAndSetFile: vi.fn(),
      handleDragOver: vi.fn(),
      handleDragLeave: vi.fn(),
      handleDrop: vi.fn(),
      handleReset: vi.fn(),
      handleToggleDirection: vi.fn(),
      handleConvert: vi.fn(),
      handleDownload: vi.fn(),
      ...workflowOverrides,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(CsvJsonFlow, {
            workflow: defaultWorkflow as any,
            isFr: true,
          })
        )
      );
    });

    return defaultWorkflow;
  };

  it('renders DelimiterRadioGroup and EncodingSelector in staging scene optionsSlot', async () => {
    await renderFlow();

    // Check DelimiterRadioGroup
    const commaDelimiterBtn = container.querySelector('button[data-delimiter=","]');
    expect(commaDelimiterBtn).not.toBeNull();

    // Check EncodingSelector
    const encodingSelect = container.querySelector('select');
    expect(encodingSelect).not.toBeNull();

    // Check DataPreviewTableLite
    const previewCounter = container.querySelector('[data-testid="data-preview-counter"]');
    expect(previewCounter).not.toBeNull();
  });
});
