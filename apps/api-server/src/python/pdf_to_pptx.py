#!/usr/bin/env python3
"""
High-fidelity PDF to PowerPoint (.pptx) converter for EverydayTools Hub.
Separates vector backgrounds from text via PyMuPDF 2.0 redaction to eliminate
text ghosting, while rebuilding 100% editable vector text boxes in python-pptx.
"""
import sys
import os
import io
import argparse


def convert_pdf_to_pptx(pdf_path: str, pptx_path: str) -> None:
    if not os.path.isfile(pdf_path) or os.path.getsize(pdf_path) == 0:
        sys.stderr.write("Error: invalid or empty PDF input file\n")
        sys.exit(1)

    try:
        import pymupdf
        import pptx
        from pptx.util import Pt
        from pptx.dml.color import RGBColor
    except ImportError as err:
        sys.stderr.write(f"Error: missing dependency: {err}\n")
        sys.exit(1)

    doc = None
    try:
        doc = pymupdf.open(pdf_path)
        if len(doc) == 0:
            sys.stderr.write("Error: PDF document contains zero pages\n")
            sys.exit(1)

        prs = pptx.Presentation()
        blank_layout = prs.slide_layouts[6]

        for i, page in enumerate(doc):
            w_pt = float(page.rect.width)
            h_pt = float(page.rect.height)

            # Anchor presentation canvas dimensions to the primary slide
            if i == 0:
                prs.slide_width = Pt(w_pt)
                prs.slide_height = Pt(h_pt)

            slide = prs.slides.add_slide(blank_layout)

            # Extract block-level textual metadata with typography
            text_blocks = []
            try:
                dict_data = page.get_text("dict")
                for b in dict_data.get("blocks", []):
                    if b.get("type") == 0 and "bbox" in b and "lines" in b:
                        text_blocks.append(b)
            except Exception:
                text_blocks = []

            # Purge text from background plate to guarantee zero ghosting
            for b in text_blocks:
                bbox = b["bbox"]
                if len(bbox) == 4 and bbox[2] > bbox[0] and bbox[3] > bbox[1]:
                    page.add_redact_annot(pymupdf.Rect(bbox))

            try:
                page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE)
            except Exception:
                pass

            # Render sanitized background plate (150 DPI balanced quality/size)
            try:
                pix = page.get_pixmap(dpi=150)
                img_stream = io.BytesIO(pix.tobytes("png"))
                slide.shapes.add_picture(img_stream, 0, 0, width=Pt(w_pt), height=Pt(h_pt))
                img_stream.close()
                del pix
            except Exception as pix_err:
                sys.stderr.write(f"Warning: background rasterization failed on slide: {pix_err}\n")

            # Superimpose 100% editable PowerPoint text boxes
            for b in text_blocks:
                bx0, by0, bx1, by1 = b["bbox"]
                bw = max(10.0, bx1 - bx0)
                bh = max(10.0, by1 - by0)

                tx_box = slide.shapes.add_textbox(Pt(bx0), Pt(by0), Pt(bw), Pt(bh))
                tf = tx_box.text_frame
                tf.word_wrap = True
                tf.margin_left = 0
                tf.margin_top = 0
                tf.margin_right = 0
                tf.margin_bottom = 0

                is_first_para = True
                for line in b.get("lines", []):
                    spans = line.get("spans", [])
                    if not spans:
                        continue

                    p = tf.paragraphs[0] if is_first_para else tf.add_paragraph()
                    is_first_para = False

                    line_text = "".join(s.get("text", "") for s in spans).strip()
                    p.text = line_text

                    # Apply typography from primary span
                    first_span = spans[0]
                    font_size = first_span.get("size", 12.0)
                    p.font.size = Pt(max(6.0, min(font_size, 96.0)))

                    # Font style flags: bit 1 (italic), bit 4 (bold)
                    flags = first_span.get("flags", 0)
                    if flags & 16:
                        p.font.bold = True
                    if flags & 2:
                        p.font.italic = True

                    color_int = first_span.get("color", 0)
                    if isinstance(color_int, int) and color_int > 0:
                        r = (color_int >> 16) & 255
                        g = (color_int >> 8) & 255
                        blue = color_int & 255
                        p.font.color.rgb = RGBColor(r, g, blue)
                    else:
                        p.font.color.rgb = RGBColor(17, 24, 39)

        prs.save(pptx_path)
    except Exception as exc:
        sys.stderr.write(f"Conversion failed: {str(exc)}\n")
        sys.exit(1)
    finally:
        if doc is not None:
            try:
                doc.close()
            except Exception:
                pass

    if not os.path.isfile(pptx_path) or os.path.getsize(pptx_path) == 0:
        sys.stderr.write("Error: conversion failed to produce output PPTX file\n")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Convert PDF to editable PPTX with high fidelity")
    parser.add_argument("--pdf", required=True, help="Input PDF file path")
    parser.add_argument("--pptx", required=True, help="Output PPTX file path")
    args = parser.parse_args()

    convert_pdf_to_pptx(args.pdf, args.pptx)


if __name__ == "__main__":
    main()
