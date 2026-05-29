---
name: i18n coverage
description: State of EN/FR translation coverage across all tool pages; what's wired vs what's still inline.
---

## Translation system
- Single file: `artifacts/everydaytools/src/i18n/translations.ts` (EN + FR objects, `TRANSLATIONS` export)
- Context: `src/contexts/locale-context.tsx` — exports `LocaleContext` + `LocaleProvider`
- Hook: `src/hooks/use-locale.ts` — exports `useLocale()` (these must stay in separate files — Fast Refresh rule)
- `FormatSelector.tsx` uses `useLocale()` internally — no prop needed

## Sections in Translations type (all have EN+FR)
- `nav`, `home`, `tools`, `ui`, `footer`, `cookie` — global/shared
- `tipCalc`, `pctCalc` — tip/percentage calculators
- `unitConverter`, `currencyConverter`, `passwordGenerator` — utility tools
- `formatSelector` — search/no-results for FormatSelector component
- `aiTextScrubber` — tabs, buttons, foundCount fn, disclaimer
- `backgroundRemover` — note, buttons, loading states, original/result labels
- `metadataCleaner` — tabs, analyze/clean/download buttons, heading, disclaimer
- `pdfCompress` — compressionLevel, compressBtn, stats labels, downloadBtn fn, note
- `pdfMerge` — mergeBtn fn, mergingLabel, errorMin2
- `imageCompress` — full: mode buttons, quality/resize/target labels, compress/download/remove buttons
- `documentConverter` — full: all UI strings for the shadcn-based document converter page
- `imageConverter` — full: all UI strings for the shadcn-based image converter page

## Pages still using inline isFR pattern (pre-existing, not yet migrated to t.*)
- `qr-code-generator.tsx` — uses `const isFR = locale === 'FR'` inline throughout

## Pre-existing TypeScript errors (not from i18n work)
- `pdf-split`, `pdf-to-epub`, `pdf-to-image`, `pdf-unlock`, `pdf-watermark`, `txt-to-pdf`, `word-to-epub` — Uint8Array/BlobPart type mismatches and missing construct signatures; unrelated to translations.

**Why:** All new translation sections follow the same pattern: a dedicated key in `Translations` type, EN value, FR value. Function-valued strings (like `mergeBtn: (n) => string`) use TypeScript function types.
