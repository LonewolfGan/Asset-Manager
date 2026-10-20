import { Router, type Request, type Response } from "express";
import { upload, guardDocument } from "../middlewares/upload.js";
import { submitConversionJob, getJobStatus, getJobOutputPath } from "../lib/queue.js";
import { defaultRateLimit } from "../middlewares/rateLimit.js";
import { apiError } from "../lib/errors.js";
import { isValidTargetFormat, isValidInputExt } from "../lib/document-validation.js";
import { buildContentDisposition } from "./convert/convert-image.js";

const router = Router();

export const SAFE_JOB_ID_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;

export function isValidJobId(jobId: unknown): boolean {
  if (typeof jobId !== "string") return false;
  const trimmed = jobId.trim();
  if (!trimmed || trimmed !== jobId) return false;
  return SAFE_JOB_ID_REGEX.test(trimmed);
}

export function getParamId(req: Request): string {
  const raw = req.params["id"];
  const val = Array.isArray(raw) ? raw[0] : (raw ?? "");
  return typeof val === "string" ? val.trim() : "";
}

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
    if (!req.file || !req.file.buffer || req.file.buffer.length === 0) {
      apiError(res, 400, "NO_FILE", "No file uploaded or file is empty");
      return;
    }

    const taskType = (req.body?.taskType as any) ?? "word-to-pdf";
    const targetFormat = String(req.body?.targetFormat ?? "pdf").toLowerCase().trim().replace(/^\./, "");
    const originalName = req.file.originalname?.trim() || "document.docx";

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

/**
 * GET /api/jobs/:id
 * Query current job status and progress (Polling fallback).
 */
router.get("/jobs/:id", defaultRateLimit, async (req: Request, res: Response) => {
  const jobId = getParamId(req);
  if (!isValidJobId(jobId)) {
    apiError(res, 400, "INVALID_ID", "Job ID is required and must be alphanumeric");
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
router.get("/jobs/:id/events", defaultRateLimit, async (req: Request, res: Response) => {
  const jobId = getParamId(req);
  if (!isValidJobId(jobId)) {
    apiError(res, 400, "INVALID_ID", "Job ID is required and must be alphanumeric");
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
  let interval: NodeJS.Timeout | null = null;
  let timeout: NodeJS.Timeout | null = null;

  const cleanup = () => {
    isClosed = true;
    if (interval) clearInterval(interval);
    if (timeout) clearTimeout(timeout);
  };

  req.on("close", cleanup);
  res.on("finish", cleanup);

  // Safety: close stream if hanging more than 10 minutes
  timeout = setTimeout(() => {
    if (!isClosed) {
      res.write(`data: ${JSON.stringify({ type: "error", error: "Stream timeout" })}\n\n`);
      cleanup();
      res.end();
    }
  }, 10 * 60_000);
  timeout.unref?.();

  // Poll state and emit delta events every 400ms until finished or client disconnects
  let lastPercent = -1;
  let isPolling = false;
  interval = setInterval(async () => {
    if (isClosed || isPolling) {
      if (isClosed) cleanup();
      return;
    }

    isPolling = true;
    try {
      const job = await getJobStatus(jobId);
      if (job.status === "not_found") {
        res.write(`data: ${JSON.stringify({ type: "error", error: "Job not found" })}\n\n`);
        cleanup();
        res.end();
        return;
      }

      if (job.progress.percent !== lastPercent || job.status === "completed" || job.status === "failed") {
        lastPercent = job.progress.percent;
        res.write(`data: ${JSON.stringify({ type: "progress", ...job })}\n\n`);
      }

      if (job.status === "completed" || job.status === "failed") {
        cleanup();
        res.end();
      }
    } catch {
      cleanup();
      res.end();
    } finally {
      isPolling = false;
    }
  }, 400);
  interval.unref?.();
});

/**
 * GET /api/jobs/:id/download
 * Download the converted output file with RFC 5987 Content-Disposition.
 */
router.get("/jobs/:id/download", defaultRateLimit, async (req: Request, res: Response) => {
  const jobId = getParamId(req);
  if (!isValidJobId(jobId)) {
    apiError(res, 400, "INVALID_ID", "Job ID is required and must be alphanumeric");
    return;
  }

  const fileInfo = await getJobOutputPath(jobId);
  if (!fileInfo) {
    apiError(res, 404, "NOT_FOUND", "Result file not found or expired");
    return;
  }

  const extMatch = fileInfo.filename.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : "bin";

  res.set({
    "Content-Disposition": buildContentDisposition(fileInfo.filename, ext),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });

  res.sendFile(fileInfo.path, (err) => {
    if (err && !res.headersSent) {
      apiError(res, 404, "NOT_FOUND", "Result file not found or expired");
    }
  });
});

export default router;
