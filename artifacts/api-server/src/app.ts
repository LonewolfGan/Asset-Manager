import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import fs from "fs";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Explicit CORS allowlist — configurable via FRONTEND_URL for production.
// Add origins here or set FRONTEND_URL in the environment.
const CORS_ORIGINS = [
  process.env["FRONTEND_URL"] ?? "https://everydaytools.qzz.io",
  "http://localhost:5000",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no Origin header (curl, server-to-server, same-origin)
      if (!origin || CORS_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin "${origin}" not allowed`));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
    credentials: false,
    maxAge: 86400,
  }),
);

app.options("/*splat", cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api", router);

// In production, serve the built frontend static files.
// The frontend is built to artifacts/everydaytools/dist/public.
// process.cwd() is the api-server package directory (pnpm changes to it).
if (process.env["NODE_ENV"] === "production") {
  const frontendDist = path.join(process.cwd(), "..", "everydaytools", "dist", "public");

  if (fs.existsSync(frontendDist)) {
    logger.info({ frontendDist }, "Serving frontend static files");

    app.use(
      express.static(frontendDist, {
        maxAge: "1y",
        immutable: true,
        index: false,
      }),
    );

    // SPA catch-all: serve index.html for any non-API, non-asset request
    app.get("/*splat", (_req, res) => {
      res.sendFile(path.join(frontendDist, "index.html"));
    });
  } else {
    logger.warn({ frontendDist }, "Frontend dist not found — static serving skipped");
  }
}

export default app;
