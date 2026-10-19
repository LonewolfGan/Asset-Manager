import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ColorPickerField } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('ColorPickerField (Studio Design with In-Popover Nuances Grid)', () => {
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
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(ColorPickerField, props)
        )
      );
    });
  };

  it('renders label and formatted hex value in a sleek studio trigger', async () => {
    await renderComponent({
      label: 'Couleur du motif',
      value: '#ff6b35',
      onChange: vi.fn(),
    });

    expect(container.textContent).toContain('Couleur du motif');
    expect(container.textContent).toContain('#FF6B35');
    const triggerBtn = container.querySelector('[data-testid="color-picker-trigger"]');
    expect(triggerBtn).not.toBeNull();
  });

  it('does NOT render any external preset swatches row on the page', async () => {
    await renderComponent({
      label: 'Couleur',
      value: '#000000',
      onChange: vi.fn(),
    });

    // Zero preset buttons outside the popover
    const presetButtons = container.querySelectorAll('[data-testid="color-preset-btn"]');
    expect(presetButtons.length).toBe(0);
  });

  it('opens studio popover with an in-popover grid of color nuances swatches', async () => {
    const handleChange = vi.fn();
    await renderComponent({
      label: 'Couleur',
      value: '#FF6B35',
      onChange: handleChange,
    });

    const triggerBtn = container.querySelector('[data-testid="color-picker-trigger"]') as HTMLButtonElement;
    expect(container.querySelector('[data-testid="color-picker-popover"]')).toBeNull();

    // Click trigger to open popover
    await act(async () => {
      triggerBtn.click();
    });

    const popover = container.querySelector('[data-testid="color-picker-popover"]');
    expect(popover).not.toBeNull();

    // Must have in-popover color nuance swatches (e.g. 18 to 24 curated swatches)
    const swatches = popover?.querySelectorAll('[data-testid="popover-swatch-btn"]');
    expect(swatches).toBeDefined();
    expect(swatches!.length).toBeGreaterThan(0);
  });

  it('calls onChange when clicking a nuance swatch in the popover', async () => {
    const handleChange = vi.fn();
    await renderComponent({
      label: 'Couleur',
      value: '#000000',
      onChange: handleChange,
    });

    const triggerBtn = container.querySelector('[data-testid="color-picker-trigger"]') as HTMLButtonElement;
    await act(async () => {
      triggerBtn.click();
    });

    const popover = container.querySelector('[data-testid="color-picker-popover"]');
    const swatches = popover?.querySelectorAll('[data-testid="popover-swatch-btn"]') as NodeListOf<HTMLButtonElement>;
    expect(swatches.length).toBeGreaterThan(1);

    act(() => {
      swatches[1].click();
    });

    expect(handleChange).toHaveBeenCalled();
  });

  it('selected nuance swatch has clean checkmark and NO ring-offset', async () => {
    await renderComponent({
      label: 'Couleur',
      value: '#FF6B35',
      onChange: vi.fn(),
    });

    const triggerBtn = container.querySelector('[data-testid="color-picker-trigger"]') as HTMLButtonElement;
    await act(async () => {
      triggerBtn.click();
    });

    const popover = container.querySelector('[data-testid="color-picker-popover"]');
    const swatches = popover?.querySelectorAll('[data-testid="popover-swatch-btn"]');
    expect(swatches).toBeDefined();

    swatches?.forEach((swatch) => {
      expect(swatch.className).not.toContain('ring-offset');
    });
  });

  it('allows manual hex code input change inside popover', async () => {
    const handleChange = vi.fn();
    await renderComponent({
      label: 'Couleur',
      value: '#000000',
      onChange: handleChange,
    });

    const triggerBtn = container.querySelector('[data-testid="color-picker-trigger"]') as HTMLButtonElement;
    await act(async () => {
      triggerBtn.click();
    });

    const hexInput = container.querySelector('input[data-testid="color-hex-input"]') as HTMLInputElement;
    expect(hexInput).not.toBeNull();

    act(() => {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeSetter?.call(hexInput, '#123456');
      hexInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(handleChange).toHaveBeenCalledWith('#123456');
  });

  it('renders compact size="sm" with no outer label header when label is omitted', async () => {
    const handleOpen = vi.fn();
    await renderComponent({
      value: '#2563eb',
      onChange: vi.fn(),
      size: 'sm',
      isActive: true,
      onOpen: handleOpen,
    });

    const triggerBtn = container.querySelector('[data-testid="color-picker-trigger"]') as HTMLButtonElement;
    expect(triggerBtn).not.toBeNull();
    expect(triggerBtn.className).toContain('h-7');
    expect(triggerBtn.className).toContain('px-2');
    // Absolute Zero Double-Ring: active trigger must NOT have ring-offset or ring-2
    expect(triggerBtn.className).not.toContain('ring-offset');
    expect(triggerBtn.className).not.toContain('ring-2');
    expect(triggerBtn.className).toContain('border-zinc-900');
    expect(triggerBtn.className).toContain('focus-visible:ring-1');
    expect(triggerBtn.getAttribute('aria-haspopup')).toBe('dialog');
    expect(triggerBtn.getAttribute('aria-expanded')).toBe('false');

    // No outer header div when label is not provided
    const headers = container.querySelectorAll('.text-zinc-700');
    expect(headers.length).toBe(0);

    // Clicking trigger invokes onOpen and sets aria-expanded="true"
    await act(async () => {
      triggerBtn.click();
    });
    expect(handleOpen).toHaveBeenCalledTimes(1);
    expect(triggerBtn.getAttribute('aria-expanded')).toBe('true');

    // Clicking again closes without triggering onOpen a second time
    await act(async () => {
      triggerBtn.click();
    });
    expect(handleOpen).toHaveBeenCalledTimes(1);
    expect(triggerBtn.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes popover on Escape key press', async () => {
    await renderComponent({
      value: '#2563eb',
      onChange: vi.fn(),
    });

    const triggerBtn = container.querySelector('[data-testid="color-picker-trigger"]') as HTMLButtonElement;
    await act(async () => {
      triggerBtn.click();
    });

    expect(container.querySelector('[data-testid="color-picker-popover"]')).not.toBeNull();

    await act(async () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      document.dispatchEvent(event);
    });

    expect(container.querySelector('[data-testid="color-picker-popover"]')).toBeNull();
  });

  it('renders neutral placeholder with Palette icon when value is empty string', async () => {
    await renderComponent({
      value: '',
      onChange: vi.fn(),
      placeholder: 'Couleur libre',
    });

    const triggerBtn = container.querySelector('[data-testid="color-picker-trigger"]');
    expect(triggerBtn).not.toBeNull();
    expect(triggerBtn?.textContent).toContain('Couleur libre');
    expect(triggerBtn?.textContent).not.toContain('#FF6B35');
    expect(triggerBtn?.textContent).not.toContain('#2563EB');
  });
});
