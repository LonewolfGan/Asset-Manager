export function serializeSvgToString(svgElement: SVGSVGElement): string {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  const serializer = new XMLSerializer();
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(clone);
}

export function downloadSvgBarcode(
  svgElement: SVGSVGElement,
  symbologyId: string,
  value: string
): void {
  const svgString = serializeSvgToString(svgElement);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `barcode-${symbologyId.toLowerCase()}-${value.trim().replace(/[^a-zA-Z0-9_-]/g, '_')}.svg`;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 150);
}

export function downloadPngBarcode(
  svgElement: SVGSVGElement,
  symbologyId: string,
  value: string,
  isPaperBackground: boolean
): Promise<void> {
  return new Promise((resolve) => {
    const clone = svgElement.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const scale = 3;
      const canvas = document.createElement('canvas');
      canvas.width = (img.naturalWidth || img.width || 300) * scale;
      canvas.height = (img.naturalHeight || img.height || 150) * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve();
        return;
      }

      if (isPaperBackground) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (!blob) {
          resolve();
          return;
        }
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = pngUrl;
        a.download = `barcode-${symbologyId.toLowerCase()}-${value.trim().replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(pngUrl);
        }, 150);
        resolve();
      }, 'image/png');
    };
    img.src = url;
  });
}

export async function copyPngBarcodeToClipboard(
  svgElement: SVGSVGElement,
  isPaperBackground: boolean
): Promise<void> {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);
  const img = new Image();
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));

  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = (img.naturalWidth || img.width || 300) * scale;
      canvas.height = (img.naturalHeight || img.height || 150) * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }

      if (isPaperBackground) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error('Blob generation failed'));
          return;
        }
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          resolve();
        } catch (err) {
          reject(err);
        }
      }, 'image/png');
    };
    img.onerror = reject;
  });
}

export function printBarcodeLabel(
  svgElement: SVGSVGElement,
  symbologyName: string,
  value: string
): void {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(clone);

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${symbologyName} - ${value}</title>
        <style>
          @page {
            size: auto;
            margin: 0;
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
          }
          .label-wrapper {
            padding: 24mm;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          svg {
            max-width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body>
        <div class="label-wrapper">
          ${svgStr}
        </div>
      </body>
    </html>
  `);
  doc.close();

  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1200);
  }, 250);
}
