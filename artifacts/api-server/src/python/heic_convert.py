#!/usr/bin/env python3
"""
HEIC/HEIF to raster image converter using pillow-heif.

Usage:
  python3 heic_convert.py --input /tmp/image.heic --output /tmp/image.jpg --format JPEG
  python3 heic_convert.py --input /tmp/image.heic --output /tmp/image.png --format PNG
  python3 heic_convert.py --input /tmp/image.heic --output /tmp/image.webp --format WEBP

Requires: pillow, pillow-heif
"""

import sys
import argparse

def main():
    parser = argparse.ArgumentParser(description="Convert HEIC/HEIF to other formats")
    parser.add_argument("--input", required=True, help="Input HEIC/HEIF file path")
    parser.add_argument("--output", required=True, help="Output file path")
    parser.add_argument("--format", default="JPEG", help="Output format (JPEG, PNG, WEBP)")
    parser.add_argument("--quality", type=int, default=90, help="Output quality (1-100, for lossy formats)")
    args = parser.parse_args()

    try:
        import pillow_heif
        pillow_heif.register_heif_opener()
    except ImportError:
        print("ERROR: pillow-heif not installed. Run: pip install pillow-heif", file=sys.stderr)
        sys.exit(1)

    try:
        from PIL import Image
    except ImportError:
        print("ERROR: Pillow not installed. Run: pip install Pillow", file=sys.stderr)
        sys.exit(1)

    try:
        img = Image.open(args.input)

        # Convert to RGB for JPEG compatibility (HEIC can be RGBA)
        fmt = args.format.upper()
        if fmt == "JPEG" and img.mode in ("RGBA", "P", "LA"):
            background = Image.new("RGB", img.size, (255, 255, 255))
            if img.mode == "P":
                img = img.convert("RGBA")
            if img.mode in ("RGBA", "LA"):
                background.paste(img, mask=img.split()[-1])
            else:
                background.paste(img)
            img = background
        elif img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGB")

        save_kwargs = {}
        if fmt in ("JPEG", "WEBP"):
            save_kwargs["quality"] = args.quality
        if fmt == "WEBP":
            save_kwargs["method"] = 4

        img.save(args.output, format=fmt, **save_kwargs)
        print(f"OK: converted to {fmt} → {args.output}")

    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
