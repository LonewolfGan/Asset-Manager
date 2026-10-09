import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { CodeWorkspaceSplit } from '@workspace/ui';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('CodeWorkspaceSplit', () => {
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

  const renderComponent = async (props: any) => {
    await act(async () => {
      root.render(React.createElement(CodeWorkspaceSplit, props));
    });
  };

  it('renders left and right panel titles and content', async () => {
    await renderComponent({
      sourceTitle: 'Code Source',
      outputTitle: 'Résultat Formaté',
      sourceContent: React.createElement('div', { 'data-testid': 'source-content' }, 'const a = 1;'),
      outputContent: React.createElement('div', { 'data-testid': 'output-content' }, 'const a = 1; // formatted'),
    });

    expect(container.textContent).toContain('Code Source');
    expect(container.textContent).toContain('Résultat Formaté');
    expect(container.querySelector('[data-testid="source-content"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="output-content"]')).not.toBeNull();
  });

  it('renders source and output stats in headers', async () => {
    await renderComponent({
      sourceTitle: 'Entrée',
      outputTitle: 'Sortie',
      sourceStats: '12 lignes · 245 B',
      outputStats: '10 lignes · 180 B (-26%)',
      sourceContent: React.createElement('div', null, 'input'),
      outputContent: React.createElement('div', null, 'output'),
    });

    expect(container.textContent).toContain('12 lignes · 245 B');
    expect(container.textContent).toContain('10 lignes · 180 B (-26%)');
  });

  it('renders source and output actions slots', async () => {
    const handleClear = vi.fn();
    const handleCopy = vi.fn();

    await renderComponent({
      sourceTitle: 'Input',
      outputTitle: 'Output',
      sourceActions: React.createElement('button', {
        'data-testid': 'clear-btn',
        onClick: handleClear,
      }, 'Effacer'),
      outputActions: React.createElement('button', {
        'data-testid': 'copy-btn',
        onClick: handleCopy,
      }, 'Copier'),
      sourceContent: React.createElement('div', null, 'input'),
      outputContent: React.createElement('div', null, 'output'),
    });

    const clearBtn = container.querySelector('[data-testid="clear-btn"]') as HTMLButtonElement;
    const copyBtn = container.querySelector('[data-testid="copy-btn"]') as HTMLButtonElement;

    expect(clearBtn).not.toBeNull();
    expect(copyBtn).not.toBeNull();

    act(() => {
      clearBtn.click();
      copyBtn.click();
    });

    expect(handleClear).toHaveBeenCalledTimes(1);
    expect(handleCopy).toHaveBeenCalledTimes(1);
  });

  it('displays drag overlay when isDragOver is true', async () => {
    await renderComponent({
      sourceTitle: 'Source',
      outputTitle: 'Output',
      sourceContent: React.createElement('div', null, 'input'),
      outputContent: React.createElement('div', null, 'output'),
      isDragOver: true,
      dragMessage: 'Déposez votre fichier ici',
    });

    const dragOverlay = container.querySelector('[data-testid="code-drag-overlay"]');
    expect(dragOverlay).not.toBeNull();
    expect(dragOverlay?.textContent).toContain('Déposez votre fichier ici');
  });

  it('handles file drop event and triggers onDropFile', async () => {
    const handleDropFile = vi.fn();
    await renderComponent({
      sourceTitle: 'Source',
      outputTitle: 'Output',
      sourceContent: React.createElement('div', null, 'input'),
      outputContent: React.createElement('div', null, 'output'),
      onDropFile: handleDropFile,
    });

    const rootWrapper = container.firstElementChild as HTMLDivElement;
    expect(rootWrapper).not.toBeNull();

    const mockFile = new File(['code'], 'test.js', { type: 'text/javascript' });
    const dropEvent = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: { files: [mockFile] },
    });

    act(() => {
      rootWrapper.dispatchEvent(dropEvent);
    });

    expect(handleDropFile).toHaveBeenCalledTimes(1);
    expect(handleDropFile).toHaveBeenCalledWith(mockFile);
  });

  it('renders loading overlay when isProcessing is true', async () => {
    await renderComponent({
      sourceTitle: 'Source',
      outputTitle: 'Output',
      sourceContent: React.createElement('div', null, 'input'),
      outputContent: React.createElement('div', null, 'output'),
      isProcessing: true,
      processingMessage: 'Formatage en cours...',
    });

    const processingOverlay = container.querySelector('[data-testid="code-processing-overlay"]');
    expect(processingOverlay).not.toBeNull();
    expect(processingOverlay?.textContent).toContain('Formatage en cours...');
  });

  it('renders footerSlot when provided', async () => {
    await renderComponent({
      sourceContent: React.createElement('div', null, 'input'),
      outputContent: React.createElement('div', null, 'output'),
      footerSlot: React.createElement('div', { 'data-testid': 'resize-handle' }, 'Resize'),
    });

    expect(container.querySelector('[data-testid="resize-handle"]')).not.toBeNull();
  });
});
