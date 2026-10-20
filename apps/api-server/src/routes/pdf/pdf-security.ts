import { Router } from "express";
import { upload } from "../../middlewares/upload.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { apiError } from "../../lib/errors.js";
import { guardSinglePdf, pdfBaseName } from "./guards.js";
import { buildContentDisposition } from "../convert/convert-image.js";
import { protectPdf, unlockPdf } from "./pdf-security-logic.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-protect
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-protect",
  defaultRateLimit,
  upload.single("file"),
  guardSinglePdf,
  async (req, res) => {
    if (!req.file) {
      apiError(res, 400, "NO_FILE", "No file uploaded");
      return;
    }

    const userPassword = String(req.body.userPassword ?? req.body.password ?? "");
    const ownerPassword = String(req.body.ownerPassword ?? "");

    if (!userPassword.trim() && !ownerPassword.trim()) {
      apiError(
        res,
        400,
        "MISSING_PARAM",
        "At least one password (user or owner) is required."
      );
      return;
    }
    if (userPassword.length > 128 || ownerPassword.length > 128) {
      apiError(res, 400, "INVALID_PARAM", "Password too long (max 128 characters).");
      return;
    }
    if (userPassword && ownerPassword && userPassword === ownerPassword) {
      apiError(res, 400, "INVALID_PARAM", "User password and owner password cannot be identical.");
      return;
    }

    const allowPrinting = String(req.body.allowPrinting ?? "true") !== "false";
    const allowCopying = String(req.body.allowCopying ?? "true") !== "false";
    const allowModifying = String(req.body.allowModifying ?? "false") === "true";
    const baseName = pdfBaseName(req.file.originalname);

    try {
      const result = await protectPdf(req.file.buffer, {
        userPassword,
        ownerPassword,
        allowPrinting,
        allowCopying,
        allowModifying,
      });

      const disposition = buildContentDisposition(`${baseName}_protected.pdf`, "pdf");

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": disposition,
        "X-Encryption": result.encryption,
        "Cache-Control": "no-store",
        "Access-Control-Expose-Headers": "X-Encryption",
      });
      res.send(result.buffer);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Protection failed";
      const isClient = /missing|invalid|password too long|cannot be identical|already|encrypt/i.test(msg);
      apiError(
        res,
        isClient ? 400 : 500,
        isClient ? "INVALID_INPUT" : "CONVERSION_FAILED",
        msg
      );
    }
  }
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
