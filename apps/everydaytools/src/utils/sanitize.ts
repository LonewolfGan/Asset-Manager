import DOMPurify from 'dompurify';

export const sanitizeHTML = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p','br','strong','em','ul','ol','li','h1','h2','h3','h4','h5','h6',
      'a','code','pre','blockquote','table','thead','tbody','tr','th','td',
      'span','div','hr','img','figure','figcaption'],
    ALLOWED_ATTR: ['href','target','rel','src','alt','class','style','id'],
    ALLOW_DATA_ATTR: false,
    FORCE_BODY: true,
    ADD_ATTR: ['target'],
  });
};

export const sanitizeText = (input: unknown): string => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

export const sanitizeFilename = (filename: unknown): string => {
  if (typeof filename !== 'string') return 'file';
  return (
    filename
      .replace(/[^a-zA-Z0-9.\-_\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/\.{2,}/g, '.')
      .slice(0, 255) || 'file'
  );
};

export const isValidURL = (input: string): boolean => {
  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};
