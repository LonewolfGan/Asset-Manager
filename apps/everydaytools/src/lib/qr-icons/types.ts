export interface LibraryIcon {
  id: string;
  label: string;
  category: 'web' | 'social' | 'business' | 'symbols';
  path: string;
  renderMode?: 'stroke' | 'fill';
}

export function getPresetIconSvg(iconId: string, color: string, library: LibraryIcon[]): string {
  const encColor = encodeURIComponent(color);
  const found = library.find((item) => item.id === iconId);
  if (!found) return '';

  if (found.renderMode === 'fill') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="${encColor}">${found.path}</svg>`;
  }

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="${encColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" color="${encColor}">${found.path}</svg>`;
}
