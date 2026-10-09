import QRCode from 'qrcode';
import { DotStyle, EyeStyle, ErrorLevel, isCornerEye } from './qr-code-logic';

export interface QrCanvasRenderOptions {
  content: string;
  isEmpty: boolean;
  size: number;
  margin: number;
  errLevel: ErrorLevel;
  fgColor: string;
  bgColor: string;
  dotStyle: DotStyle;
  eyeStyle: EyeStyle;
  logoUrl: string | null;
  logoScale: number;
}

export async function renderQrToCanvas(
  canvas: HTMLCanvasElement,
  options: QrCanvasRenderOptions
): Promise<void> {
  const {
    content,
    isEmpty,
    size,
    margin,
    errLevel,
    fgColor,
    bgColor,
    dotStyle,
    eyeStyle,
    logoUrl,
    logoScale,
  } = options;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = size;
  canvas.height = size;

  if (isEmpty) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
    return;
  }

  const qr = QRCode.create(content, {
    errorCorrectionLevel: errLevel,
  });

  const moduleCount = qr.modules.size;
  const totalCells = moduleCount + margin * 2;
  const cellSize = size / totalCells;
  const offset = margin * cellSize;

  // 1. Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // 2. Center Logo Exclusion Zone
  let centerModuleStart = -1;
  let centerModuleEnd = -1;
  if (logoUrl) {
    const center = (moduleCount - 1) / 2;
    const radiusModules = Math.floor((moduleCount * (logoScale / 100)) / 2) + 1;
    centerModuleStart = Math.max(0, Math.floor(center - radiusModules));
    centerModuleEnd = Math.min(moduleCount - 1, Math.ceil(center + radiusModules));
  }

  // 3. Draw Data Modules
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (
        logoUrl &&
        r >= centerModuleStart &&
        r <= centerModuleEnd &&
        c >= centerModuleStart &&
        c <= centerModuleEnd
      ) {
        continue;
      }

      if (eyeStyle !== 'square' && isCornerEye(r, c, moduleCount)) {
        continue;
      }

      if (qr.modules.get(r, c)) {
        const x = offset + c * cellSize;
        const y = offset + r * cellSize;

        ctx.fillStyle = fgColor;

        if (dotStyle === 'dots') {
          ctx.beginPath();
          ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.44, 0, Math.PI * 2);
          ctx.fill();
        } else if (dotStyle === 'rounded') {
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x, y, cellSize, cellSize, cellSize * 0.35);
          } else {
            ctx.rect(x, y, cellSize, cellSize);
          }
          ctx.fill();
        } else {
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
    }
  }

  // 4. Draw Corner Eyes
  if (eyeStyle !== 'square') {
    const eyePositions = [
      { r: 0, c: 0 },
      { r: 0, c: moduleCount - 7 },
      { r: moduleCount - 7, c: 0 },
    ];

    eyePositions.forEach(({ r, c }) => {
      const eyeX = offset + c * cellSize;
      const eyeY = offset + r * cellSize;
      const eyeW = 7 * cellSize;
      const eyeH = 7 * cellSize;
      const eyeCenterX = eyeX + eyeW / 2;
      const eyeCenterY = eyeY + eyeH / 2;

      if (eyeStyle === 'circle') {
        ctx.lineWidth = cellSize;
        ctx.strokeStyle = fgColor;
        ctx.beginPath();
        ctx.arc(eyeCenterX, eyeCenterY, 3 * cellSize, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = fgColor;
        ctx.beginPath();
        ctx.arc(eyeCenterX, eyeCenterY, 1.5 * cellSize, 0, Math.PI * 2);
        ctx.fill();
      } else if (eyeStyle === 'rounded') {
        ctx.lineWidth = cellSize;
        ctx.strokeStyle = fgColor;
        ctx.beginPath();
        const frameOffset = cellSize / 2;
        if (ctx.roundRect) {
          ctx.roundRect(eyeX + frameOffset, eyeY + frameOffset, 6 * cellSize, 6 * cellSize, 1.6 * cellSize);
        } else {
          ctx.rect(eyeX + frameOffset, eyeY + frameOffset, 6 * cellSize, 6 * cellSize);
        }
        ctx.stroke();

        ctx.fillStyle = fgColor;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(eyeX + 2 * cellSize, eyeY + 2 * cellSize, 3 * cellSize, 3 * cellSize, 0.9 * cellSize);
        } else {
          ctx.rect(eyeX + 2 * cellSize, eyeY + 2 * cellSize, 3 * cellSize, 3 * cellSize);
        }
        ctx.fill();
      }
    });
  }

  // 5. Draw Center Logo / Badge (if present)
  if (logoUrl) {
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      logoImg.onload = () => resolve();
      logoImg.onerror = () => reject(new Error('Failed to load logo'));
      logoImg.src = logoUrl;
    });

    const logoPixelSize = size * (logoScale / 100);
    const logoX = (size - logoPixelSize) / 2;
    const logoY = (size - logoPixelSize) / 2;
    const cushion = cellSize * 0.9;
    const badgeSize = logoPixelSize + 2 * cushion;
    const badgeX = logoX - cushion;
    const badgeY = logoY - cushion;
    const centerX = size / 2;
    const centerY = size / 2;
    ctx.fillStyle = bgColor;

    ctx.beginPath();
    if (eyeStyle === 'circle') {
      ctx.arc(centerX, centerY, badgeSize / 2, 0, Math.PI * 2);
    } else if (eyeStyle === 'rounded') {
      const r = Math.min(14, badgeSize * 0.22);
      if (ctx.roundRect) {
        ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, r);
      } else {
        ctx.rect(badgeX, badgeY, badgeSize, badgeSize);
      }
    } else {
      ctx.rect(badgeX, badgeY, badgeSize, badgeSize);
    }
    ctx.fill();

    ctx.drawImage(logoImg, logoX, logoY, logoPixelSize, logoPixelSize);
  }

  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.maxWidth = '100%';
  canvas.style.maxHeight = '100%';
  canvas.style.objectFit = 'contain';
}
