import app from "./app";
import { logger } from "./lib/logger";
import { warmupRembg, checkGotenbergStatus } from "./warmup";
import { startTempCleanupSchedule } from "./lib/temp-cleanup";
import { initConversionQueue } from "./lib/queue";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // Start periodic orphan temp directory cleanup (every 15 mins)
  startTempCleanupSchedule();

  // Check Gotenberg warm pool availability
  checkGotenbergStatus();

  // Initialize BullMQ conversion queue (with resilient in-memory fallback)
  initConversionQueue();

  // Warm up the rembg model in the background so it's cached for first user request.
  warmupRembg();
});
