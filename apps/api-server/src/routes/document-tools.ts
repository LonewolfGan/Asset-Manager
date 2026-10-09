import { Router } from "express";
import officeToPdfRouter from "./docs/office-to-pdf.js";
import htmlMarkdownToPdfRouter from "./docs/html-markdown-to-pdf.js";
import textMarkdownToDocxRouter from "./docs/text-markdown-to-docx.js";
import documentConvertRouter from "./docs/document-convert.js";

const router = Router();

router.use(officeToPdfRouter);
router.use(htmlMarkdownToPdfRouter);
router.use(textMarkdownToDocxRouter);
router.use(documentConvertRouter);

export default router;
