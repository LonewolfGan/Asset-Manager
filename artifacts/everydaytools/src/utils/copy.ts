export async function copyWithToast(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // silent fail — clipboard access denied
  }
}
