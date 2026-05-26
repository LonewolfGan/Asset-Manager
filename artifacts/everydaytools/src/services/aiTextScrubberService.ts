export const cleanTextScrubInvisibles = (text: string): { cleaned: string, removedCount: number } => {
  const invisibleCharsRegex = /[​‌‍﻿⁠]/g;
  const matches = text.match(invisibleCharsRegex);
  const removedCount = matches ? matches.length : 0;
  const cleaned = text.replace(invisibleCharsRegex, "");
  return { cleaned, removedCount };
};

const replacementMap: Record<string, string[]> = {
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

export const applyStylisticScrub = (text: string): string => {
  let scrubbedText = text;
  
  for (const [phrase, alternatives] of Object.entries(replacementMap)) {
    const regex = new RegExp(`\\b${phrase}\\b`, "gi");
    scrubbedText = scrubbedText.replace(regex, (match) => {
      const isCapitalized = match.charAt(0) === match.charAt(0).toUpperCase();
      const randomAlt = alternatives[Math.floor(Math.random() * alternatives.length)];
      if (!randomAlt) return ""; // empty replacement
      
      // Preserve original capitalization if needed, simple approach:
      if (isCapitalized && randomAlt.length > 0) {
        return randomAlt.charAt(0).toUpperCase() + randomAlt.slice(1);
      }
      return randomAlt.toLowerCase();
    });
  }
  
  // Clean up double spaces that might result from empty replacements
  return scrubbedText.replace(/\s{2,}/g, ' ').trim();
};
