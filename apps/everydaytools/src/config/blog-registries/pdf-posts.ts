import type { BlogPost } from "../blog-types";
import { postPdfCompress } from "../blog-posts/pdf-compress";
import { postPdfMerge } from "../blog-posts/pdf-merge";
import { postPdfMetadata } from "../blog-posts/pdf-metadata";
import { postPdfOcr } from "../blog-posts/pdf-ocr";
import { postPdfPageNumbers } from "../blog-posts/pdf-page-numbers";
import { postPdfProtect } from "../blog-posts/pdf-protect";
import { postPdfRepair } from "../blog-posts/pdf-repair";
import { postPdfRotate } from "../blog-posts/pdf-rotate";
import { postPdfSplit } from "../blog-posts/pdf-split";
import { postPdfToEpub } from "../blog-posts/pdf-to-epub";
import { postPdfToExcel } from "../blog-posts/pdf-to-excel";
import { postPdfToHtml } from "../blog-posts/pdf-to-html";
import { postPdfToImage } from "../blog-posts/pdf-to-image";
import { postPdfToMarkdown } from "../blog-posts/pdf-to-markdown";
import { postPdfToPdfa } from "../blog-posts/pdf-to-pdfa";
import { postPdfToPptx } from "../blog-posts/pdf-to-pptx";
import { postPdfToText } from "../blog-posts/pdf-to-text";
import { postPdfToWord } from "../blog-posts/pdf-to-word";
import { postPdfUnlock } from "../blog-posts/pdf-unlock";
import { postPdfWatermark } from "../blog-posts/pdf-watermark";
import { postReorderPdf } from "../blog-posts/reorder-pdf";

export const pdfPosts: BlogPost[] = [
  postPdfCompress,
  postPdfMerge,
  postPdfMetadata,
  postPdfOcr,
  postPdfPageNumbers,
  postPdfProtect,
  postPdfRepair,
  postPdfRotate,
  postPdfSplit,
  postPdfToEpub,
  postPdfToExcel,
  postPdfToHtml,
  postPdfToImage,
  postPdfToMarkdown,
  postPdfToPdfa,
  postPdfToPptx,
  postPdfToText,
  postPdfToWord,
  postPdfUnlock,
  postPdfWatermark,
  postReorderPdf,
];
