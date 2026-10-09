import { spawn } from "child_process";
import { BIN } from "./binaries.js";

/**
 * Asynchronously linearizes a PDF buffer via qpdf without blocking the Node.js event loop.
 * If qpdf fails or is unavailable, falls back gracefully to returning the original buffer.
 *
 * @param inputBuffer PDF bytes to linearize
 * @returns Linearized PDF buffer, or original buffer on failure
 */
export function linearizePdf(inputBuffer: Buffer): Promise<Buffer> {
  if (!inputBuffer || inputBuffer.length === 0) {
    return Promise.resolve(inputBuffer);
  }

  return new Promise((resolve) => {
    try {
      const child = spawn(BIN.qpdf, ["--linearize", "-", "-"], {
        stdio: ["pipe", "pipe", "ignore"],
      });

      const chunks: Buffer[] = [];

      child.stdout.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      const timer = setTimeout(() => {
        try {
          child.kill("SIGKILL");
        } catch {}
        resolve(inputBuffer);
      }, 30_000);

      child.on("error", () => {
        clearTimeout(timer);
        resolve(inputBuffer);
      });

      child.on("close", (code) => {
        clearTimeout(timer);
        if ((code === 0 || code === 3) && chunks.length > 0) {
          resolve(Buffer.concat(chunks));
        } else {
          resolve(inputBuffer);
        }
      });

      child.stdin.on("error", () => {
        // Ignore EPIPE if child process exits early
      });

      child.stdin.end(inputBuffer);
    } catch {
      resolve(inputBuffer);
    }
  });
}
