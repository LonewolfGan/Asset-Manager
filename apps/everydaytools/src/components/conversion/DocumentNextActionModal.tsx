import React, { useMemo } from 'react';
import { useLocation } from 'wouter';
import { NextActionModalShell } from './NextActionModalShell';
import {
  WordDocGraphic,
  ExcelSheetGraphic,
  CsvTableGraphic,
  JsonTreeGraphic,
  MarkdownGraphic,
  PptxSlideGraphic,
  TextDocGraphic,
  HtmlCodeGraphic,
  EpubBookGraphic,
} from './DocumentWorkflowGraphics';
import { CompressGraphic as PdfDocGraphic } from './WorkflowGraphics';
import { setHandoffFile } from '@/lib/file-handoff';
import { useLocale } from '@/hooks/use-locale';

export interface DocumentNextActionModalProps {
  toolId: string;
  isOpen: boolean;
  onClose: () => void;
  resultBlob?: Blob | null;
  resultFilename?: string;
  file?: File | null;
  formatType?: 'docx' | 'xlsx' | 'csv' | 'json' | 'md' | 'pptx' | 'txt' | 'html' | 'epub';
}

interface WorkflowActionItem {
  id: string;
  shortTag: string;
  tagColor: string;
  title: string;
  description: string;
  ctaText: string;
  route: string;
  supportsHandoff: boolean;
  graphic: React.ReactNode;
  accentBorder: string;
  glowColor: string;
}

const ACTION_TEXTS: Record<
  string,
  {
    title: { fr: string; en: string };
    description: { fr: string; en: string };
    ctaText: { fr: string; en: string };
  }
