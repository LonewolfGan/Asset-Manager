export type ReciprocalFormatType =
  | 'csv'
  | 'json'
  | 'excel'
  | 'word'
  | 'pdf'
  | 'pptx'
  | 'markdown'
  | 'html'
  | 'text'
  | 'image'
  | 'epub'
  | 'odt'
  | 'rtf';

export interface ReciprocalToolInfo {
  mirrorSlug?: string;
  sourceLabel: { fr: string; en: string };
  targetLabel: { fr: string; en: string };
  badgeLabel?: { fr: string; en: string };
  isPrimary?: boolean;
  sourceFormat?: ReciprocalFormatType;
  /**
   * Indicates an N-to-1 format-specific variant (e.g. png-to-pdf -> pdf-to-image)
   * that points to a canonical multi-format handler rather than a 1-to-1 bijection.
   */
  isVariant?: boolean;
  /**
   * Indicates a one-way conversion tool without an inverted counterpart in the browser.
   * Renders the standardized directional title without deceptive mirror redirection.
   */
  unidirectional?: boolean;
}
