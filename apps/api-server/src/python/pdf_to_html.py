#!/usr/bin/env python3
"""
High-fidelity PDF to HTML5 converter for EverydayTools Hub.
Extracts vector paths, embedded raster assets, and native selectable text via
PyMuPDF 2.0 SVG container, wrapped in a responsive, self-contained HTML5 shell.
"""
import sys
import os
import argparse
import html


def convert_pdf_to_html(pdf_path: str, html_path: str, doc_title: str = None) -> None:
    if not os.path.isfile(pdf_path) or os.path.getsize(pdf_path) == 0:
        sys.stderr.write("Error: invalid or empty PDF input file\n")
        sys.exit(1)

    try:
        import pymupdf
    except ImportError as err:
        sys.stderr.write(f"Error: missing dependency: {err}\n")
        sys.exit(1)

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

        metadata = doc.metadata or {}
        title = doc_title or metadata.get("title") or "Converted Document"
        safe_title = html.escape(title)

        html_out = []
        html_out.append(f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{safe_title}</title>
  <style>
    :root {{
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --text: #0f172a;
      --muted: #64748b;
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding-bottom: 4rem;
      -webkit-font-smoothing: antialiased;
    }}
    .document-header {{
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(8px);
      background: rgba(255, 255, 255, 0.92);
      border-bottom: 1px solid var(--border);
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}
    .doc-meta {{
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 0;
    }}
    .doc-title {{
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 380px;
    }}
    .page-badge {{
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.2rem 0.5rem;
      background: #f1f5f9;
      color: var(--muted);
      border-radius: 4px;
      border: 1px solid var(--border);
      flex-shrink: 0;
    }}
    .actions {{ display: flex; gap: 0.5rem; }}
    .btn {{
      padding: 0.4rem 0.75rem;
      font-size: 0.8125rem;
      font-weight: 500;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: #ffffff;
      color: var(--text);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      transition: background 0.15s ease, border-color 0.15s ease;
    }}
    .btn:hover {{ background: #f8fafc; border-color: #cbd5e1; }}
    .pages-container {{
      max-width: 860px;
      margin: 2rem auto;
      padding: 0 1rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }}
    .page-wrapper {{
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      box-shadow: var(--shadow);
      position: relative;
      overflow: hidden;
      user-select: text;
    }}
    .page-wrapper svg {{ width: 100%; height: auto; display: block; }}
    .page-footer {{
      border-top: 1px solid #f1f5f9;
      padding: 0.35rem 0.75rem;
      font-size: 0.75rem;
      color: var(--muted);
      text-align: right;
      background: #fafafa;
    }}
    @media (max-width: 640px) {{
      .document-header {{ padding: 0.5rem 1rem; }}
      .doc-title {{ max-width: 180px; }}
      .pages-container {{ margin: 1rem auto; gap: 1rem; padding: 0 0.5rem; }}
    }}
    @media print {{
      body {{ background: none; padding-bottom: 0; }}
      .document-header, .page-footer {{ display: none !important; }}
      .pages-container {{ max-width: none; margin: 0; padding: 0; gap: 0; }}
      .page-wrapper {{
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        page-break-after: always;
        break-after: page;
      }}
    }}
  </style>
</head>
<body>
  <header class="document-header">
    <div class="doc-meta">
      <span class="doc-title">{safe_title}</span>
      <span class="page-badge">{page_count} Pages</span>
    </div>
    <div class="actions">
      <button class="btn" onclick="copyDocumentText()">Copy Text</button>
      <button class="btn" onclick="window.print()">Print</button>
    </div>
  </header>

  <main class="pages-container">
""")

        for idx, page in enumerate(doc):
            p_num = idx + 1
            # text_as_path=False preserves native selectable <text> elements
            svg_content = page.get_svg_image(text_as_path=False)
            html_out.append(f"""    <article class="page-wrapper" id="page-{p_num}" aria-label="Page {p_num}">
      {svg_content}
      <footer class="page-footer">Page {p_num} of {page_count}</footer>
    </article>
""")

        html_out.append("""  </main>
  <script>
    function copyDocumentText() {
      const texts = Array.from(document.querySelectorAll('text')).map(el => el.textContent.trim()).filter(Boolean);
      navigator.clipboard.writeText(texts.join('\\n')).then(() => {
        alert('Document text copied to clipboard');
      }).catch(() => {
        alert('Failed to copy text');
      });
    }
  </script>
</body>
</html>
""")

        with open(html_path, "w", encoding="utf-8") as f:
            f.write("".join(html_out))

    except Exception as exc:
        sys.stderr.write(f"Conversion failed: {str(exc)}\n")
        sys.exit(1)
    finally:
        if doc is not None:
            try:
                doc.close()
            except Exception:
                pass

    if not os.path.isfile(html_path) or os.path.getsize(html_path) == 0:
        sys.stderr.write("Error: conversion failed to produce output HTML file\n")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Convert PDF to responsive high-fidelity HTML5")
    parser.add_argument("--pdf", required=True, help="Input PDF file path")
    parser.add_argument("--html", required=True, help="Output HTML file path")
    parser.add_argument("--title", required=False, default=None, help="Document title")
    args = parser.parse_args()

    convert_pdf_to_html(args.pdf, args.html, args.title)


if __name__ == "__main__":
    main()
