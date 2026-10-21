#!/usr/bin/env python3
"""
High-fidelity PDF to Excel converter using PyMuPDF 2.0 and openpyxl for EverydayTools.
Extracts structured tables with automatic numeric/currency typing, column auto-fitting,
header styling, freeze panes, number formats, and clean worksheet partitioning.
"""
import sys
import os
import re
import argparse
from typing import Any, Tuple, Optional


def parse_cell_value(val: Any) -> Tuple[Any, Optional[str]]:
    """
    Intelligently converts raw string cell values into proper native Excel types
    (int, float, percentage, or sanitized text string) along with appropriate Excel number_format.
    Preserves text cells with mixed numbers/letters ("Item 1", "42 Wallaby Way").
    """
    if val is None:
        return ("", None)
    text = str(val).strip()
    if not text:
        return ("", None)

    # Percentage: e.g. "32.5%", "-4.2%", "15%"
    pct_match = re.fullmatch(r"([+-]?\d+(?:[\.,]\d+)?)\s*%", text)
    if pct_match:
        try:
            num = float(pct_match.group(1).replace(",", ".")) / 100.0
            fmt = "0.0%" if ("." in pct_match.group(1) or "," in pct_match.group(1)) else "0%"
            return (num, fmt)
        except ValueError:
            pass

    # Accounting negative in parentheses: e.g. (1,250.00), (450)
    is_negative = False
    inner = text
    if text.startswith("(") and text.endswith(")"):
        is_negative = True
        inner = text[1:-1].strip()

    # Targeted removal of currency symbols and standard codes only
    currency_stripped = re.sub(
        r"^([$€£¥₹₽₩]|USD|EUR|GBP|CAD|AUD|JPY|CHF)\s*|\s*([$€£¥₹₽₩]|USD|EUR|GBP|CAD|AUD|JPY|CHF)$",
        "",
        inner,
        flags=re.IGNORECASE,
    ).strip()

    # If remaining string still has letters, it is textual content (e.g. "Item 1", "42 Wallaby Way")
    if re.search(r"[a-zA-Z]", currency_stripped):
        return (text, None)

    cleaned_num = currency_stripped.replace(" ", "").replace("\u00a0", "")

    # European format with dot thousands: 12.345,67
    if re.fullmatch(r"[+-]?\d{1,3}(?:\.\d{3})+(?:,\d+)?", cleaned_num):
        cleaned_num = cleaned_num.replace(".", "").replace(",", ".")
    # US format with comma thousands: 12,345.67
    elif re.fullmatch(r"[+-]?\d{1,3}(?:,\d{3})+(?:\.\d+)?", cleaned_num):
        cleaned_num = cleaned_num.replace(",", "")
    elif "," in cleaned_num and "." not in cleaned_num:
        cleaned_num = cleaned_num.replace(",", ".")

    # Integer conversion
    if re.fullmatch(r"[+-]?\d+", cleaned_num):
        try:
            n = int(cleaned_num)
            return (-n if is_negative and n > 0 else n, None)
        except ValueError:
            pass

    # Float conversion
    if re.fullmatch(r"[+-]?\d+\.\d+", cleaned_num):
        try:
            f = float(cleaned_num)
            return (-f if is_negative and f > 0 else f, None)
        except ValueError:
            pass

    return (text, None)


def extract_tables_from_pdf(pdf_path: str):
    """
    Extracts tables from PDF pages using PyMuPDF 2.0 find_tables()
    with a geometric text-clustering fallback for unbordered tables.
    """
    import pymupdf

    doc = pymupdf.open(pdf_path)
    all_sheets = []

    for page_idx, page in enumerate(doc):
        page_num = page_idx + 1
        tabs = page.find_tables()

        if tabs.tables:
            for t_idx, tab in enumerate(tabs):
                raw_rows = tab.extract()
                if not raw_rows:
                    continue
                # Clean up empty rows and empty trailing columns
                cleaned_rows = []
                for row in raw_rows:
                    cleaned_row = [cell if cell is not None else "" for cell in row]
                    if any(str(c).strip() for c in cleaned_row):
                        cleaned_rows.append(cleaned_row)

                if cleaned_rows:
                    sheet_name = f"Page {page_num}" if len(tabs.tables) == 1 else f"Page {page_num} - Tab {t_idx + 1}"
                    all_sheets.append((sheet_name[:31], cleaned_rows, True))
        else:
            # Fallback: cluster text words by Y-coordinates
            words = page.get_text("words")  # (x0, y0, x1, y1, word, block_no, line_no, word_no)
            if not words:
                continue

            lines = {}
            for w in words:
                y_bucket = round(w[1] / 4.0) * 4.0
                lines.setdefault(y_bucket, []).append(w)

            fallback_rows = []
            for y_k in sorted(lines.keys()):
                sorted_words = sorted(lines[y_k], key=lambda item: item[0])
                line_cells = [w[4] for w in sorted_words]
                if line_cells and any(c.strip() for c in line_cells):
                    fallback_rows.append(line_cells)

            if fallback_rows:
                sheet_name = f"Page {page_num}"
                all_sheets.append((sheet_name[:31], fallback_rows, False))

    doc.close()
    return all_sheets


