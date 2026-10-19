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
  mirrorSlug: string;
  sourceLabel: { fr: string; en: string };
  targetLabel: { fr: string; en: string };
  badgeLabel?: { fr: string; en: string };
  isPrimary?: boolean;
  sourceFormat?: ReciprocalFormatType;
}
