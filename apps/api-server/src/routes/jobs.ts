import { Router, type Request, type Response } from "express";
import { upload, guardDocument } from "../middlewares/upload.js";
import { submitConversionJob, getJobStatus, getJobOutputPath } from "../lib/queue.js";
import { defaultRateLimit } from "../middlewares/rateLimit.js";
import { apiError } from "../lib/errors.js";
import { isValidTargetFormat, isValidInputExt } from "../lib/document-validation.js";

const router = Router();

/**
 * POST /api/jobs/create
 * Accept document upload and queue for asynchronous background conversion (HTTP 202).
 */
router.post(
  "/jobs/create",
  defaultRateLimit,
  upload.single("file"),
  guardDocument,
  async (req: Request, res: Response) => {
    if (!req.file) {
      apiError(res, 400, "NO_FILE", "No file uploaded");
      return;
    }

    const taskType = (req.body?.taskType as any) ?? "word-to-pdf";
    const targetFormat = String(req.body?.targetFormat ?? "pdf").toLowerCase().trim();
    const originalName = req.file.originalname ?? "document.docx";

    if (!isValidTargetFormat(targetFormat)) {
      apiError(res, 400, "INVALID_PARAM", `Unsupported target format: ${targetFormat}`);
      return;
    }

    const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
    const inputExt = extMatch ? extMatch[1].toLowerCase() : "docx";
    if (!isValidInputExt(inputExt)) {
      apiError(res, 400, "INVALID_PARAM", `Invalid input document extension: ${inputExt}`);
      return;
    }

    try {
      const { jobId } = await submitConversionJob(
        taskType,
        req.file.buffer,
        originalName,
        targetFormat,
      );

      res.status(202).json({
        jobId,
        status: "queued",
        message: "Document queued for high-performance conversion",
      });
    } catch (err) {
      apiError(
        res,
        500,
        "QUEUE_ERROR",
        err instanceof Error ? err.message : "Failed to queue conversion task",
      );
    }
  },
);

function getParamId(req: Request): string {
  const raw = req.params["id"];
  return Array.isArray(raw) ? raw[0] : (raw ?? "");
}

/**
 * GET /api/jobs/:id
 * Query current job status and progress (Polling fallback).
 */
router.get("/jobs/:id", async (req: Request, res: Response) => {
  const jobId = getParamId(req);
  if (!jobId) {
    apiError(res, 400, "INVALID_ID", "Job ID is required");
    return;
  }

  const status = await getJobStatus(jobId);
  if (status.status === "not_found") {
    apiError(res, 404, "NOT_FOUND", "Conversion job not found or expired");
    return;
  }

  res.json(status);
});

/**
 * GET /api/jobs/:id/events
 * Real-time Server-Sent Events (SSE) stream for live 60fps progress updates.
 */
router.get("/jobs/:id/events", async (req: Request, res: Response) => {
  const jobId = getParamId(req);
  if (!jobId) {
    apiError(res, 400, "INVALID_ID", "Job ID is required");
    return;
  }

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no", // Disable buffering in Caddy / Nginx
  });
  res.flushHeaders?.();

  // Send initial ping to confirm stream open
  res.write(`data: ${JSON.stringify({ type: "connected", jobId })}\n\n`);

  let isClosed = false;
  req.on("close", () => {
    isClosed = true;
  });

  // Poll state and emit delta events every 400ms until finished or client disconnects
  let lastPercent = -1;
  const interval = setInterval(async () => {
    if (isClosed) {
      clearInterval(interval);
      return;
    }

    try {
      const job = await getJobStatus(jobId);
      if (job.status === "not_found") {
        res.write(`data: ${JSON.stringify({ type: "error", error: "Job not found" })}\n\n`);
        clearInterval(interval);
        res.end();
        return;
      }

      if (job.progress.percent !== lastPercent || job.status === "completed" || job.status === "failed") {
        lastPercent = job.progress.percent;
        res.write(`data: ${JSON.stringify({ type: "progress", ...job })}\n\n`);
      }

      if (job.status === "completed" || job.status === "failed") {
        clearInterval(interval);
        res.end();
      }
    } catch {
      clearInterval(interval);
      res.end();
    }
  }, 400);
});

/**
 * GET /api/jobs/:id/download
 * Download the converted output file.
 */
router.get("/jobs/:id/download", async (req: Request, res: Response) => {
  const jobId = getParamId(req);
  if (!jobId) {
    apiError(res, 400, "INVALID_ID", "Job ID is required");
    return;
  }

  const fileInfo = await getJobOutputPath(jobId);
  if (!fileInfo) {
    apiError(res, 404, "NOT_FOUND", "Result file not found or expired");
    return;
  }

  res.download(fileInfo.path, fileInfo.filename, (err) => {
    if (err && !res.headersSent) {
      apiError(res, 404, "NOT_FOUND", "Result file not found or expired");
    }
  });
});

export default router;
