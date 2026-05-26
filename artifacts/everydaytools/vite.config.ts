import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import type { ViteDevServer } from "vite";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

function seoSsrPlugin() {
  return {
    name: "seo-ssr-middleware",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url ?? "/").split("?")[0];

        try {
          if (pathname === "/robots.txt") {
            const mod = await server.ssrLoadModule("/src/lib/seo-ssr.ts");
            res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" });
            res.end(mod.generateRobotsTxt());
            return;
          }

          if (pathname === "/sitemap.xml") {
            const mod = await server.ssrLoadModule("/src/lib/seo-ssr.ts");
            res.writeHead(200, { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" });
            res.end(mod.generateSitemapXml());
            return;
          }

          if (pathname === "/hreflang-manifest.json") {
            const mod = await server.ssrLoadModule("/src/lib/seo-ssr.ts");
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=3600" });
            res.end(mod.generateHreflangManifest());
            return;
          }

          const enToolMatch = /^\/en\/([^/]+)\/?$/.exec(pathname);
          const frToolMatch = /^\/fr\/([^/]+)\/?$/.exec(pathname);
          const isEnHome = pathname === "/en" || pathname === "/en/";
          const isFrHome = pathname === "/fr" || pathname === "/fr/";

          if (enToolMatch || frToolMatch || isEnHome || isFrHome) {
            const mod = await server.ssrLoadModule("/src/lib/seo-ssr.ts");
            let html: string | null = null;

            if (isEnHome) {
              html = mod.generateHomepageHtml("en");
            } else if (isFrHome) {
              html = mod.generateHomepageHtml("fr");
            } else if (enToolMatch) {
              html = mod.generateToolPageHtml(enToolMatch[1], "en");
            } else if (frToolMatch) {
              html = mod.generateToolPageHtml(frToolMatch[1], "fr");
            }

            if (html) {
              res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300" });
              res.end(html);
              return;
            }
          }
        } catch (e) {
          server.config.logger.error(`[seo-ssr] ${e}`);
        }

        next();
      });
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    seoSsrPlugin(),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: process.env.VERCEL
      ? path.resolve(import.meta.dirname, "../../public")
      : path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: !process.env.VERCEL,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
