import type { ReactNode } from 'react';

export interface ConversionFormat {
  /** Display title, e.g. 'PDF', 'Word', 'TXT', 'Excel' */
  name: string;
  /** File extension without dot, e.g. 'pdf', 'docx', 'txt' */
  extension: string;
  /** Authentic SVG icon path, e.g. '/icons/pdf.svg' */
  icon: string;
  /** Official brand color hex, e.g. '#EC1C24', '#185ABD', '#4B5563' */
  color: string;
  /** Secondary or technical standard label, e.g. 'Adobe Acrobat', 'Texte brut UTF-8' */
  subLabel?: string;
}

export interface ConversionAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}
