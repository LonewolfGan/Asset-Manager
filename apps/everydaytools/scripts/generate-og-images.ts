import { writeFileSync, mkdirSync, existsSync, statSync, copyFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { SEO_TOOLS, type Locale } from "../src/config/tools-seo-data";
import { BLOG_POSTS } from "../src/config/blog-data";
import { resolveToolOgData, resolveBlogOgData, resolveHomeOgData } from "../src/lib/og/og-data-resolver";
import { generateOgSvg, renderOgPng } from "../src/lib/og/og-svg-template";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface OgCardItem {
  relPath: string; // e.g. "og/tools/en/slug.png"
  svg: string;
}

export function collectAllCardItems(): OgCardItem[] {
  const locales: Locale[] = ["en", "fr"];
  const items: OgCardItem[] = [];

  for (const locale of locales) {
    // 1. Home card
    const homeData = resolveHomeOgData(locale);
    items.push({
      relPath: `og/home-${locale}.png`,
      svg: generateOgSvg(homeData),
    });

    // 2. Tool cards
    for (const tool of SEO_TOOLS) {
      const slug = tool.slugs[locale];
      const toolData = resolveToolOgData(tool, locale);
      items.push({
        relPath: `og/tools/${locale}/${slug}.png`,
        svg: generateOgSvg(toolData),
      });
    }

    // 3. Blog cards
    for (const post of BLOG_POSTS) {
      const slug = post.slug[locale];
      const blogData = resolveBlogOgData(post, locale);
      items.push({
        relPath: `og/blog/${locale}/${slug}.png`,
        svg: generateOgSvg(blogData),
      });
    }
  }

  return items;
}

export async function generateAllOgImages(baseDirs: string[]): Promise<number> {
  const force = process.env.FORCE_OG === "true";
  const items = collectAllCardItems();

  // Ensure all directories exist across target base dirs
  for (const baseDir of baseDirs) {
    mkdirSync(resolve(baseDir, "og/tools/en"), { recursive: true });
    mkdirSync(resolve(baseDir, "og/tools/fr"), { recursive: true });
    mkdirSync(resolve(baseDir, "og/blog/en"), { recursive: true });
    mkdirSync(resolve(baseDir, "og/blog/fr"), { recursive: true });
  }

  // Filter items that need rendering (missing or empty in ANY of the baseDirs)
  const pendingItems = items.filter((item) => {
    if (force) return true;
    return baseDirs.some((dir) => {
      const fullPath = resolve(dir, item.relPath);
      return !existsSync(fullPath) || statSync(fullPath).size === 0;
    });
  });

  if (pendingItems.length === 0) {
    return 0;
  }

  // Render each unique SVG once, then write to all baseDirs
  const BATCH_SIZE = 16;
  let processed = 0;

  for (let i = 0; i < pendingItems.length; i += BATCH_SIZE) {
    const batch = pendingItems.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (item) => {
        try {
          // Check if primary baseDir already has it to avoid re-rendering
          const primaryPath = resolve(baseDirs[0], item.relPath);
          let pngBuffer: Buffer;

          if (!force && existsSync(primaryPath) && statSync(primaryPath).size > 0) {
            // Already rendered in primary, copy to secondary dirs if missing
            for (let d = 1; d < baseDirs.length; d++) {
              const dest = resolve(baseDirs[d], item.relPath);
              if (!existsSync(dest) || statSync(dest).size === 0) {
                copyFileSync(primaryPath, dest);
              }
            }
            return;
          }

          // Rasterize SVG exactly ONCE
          pngBuffer = await renderOgPng(item.svg);

          // Write buffer to all target base directories
          for (const dir of baseDirs) {
            const destPath = resolve(dir, item.relPath);
            writeFileSync(destPath, pngBuffer);
          }
        } catch (err) {
          throw new Error(`Failed to generate OG image for "${item.relPath}": ${String(err)}`);
        }
      })
    );
    processed += batch.length;
  }

  return processed;
}

// Auto-run if executed directly via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const startTime = Date.now();
  const rootDir = resolve(__dirname, "..");
  const publicDir = resolve(rootDir, "public");
  const distPublicDir = resolve(rootDir, "dist/public");

  const targetDirs = [publicDir];
  if (existsSync(distPublicDir)) {
    targetDirs.push(distPublicDir);
  }

  console.log(`[OG Engine] Generating dark-hardware social preview cards...`);
  generateAllOgImages(targetDirs)
    .then((count) => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`[OG Engine] Successfully generated/synchronized ${count} PNG cards in ${elapsed}s.`);
    })
    .catch((err) => {
      console.error("[OG Engine] Generation failed:", err);
      process.exit(1);
    });
}
