#!/usr/bin/env python3
"""
pdfplumber-based PDF extractor for EverydayTools API server.

Usage:
  python pdf_extract.py --pdf /path/to/file.pdf --mode word
  python pdf_extract.py --pdf /path/to/file.pdf --mode excel

Outputs JSON to stdout. Errors go to stderr with exit code 1.
"""
import sys
import json
import argparse
from collections import defaultdict


def extract_for_word(pdf_path: str) -> dict:
    """
    Extract paragraphs (with heading level hints) and table rows.
    The Node.js caller uses this to build a DOCX via the docx library.
    """
    import pdfplumber

    pages = []
    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages):
            paragraphs = []

            # Collect table bounding boxes so we don't double-extract their text
            page_tables = page.find_tables()
            table_bboxes = [t.bbox for t in page_tables]

            def in_table(word: dict) -> bool:
                for bbox in table_bboxes:
                    if (bbox[0] <= word["x0"] <= bbox[2] and
                            bbox[1] <= word["top"] <= bbox[3]):
                        return True
                return False

            # Group words into lines by Y position (4-pt buckets)
            words = page.extract_words(
                use_text_flow=True,
                extra_attrs=["size", "fontname"],
            )
            if words:
                line_map: dict[int, list] = defaultdict(list)
                for w in words:
                    if not in_table(w):
                        bucket = round(w["top"] / 4) * 4
                        line_map[bucket].append(w)

                for bucket in sorted(line_map.keys()):
                    ws = sorted(line_map[bucket], key=lambda w: w["x0"])
                    text = " ".join(w["text"] for w in ws).strip()
                    if not text:
                        continue
                    avg_size = sum(w.get("size", 12) or 12 for w in ws) / len(ws)
                    level = 0
                    if avg_size >= 20:
                        level = 1
                    elif avg_size >= 16:
                        level = 2
                    elif avg_size >= 13:
                        level = 3
                    paragraphs.append({"text": text, "heading": level})

            # Append table rows as pipe-delimited paragraphs
            for table in page.extract_tables():
                if not table:
                    continue
                paragraphs.append({"text": "", "heading": 0})  # blank spacer
                for row in table:
                    row_text = " | ".join(str(c or "").strip() for c in row)
                    if row_text.replace("|", "").strip():
                        paragraphs.append({
                            "text": row_text,
                            "heading": 0,
                            "table_row": True,
                        })
                paragraphs.append({"text": "", "heading": 0})

            pages.append({"page": page_num + 1, "paragraphs": paragraphs})

    return {"pages": pages}


def extract_for_excel(pdf_path: str) -> dict:
    """
    Extract tables (and text-row fallback) for XLSX generation.
    """
    import pdfplumber

    all_tables = []
    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages):
            tables = page.extract_tables()
            if tables:
                for table in tables:
                    cleaned = [
                        [str(cell or "").strip() for cell in row]
                        for row in table
                        if any(cell for cell in row)
                    ]
                    if cleaned:
                        all_tables.append({
                            "page": page_num + 1,
                            "rows": cleaned,
                            "is_table": True,
                        })
            else:
                # Fallback: group words into rows by Y position
                words = page.extract_words()
                if not words:
                    continue
                line_map: dict[int, list] = defaultdict(list)
                for w in words:
                    bucket = round(w["top"] / 3) * 3
                    line_map[bucket].append(w)

                rows = []
                for bucket in sorted(line_map.keys()):
                    ws = sorted(line_map[bucket], key=lambda w: w["x0"])
                    row = [w["text"] for w in ws]
                    if any(c.strip() for c in row):
                        rows.append(row)

                if rows:
                    all_tables.append({
                        "page": page_num + 1,
                        "rows": rows,
                        "is_table": False,
                    })

    return {"tables": all_tables}


def main() -> None:
    parser = argparse.ArgumentParser(description="pdfplumber PDF extractor")
    parser.add_argument("--pdf", required=True, help="Path to input PDF")
    parser.add_argument("--mode", choices=["word", "excel"], required=True)
    args = parser.parse_args()

    try:
        if args.mode == "word":
            result = extract_for_word(args.pdf)
        else:
            result = extract_for_excel(args.pdf)
        print(json.dumps(result, ensure_ascii=False))
    except Exception as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
