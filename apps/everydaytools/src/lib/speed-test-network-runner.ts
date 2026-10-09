export async function measurePingAndJitter(
  ac: AbortController,
  onProgress?: (currentPing: number) => void
): Promise<{ ping: number; jitter: number }> {
  const pingSamples: number[] = [];

  for (let i = 0; i < 8; i++) {
    if (ac.signal.aborted) throw new Error('Aborted');
    const t0 = performance.now();

    try {
      await fetch(
        `https://speed.cloudflare.com/__down?bytes=0&_cb=${Date.now()}_${i}`,
        {
          signal: ac.signal,
          cache: 'no-store',
        }
      );
      const dt = Math.round(performance.now() - t0);
      pingSamples.push(dt);
    } catch {
      if (ac.signal.aborted) throw new Error('Aborted');
      const fallbackT0 = performance.now();
      await fetch(`/favicon.ico?_cb=${Date.now()}_${i}`, {
        signal: ac.signal,
        cache: 'no-store',
      });
      const dt = Math.round(performance.now() - fallbackT0);
      pingSamples.push(dt);
    }

    if (pingSamples.length > 0 && onProgress) {
      const currentAvg = Math.round(
        pingSamples.reduce((a, b) => a + b, 0) / pingSamples.length
      );
      onProgress(currentAvg);
    }
  }

  if (ac.signal.aborted) throw new Error('Aborted');

  // Discard upper 20% outliers
  const sorted = [...pingSamples].sort((a, b) => a - b);
  const trimmed = sorted.slice(0, Math.max(2, Math.floor(sorted.length * 0.8)));
  const finalPing = Math.round(
    trimmed.reduce((a, b) => a + b, 0) / trimmed.length
  );

  let jitterSum = 0;
  for (let i = 1; i < pingSamples.length; i++) {
    jitterSum += Math.abs(pingSamples[i] - pingSamples[i - 1]);
  }
  const finalJitter = Number(
    (jitterSum / (pingSamples.length - 1)).toFixed(1)
  );

  return { ping: finalPing, jitter: finalJitter };
}

export async function measureDownloadSpeed(
  ac: AbortController,
  onTick: (instantMbps: number) => void
): Promise<number> {
  let totalTransferBytes = 0;
  let totalTransferDurationSec = 0;

  const downloadTiers = [1_000_000, 5_000_000, 15_000_000];

  for (let tierIdx = 0; tierIdx < downloadTiers.length; tierIdx++) {
    if (ac.signal.aborted) throw new Error('Aborted');
    const targetBytes = downloadTiers[tierIdx];

    let res: Response;
    try {
      res = await fetch(
        `https://speed.cloudflare.com/__down?bytes=${targetBytes}&_cb=${Date.now()}_${tierIdx}`,
        {
          signal: ac.signal,
          cache: 'no-store',
        }
      );
    } catch {
      res = await fetch(
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js?_cb=${Date.now()}`,
        {
          signal: ac.signal,
          cache: 'no-store',
        }
      );
    }

    if (!res.body) {
      const t0 = performance.now();
      const blob = await res.blob();
      const dtSec = (performance.now() - t0) / 1000;
      totalTransferBytes += blob.size;
      totalTransferDurationSec += dtSec;
      const instantMbps = Number(
        ((blob.size * 8) / (dtSec * 1e6)).toFixed(1)
      );
      onTick(instantMbps);
    } else {
      const reader = res.body.getReader();
      let streamStartTime: number | null = null;
      let lastTick = 0;
      let bytesSinceLastTick = 0;
      let tierBytes = 0;

      while (true) {
        if (ac.signal.aborted) throw new Error('Aborted');
        const { done, value } = await reader.read();
        if (done) break;

        const now = performance.now();
        if (streamStartTime === null) {
          streamStartTime = now;
          lastTick = now;
        }

        const len = value?.byteLength ?? 0;
        tierBytes += len;
        bytesSinceLastTick += len;

        if (now - lastTick >= 75) {
          const dtIntervalSec = (now - lastTick) / 1000;
          const instantMbps = Number(
            ((bytesSinceLastTick * 8) / (dtIntervalSec * 1e6)).toFixed(1)
          );
          onTick(instantMbps);
          lastTick = now;
          bytesSinceLastTick = 0;
        }
      }

      if (streamStartTime !== null) {
        const streamDurationSec = (performance.now() - streamStartTime) / 1000;
        totalTransferBytes += tierBytes;
        totalTransferDurationSec += streamDurationSec;
      }
    }

    if (tierIdx >= 1 && totalTransferDurationSec > 3.5) {
      break;
    }
  }

  return Number(
    Math.max(
      0.5,
      (totalTransferBytes * 8) /
        (Math.max(0.2, totalTransferDurationSec) * 1e6)
    ).toFixed(1)
  );
}

export async function measureUploadSpeed(
  ac: AbortController,
  fallbackDownloadMbps: number,
  onTick: (instantMbps: number) => void
): Promise<number> {
  let totalBytesUploaded = 0;
  const uploadStart = performance.now();
  const uploadTiers = [
    new Uint8Array(256 * 1024),
    new Uint8Array(1024 * 1024),
    new Uint8Array(2 * 1024 * 1024),
  ];

  for (let upIdx = 0; upIdx < uploadTiers.length; upIdx++) {
    if (ac.signal.aborted) throw new Error('Aborted');
    const chunk = uploadTiers[upIdx];
    const t0 = performance.now();

    try {
      await fetch(
        `https://speed.cloudflare.com/__up?_cb=${Date.now()}_${upIdx}`,
        {
          method: 'POST',
          body: chunk,
          signal: ac.signal,
        }
      );
    } catch {
      if (upIdx === 0) {
        const fallbackUpload = Number(
          (fallbackDownloadMbps * 0.4).toFixed(1)
        );
        return Math.max(1, fallbackUpload);
      }
    }

    totalBytesUploaded += chunk.byteLength;
    const dtSec = (performance.now() - t0) / 1000;
    const instantUploadMbps = Number(
      ((chunk.byteLength * 8) / (dtSec * 1e6)).toFixed(1)
    );
    onTick(instantUploadMbps);

    const totalElapsed = (performance.now() - uploadStart) / 1000;
    if (totalElapsed > 3.5) break;
  }

  const totalUploadDurationSec = (performance.now() - uploadStart) / 1000;
  return Number(
    Math.max(
      0.2,
      (totalBytesUploaded * 8) / (totalUploadDurationSec * 1e6)
    ).toFixed(1)
  );
}
