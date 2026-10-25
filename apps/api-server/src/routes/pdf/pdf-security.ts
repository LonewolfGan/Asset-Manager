import { Router } from "express";
import { upload } from "../../middlewares/upload.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { guardSinglePdf } from "./guards.js";
import { handlePdfProtect } from "../convert/pdf-protect-handler.js";
import { handlePdfUnlock } from "../convert/pdf-unlock-handler.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-protect
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-protect",
  defaultRateLimit,
  upload.single("file"),
  guardSinglePdf,
  handlePdfProtect
);

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-unlock
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-unlock",
  defaultRateLimit,
  upload.single("file"),
  guardSinglePdf,
  handlePdfUnlock
);

export default router;
