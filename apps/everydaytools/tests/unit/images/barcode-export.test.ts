import { describe, it, expect } from 'vitest';
import { serializeSvgToString } from '../../../src/lib/barcode-export';

describe('barcode-export', () => {
  it('serializeSvgToString clones svg and outputs valid serialized XML with xml namespaces', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '100');
    rect.setAttribute('height', '50');
    svg.appendChild(rect);

    const serialized = serializeSvgToString(svg);
    expect(serialized).toContain('<svg');
    expect(serialized).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(serialized).toContain('width="100"');
  });
});
