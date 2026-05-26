import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";

// Initialize worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).href;

export type ConversionProgressCallback = (progress: number) => void;

export const convertPdfToText = async (
  file: File,
  onProgress?: ConversionProgressCallback
): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  let fullText = "";

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      // @ts-ignore
      .map((item) => item.str)
      .join(" ");
    fullText += pageText + "\n\n";

    if (onProgress) {
      onProgress(Math.round((i / numPages) * 100));
    }
  }

  return fullText;
};

export const convertDocxToHtml = async (
  file: File,
  onProgress?: ConversionProgressCallback
): Promise<string> => {
  if (onProgress) onProgress(20);
  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(50);
  const result = await mammoth.convertToHtml({ arrayBuffer });
  if (onProgress) onProgress(100);
  return result.value;
};

export const convertDocxToText = async (
  file: File,
  onProgress?: ConversionProgressCallback
): Promise<string> => {
  if (onProgress) onProgress(20);
  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(50);
  const result = await mammoth.extractRawText({ arrayBuffer });
  if (onProgress) onProgress(100);
  return result.value;
};

export const convertTextToPdf = async (
  text: string,
  onProgress?: ConversionProgressCallback
): Promise<Uint8Array> => {
  if (onProgress) onProgress(10);
  const pdfDoc = await PDFDocument.create();
  if (onProgress) onProgress(30);
  
  // Basic implementation: split text into lines and add to pages
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 12;
  const margin = 50;
  let y = height - margin;

  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (y < margin) {
      page = pdfDoc.addPage();
      y = height - margin;
    }
    page.drawText(lines[i] || " ", {
      x: margin,
      y,
      size: fontSize,
    });
    y -= fontSize * 1.5;

    if (onProgress && i % 10 === 0) {
      onProgress(30 + Math.round((i / lines.length) * 60));
    }
  }

  if (onProgress) onProgress(90);
  const pdfBytes = await pdfDoc.save();
  if (onProgress) onProgress(100);
  return pdfBytes;
};

export const unsupportedConversionError = (format: string): string => {
  return `Conversion to ${format} is layout-engine dependent and not supported directly in the browser. Please use a dedicated desktop application or cloud service for layout-preserving conversions.`;
};
