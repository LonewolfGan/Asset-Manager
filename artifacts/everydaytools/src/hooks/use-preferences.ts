import { useState, useEffect } from "react";

export type Preferences = {
  theme: "light" | "dark" | "system";
  sidebarPinned: boolean;
  lastVisitedTool: string;
};

const defaultPrefs: Preferences = {
  theme: "system",
  sidebarPinned: true,
  lastVisitedTool: "/",
};

export const usePreferences = () => {
  const [prefs, setPrefs] = useState<Preferences>(defaultPrefs);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("everydaytools_prefs");
      if (stored) {
        setPrefs({ ...defaultPrefs, ...JSON.parse(stored) });
      }
    } catch (e) {
      // ignore
    }
    setMounted(true);
  }, []);

  const updatePrefs = (newPrefs: Partial<Preferences>) => {
    setPrefs((prev) => {
      const updated = { ...prev, ...newPrefs };
      try {
        localStorage.setItem("everydaytools_prefs", JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let effectiveTheme = prefs.theme;
    if (prefs.theme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    if (effectiveTheme === "dark") {
      root.classList.add("dark");
    }
  }, [prefs.theme, mounted]);

  return { prefs, updatePrefs, mounted };
};
