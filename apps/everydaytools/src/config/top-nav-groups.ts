import { tools } from "./tools.config";
import type { LucideIcon } from "lucide-react";

export const SLUG_ICON_MAP: Record<string, LucideIcon> = {};
for (const tool of tools) {
  SLUG_ICON_MAP[tool.slug] = tool.icon as LucideIcon;
}

export type NavEntry = { href: string } | null;
export type NavPair = [NavEntry, NavEntry];

export interface NavGroupDef {
  id: string;
  pairs: NavPair[];
}

export const GROUPS: NavGroupDef[] = [
  {
    id: "pdf",
    pairs: [
      [{ href: "/pdf-merge" }, { href: "/pdf-split" }],
      [{ href: "/pdf-compress" }, { href: "/ocr" }],
      [{ href: "/pdf-rotate" }, { href: "/reorder-pdf" }],
      [{ href: "/pdf-protect" }, { href: "/pdf-unlock" }],
      [{ href: "/pdf-page-numbers" }, { href: "/pdf-watermark" }],
      [{ href: "/pdf-repair" }, { href: "/pdf-metadata" }],
      [null, null],
      [{ href: "/pdf-to-word" }, { href: "/pdf-to-excel" }],
      [{ href: "/pdf-to-text" }, { href: "/pdf-to-image" }],
      [{ href: "/pdf-to-markdown" }, { href: "/pdf-to-html" }],
      [{ href: "/pdf-to-epub" }, { href: "/pdf-to-pptx" }],
      [{ href: "/pdf-to-odt" }, { href: "/pdf-to-rtf" }],
      [{ href: "/pdf-to-pdfa" }, { href: "/pdf-ocr" }],
    ],
  },
  {
    id: "documents",
    pairs: [
      [{ href: "/word-to-pdf" }, { href: "/word-to-text" }],
      [{ href: "/word-to-markdown" }, { href: "/markdown-to-docx" }],
      [{ href: "/word-to-html" }, { href: "/html-to-word" }],
      [{ href: "/word-to-epub" }, { href: "/epub-to-word" }],
      [{ href: "/markdown-to-pdf" }, { href: "/html-to-markdown" }],
      [{ href: "/html-to-pdf" }, { href: "/epub-to-pdf" }],
      [{ href: "/txt-to-pdf" }, { href: "/txt-to-docx" }],
      [{ href: "/odt-to-pdf" }, { href: "/rtf-to-pdf" }],
      [null, null],
      [{ href: "/csv-editor" }, { href: "/csv-viewer" }],
      [{ href: "/excel-to-pdf" }, { href: "/excel-to-csv" }],
      [{ href: "/csv-to-excel" }, { href: "/csv-to-json" }],
      [{ href: "/json-to-csv" }, { href: "/markdown-preview" }],
      [null, null],
      [{ href: "/pptx-to-pdf" }, { href: "/pptx-to-images" }],
      [{ href: "/pdf-to-pptx" }, null],
    ],
  },
  {
    id: "images",
    pairs: [
      [{ href: "/background-remover" }, { href: "/image-upscale" }],
      [{ href: "/image-compress" }, { href: "/image-resize" }],
      [{ href: "/image-crop" }, { href: "/flip-rotate-image" }],
      [{ href: "/image-filters" }, { href: "/watermark-image" }],
      [{ href: "/favicon-generator" }, { href: "/image-to-pdf" }],
      [null, null],
      [{ href: "/png-to-webp" }, { href: "/jpg-to-webp" }],
      [{ href: "/webp-to-png" }, { href: "/webp-to-jpg" }],
      [{ href: "/png-to-avif" }, { href: "/jpg-to-avif" }],
      [{ href: "/avif-to-png" }, { href: "/avif-to-jpg" }],
      [{ href: "/png-to-svg" }, { href: "/svg-to-png" }],
      [{ href: "/webp-to-avif" }, { href: "/webp-to-pdf" }],
      [null, null],
      [{ href: "/heic-to-jpg" }, { href: "/heic-to-png" }],
      [{ href: "/heic-to-webp" }, { href: "/heic-to-pdf" }],
      [{ href: "/jpg-to-png" }, { href: "/png-to-jpg" }],
      [{ href: "/jpg-to-pdf" }, { href: "/png-to-pdf" }],
      [{ href: "/gif-to-webp" }, { href: "/gif-to-png" }],
      [{ href: "/png-to-gif" }, { href: "/webp-to-gif" }],
      [{ href: "/tiff-to-jpg" }, { href: "/tiff-to-png" }],
      [{ href: "/bmp-to-jpg" }, { href: "/bmp-to-webp" }],
    ],
  },
  {
    id: "textCode",
    pairs: [
      [{ href: "/json-formatter" }, { href: "/json-diff" }],
      [{ href: "/html-formatter" }, { href: "/css-formatter" }],
      [{ href: "/js-formatter" }, { href: "/diff-checker" }],
      [{ href: "/regex-tester" }, { href: "/jwt-decoder" }],
      [null, null],
      [{ href: "/base64" }, { href: "/url-encoder" }],
      [{ href: "/hash-generator" }, { href: "/uuid-generator" }],
      [null, null],
      [{ href: "/word-counter" }, { href: "/lorem-ipsum" }],
      [{ href: "/barcode-generator" }, { href: "/color-converter" }],
      [{ href: "/color-palette" }, null],
    ],
  },
  {
    id: "tools",
    pairs: [
      [{ href: "/metadata-cleaner" }, { href: "/ai-text-scrubber" }],
      [{ href: "/password-generator" }, { href: "/checksum" }],
      [null, null],
      [{ href: "/qr-code-generator" }, { href: "/speed-test" }],
      [{ href: "/currency-converter" }, { href: "/unit-converter" }],
    ],
  },
];
