#!/usr/bin/env python3
"""
High-fidelity PDF to Markdown (GFM) extractor for EverydayTools Hub.
Extracts structural tables, headers, lists, and formatting via PyMuPDF4LLM 2.0.
"""
import sys
import os
import argparse
import unicodedata


def extract_pdf_to_markdown(pdf_path: str, output_path: str) -> None:
    if not os.path.isfile(pdf_path) or os.path.getsize(pdf_path) == 0:
        sys.stderr.write("Error: invalid or empty PDF input file\n")
        sys.exit(1)

    try:
        import pymupdf
        import pymupdf4llm
    except ImportError as err:
        sys.stderr.write(f"Error: missing dependency: {err}\n")
        sys.exit(1)

    doc = None
    try:
        doc = pymupdf.open(pdf_path)

        if doc.needs_pass or doc.is_encrypted:
            sys.stderr.write("Error: PDF document is encrypted or password-protected\n")
            sys.exit(2)

        if len(doc) == 0:
            sys.stderr.write("Error: PDF document contains zero pages\n")
            sys.exit(1)

        markdown_text = pymupdf4llm.to_markdown(
            doc,
            page_chunks=False,
            write_images=False,
        )

        # Normalization
        text = unicodedata.normalize("NFKC", markdown_text or "")
        text = text.replace("\u00ad", "")

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text)

    except Exception as exc:
        sys.stderr.write(f"Extraction failed: {str(exc)}\n")
        sys.exit(1)
    finally:
        if doc is not None:
            try:
                doc.close()
            except Exception:
                pass


def main():
    parser = argparse.ArgumentParser(description="Convert PDF to Markdown with PyMuPDF4LLM")
    parser.add_argument("--pdf", required=True, help="Input PDF file path")
    parser.add_argument("--output", required=True, help="Output Markdown file path")
    args = parser.parse_args()

    extract_pdf_to_markdown(args.pdf, args.output)


if __name__ == "__main__":
    main()
