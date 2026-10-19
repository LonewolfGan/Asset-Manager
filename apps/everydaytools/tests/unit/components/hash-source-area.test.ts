import { describe, it, expect, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { HashGeneratorSourceArea } from '@/components/hash-generator/HashGeneratorSourceArea';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    isFr: true,
  }),
}));

describe('HashGeneratorSourceArea', () => {
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

  it('renders textarea with sample presets when empty', async () => {
    const onTextChange = vi.fn();
    const onLoadSample = vi.fn();
    const textareaRef = React.createRef<HTMLTextAreaElement>();
    const fileInputRef = React.createRef<HTMLInputElement>();

    await act(async () => {
      root.render(
        React.createElement(HashGeneratorSourceArea, {
          inputMode: 'text',
          inputText: '',
          fileInfo: null,
          isDragOver: false,
          textareaRef,
          fileInputRef,
          onTextChange,
          onLoadSample,
          onProcessFile: vi.fn(),
          onClearFile: vi.fn(),
          setIsDragOver: vi.fn(),
        })
      );
    });

    const textarea = container.querySelector('textarea');
    expect(textarea).toBeTruthy();

    const sampleButtons = container.querySelectorAll('button[data-sample-id]');
    expect(sampleButtons.length).toBeGreaterThan(0);

    const firstSampleBtn = sampleButtons[0] as HTMLButtonElement;
    firstSampleBtn.click();
    expect(onLoadSample).toHaveBeenCalled();
  });

  it('renders file dropzone without arbitrary hex classes in file mode', async () => {
    const textareaRef = React.createRef<HTMLTextAreaElement>();
    const fileInputRef = React.createRef<HTMLInputElement>();

    await act(async () => {
      root.render(
        React.createElement(HashGeneratorSourceArea, {
          inputMode: 'file',
          inputText: '',
          fileInfo: null,
          isDragOver: false,
          textareaRef,
          fileInputRef,
          onTextChange: vi.fn(),
          onLoadSample: vi.fn(),
          onProcessFile: vi.fn(),
          onClearFile: vi.fn(),
          setIsDragOver: vi.fn(),
        })
      );
    });

    expect(container.innerHTML).not.toContain('#FF6B35');
    expect(container.innerHTML).not.toContain('#e85a26');
  });
});
