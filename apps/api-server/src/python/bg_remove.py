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


def main() -> None:
    parser = argparse.ArgumentParser(description="Remove image background with rembg")
    parser.add_argument("--input",  required=True,  help="Input image path")
    parser.add_argument("--output", required=True,  help="Output PNG path (transparent)")
    parser.add_argument("--model",  default="u2net", help="rembg model (default: u2net)")
    args = parser.parse_args()

    try:
        # rembg import triggers numba JIT — will raise ImportError or llvmlite error
        # inside the Replit sandbox; works normally on every other platform.
        from rembg import remove, new_session
        from PIL import Image
    except ImportError as exc:
        sys.stderr.write(
            f"[bg_remove] Import error: {exc}\n"
            "Install with: pip install rembg Pillow\n"
            "Note: numba/JIT required — does not work in Replit sandbox.\n"
        )
        sys.exit(1)

    try:
        session = new_session(args.model)

        with open(args.input, "rb") as fh:
            input_bytes = fh.read()

        result_bytes = remove(input_bytes, session=session)

        with open(args.output, "wb") as fh:
            fh.write(result_bytes)

    except Exception as exc:
        sys.stderr.write(f"[bg_remove] Processing error: {exc}\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
