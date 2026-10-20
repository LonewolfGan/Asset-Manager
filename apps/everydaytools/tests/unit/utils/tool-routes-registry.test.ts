import { describe, it, expect } from 'vitest';
import { TOOL_COMPONENTS } from '@/routes/tool-components';
import { tools } from '@/config/tools.config';

describe('Tool Routes Registry Audit (114 Tools SSOT)', () => {
  it('registers all 114 tools from tools.config.ts in TOOL_COMPONENTS', () => {
    expect(tools.length).toBe(114);
    expect(Object.keys(TOOL_COMPONENTS).length).toBe(114);

    for (const tool of tools) {
      expect(
        TOOL_COMPONENTS[tool.slug],
        `Expected tool ${tool.slug} to be registered in TOOL_COMPONENTS`
      ).toBeDefined();
    }
  });

  it('contains valid lazy components for all registered tools', () => {
    for (const [slug, Comp] of Object.entries(TOOL_COMPONENTS)) {
      expect(slug).toBeTruthy();
      expect(Comp).toBeDefined();
    }
  });
});
