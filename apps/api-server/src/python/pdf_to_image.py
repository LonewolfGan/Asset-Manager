#!/usr/bin/env python3
"""
High-fidelity PDF to Image converter for EverydayTools Hub.
Renders pages using PyMuPDF 2.0 at configurable DPI (72, 150, 300) into PNG, JPEG, or WebP.
Outputs single image for 1-page PDF, or a ZIP archive for multi-page PDF.
"""
import sys
import os
import argparse
import zipfile


def convert_pdf_to_image(pdf_path: str, output_path: str, img_format: str = "png", dpi: int = 150) -> None:
    if not os.path.isfile(pdf_path) or os.path.getsize(pdf_path) == 0:
        sys.stderr.write("Error: invalid or empty PDF input file\n")
        sys.exit(1)

    try:
        import pymupdf
    except ImportError as err:
        sys.stderr.write(f"Error: missing dependency pymupdf: {err}\n")
        sys.exit(1)

    norm_format = img_format.lower().strip()
    if norm_format in ("jpg", "jpeg"):
        out_ext = "jpeg"
        save_ext = "jpeg"
    elif norm_format == "webp":
        out_ext = "webp"
        save_ext = "webp"
    else:
        out_ext = "png"
        save_ext = "png"

    doc = None
    try:
        doc = pymupdf.open(pdf_path)
        if doc.needs_pass or doc.is_encrypted:
            sys.stderr.write("Error: PDF document is encrypted or password-protected\n")
            sys.exit(2)

        page_count = len(doc)
        if page_count == 0:
            sys.stderr.write("Error: PDF document contains zero pages\n")
            sys.exit(1)

        target_dpi = max(72, min(600, dpi))

        # Single page: render directly to output_path
        if page_count == 1:
            page = doc[0]
            pix = page.get_pixmap(dpi=target_dpi)
            if out_ext == "webp":
                pix.pil_save(output_path, format="WEBP")
            else:
                pix.save(output_path, output=save_ext)
            return

        # Multi-page: compile into a clean ZIP archive
        with zipfile.ZipFile(output_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
            for idx, page in enumerate(doc):
                page_num = idx + 1
                pix = page.get_pixmap(dpi=target_dpi)
                if out_ext == "webp":
                    img_bytes = pix.pil_tobytes(format="WEBP")
                else:
                    img_bytes = pix.tobytes(save_ext)
                filename = f"page_{page_num:03d}.{out_ext}"
                zf.writestr(filename, img_bytes)

    except Exception as exc:
        sys.stderr.write(f"PDF to Image rendering failed: {str(exc)}\n")
        sys.exit(1)
    finally:
        if doc is not None:
            try:
                doc.close()
            except Exception:
                pass


def main():
    parser = argparse.ArgumentParser(description="High-fidelity PDF to Image Renderer")
    parser.add_argument("--pdf", required=True, help="Path to input PDF file")
    parser.add_argument("--output", required=True, help="Path to output file (image or zip)")
    parser.add_argument("--format", default="png", choices=["png", "jpeg", "jpg", "webp"], help="Target format")
    parser.add_argument("--dpi", type=int, default=150, help="Rendering resolution (72, 150, 300)")
    args = parser.parse_args()

    convert_pdf_to_image(args.pdf, args.output, img_format=args.format, dpi=args.dpi)


if __name__ == "__main__":
    main()
