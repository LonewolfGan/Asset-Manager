import { Router } from "express";
import { upload } from "../../middlewares/upload.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { apiError } from "../../lib/errors.js";
import { guardSinglePdf, pdfBaseName } from "./guards.js";
import { buildContentDisposition } from "../convert/convert-image.js";
import { protectPdf, unlockPdf } from "./pdf-security-logic.js";
import { handlePdfProtect } from "../convert/pdf-protect-handler.js";

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
  async (req, res) => {
    if (!req.file) {
      apiError(res, 400, "NO_FILE", "No file uploaded");
      return;
    }

    const password = String(req.body.password ?? "");
    if (password.length > 128) {
      apiError(res, 400, "INVALID_PARAM", "Password too long (max 128 characters).");
      return;
    }
    const baseName = pdfBaseName(req.file.originalname);

    try {
      const unlockedBuf = await unlockPdf(req.file.buffer, { password });
      const disposition = buildContentDisposition(`${baseName}_unlocked.pdf`, "pdf");

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": disposition,
        "Cache-Control": "no-store",
      });
      res.send(unlockedBuf);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unlock failed";
      const isPasswordErr = /password|incorrect|chiffrement/i.test(msg);
      const isClient = isPasswordErr || /invalid|corrupt|password too long/i.test(msg);

      apiError(
        res,
        isClient ? 400 : 500,
        isPasswordErr ? "INVALID_PASSWORD" : isClient ? "INVALID_INPUT" : "CONVERSION_FAILED",
        msg
      );
    }
  }
);

export default router;