> = {
  'word-to-pdf': {
    title: { fr: 'Convertir en PDF', en: 'Convert to PDF' },
    description: {
      fr: 'Générez un document PDF professionnel haute fidélité pour signature ou envoi.',
      en: 'Generate a professional, high-fidelity PDF document ready for signing or sharing.',
    },
    ctaText: { fr: 'Vers PDF', en: 'To PDF' },
  },
  'word-to-markdown': {
    title: { fr: 'Convertir en Markdown', en: 'Convert to Markdown' },
    description: {
      fr: 'Exportez le document vers la syntaxe Markdown pour la documentation ou GitHub.',
      en: 'Export document content to Markdown syntax for documentation or GitHub.',
    },
    ctaText: { fr: 'Vers Markdown', en: 'To Markdown' },
  },
  'word-to-html': {
    title: { fr: 'Convertir en HTML', en: 'Convert to HTML' },
    description: {
      fr: 'Générez une structure web sémantique propre pour l’intégration en ligne.',
      en: 'Generate clean, semantic HTML structure for web publishing and integration.',
    },
    ctaText: { fr: 'Vers HTML', en: 'To HTML' },
  },
  'word-to-epub': {
    title: { fr: 'Convertir en EPUB', en: 'Convert to EPUB' },
    description: {
      fr: 'Compilez votre document en livre numérique standard compatible liseuses.',
      en: 'Compile your document into a standard e-book compatible with e-readers.',
    },
    ctaText: { fr: 'Vers EPUB', en: 'To EPUB' },
  },
  'word-to-text': {
    title: { fr: 'Extraire le texte brut', en: 'Extract plain text' },
    description: {
      fr: 'Extrayez l’intégralité du contenu textuel débarrassé de toute mise en forme.',
      en: 'Extract all textual content stripped of any formatting or tags.',
    },
    ctaText: { fr: 'Vers Texte', en: 'To Text' },
  },
  'excel-to-pdf': {
    title: { fr: 'Convertir en PDF', en: 'Convert to PDF' },
    description: {
      fr: 'Mettez en page et imprimez votre feuille de calcul en document PDF propre.',
      en: 'Layout and format your spreadsheet into a clean, printable PDF document.',
    },
    ctaText: { fr: 'Vers PDF', en: 'To PDF' },
  },
  'excel-to-csv': {
    title: { fr: 'Exporter en CSV', en: 'Export to CSV' },
    description: {
      fr: 'Convertissez la feuille active en données brutes délimitées par virgules.',
      en: 'Convert active spreadsheet data into raw comma-separated values.',
    },
    ctaText: { fr: 'Vers CSV', en: 'To CSV' },
  },
  'csv-editor': {
    title: { fr: 'Éditer dans le Tableur', en: 'Edit in Spreadsheet' },
    description: {
      fr: 'Manipulez directement les colonnes, triez et modifiez les cellules en ligne.',
      en: 'Manipulate columns, sort data, and edit spreadsheet cells online.',
    },
    ctaText: { fr: 'Ouvrir Éditeur', en: 'Open Editor' },
  },
  'csv-viewer': {
    title: { fr: 'Visualiseur de données', en: 'Data Viewer' },
    description: {
      fr: 'Inspectez et parcourez les grands jeux de données avec recherche instantanée.',
      en: 'Inspect and explore large datasets with instant search and pagination.',
    },
    ctaText: { fr: 'Ouvrir Visualiseur', en: 'Open Viewer' },
  },
  'csv-to-excel': {
    title: { fr: 'Convertir en Excel', en: 'Convert to Excel' },
    description: {
      fr: 'Générez un classeur .xlsx standard prêt pour Microsoft Office ou Sheets.',
      en: 'Generate a standard .xlsx workbook ready for Microsoft Excel or Sheets.',
    },
    ctaText: { fr: 'Vers Excel', en: 'To Excel' },
  },
  'csv-to-json': {
    title: { fr: 'Convertir en JSON', en: 'Convert to JSON' },
    description: {
      fr: 'Transformez la structure tabulaire en tableau d’objets JSON standard.',
      en: 'Transform tabular structures into a clean array of standard JSON objects.',
    },
    ctaText: { fr: 'Vers JSON', en: 'To JSON' },
  },
  'json-formatter': {
    title: { fr: 'Éditeur & Formateur JSON', en: 'JSON Editor & Formatter' },
    description: {
      fr: 'Visualisez l’arbre interactif, validez la syntaxe et formatez le code en direct.',
      en: 'Inspect interactive JSON tree, validate syntax, and format code instantly.',
    },
    ctaText: { fr: 'Ouvrir Éditeur', en: 'Open Editor' },
  },
  'json-diff': {
    title: { fr: 'Comparer deux JSON', en: 'Compare two JSONs' },
    description: {
      fr: 'Identifiez précisément les différences, clés ajoutées ou valeurs modifiées.',
      en: 'Spot exact differences, added keys, and changed values between two JSONs.',
    },
    ctaText: { fr: 'Comparer JSON', en: 'Compare JSON' },
  },
  'markdown-preview': {
    title: { fr: 'Prévisualiser le Markdown', en: 'Preview Markdown' },
    description: {
      fr: 'Visualisez en temps réel le rendu HTML / GitHub avec coloration syntaxique.',
      en: 'Real-time HTML / GitHub Markdown rendering with syntax highlighting.',
    },
    ctaText: { fr: 'Ouvrir Preview', en: 'Open Preview' },
  },
  'markdown-to-pdf': {
    title: { fr: 'Convertir en PDF', en: 'Convert to PDF' },
    description: {
      fr: 'Générez un document PDF propre et typographié depuis votre syntaxe Markdown.',
      en: 'Generate clean, publication-ready PDF documents from Markdown syntax.',
    },
    ctaText: { fr: 'Vers PDF', en: 'To PDF' },
  },
  'markdown-to-docx': {
    title: { fr: 'Convertir en Word', en: 'Convert to Word' },
    description: {
      fr: 'Exportez vos notes ou documentation en document Word .docx standard.',
      en: 'Export notes and documentation into standard Word .docx documents.',
    },
    ctaText: { fr: 'Vers Word', en: 'To Word' },
  },
  'pptx-to-pdf': {
    title: { fr: 'Convertir en PDF', en: 'Convert to PDF' },
    description: {
      fr: 'Transformez votre diaporama en document PDF propre prêt au partage.',
      en: 'Convert your slide deck into a portable, print-ready PDF document.',
    },
    ctaText: { fr: 'Vers PDF', en: 'To PDF' },
  },
  'pptx-to-images': {
    title: { fr: 'Extraire en images', en: 'Extract to images' },
    description: {
      fr: 'Isolez chaque diapositive sous forme d’image PNG/JPG haute définition.',
      en: 'Extract each slide as high-resolution PNG/JPEG images.',
    },
    ctaText: { fr: 'Vers Images', en: 'To Images' },
  },
  'word-counter': {
    title: { fr: 'Compteur de mots & Stats', en: 'Word Counter & Stats' },
    description: {
      fr: 'Analysez le volume de mots, caractères, temps de lecture et lisibilité.',
      en: 'Analyze word count, characters, estimated reading time, and readability.',
    },
    ctaText: { fr: 'Analyser texte', en: 'Analyze Text' },
  },
  'diff-checker': {
    title: { fr: 'Comparateur de texte', en: 'Text Diff Checker' },
    description: {
      fr: 'Comparez ce texte avec une autre version pour inspecter les ajouts et suppressions.',
      en: 'Compare text versions side-by-side to highlight additions and deletions.',
    },
    ctaText: { fr: 'Comparer', en: 'Compare' },
  },
  'txt-to-docx': {
    title: { fr: 'Convertir en Word', en: 'Convert to Word' },
    description: {
      fr: 'Mettez en forme votre texte brut dans un document Word .docx standard.',
      en: 'Format your plain text notes into a standard Microsoft Word .docx file.',
    },
    ctaText: { fr: 'Vers Word', en: 'To Word' },
  },
  'txt-to-pdf': {
    title: { fr: 'Convertir en PDF', en: 'Convert to PDF' },
    description: {
      fr: 'Générez un document PDF épuré à partir du texte extrait sans mise en page complexe.',
      en: 'Create a clean, formatted PDF from extracted text with clean margins.',
    },
    ctaText: { fr: 'Vers PDF', en: 'To PDF' },
  },
};

