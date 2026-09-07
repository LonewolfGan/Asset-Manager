import { spawn, type ChildProcess } from "child_process";
import { logger } from "./lib/logger.js";
import { BIN, getPythonScriptPath } from "./lib/binaries.js";

let daemonProcess: ChildProcess | null = null;
const DAEMON_PORT = process.env["REMBG_DAEMON_PORT"] ?? "5005";
const DAEMON_URL = `http://127.0.0.1:${DAEMON_PORT}`;

const DUMMY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export async function warmupRembg(): Promise<void> {
  try {
    const daemonScript = getPythonScriptPath("bg_daemon.py");
    logger.info({ daemonScript, port: DAEMON_PORT }, "Starting persistent rembg daemon...");

    daemonProcess = spawn(BIN.python3, [daemonScript], {
      env: {
        ...process.env,
        REMBG_MODEL: "isnet-general-use",
        REMBG_DAEMON_PORT: DAEMON_PORT,
        REMBG_DAEMON_HOST: "127.0.0.1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    daemonProcess.stdout?.on("data", (data: Buffer) => {
      logger.info({ src: "bg_daemon" }, data.toString().trim());
    });

    daemonProcess.stderr?.on("data", (data: Buffer) => {
      logger.warn({ src: "bg_daemon" }, data.toString().trim());
    });

    daemonProcess.on("exit", (code) => {
      logger.warn({ code }, "rembg daemon exited");
      daemonProcess = null;
    });

    // Poll health endpoint until ready (up to 30s)
    let ready = false;
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      try {
        const res = await fetch(`${DAEMON_URL}/health`);
        if (res.ok) {
          ready = true;
          break;
        }
      } catch {
        // still starting up
      }
    }

    if (ready) {
      logger.info("rembg daemon is ready — performing JIT warmup inference...");
      const dummyBuf = Buffer.from(DUMMY_PNG_BASE64, "base64");
      await fetch(`${DAEMON_URL}/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: dummyBuf,
      });
      logger.info("rembg daemon fully warmed up and hot in memory");
    } else {
      logger.warn("rembg daemon healthcheck timed out — falling back to per-request CLI mode");
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn({ err: msg }, "rembg daemon launch failed");
  }
}

export function getRembgDaemonUrl(): string {
  return DAEMON_URL;
}
