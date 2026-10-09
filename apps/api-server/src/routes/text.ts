import { Router, type IRouter } from "express";
import { apiError } from "../lib/errors.js";

const router: IRouter = Router();

const INVISIBLE_RE = /[​‌‍﻿⁠]/g;

const REPLACEMENT_MAP: Record<string, string[]> = {
  "In conclusion": ["To sum up", "Overall", "Taken together"],
  "It is important to note": ["Note that", "Worth mentioning"],
  "Furthermore": ["Also", "Beyond this"],
  "In summary": ["In short", "To recap"],
  "It is worth noting": ["Note that"],
  "As previously mentioned": ["As noted"],
  "In today's world": [""],
  "At the end of the day": ["Ultimately"],
  "Needless to say": [""],
  "It goes without saying": [""],
};

router.post("/text/scrub", (req, res) => {
  const { text, options } = req.body as {
    text: string;
    options?: { invisibles?: boolean; stylistic?: boolean };
  };

  if (typeof text !== "string") {
    apiError(res, 400, "MISSING_PARAM", "text field required");
    return;
  }

  const scrubInvisibles = options?.invisibles !== false;
  const scrubStylistic = options?.stylistic !== false;

  let cleaned = text;
  let removedCount = 0;

  if (scrubInvisibles) {
    const matches = cleaned.match(INVISIBLE_RE);
    removedCount = matches ? matches.length : 0;
    cleaned = cleaned.replace(INVISIBLE_RE, "");
  }

  if (scrubStylistic) {
    for (const [phrase, alternatives] of Object.entries(REPLACEMENT_MAP)) {
      const regex = new RegExp(`\\b${phrase}\\b`, "gi");
      cleaned = cleaned.replace(regex, (match) => {
        const isCapitalized = match.charAt(0) === match.charAt(0).toUpperCase();
        const randomAlt = alternatives[Math.floor(Math.random() * alternatives.length)];
        if (!randomAlt) return "";
        return isCapitalized
          ? randomAlt.charAt(0).toUpperCase() + randomAlt.slice(1)
          : randomAlt.toLowerCase();
      });
    }
    cleaned = cleaned.replace(/\s{2,}/g, " ").trim();
  }

  res.json({ cleaned, removedCount });
});

router.get("/text/tts", async (req, res) => {
  const rawText = req.query["text"] as string | undefined;
  if (!rawText || typeof rawText !== "string") {
    apiError(res, 400, "MISSING_PARAM", "text query parameter required");
    return;
  }

  // Clean and sanitize string (max 120 chars for pronunciation)
  const text = rawText.trim().slice(0, 120);
  const lang = (req.query["lang"] as string) === "en" ? "en" : "fr";

  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    const upstreamRes = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "*/*",
      },
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

