import { describe, it, expect } from 'vitest';
import { TOOL_COMPONENTS } from '@/routes/tool-components';

describe('Tool Routes Registry Audit (TDD RED -> GREEN)', () => {
  it('registers odt-to-pdf, rtf-to-pdf, pdf-to-markdown, and pdf-to-pdfa in TOOL_COMPONENTS', () => {
    expect(TOOL_COMPONENTS['odt-to-pdf']).toBeDefined();
    expect(TOOL_COMPONENTS['rtf-to-pdf']).toBeDefined();
    expect(TOOL_COMPONENTS['pdf-to-markdown']).toBeDefined();
    expect(TOOL_COMPONENTS['pdf-to-pdfa']).toBeDefined();
  });

  it('contains valid lazy components for all registered tools', () => {
    expect(Object.keys(TOOL_COMPONENTS).length).toBeGreaterThanOrEqual(84);
    for (const [slug, Comp] of Object.entries(TOOL_COMPONENTS)) {
      expect(slug).toBeTruthy();
      expect(Comp).toBeDefined();
    }
  });
});
