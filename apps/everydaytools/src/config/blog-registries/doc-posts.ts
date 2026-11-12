import type { BlogPost } from "../blog-types";
import { postCsvEditor } from "../blog-posts/csv-editor";
import { postCsvToExcel } from "../blog-posts/csv-to-excel";
import { postCsvToJson } from "../blog-posts/csv-to-json";
import { postCsvViewer } from "../blog-posts/csv-viewer";
import { postEpubToPdf } from "../blog-posts/epub-to-pdf";
import { postEpubToWord } from "../blog-posts/epub-to-word";
import { postExcelToCsv } from "../blog-posts/excel-to-csv";
import { postExcelToPdf } from "../blog-posts/excel-to-pdf";
import { postHtmlToMarkdown } from "../blog-posts/html-to-markdown";
import { postHtmlToPdf } from "../blog-posts/html-to-pdf";
import { postHtmlToWord } from "../blog-posts/html-to-word";
import { postJsonToCsv } from "../blog-posts/json-to-csv";
import { postMarkdownToDocx } from "../blog-posts/markdown-to-docx";
import { postMarkdownToPdf } from "../blog-posts/markdown-to-pdf";
import { postOcr } from "../blog-posts/ocr";
import { postOdtToPdf } from "../blog-posts/odt-to-pdf";
import { postPdfToOdt } from "../blog-posts/pdf-to-odt";
import { postPdfToRtf } from "../blog-posts/pdf-to-rtf";
import { postPptxToImages } from "../blog-posts/pptx-to-images";
import { postPptxToPdf } from "../blog-posts/pptx-to-pdf";
import { postRtfToPdf } from "../blog-posts/rtf-to-pdf";
import { postTxtToDocx } from "../blog-posts/txt-to-docx";
import { postTxtToPdf } from "../blog-posts/txt-to-pdf";
import { postWordToEpub } from "../blog-posts/word-to-epub";
import { postWordToHtml } from "../blog-posts/word-to-html";
import { postWordToMarkdown } from "../blog-posts/word-to-markdown";
import { postWordToPdf } from "../blog-posts/word-to-pdf";
import { postWordToText } from "../blog-posts/word-to-text";

export const docPosts: BlogPost[] = [
  postCsvEditor,
  postCsvToExcel,
  postCsvToJson,
  postCsvViewer,
  postEpubToPdf,
  postEpubToWord,
  postExcelToCsv,
  postExcelToPdf,
  postHtmlToMarkdown,
  postHtmlToPdf,
  postHtmlToWord,
  postJsonToCsv,
  postMarkdownToDocx,
  postMarkdownToPdf,
  postOcr,
  postOdtToPdf,
  postPdfToOdt,
  postPdfToRtf,
  postPptxToImages,
  postPptxToPdf,
  postRtfToPdf,
  postTxtToDocx,
  postTxtToPdf,
  postWordToEpub,
  postWordToHtml,
  postWordToMarkdown,
  postWordToPdf,
  postWordToText,
];
