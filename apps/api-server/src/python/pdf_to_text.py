#!/usr/bin/env python3
"""
High-fidelity PDF to Plain Text (UTF-8) extractor for EverydayTools Hub.
Extracts semantic reading order text via PyMuPDF 2.0 with automatic scanned page
detection, C-native OCR fallback (Tesseract), Unicode NFKC normalization,
and de-hyphenation.
"""
import sys
import os
import argparse
import unicodedata
import re


def extract_pdf_to_text(pdf_path: str, output_txt_path: str, tessdata_dir: str = None) -> None:
    if not os.path.isfile(pdf_path) or os.path.getsize(pdf_path) == 0:
        sys.stderr.write("Error: invalid or empty PDF input file\n")
        sys.exit(1)

    try:
        import pymupdf
    except ImportError as err:
        sys.stderr.write(f"Error: missing dependency: {err}\n")
        sys.exit(1)

    tessdata_path = tessdata_dir or os.environ.get("TESSDATA_PREFIX")
    if not tessdata_path or not os.path.exists(tessdata_path):
        candidates = [
            "/usr/share/tesseract-ocr/5/tessdata",
            "/usr/share/tesseract-ocr/4.00/tessdata",
            "/usr/share/tessdata",
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")),
        ]
        tessdata_path = next((p for p in candidates if os.path.exists(p)), candidates[-1])

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

        extracted_pages = []

        for p_index in range(page_count):
            page = doc[p_index]
            # Semantic reading order: extract layout blocks and sort by column then vertical position
            blocks = page.get_text("blocks", sort=True)
            valid_blocks = [b for b in blocks if len(b) > 6 and b[6] == 0 and b[4].strip()]
            col_width = max(100.0, page.rect.width / 2.0)
            sorted_blocks = sorted(valid_blocks, key=lambda b: (int(b[0] // col_width), b[1]))
            text_blocks = [b[4].strip() for b in sorted_blocks]
            raw_text = "\n\n".join(text_blocks)
            if not raw_text:
                raw_text = page.get_text("text", sort=True).strip()

            # Scanned / Image-only PDF page heuristic:
            # If text is sparse (< 40 characters), attempt OCR fallback
            if len(raw_text) < 40:
                try:
                    tp = page.get_textpage_ocr(
                        language="eng",
                        tessdata=tessdata_path,
                        dpi=150,
                    )
                    ocr_text = tp.extractText().strip()
                    if len(ocr_text) > len(raw_text):
                        raw_text = ocr_text
                except Exception:
                    # If OCR fails or tessdata missing, keep native raw_text
                    pass

            # Normalization pipeline:
            # 1. Unicode NFKC (composition & ligature decomposition)
            text = unicodedata.normalize("NFKC", raw_text)
            # 2. Strip soft hyphens (\u00ad)
            text = text.replace("\u00ad", "")
            # 3. De-hyphenate words broken by line breaks: "inter-\nnational" -> "international"
            text = re.sub(r"(\b\w+)-\r?\n(\w+\b)", r"\1\2", text)

            extracted_pages.append(text)

        full_output = "\n\n".join(extracted_pages)

        with open(output_txt_path, "w", encoding="utf-8") as f:
            f.write(full_output)

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
    parser = argparse.ArgumentParser(description="Extract clean plain text from PDF")
    parser.add_argument("--pdf", required=True, help="Input PDF file path")
    parser.add_argument("--output", required=True, help="Output TXT file path")
    parser.add_argument("--tessdata", required=False, default=None, help="Tessdata directory path")
    args = parser.parse_args()

    extract_pdf_to_text(args.pdf, args.output, args.tessdata)


if __name__ == "__main__":
    main()
