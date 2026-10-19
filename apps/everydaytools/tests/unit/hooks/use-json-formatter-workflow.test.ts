import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useJsonFormatterWorkflow, escapeHtml } from '@/hooks/use-json-formatter-workflow';
import { JSON_SAMPLES } from '@/lib/json-formatter-logic';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('useJsonFormatterWorkflow Hook & Security (TDD)', () => {
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

  it('escapeHtml prevents DOM XSS injection by encoding sensitive entities', () => {
    const malicious = '<script>alert("XSS & \'pwned\'")</script>';
    const sanitized = escapeHtml(malicious);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('</script>');
    expect(sanitized).toContain('&lt;script&gt;');
    expect(sanitized).toContain('&quot;XSS &amp; &#039;pwned&#039;&quot;');
  });

  it('provides state and actions to load samples and format valid JSON', async () => {
    let hookResult!: ReturnType<typeof useJsonFormatterWorkflow>;

    function TestHarness() {
      hookResult = useJsonFormatterWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(TestHarness));
    });

    expect(hookResult.rawInput).toBe('');
    expect(hookResult.parseResult.ok).toBe(true);
    expect(hookResult.parseResult.empty).toBe(true);

    // Load sample
    await act(async () => {
      hookResult.handleLoadSample('userProfile');
    });

    expect(hookResult.rawInput).toBe(JSON_SAMPLES.userProfile);
    expect(hookResult.parseResult.ok).toBe(true);
    expect(hookResult.parseResult.empty).toBe(false);

    // Minify
    await act(async () => {
      hookResult.handleMinify();
    });
    expect(hookResult.isMinified).toBe(true);
    expect(hookResult.outputCode).not.toContain('\n');

    // Format with 4 spaces
    await act(async () => {
      hookResult.handleFormat(4);
    });
    expect(hookResult.isMinified).toBe(false);
    expect(hookResult.indentSize).toBe(4);
    expect(hookResult.outputCode).toContain('    "id": "usr_9981"');

    // Sort keys
    await act(async () => {
      hookResult.handleSortKeys();
    });
    expect(hookResult.parseResult.ok).toBe(true);

    // Clear
    await act(async () => {
      hookResult.handleClear();
    });
    expect(hookResult.rawInput).toBe('');

    // Undo should restore previous input
    await act(async () => {
      hookResult.handleUndo();
    });
    expect(hookResult.rawInput).toBeTruthy();
  });
});