def write_excel(sheets_data, output_path: str) -> None:
    """
    Writes extracted tabular data into a polished Excel file using openpyxl.
    Applies Radix-aligned header styling, number formatting, freeze panes, and auto-column widths.
    """
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    from openpyxl.utils import get_column_letter

    wb = Workbook()
    wb.remove(wb.active)

    header_font = Font(name="Calibri", size=11, bold=True, color="111827")
    header_fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")
    regular_font = Font(name="Calibri", size=10, color="1F2937")

    thin_border_side = Side(border_style="thin", color="E2E8F0")
    grid_border = Border(
        left=thin_border_side,
        right=thin_border_side,
        top=thin_border_side,
        bottom=thin_border_side,
    )

    if not sheets_data:
        ws = wb.create_sheet(title="Extracted")
        ws.cell(row=1, column=1, value="(No tabular data found in PDF)")
    else:
        for title, rows, has_header in sheets_data:
            ws = wb.create_sheet(title=title)
            ws.views.sheetView[0].showGridLines = True

            max_col_lengths = {}

            for r_idx, row in enumerate(rows, start=1):
                is_header_row = (r_idx == 1) and has_header

                for c_idx, raw_val in enumerate(row, start=1):
                    val, num_format = parse_cell_value(raw_val)
                    cell = ws.cell(row=r_idx, column=c_idx, value=val)

                    # Styling
                    if is_header_row:
                        cell.font = header_font
                        cell.fill = header_fill
                        cell.alignment = Alignment(horizontal="left", vertical="center")
                    else:
                        cell.font = regular_font
                        if isinstance(val, (int, float)):
                            cell.alignment = Alignment(horizontal="right", vertical="center")
                        else:
                            cell.alignment = Alignment(horizontal="left", vertical="center")

                    if num_format:
                        cell.number_format = num_format

                    cell.border = grid_border

                    # Track column max length for auto-width across multi-line content
                    val_str = str(raw_val or "")
                    line_max = max((len(line) for line in val_str.split("\n")), default=0)
                    cur_max = max_col_lengths.get(c_idx, 0)
                    max_col_lengths[c_idx] = max(cur_max, line_max)

            # Enable auto-filter and freeze pane for header
            if has_header and rows:
                ws.freeze_panes = "A2"
                last_col_letter = get_column_letter(max(len(r) for r in rows))
                ws.auto_filter.ref = f"A1:{last_col_letter}{len(rows)}"

            # Set adaptive column widths
            for c_idx, max_len in max_col_lengths.items():
                col_letter = get_column_letter(c_idx)
                calculated_width = max(10, min(max_len + 4, 50))
                ws.column_dimensions[col_letter].width = calculated_width

    wb.save(output_path)


def convert_pdf_to_excel(pdf_path: str, xlsx_path: str) -> None:
    """
    Main conversion routine: validates input and processes PDF to Excel.
    """
    if not os.path.isfile(pdf_path) or os.path.getsize(pdf_path) == 0:
        sys.stderr.write("Error: invalid or empty PDF input file\n")
        sys.exit(1)

    try:
        sheets_data = extract_tables_from_pdf(pdf_path)
        write_excel(sheets_data, xlsx_path)
    except Exception as exc:
        sys.stderr.write(f"Conversion failed: {str(exc)}\n")
        sys.exit(1)

    if not os.path.isfile(xlsx_path) or os.path.getsize(xlsx_path) == 0:
        sys.stderr.write("Error: conversion failed to produce output XLSX file\n")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Convert PDF to XLSX with high fidelity")
    parser.add_argument("--pdf", required=True, help="Input PDF file path")
    parser.add_argument("--xlsx", required=True, help="Output XLSX file path")
    args = parser.parse_args()

    convert_pdf_to_excel(args.pdf, args.xlsx)


if __name__ == "__main__":
    main()
