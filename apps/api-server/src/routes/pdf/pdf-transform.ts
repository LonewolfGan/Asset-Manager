import { Router } from "express";
import { upload } from "../../middlewares/upload.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { apiError } from "../../lib/errors.js";
import { guardSinglePdf, guardMultiPdf, pdfBaseName } from "./guards.js";
import { buildContentDisposition } from "../convert/convert-image.js";
import { handlePdfMerge } from "../convert/pdf-merge-handler.js";
import {
  reorderPdfPages,
  mergePdfDocuments,
  splitPdfDocument,
  rotatePdfPages,
} from "./pdf-transform-logic.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-reorder
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-reorder",
  defaultRateLimit,
  upload.single("file"),
  guardSinglePdf,
  async (req, res) => {
    if (!req.file) {
      apiError(res, 400, "NO_FILE", "No file uploaded");
      return;
    }

    const pagesParam = String(req.body.pages ?? "");
    if (!pagesParam.trim()) {
      apiError(
        res,
        400,
        "MISSING_PARAM",
        "pages parameter required (comma-separated 1-based page numbers)"
      );
      return;
    }

    try {
      const pageNumbers = pagesParam
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n) && n > 0);

      if (pageNumbers.length === 0) {
        apiError(
          res,
          400,
          "INVALID_PARAM",
          "No valid page indices. Pages must be 1-based integers within document range."
        );
        return;
      }

      const result = await reorderPdfPages(req.file.buffer, pageNumbers);
      const baseName = pdfBaseName(req.file.originalname);
      const disposition = buildContentDisposition(`${baseName}_reordered.pdf`, "pdf");

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": disposition,
        "X-Page-Count": String(result.pageCount),
        "Cache-Control": "no-store",
        "Access-Control-Expose-Headers": "X-Page-Count",
      });
      res.send(result.buffer);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Reorder failed";
      const status = msg.includes("No valid page") || msg.includes("Invalid") ? 400 : 500;
      apiError(res, status, "CONVERSION_FAILED", msg);
    }
  }
);

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-merge (Delegated to High-Fidelity Merge Engine)
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-merge",
  defaultRateLimit,
  upload.array("files", 20),
  guardMultiPdf,
  handlePdfMerge
);

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-split
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-split",
  defaultRateLimit,
  upload.single("file"),
  guardSinglePdf,
  async (req, res) => {
    if (!req.file) {
      apiError(res, 400, "NO_FILE", "No file uploaded");
      return;
    }

    try {
      const mode = (String(req.body.mode ?? "every") as "every" | "ranges");
      const rangesStr = String(req.body.ranges ?? "");
      const mergeOutput = String(req.body.merge ?? "false") === "true";
      const baseName = pdfBaseName(req.file.originalname);

      const result = await splitPdfDocument(req.file.buffer, {
        mode,
        rangesStr,
        mergeOutput,
        baseName,
      });

      if (result.isZip) {
        const disposition = buildContentDisposition(`${baseName}_split.zip`, "zip");
        res.set({
          "Content-Type": "application/zip",
          "Content-Disposition": disposition,
          "X-Segment-Count": String(result.segmentCount),
          "Cache-Control": "no-store",
          "Access-Control-Expose-Headers": "X-Segment-Count",
        });
      } else {
        const disposition = buildContentDisposition(`${baseName}_extracted.pdf`, "pdf");
        res.set({
          "Content-Type": "application/pdf",
          "Content-Disposition": disposition,
          "X-Segment-Count": String(result.segmentCount),
          "Cache-Control": "no-store",
          "Access-Control-Expose-Headers": "X-Segment-Count",
        });
      }
      res.send(result.buffer);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Split failed";
      const status = msg.includes("Invalid or empty") || msg.includes("corrupt") ? 400 : 500;
      apiError(res, status, "CONVERSION_FAILED", msg);
    }
  }
);

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-rotate
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-rotate",
  defaultRateLimit,
  upload.single("file"),
  guardSinglePdf,
  async (req, res) => {
    if (!req.file) {
      apiError(res, 400, "NO_FILE", "No file uploaded");
      return;
    }

    const parsed = parseInt(String(req.body.rotation ?? "90"), 10);
    const rotationDeg = Number.isFinite(parsed) ? parsed : 90;
    const pageList = String(req.body.pages ?? "all");
    const rotationsRaw = req.body.rotations;

    try {
      let perPageRotations: Record<string | number, number> | number[] | undefined;
      if (rotationsRaw) {
        try {
          perPageRotations =
            typeof rotationsRaw === "string" ? JSON.parse(rotationsRaw) : rotationsRaw;
        } catch {
          perPageRotations = undefined;
        }
      }

      const result = await rotatePdfPages(req.file.buffer, {
        rotationDeg,
        pages: pageList,
        perPageRotations,
      });

      const baseName = pdfBaseName(req.file.originalname);
      const disposition = buildContentDisposition(`${baseName}_rotated.pdf`, "pdf");

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": disposition,
        "X-Page-Count": String(result.pageCount),
        "Cache-Control": "no-store",
        "Access-Control-Expose-Headers": "X-Page-Count",
      });
      res.send(result.buffer);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Rotation failed";
      const isClientErr = msg.includes("Invalid") || msg.includes("corrupt");
      apiError(res, isClientErr ? 400 : 500, "CONVERSION_FAILED", msg);
    }
  }
);

export default router;
