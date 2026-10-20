#!/usr/bin/env python3
"""
rembg background remover for EverydayTools API server.

IMPORTANT: This module requires numba/JIT compilation.
  - Does NOT work in the Replit sandbox (JIT blocked by the sandbox environment).
  - Works normally on Render, Railway, Fly.io, any standard Linux VPS.
  - Run `pip install rembg Pillow` on the deployment platform.
  - Test this endpoint FIRST after initial deployment.

Usage:
  python bg_remove.py --input /path/to/image.jpg --output /path/to/result.png

Exit codes:
  0  — success, result written to --output
  1  — error, message on stderr
"""
import sys
import argparse
import io


def defringe_rgba(image):
    """
    Removes edge color fringing/halo from semi-transparent boundaries
    by decontaminating RGB channels against alpha bleed.
    """
    try:
        import numpy as np
        img_np = np.array(image, dtype=np.float32)
        if img_np.ndim != 3 or img_np.shape[2] != 4:
            return image

        rgb = img_np[:, :, :3]
        alpha = img_np[:, :, 3] / 255.0

        edge_mask = (alpha > 0.05) & (alpha < 0.95)
        if np.any(edge_mask):
            alpha_denom = np.maximum(alpha[..., np.newaxis], 0.1)
            rgb = np.where(edge_mask[..., np.newaxis], np.clip(rgb / alpha_denom, 0, 255), rgb)

        clean_np = np.dstack((rgb, img_np[:, :, 3])).astype(np.uint8)
        from PIL import Image
        return Image.fromarray(clean_np, "RGBA")
    except Exception:
        return image


def main() -> None:
    parser = argparse.ArgumentParser(description="Remove image background with rembg")
    parser.add_argument("--input",  required=True,  help="Input image path")
    parser.add_argument("--output", required=True,  help="Output PNG path (transparent)")
    parser.add_argument("--model",  default="u2net", help="rembg model (default: u2net)")
    args = parser.parse_args()

    try:
        from rembg import remove, new_session
        from PIL import Image
    except ImportError as exc:
        sys.stderr.write(
            f"[bg_remove] Import error: {exc}\n"
            "Install with: pip install rembg Pillow numpy\n"
        )
        sys.exit(1)

    try:
        session = new_session(args.model)

        with open(args.input, "rb") as fh:
            input_bytes = fh.read()

        try:
            result_bytes = remove(
                input_bytes,
                session=session,
                alpha_matting=True,
                alpha_matting_foreground_threshold=240,
                alpha_matting_background_threshold=20,
                alpha_matting_erode_size=12,
            )
        except Exception:
            result_bytes = remove(input_bytes, session=session)

        # Post-process: defringe halo strictly on semi-transparent edges
        pil_img = Image.open(io.BytesIO(result_bytes)).convert("RGBA")
        clean_img = defringe_rgba(pil_img)
        clean_img.save(args.output, format="PNG", optimize=True)

    except Exception as exc:
        sys.stderr.write(f"[bg_remove] Processing error: {exc}\n")
        sys.exit(1)


if __name__ == "__main__":
    main()