const ACTIONS_BY_FORMAT: Record<string, WorkflowActionItem[]> = {
  docx: [
    {
      id: 'word-to-pdf',
      shortTag: 'PDF',
      tagColor: 'text-red-600 dark:text-red-400',
      title: 'Convertir en PDF',
      description: 'Générez un document PDF professionnel haute fidélité pour signature ou envoi.',
      ctaText: 'Vers PDF',
      route: '/word-to-pdf',
      supportsHandoff: true,
      graphic: <PdfDocGraphic />,
      accentBorder: 'hover:border-red-500/50 dark:hover:border-red-400/50',
      glowColor: '#EC1C24',
    },
    {
      id: 'word-to-markdown',
      shortTag: 'MARKDOWN',
      tagColor: 'text-sky-600 dark:text-sky-400',
      title: 'Convertir en Markdown',
      description: 'Exportez le document vers la syntaxe Markdown pour la documentation ou GitHub.',
      ctaText: 'Vers Markdown',
      route: '/word-to-markdown',
      supportsHandoff: true,
      graphic: <MarkdownGraphic />,
      accentBorder: 'hover:border-sky-500/50 dark:hover:border-sky-400/50',
      glowColor: '#0EA5E9',
    },
    {
      id: 'word-to-html',
      shortTag: 'HTML',
      tagColor: 'text-orange-600 dark:text-orange-400',
      title: 'Convertir en HTML',
      description: 'Générez une structure web sémantique propre pour l’intégration en ligne.',
      ctaText: 'Vers HTML',
      route: '/word-to-html',
      supportsHandoff: true,
      graphic: <HtmlCodeGraphic />,
      accentBorder: 'hover:border-orange-500/50 dark:hover:border-orange-400/50',
      glowColor: '#EA580C',
    },
    {
      id: 'word-to-epub',
      shortTag: 'EPUB',
      tagColor: 'text-violet-600 dark:text-violet-400',
      title: 'Convertir en EPUB',
      description: 'Compilez votre document en livre numérique standard compatible liseuses.',
      ctaText: 'Vers EPUB',
      route: '/word-to-epub',
      supportsHandoff: true,
      graphic: <EpubBookGraphic />,
      accentBorder: 'hover:border-violet-500/50 dark:hover:border-violet-400/50',
      glowColor: '#8B5CF6',
    },
    {
      id: 'word-to-text',
      shortTag: 'TEXT',
      tagColor: 'text-slate-600 dark:text-slate-400',
      title: 'Extraire le texte brut',
      description: 'Extrayez l’intégralité du contenu textuel débarrassé de toute mise en forme.',
      ctaText: 'Vers Texte',
      route: '/word-to-text',
      supportsHandoff: true,
      graphic: <TextDocGraphic />,
      accentBorder: 'hover:border-slate-500/50 dark:hover:border-slate-400/50',
      glowColor: '#64748B',
    },
  ],
  xlsx: [
    {
      id: 'excel-to-pdf',
      shortTag: 'PDF',
      tagColor: 'text-red-600 dark:text-red-400',
      title: 'Convertir en PDF',
      description: 'Mettez en page et imprimez votre feuille de calcul en document PDF propre.',
      ctaText: 'Vers PDF',
      route: '/excel-to-pdf',
      supportsHandoff: true,
      graphic: <PdfDocGraphic />,
      accentBorder: 'hover:border-red-500/50 dark:hover:border-red-400/50',
      glowColor: '#EC1C24',
    },
    {
      id: 'excel-to-csv',
      shortTag: 'CSV',
      tagColor: 'text-teal-600 dark:text-teal-400',
      title: 'Exporter en CSV',
      description: 'Convertissez la feuille active en données brutes délimitées par virgules.',
      ctaText: 'Vers CSV',
      route: '/excel-to-csv',
      supportsHandoff: true,
      graphic: <CsvTableGraphic />,
      accentBorder: 'hover:border-teal-500/50 dark:hover:border-teal-400/50',
      glowColor: '#0D9488',
    },
    {
      id: 'csv-editor',
      shortTag: 'TABLEUR',
      tagColor: 'text-emerald-600 dark:text-emerald-400',
      title: 'Éditer dans le Tableur',
      description: 'Manipulez directement les colonnes, triez et modifiez les cellules en ligne.',
      ctaText: 'Ouvrir Éditeur',
      route: '/csv-editor',
      supportsHandoff: true,
      graphic: <ExcelSheetGraphic />,
      accentBorder: 'hover:border-emerald-500/50 dark:hover:border-emerald-400/50',
      glowColor: '#107C41',
    },
    {
      id: 'csv-viewer',
      shortTag: 'VIEWER',
      tagColor: 'text-sky-600 dark:text-sky-400',
      title: 'Visualiseur de données',
      description: 'Inspectez et parcourez les grands jeux de données avec pagination instantanée.',
      ctaText: 'Ouvrir Visualiseur',
      route: '/csv-viewer',
      supportsHandoff: true,
      graphic: <CsvTableGraphic />,
      accentBorder: 'hover:border-sky-500/50 dark:hover:border-sky-400/50',
      glowColor: '#0284C7',
    },
  ],
  csv: [
    {
      id: 'csv-editor',
      shortTag: 'TABLEUR',
      tagColor: 'text-emerald-600 dark:text-emerald-400',
      title: 'Éditer dans le Tableur',
      description: 'Manipulez, triez et modifiez directement le jeu de données dans la grille.',
      ctaText: 'Ouvrir Tableur',
      route: '/csv-editor',
      supportsHandoff: true,
      graphic: <ExcelSheetGraphic />,
      accentBorder: 'hover:border-emerald-500/50 dark:hover:border-emerald-400/50',
      glowColor: '#107C41',
    },
    {
      id: 'csv-to-excel',
      shortTag: 'EXCEL',
      tagColor: 'text-green-600 dark:text-green-400',
      title: 'Convertir en Excel',
      description: 'Générez un classeur .xlsx standard prêt pour Microsoft Office ou Sheets.',
      ctaText: 'Vers Excel',
      route: '/csv-to-excel',
      supportsHandoff: true,
      graphic: <ExcelSheetGraphic />,
      accentBorder: 'hover:border-green-500/50 dark:hover:border-green-400/50',
      glowColor: '#16A34A',
    },
    {
      id: 'csv-to-json',
      shortTag: 'JSON',
      tagColor: 'text-amber-600 dark:text-amber-400',
      title: 'Convertir en JSON',
      description: 'Transformez la structure tabulaire en tableau d’objets JSON standard.',
      ctaText: 'Vers JSON',
      route: '/csv-to-json',
      supportsHandoff: true,
      graphic: <JsonTreeGraphic />,
      accentBorder: 'hover:border-amber-500/50 dark:hover:border-amber-400/50',
      glowColor: '#F59E0B',
    },
    {
      id: 'csv-viewer',
      shortTag: 'VIEWER',
      tagColor: 'text-teal-600 dark:text-teal-400',
      title: 'Visualiser les données',
      description: 'Inspectez et analysez rapidement vos données avec recherche instantanée.',
      ctaText: 'Ouvrir Visualiseur',
      route: '/csv-viewer',
      supportsHandoff: true,
      graphic: <CsvTableGraphic />,
      accentBorder: 'hover:border-teal-500/50 dark:hover:border-teal-400/50',
      glowColor: '#0D9488',
    },
  ],
  json: [
    {
      id: 'json-formatter',
      shortTag: 'FORMATTER',
      tagColor: 'text-amber-600 dark:text-amber-400',
      title: 'Éditer & Formateur JSON',
      description: 'Visualisez l’arbre interactif, validez la syntaxe et formatez le code en direct.',
      ctaText: 'Ouvrir Éditeur',
      route: '/json-formatter',
      supportsHandoff: true,
      graphic: <JsonTreeGraphic />,
      accentBorder: 'hover:border-amber-500/50 dark:hover:border-amber-400/50',
      glowColor: '#F59E0B',
    },
    {
      id: 'json-diff',
      shortTag: 'DIFF',
      tagColor: 'text-blue-600 dark:text-blue-400',
      title: 'Comparer deux JSON',
      description: 'Identifiez précisément les différences, clés ajoutées ou valeurs modifiées.',
      ctaText: 'Comparer JSON',
      route: '/json-diff',
      supportsHandoff: true,
      graphic: <JsonTreeGraphic />,
      accentBorder: 'hover:border-blue-500/50 dark:hover:border-blue-400/50',
      glowColor: '#2563EB',
    },
    {
      id: 'csv-editor',
      shortTag: 'TABLEUR',
      tagColor: 'text-teal-600 dark:text-teal-400',
      title: 'Reconvertir en Tableur',
      description: 'Importez vos structures tabulaires pour les éditer dans une grille conviviale.',
      ctaText: 'Vers Tableur',
      route: '/csv-editor',
      supportsHandoff: true,
      graphic: <CsvTableGraphic />,
      accentBorder: 'hover:border-teal-500/50 dark:hover:border-teal-400/50',
      glowColor: '#0D9488',
    },
  ],
  md: [
    {
      id: 'markdown-preview',
      shortTag: 'PREVIEW',
      tagColor: 'text-sky-600 dark:text-sky-400',
      title: 'Prévisualiser le Markdown',
      description: 'Visualisez en temps réel le rendu HTML / GitHub avec coloration syntaxique.',
      ctaText: 'Ouvrir Preview',
      route: '/markdown-preview',
      supportsHandoff: true,
      graphic: <MarkdownGraphic />,
      accentBorder: 'hover:border-sky-500/50 dark:hover:border-sky-400/50',
      glowColor: '#0EA5E9',
    },
    {
      id: 'markdown-to-pdf',
      shortTag: 'PDF',
      tagColor: 'text-red-600 dark:text-red-400',
      title: 'Convertir en PDF',
      description: 'Générez un document PDF propre et typographié depuis votre syntaxe Markdown.',
      ctaText: 'Vers PDF',
      route: '/markdown-to-pdf',
      supportsHandoff: true,
      graphic: <PdfDocGraphic />,
      accentBorder: 'hover:border-red-500/50 dark:hover:border-red-400/50',
      glowColor: '#EC1C24',
    },
    {
      id: 'markdown-to-docx',
      shortTag: 'WORD',
      tagColor: 'text-blue-600 dark:text-blue-400',
      title: 'Convertir en Word',
      description: 'Exportez vos notes ou documentation en document Word .docx standard.',
      ctaText: 'Vers Word',
      route: '/markdown-to-docx',
      supportsHandoff: true,
      graphic: <WordDocGraphic />,
      accentBorder: 'hover:border-blue-500/50 dark:hover:border-blue-400/50',
      glowColor: '#185ABD',
    },
  ],
  pptx: [
    {
      id: 'pptx-to-pdf',
      shortTag: 'PDF',
      tagColor: 'text-red-600 dark:text-red-400',
      title: 'Convertir en PDF',
      description: 'Transformez votre diaporama en document PDF propre prêt au partage.',
      ctaText: 'Vers PDF',
      route: '/pptx-to-pdf',
      supportsHandoff: true,
      graphic: <PdfDocGraphic />,
      accentBorder: 'hover:border-red-500/50 dark:hover:border-red-400/50',
      glowColor: '#EC1C24',
    },
    {
      id: 'pptx-to-images',
      shortTag: 'IMAGES',
      tagColor: 'text-emerald-600 dark:text-emerald-400',
      title: 'Extraire en images',
      description: 'Isolez chaque diapositive sous forme d’image PNG/JPG haute définition.',
      ctaText: 'Vers Images',
      route: '/pptx-to-images',
      supportsHandoff: true,
      graphic: <PptxSlideGraphic />,
      accentBorder: 'hover:border-emerald-500/50 dark:hover:border-emerald-400/50',
      glowColor: '#10B981',
    },
  ],
  txt: [
    {
      id: 'word-counter',
      shortTag: 'ANALYTICS',
      tagColor: 'text-blue-600 dark:text-blue-400',
      title: 'Compteur de mots & Stats',
      description: 'Analysez le volume de mots, caractères, temps de lecture et lisibilité.',
      ctaText: 'Analyser texte',
      route: '/word-counter',
      supportsHandoff: true,
      graphic: <TextDocGraphic />,
      accentBorder: 'hover:border-blue-500/50 dark:hover:border-blue-400/50',
      glowColor: '#2563EB',
    },
    {
      id: 'diff-checker',
      shortTag: 'DIFF',
      tagColor: 'text-purple-600 dark:text-purple-400',
      title: 'Comparateur de texte',
      description: 'Comparez ce texte avec une autre version pour inspecter les ajouts et suppressions.',
      ctaText: 'Comparer',
      route: '/diff-checker',
      supportsHandoff: true,
      graphic: <TextDocGraphic />,
      accentBorder: 'hover:border-purple-500/50 dark:hover:border-purple-400/50',
      glowColor: '#8B5CF6',
    },
    {
      id: 'txt-to-docx',
      shortTag: 'WORD',
      tagColor: 'text-blue-600 dark:text-blue-400',
      title: 'Convertir en Word',
      description: 'Mettez en forme votre texte brut dans un document Word .docx standard.',
      ctaText: 'Vers Word',
      route: '/txt-to-docx',
      supportsHandoff: true,
      graphic: <WordDocGraphic />,
      accentBorder: 'hover:border-blue-500/50 dark:hover:border-blue-400/50',
      glowColor: '#185ABD',
    },
    {
      id: 'txt-to-pdf',
      shortTag: 'PDF',
      tagColor: 'text-red-600 dark:text-red-400',
      title: 'Convertir en PDF',
      description: 'Générez un document PDF épuré à partir du texte extrait sans mise en page complexe.',
      ctaText: 'Vers PDF',
      route: '/txt-to-pdf',
      supportsHandoff: true,
      graphic: <PdfDocGraphic />,
      accentBorder: 'hover:border-red-500/50 dark:hover:border-red-400/50',
      glowColor: '#EC1C24',
    },
  ],
};

