import { apiUrl } from "@/lib/apiBase";

export interface AsyncConversionParams {
  taskType: "word-to-pdf" | "excel-to-pdf" | "pptx-to-pdf" | "document-convert";
  file: File;
  targetFormat?: string;
  onProgress?: (percent: number, label: string) => void;
  fallbackSyncUrl?: string;
  extraFields?: Record<string, string>;
}

export interface AsyncConversionResult {
  blob: Blob;
  filename: string;
  sizeAfter: number;
  sizeBefore: number;
}

/**
 * Execute a resilient document conversion:
 * 1. Submits task to BullMQ async queue (HTTP 202).
 * 2. Streams real-time SSE progress events (60fps dynamic label in ConversionConduit).
 * 3. Falls back gracefully to HTTP polling if SSE is blocked by client proxy.
 * 4. Falls back to direct synchronous HTTP endpoint if async queue fails.
 */
export async function runAsyncDocumentConversion({
  taskType,
  file,
  targetFormat = "pdf",
  onProgress,
  fallbackSyncUrl,
  extraFields,
}: AsyncConversionParams): Promise<AsyncConversionResult> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("taskType", taskType);
  fd.append("targetFormat", targetFormat);

  if (extraFields) {
    for (const [key, val] of Object.entries(extraFields)) {
      if (val !== undefined && val !== null && val !== "") {
        fd.append(key, val);
      }
    }
  }

  try {
    onProgress?.(10, "Envoi du document...");

    const createRes = await fetch(apiUrl("/api/jobs/create"), {
      method: "POST",
      body: fd,
    });

    if (!createRes.ok) {
      throw new Error(`Queue submission returned HTTP ${createRes.status}`);
    }

    const { jobId } = (await createRes.json()) as { jobId: string };

    // Try Real-Time SSE stream first
    const result = await streamJobProgress(jobId, onProgress);
    return result;
  } catch (asyncErr) {
    // If fallback sync URL is provided (e.g. /api/tools/word-to-pdf), try direct sync
    if (fallbackSyncUrl) {
      onProgress?.(40, "Traitement direct en cours...");
      const syncRes = await fetch(apiUrl(fallbackSyncUrl), {
        method: "POST",
        body: fd,
      });

      if (!syncRes.ok) {
        const errJson = (await syncRes.json().catch(() => ({}))) as { message?: string; error?: string };
        throw new Error(errJson.message ?? errJson.error ?? "Erreur de conversion");
      }

      const blob = await syncRes.blob();
      const outputExt = targetFormat.replace(/^\./, "");
      const outputFilename = file.name.replace(/\.[a-zA-Z0-9]+$/, `.${outputExt}`);

      return {
        blob,
        filename: outputFilename,
        sizeAfter: blob.size,
        sizeBefore: file.size,
      };
    }

    throw asyncErr;
  }
}

/**
 * Stream real-time progress via Server-Sent Events with polling fallback.
 */
function streamJobProgress(
  jobId: string,
  onProgress?: (percent: number, label: string) => void,
): Promise<AsyncConversionResult> {
  return new Promise((resolve, reject) => {
    const sseUrl = apiUrl(`/api/jobs/${jobId}/events`);
    let eventSource: EventSource | null = null;
    let isSettled = false;

    const cleanup = () => {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
    };

    // Timeout guard (3 minutes max)
    const timeout = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        cleanup();
        reject(new Error("Délai de conversion dépassé"));
      }
    }, 180_000);

    const finishWithDownload = async (filename?: string) => {
      if (isSettled) return;
      isSettled = true;
      clearTimeout(timeout);
      cleanup();

      try {
        onProgress?.(95, "Téléchargement du résultat...");
        const downloadRes = await fetch(apiUrl(`/api/jobs/${jobId}/download`));
        if (!downloadRes.ok) throw new Error("Impossible de récupérer le document converti");

        const blob = await downloadRes.blob();
        resolve({
          blob,
          filename: filename || "document.pdf",
          sizeAfter: blob.size,
          sizeBefore: 0,
        });
      } catch (err) {
        reject(err);
      }
    };

    try {
      eventSource = new EventSource(sseUrl);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "progress") {
            if (data.progress) {
              onProgress?.(data.progress.percent ?? 50, data.progress.label ?? "Conversion en cours...");
            }

            if (data.status === "completed") {
              finishWithDownload(data.result?.filename);
            } else if (data.status === "failed") {
              isSettled = true;
              clearTimeout(timeout);
              cleanup();
              reject(new Error(data.error || "Échec du traitement du document"));
            }
          }
        } catch {
          // Ignore JSON parse quirks
        }
      };

      eventSource.onerror = () => {
        // SSE disconnected or blocked by client proxy — fallback to polling
        cleanup();
        pollJobStatus(jobId, onProgress)
          .then((res) => {
            if (!isSettled) {
              isSettled = true;
              clearTimeout(timeout);
              resolve(res);
            }
          })
          .catch((pollErr) => {
            if (!isSettled) {
              isSettled = true;
              clearTimeout(timeout);
              reject(pollErr);
            }
          });
      };
    } catch {
      // Fallback directly to polling if EventSource initialization fails
      pollJobStatus(jobId, onProgress).then(resolve).catch(reject);
    }
  });
}

/**
 * Resilient polling fallback if SSE is unavailable.
 */
async function pollJobStatus(
  jobId: string,
  onProgress?: (percent: number, label: string) => void,
): Promise<AsyncConversionResult> {
  const maxPolls = 60; // 60s max
  for (let i = 0; i < maxPolls; i++) {
    await new Promise((r) => setTimeout(r, 1000));

    const res = await fetch(apiUrl(`/api/jobs/${jobId}`));
    if (!res.ok) continue;

    const data = await res.json();
    if (data.progress) {
      onProgress?.(data.progress.percent ?? 50, data.progress.label ?? "Traitement en cours...");
    }

    if (data.status === "completed") {
      const downloadRes = await fetch(apiUrl(`/api/jobs/${jobId}/download`));
      if (!downloadRes.ok) throw new Error("Impossible de télécharger le résultat");
      const blob = await downloadRes.blob();
      return {
        blob,
        filename: data.result?.filename || "document.pdf",
        sizeAfter: blob.size,
        sizeBefore: 0,
      };
    }

    if (data.status === "failed") {
      throw new Error(data.error || "Échec de la conversion");
    }
  }

  throw new Error("Délai de traitement dépassé");
}
