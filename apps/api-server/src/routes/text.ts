import { Router, type IRouter, type Request, type Response } from "express";
import { apiError } from "../lib/errors.js";
import { defaultRateLimit } from "../middlewares/rateLimit.js";

const router: IRouter = Router();

/**
 * Matches zero-width spaces, joiners, direction marks, word joiners, soft hyphens,
 * and invisible directional/operator characters frequently injected as AI watermarks.
 */
export const INVISIBLE_CHARS_REGEX = /[\u200B-\u200D\uFEFF\u2060-\u2064\u200E\u200F\u00AD\u202A-\u202E]/g;

export const REPLACEMENT_MAP: Record<string, string[]> = {
  "in conclusion": ["overall", "to sum up", "in short"],
  "it is important to note": ["note that", "worth mentioning"],
  "furthermore": ["also", "in addition", "beyond this"],
  "moreover": ["also", "in addition"],
  "in summary": ["in short", "to recap", "overall"],
  "it is worth noting": ["note that"],
  "as previously mentioned": ["as noted", "earlier"],
  "in today's world": ["today", "currently"],
  "at the end of the day": ["ultimately", "finally"],
  "needless to say": [""],
  "it goes without saying": [""],
  "delve into": ["explore", "examine", "investigate"],
  "testament to": ["proof of", "evidence of"],
  "tapestry": ["collection", "blend", "combination"],
  "beacon of": ["symbol of", "model of"],
  "crucial": ["key", "essential", "important"],
  "paramount": ["vital", "essential", "primary"],
  "harness the power of": ["use", "leverage"],
  "ever-evolving": ["changing", "evolving"],
  "bustling": ["busy", "active"],
};

// Pre-compiled regex patterns for O(1) loop execution
const COMPILED_REPLACEMENTS = Object.entries(REPLACEMENT_MAP).map(([phrase, alternatives]) => ({
  regex: new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"),
  alternatives,
}));

export interface ScrubOptions {
  invisibles?: boolean;
  stylistic?: boolean;
}

export function scrubText(
  text: string,
  options?: ScrubOptions,
): { cleaned: string; removedCount: number } {
  if (!text) {
    return { cleaned: "", removedCount: 0 };
  }

  const scrubInvisibles = options?.invisibles !== false;
  const scrubStylistic = options?.stylistic !== false;

  // Normalize curly smart quotes/apostrophes to ASCII for reliable boundary matching
  let cleaned = text.replace(/[\u2018\u2019]/g, "'");
  let removedCount = 0;

  if (scrubInvisibles) {
    const matches = cleaned.match(INVISIBLE_CHARS_REGEX);
    removedCount = matches ? matches.length : 0;
    cleaned = cleaned.replace(INVISIBLE_CHARS_REGEX, "");
  }

  if (scrubStylistic) {
    for (const { regex, alternatives } of COMPILED_REPLACEMENTS) {
      cleaned = cleaned.replace(regex, (match) => {
        const isCapitalized = match.charAt(0) === match.charAt(0).toUpperCase();
        const alt = alternatives[0] ?? "";
        if (!alt) return "";
        return isCapitalized
          ? alt.charAt(0).toUpperCase() + alt.slice(1)
          : alt.toLowerCase();
      });
    }
  }

  // Normalize spaces, orphan punctuation, and punctuation spacing
  cleaned = cleaned
    .replace(/\s{2,}/g, " ")
    .replace(/,\s*,/g, ",")
    .replace(/^[.,;:!?]\s*/, "")
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim();

  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return { cleaned, removedCount };
}

router.post("/text/scrub", defaultRateLimit, (req: Request, res: Response) => {
  const body = (req.body ?? {}) as { text?: unknown; options?: ScrubOptions };
  const { text, options } = body;

  if (typeof text !== "string") {
    apiError(res, 400, "MISSING_PARAM", "text field required");
    return;
  }

  if (text.length > 100_000) {
    apiError(res, 413, "PAYLOAD_TOO_LARGE", "Text exceeds maximum limit of 100,000 characters");
    return;
  }

  const result = scrubText(text, options);
  res.json(result);
});

router.get("/text/tts", defaultRateLimit, async (req: Request, res: Response) => {
  const rawText = req.query["text"];
  const trimmed = typeof rawText === "string" ? rawText.trim() : "";
  if (!trimmed) {
    apiError(res, 400, "MISSING_PARAM", "text query parameter required and cannot be empty");
    return;
  }

  // Clean and sanitize string (max 150 chars for pronunciation snippets)
  const text = trimmed.slice(0, 150);
  const rawLang = typeof req.query["lang"] === "string" ? req.query["lang"].toLowerCase() : "en";
  const supportedLangs = new Set(["en", "fr", "es", "de", "it"]);
  const lang = supportedLangs.has(rawLang) ? rawLang : "en";

  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    const upstreamRes = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "*/*",
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!upstreamRes.ok) {
      apiError(res, 502, "TTS_UPSTREAM_ERROR", `Upstream TTS error ${upstreamRes.status}`);
      return;
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");

    const arrayBuffer = await upstreamRes.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    apiError(res, 500, "TTS_ERROR", err instanceof Error ? err.message : "TTS error");
  }
});

export default router;
