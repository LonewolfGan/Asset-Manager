import { toast } from 'sonner';
import { trackToolUsed } from '@/lib/analytics';
import { downloadText } from '@/lib/download';

export function downloadPatchFile(patchText: string, isFr: boolean) {
  if (!patchText) return;
  trackToolUsed('diff-checker', 'download-patch');
  downloadText(patchText, 'changes.diff', 'text/plain;charset=utf-8');
  toast.success(isFr ? 'Fichier changes.diff téléchargé' : 'File changes.diff downloaded');
}

export function downloadOriginalFile(textA: string, isFr: boolean) {
  if (!textA) return;
  downloadText(textA, 'original.txt', 'text/plain;charset=utf-8');
  toast.success(isFr ? 'Fichier original.txt téléchargé' : 'File original.txt downloaded');
}

export function downloadModifiedFile(textB: string, isFr: boolean) {
  if (!textB) return;
  downloadText(textB, 'modified.txt', 'text/plain;charset=utf-8');
  toast.success(isFr ? 'Fichier modified.txt téléchargé' : 'File modified.txt downloaded');
}
