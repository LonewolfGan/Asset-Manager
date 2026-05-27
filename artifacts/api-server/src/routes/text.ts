import { Router, type IRouter } from "express";

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
    res.status(400).json({ error: "text field required" });
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

export default router;