function inferFormat(filename?: string, fallback?: string): string {
  if (fallback) return fallback;
  if (!filename) return 'docx';
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'docx' || ext === 'doc') return 'docx';
  if (ext === 'xlsx' || ext === 'xls') return 'xlsx';
  if (ext === 'csv') return 'csv';
  if (ext === 'json') return 'json';
  if (ext === 'md' || ext === 'markdown') return 'md';
  if (ext === 'pptx' || ext === 'ppt') return 'pptx';
  if (ext === 'txt') return 'txt';
  if (ext === 'html' || ext === 'htm') return 'html';
  if (ext === 'epub') return 'epub';
  return 'docx';
}

export function DocumentNextActionModal({
  toolId,
  isOpen,
  onClose,
  resultBlob,
  resultFilename,
  file,
  formatType,
}: DocumentNextActionModalProps) {
  const [, setLocation] = useLocation();
  const { locale } = useLocale();
  const isFr = locale === 'FR';

  const activeFormat = useMemo(() => {
    return inferFormat(resultFilename || file?.name, formatType);
  }, [resultFilename, file, formatType]);

  const handleActionSelect = (action: WorkflowActionItem) => {
    if (action.supportsHandoff) {
      if (resultBlob && resultFilename) {
        setHandoffFile(resultBlob, resultFilename);
      } else if (file) {
        setHandoffFile(file, file.name);
      }
    }
    onClose();
    setLocation(action.route);
  };

  const displayedActions = useMemo(() => {
    const rawList = ACTIONS_BY_FORMAT[activeFormat] || ACTIONS_BY_FORMAT.docx;
    return rawList
      .filter((action) => action.id !== toolId)
      .slice(0, 6)
      .map((action, idx) => {
        const localized = ACTION_TEXTS[action.id];
        return {
          ...action,
          title: localized ? (isFr ? localized.title.fr : localized.title.en) : action.title,
          description: localized ? (isFr ? localized.description.fr : localized.description.en) : action.description,
          ctaText: localized ? (isFr ? localized.ctaText.fr : localized.ctaText.en) : action.ctaText,
          tag: `0${idx + 1} // ${action.shortTag}`,
        };
      });
  }, [activeFormat, toolId, isFr]);

  if (displayedActions.length === 0) return null;

  return (
    <NextActionModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isFr ? 'Actions recommandées' : 'Recommended next actions'}
      subtitleMobile={isFr ? 'Sélectionnez l’étape suivante pour votre fichier' : 'Choose the next step for your file'}
      closeLabel={isFr ? 'Fermer' : 'Close'}
      moreActionsLabel={(count) => `+ ${count} ${isFr ? 'autres actions' : 'more actions'}`}
      actions={displayedActions}
      onSelectAction={handleActionSelect}
    />
  );
}

export default DocumentNextActionModal;
