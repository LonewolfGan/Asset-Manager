declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function trackToolUsed(toolSlug: string, category: string): void {
  if (typeof window !== "undefined" && typeof window.plausible === "function") {
    window.plausible("Tool Used", { props: { tool: toolSlug, category } });
  }
}

export function trackToolError(toolSlug: string, errorType: string): void {
  if (typeof window !== "undefined" && typeof window.plausible === "function") {
    window.plausible("Tool Error", { props: { tool: toolSlug, error_type: errorType } });
  }
}

export function trackLanguageChanged(language: string): void {
  if (typeof window !== "undefined" && typeof window.plausible === "function") {
    window.plausible("Language Changed", { props: { language } });
  }
}
