import { readdir, stat, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { logger } from "./logger.js";
import { evictExpiredInMemoryJobs } from "./queue-memory.js";

/** Top-level temporary prefix patterns created directly under /tmp */
const TOP_LEVEL_PREFIXES = ["lo-work-", "lo-profile-", "rembg-"];

/**
 * Scan the system tmp directory and purge orphan everydaytools artifacts
 * older than maxAgeMs (default: 15 minutes).
 *
 * CRITICAL SAFETY INVARIANT: Never deletes the parent /tmp/everydaytools directory itself,
 * only stale session and job subdirectories inside it.
 */
export async function cleanupTempFiles(maxAgeMs = 15 * 60 * 1000): Promise<{ cleaned: number; errors: number }> {
  const rootTmp = tmpdir();
  const now = Date.now();
  let cleaned = 0;
  let errors = 0;

  // 1. Clean top-level isolated temp workspaces (lo-work-*, lo-profile-*, rembg-*)
  try {
    const entries = await readdir(rootTmp, { withFileTypes: true });

    for (const entry of entries) {
      const isTarget = TOP_LEVEL_PREFIXES.some((prefix) => entry.name.startsWith(prefix));
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
      } catch {
        errors++;
      }
    }
  } catch (err) {
    logger.warn({ err }, "Failed to read tmp directory for top-level cleanup");
  }

  // 2. Clean stale subdirectories inside /tmp/everydaytools (sessions & jobs), leaving parent intact
  const everydaytoolsDir = join(rootTmp, "everydaytools");
  try {
    const subEntries = await readdir(everydaytoolsDir, { withFileTypes: true });

    for (const sub of subEntries) {
      const subPath = join(everydaytoolsDir, sub.name);

      if (sub.name === "jobs") {
        // Purge individual stale job folders inside /tmp/everydaytools/jobs/
        try {
          const jobEntries = await readdir(subPath, { withFileTypes: true });
          for (const job of jobEntries) {
            const jobPath = join(subPath, job.name);
            const jobStat = await stat(jobPath);
            if (now - jobStat.mtimeMs > maxAgeMs) {
              await rm(jobPath, { recursive: true, force: true });
              cleaned++;
              logger.debug({ path: jobPath }, "Purged stale background job directory");
            }
          }
        } catch {
          // jobs folder read error or already removed
        }
        continue;
      }

      try {
        const fileStat = await stat(subPath);
        const ageMs = now - fileStat.mtimeMs;

        if (ageMs > maxAgeMs) {
          await rm(subPath, { recursive: true, force: true });
          cleaned++;
          logger.debug({ path: subPath, ageMinutes: Math.round(ageMs / 60000) }, "Purged stale session directory");
        }
      } catch {
        errors++;
      }
    }
  } catch {
    // /tmp/everydaytools doesn't exist yet or not accessible, normal on fresh start
  }

  // 3. Purge idle expired in-memory queue jobs
  try {
    evictExpiredInMemoryJobs();
  } catch {}

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
