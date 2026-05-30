export async function copyWithToast(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    window.dispatchEvent(new CustomEvent('et:copied'));
  } catch {
    // silent fail — clipboard access denied
  }
}
