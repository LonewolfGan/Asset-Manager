import { Router } from "express";
import pdfTransformRouter from "./pdf/pdf-transform.js";
import pdfSecurityRouter from "./pdf/pdf-security.js";
import pdfAnnotateRouter from "./pdf/pdf-annotate.js";
import pdfOptimizeRouter from "./pdf/pdf-optimize.js";
import pdfConversionRouter from "./pdf/pdf-conversion.js";
import pdfOcrRouter from "./pdf/pdf-ocr.js";

const router = Router();

router.use(pdfTransformRouter);
router.use(pdfSecurityRouter);
router.use(pdfAnnotateRouter);
router.use(pdfOptimizeRouter);
router.use(pdfConversionRouter);
router.use(pdfOcrRouter);

export default router;
