import { FileImage, FileText, Table2, FileCode } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SourceType = "image" | "document" | "pdf" | "spreadsheet" | "data";

const SOURCE_ICONS: Record<SourceType, LucideIcon> = {
  image: FileImage,
  document: FileText,
  pdf: FileText,
  spreadsheet: Table2,
  data: FileCode,
};

const FORMAT_SOURCE: Record<string, SourceType> = {
  PNG: "image", JPG: "image", JPEG: "image", GIF: "image", BMP: "image",
  TIFF: "image", WEBP: "image", AVIF: "image", SVG: "image", HEIC: "image", IMG: "image",
  CSV: "spreadsheet", XLSX: "spreadsheet", XLS: "spreadsheet",
  JSON: "data", HTML: "data", XML: "data",
  PDF: "pdf",
  DOCX: "document", DOC: "document", TXT: "document", MD: "document",
  MARKDOWN: "document", EPUB: "document", PPTX: "document",
};

const FORMAT_ABBR: Record<string, string> = {
  DOCX: "DOC",
  XLSX: "XLS",
  PPTX: "PPT",
  MARKDOWN: "MD",
  JPEG: "JPG",
};

const ACCENT = "var(--accent)";
const ACCENT_BG = "var(--accent-subtle)";

function getSourceType(format: string): SourceType {
  return FORMAT_SOURCE[format.toUpperCase()] ?? "document";
}

function getDisplayFormat(format: string): string {
  const upper = format.toUpperCase();
  return FORMAT_ABBR[upper] ?? upper;
}

export function FormatIcon({
  sourceFormat,
  targetFormat,
  size = "md",
}: {
  sourceFormat: string;
  targetFormat: string;
  size?: "sm" | "md";
}) {
  const isSmall = size === "sm";
  const iconSize = isSmall ? 14 : 20;
  const badgeFontSize = isSmall ? 7 : 8;
  const badgePadding = isSmall ? "1px 3px" : "2px 4px";
  const badgeBottom = isSmall ? -3 : -4;
  const badgeRight = isSmall ? -4 : -5;
  const boxBorderRadius = 10;

  const sourceType = getSourceType(sourceFormat);
  const Icon = SOURCE_ICONS[sourceType];
  const displayTarget = getDisplayFormat(targetFormat);

  if (isSmall) {
    return (
      <div style={{ position: "relative", width: 28, height: 28, flexShrink: 0 }}>
        <div style={{
          width: "100%", height: "100%",
          borderRadius: boxBorderRadius,
          background: ACCENT_BG,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={iconSize} color={ACCENT} strokeWidth={1.6} />
        </div>
        <span style={{
          position: "absolute",
          bottom: badgeBottom,
          right: badgeRight,
          background: ACCENT,
          color: "var(--accent-text)",
          fontSize: badgeFontSize,
          fontWeight: 600,
          letterSpacing: "-0.2px",
          padding: badgePadding,
          borderRadius: 'var(--radius-sm)',
          fontFamily: "var(--font-mono)",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}>
          {displayTarget}
        </span>
      </div>
    );
  }

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%",
      alignSelf: "stretch",
    }}>
      <div style={{
        width: "100%",
        height: "100%",
        borderRadius: boxBorderRadius,
        background: ACCENT_BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Icon size={iconSize} color={ACCENT} strokeWidth={1.6} />
      </div>
      <span style={{
        position: "absolute",
        bottom: badgeBottom,
        right: badgeRight,
        background: ACCENT,
        color: "var(--accent-text)",
        fontSize: badgeFontSize,
        fontWeight: 600,
        letterSpacing: "-0.2px",
        padding: badgePadding,
        borderRadius: 'var(--radius-sm)',
        fontFamily: "var(--font-mono)",
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        pointerEvents: "none",
      }}>
        {displayTarget}
      </span>
    </div>
  );
}
