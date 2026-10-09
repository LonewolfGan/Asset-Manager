import { readdir, stat, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { logger } from "./logger.js";

/** Prefix patterns created by everydaytools */
const TEMP_PREFIXES = ["lo-work-", "lo-profile-", "everydaytools"];

/**
 * Scan the system tmp directory and purge orphan everydaytools artifacts
 * older than maxAgeMs (default: 15 minutes).
 */
export async function cleanupTempFiles(maxAgeMs = 15 * 60 * 1000): Promise<{ cleaned: number; errors: number }> {
  const rootTmp = tmpdir();
  const now = Date.now();
  let cleaned = 0;
  let errors = 0;

  try {
    const entries = await readdir(rootTmp, { withFileTypes: true });

    for (const entry of entries) {
      const isTarget = TEMP_PREFIXES.some((prefix) => entry.name.startsWith(prefix));
      if (!isTarget) continue;

      const fullPath = join(rootTmp, entry.name);
      try {
        const fileStat = await stat(fullPath);
        const ageMs = now - fileStat.mtimeMs;

        if (ageMs > maxAgeMs) {
          await rm(fullPath, { recursive: true, force: true });
          cleaned++;
          logger.debug({ path: fullPath, ageMinutes: Math.round(ageMs / 60000) }, "Purged orphan temp directory");
        }
      } catch (statOrRmErr) {
        errors++;
        // File may have been removed concurrently by the worker
      }
    }
  } catch (err) {
    logger.warn({ err }, "Failed to read tmp directory for orphan cleanup");
  }

  if (cleaned > 0) {
    logger.info({ cleaned, errors }, "Orphan temp cleanup completed");
  }

  return { cleaned, errors };
}

/**
 * Start periodic temp cleanup schedule (every 15 minutes by default).
 */
export function startTempCleanupSchedule(intervalMs = 15 * 60 * 1000): NodeJS.Timeout {
  logger.info({ intervalMinutes: Math.round(intervalMs / 60000) }, "Starting periodic temp cleanup scheduler");

  // Initial cleanup on boot
  cleanupTempFiles().catch((err) => {
    logger.warn({ err }, "Initial temp cleanup failed");
  });

  const timer = setInterval(() => {
    cleanupTempFiles().catch((err) => {
      logger.warn({ err }, "Scheduled temp cleanup failed");
    });
  }, intervalMs);

  // Allow Node process to exit gracefully without waiting for this timer
  if (timer.unref) {
    timer.unref();
  }

  return timer;
}
