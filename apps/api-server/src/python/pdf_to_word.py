#!/usr/bin/env python3
"""
High-fidelity PDF to Word converter using pdf2docx for EverydayTools.
Preserves tables (<w:tbl>), headings, styles, layout flow, and embedded images.
"""
import sys
import os
import argparse


def convert_pdf_to_word(pdf_path: str, docx_path: str) -> None:
    if not os.path.isfile(pdf_path) or os.path.getsize(pdf_path) == 0:
        sys.stderr.write("Error: invalid or empty PDF input file\n")
        sys.exit(1)

    try:
        from pdf2docx import Converter
    except ImportError as err:
        sys.stderr.write(f"Error: pdf2docx dependency missing: {err}\n")
        sys.exit(1)

    cv = None
    try:
        cv = Converter(pdf_path)
        cv.convert(docx_path, start=0, end=None)
    except Exception as exc:
        sys.stderr.write(f"Conversion failed: {str(exc)}\n")
        sys.exit(1)
    finally:
        if cv is not None:
            try:
                cv.close()
            except Exception:
                pass

    if not os.path.isfile(docx_path) or os.path.getsize(docx_path) == 0:
        sys.stderr.write("Error: conversion failed to produce output DOCX file\n")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Convert PDF to DOCX with high fidelity")
    parser.add_argument("--pdf", required=True, help="Input PDF file path")
    parser.add_argument("--docx", required=True, help="Output DOCX file path")
    args = parser.parse_args()

    convert_pdf_to_word(args.pdf, args.docx)


if __name__ == "__main__":
    main()
