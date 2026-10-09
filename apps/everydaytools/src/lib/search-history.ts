export const HISTORY_KEY = 'et:search-history';
export const MAX_HISTORY = 5;

/**
 * Reads the list of past search queries from localStorage
 */
export function readHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
  } catch {
    return [];
  }
}

/**
 * Saves a new query to history (deduplicated, max 5, newest on top)
 */
export function saveToHistory(q: string): void {
  const trimmed = q.trim();
  if (!trimmed) return;
  try {
    const prev = readHistory();
    const next = [trimmed, ...prev.filter((s) => s !== trimmed)].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {}
}

/**
 * Removes a specific query from history
 */
export function removeFromHistory(q: string): void {
  try {
    const prev = readHistory();
    const next = prev.filter((s) => s !== q);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {}
}

/**
 * Clears the entire search history
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {}
}
