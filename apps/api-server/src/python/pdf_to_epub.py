#!/usr/bin/env python3
"""
High-fidelity PDF to EPUB 3.2 / 3.3 converter for EverydayTools Hub.
Extracts structural content via PyMuPDF4LLM and generates compliant reflowable EPUB.
"""
import sys
import os
import argparse
import uuid
import datetime
import zipfile
import html
import unicodedata

CSS_STYLESHEET = """@charset "utf-8";
body {
  margin: 1em 1.5em;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif;
  line-height: 1.6;
  color: #1a1a1a;
  background-color: #fafafa;
}
h1, h2, h3, h4, h5, h6 {
  color: #0f172a;
  font-weight: 600;
  line-height: 1.25;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}
h1 { font-size: 1.8em; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3em; }
h2 { font-size: 1.4em; }
h3 { font-size: 1.2em; }
p { margin: 0.8em 0; text-align: justify; }
table {
  border-collapse: collapse;
  width: 100%;
  margin: 1.2em 0;
  font-size: 0.9em;
}
th, td {
  border: 1px solid #cbd5e1;
  padding: 8px 12px;
  text-align: left;
}
th { background-color: #f1f5f9; font-weight: 600; }
tr:nth-child(even) { background-color: #f8fafc; }
blockquote {
  margin: 1em 0;
  padding: 0.5em 1em;
  border-left: 4px solid #3b82f6;
  background-color: #f8fafc;
  color: #475569;
}
code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85em;
  background-color: #f1f5f9;
  padding: 2px 4px;
  border-radius: 4px;
}
img { max-width: 100%; height: auto; display: block; margin: 1em auto; }
.cover-img { max-width: 100%; max-height: 100vh; height: auto; margin: auto; }
@media (prefers-color-scheme: dark) {
  body { background-color: #121212; color: #e4e4e7; }
  h1, h2, h3, h4, h5, h6 { color: #fafafa; }
  th { background-color: #27272a; }
  tr:nth-child(even) { background-color: #18181b; }
  th, td { border-color: #3f3f46; }
  blockquote { border-color: #6366f1; color: #a1a1aa; }
  code { background-color: #27272a; color: #f4f4f5; }
}
"""


def convert_pdf_to_epub(pdf_path: str, output_path: str, title: str = None, author: str = None) -> None:
    if not os.path.isfile(pdf_path) or os.path.getsize(pdf_path) == 0:
        sys.stderr.write("Error: invalid or empty PDF input file\n")
        sys.exit(1)

    try:
        import pymupdf
        import pymupdf4llm
        import markdown_it
        import lxml.html
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

        meta_title = doc.metadata.get("title") if doc.metadata else None
        meta_author = doc.metadata.get("author") if doc.metadata else None
        book_title = (title or meta_title or os.path.splitext(os.path.basename(pdf_path))[0] or "Untitled Publication").strip()
        book_author = (author or meta_author or "EverydayTools Hub").strip()
        book_id = str(uuid.uuid4())
        date_iso = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        # 1. Render cover thumbnail from first page
        cover_bytes = doc[0].get_pixmap(dpi=150).tobytes("jpeg")

        # 2. Extract structured content per page
        chunks = pymupdf4llm.to_markdown(doc, page_chunks=True, write_images=False)
        md_parser = markdown_it.MarkdownIt().enable("table")
        toc = doc.get_toc()  # [[level, title, page]]

        chapters = []
        for i, chunk in enumerate(chunks):
            page_num = i + 1
            raw_text = unicodedata.normalize("NFKC", chunk.get("text", "") or "").strip()
            if not raw_text:
                raw_text = f"*(Page {page_num})*"
            html_content = md_parser.render(raw_text)
            root = lxml.html.fragment_fromstring(f"<div>{html_content}</div>")
            xhtml_body = lxml.html.tostring(root, method="xml", encoding="utf-8").decode("utf-8")

            chapter_title = f"Page {page_num}"
            for t_level, t_title, t_page in toc:
                if t_page == page_num:
                    chapter_title = t_title
                    break

            chapters.append({
                "id": f"chapter_{page_num}",
                "filename": f"chapter_{page_num}.xhtml",
                "title": chapter_title,
                "body": xhtml_body,
                "page": page_num,
            })

        # 3. Assemble EPUB 3 Container Archive
        with zipfile.ZipFile(output_path, "w") as zf:
            # Entry 0: uncompressed mimetype
            mimetype_info = zipfile.ZipInfo("mimetype")
            mimetype_info.compress_type = zipfile.ZIP_STORED
            zf.writestr(mimetype_info, b"application/epub+zip")

            # Entry 1: META-INF/container.xml
            container_xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
                             '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n'
                             '  <rootfiles>\n'
                             '    <rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml"/>\n'
                             '  </rootfiles>\n'
                             '</container>')
            zf.writestr("META-INF/container.xml", container_xml)

            # Entry 2: Stylesheet
            zf.writestr("EPUB/style.css", CSS_STYLESHEET)

            # Entry 3: Cover image & cover XHTML
            zf.writestr("EPUB/cover.jpg", cover_bytes)
            cover_xhtml = (f'<?xml version="1.0" encoding="utf-8"?>\n'
                           f'<!DOCTYPE html>\n'
                           f'<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">\n'
                           f'<head><title>Cover</title><link rel="stylesheet" type="text/css" href="style.css"/></head>\n'
                           f'<body style="margin:0;padding:0;text-align:center;">\n'
                           f'  <img src="cover.jpg" alt="Cover" class="cover-img"/>\n'
                           f'</body></html>')
            zf.writestr("EPUB/cover.xhtml", cover_xhtml)

            # Entry 4+: XHTML Chapters
            for ch in chapters:
                ch_xhtml = (f'<?xml version="1.0" encoding="utf-8"?>\n'
                            f'<!DOCTYPE html>\n'
                            f'<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">\n'
                            f'<head><title>{html.escape(ch["title"])}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>\n'
                            f'<body>\n{ch["body"]}\n</body></html>')
                zf.writestr(f"EPUB/{ch['filename']}", ch_xhtml)

            # Entry Nav: EPUB 3 nav.xhtml
            nav_items = "".join([f'<li><a href="{ch["filename"]}">{html.escape(ch["title"])}</a></li>' for ch in chapters])
            nav_xhtml = (f'<?xml version="1.0" encoding="utf-8"?>\n'
                         f'<!DOCTYPE html>\n'
                         f'<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">\n'
                         f'<head><title>Table of Contents</title><link rel="stylesheet" type="text/css" href="style.css"/></head>\n'
                         f'<body>\n'
                         f'  <nav epub:type="toc" id="toc" role="doc-toc">\n'
                         f'    <h1>Table of Contents</h1>\n'
                         f'    <ol>{nav_items}</ol>\n'
                         f'  </nav>\n'
                         f'</body></html>')
            zf.writestr("EPUB/nav.xhtml", nav_xhtml)

            # Entry NCX: EPUB 2 toc.ncx fallback
            ncx_navpoints = "".join([
                f'<navPoint id="np_{ch["page"]}" playOrder="{ch["page"]}">\n'
                f'  <navLabel><text>{html.escape(ch["title"])}</text></navLabel>\n'
                f'  <content src="{ch["filename"]}"/>\n'
                f'</navPoint>'
                for ch in chapters
            ])
            toc_ncx = (f'<?xml version="1.0" encoding="utf-8"?>\n'
                       f'<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">\n'
                       f'  <head>\n'
                       f'    <meta name="dtb:uid" content="urn:uuid:{book_id}"/>\n'
                       f'    <meta name="dtb:depth" content="1"/>\n'
                       f'    <meta name="dtb:totalPageCount" content="0"/>\n'
                       f'    <meta name="dtb:maxPageNumber" content="0"/>\n'
                       f'  </head>\n'
                       f'  <docTitle><text>{html.escape(book_title)}</text></docTitle>\n'
                       f'  <navMap>{ncx_navpoints}</navMap>\n'
                       f'</ncx>')
            zf.writestr("EPUB/toc.ncx", toc_ncx)

            # Entry OPF: EPUB 3 package.opf
            manifest_items = [
                '<item id="style" href="style.css" media-type="text/css"/>',
                '<item id="cover-image" href="cover.jpg" media-type="image/jpeg" properties="cover-image"/>',
                '<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>',
                '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
                '<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>',
            ]
            spine_items = ['<itemref idref="cover" linear="no"/>']
            for ch in chapters:
                manifest_items.append(f'<item id="{ch["id"]}" href="{ch["filename"]}" media-type="application/xhtml+xml"/>')
                spine_items.append(f'<itemref idref="{ch["id"]}"/>')

            manifest_str = "\n    ".join(manifest_items)
            spine_str = "\n    ".join(spine_items)

            package_opf = (f'<?xml version="1.0" encoding="utf-8"?>\n'
                           f'<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">\n'
                           f'  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">\n'
                           f'    <dc:identifier id="pub-id">urn:uuid:{book_id}</dc:identifier>\n'
                           f'    <dc:title>{html.escape(book_title)}</dc:title>\n'
                           f'    <dc:language>en</dc:language>\n'
                           f'    <dc:creator>{html.escape(book_author)}</dc:creator>\n'
                           f'    <meta property="dcterms:modified">{date_iso}</meta>\n'
                           f'    <meta name="cover" content="cover-image"/>\n'
                           f'  </metadata>\n'
                           f'  <manifest>\n    {manifest_str}\n  </manifest>\n'
                           f'  <spine toc="ncx">\n    {spine_str}\n  </spine>\n'
                           f'</package>')
            zf.writestr("EPUB/package.opf", package_opf)

    except Exception as exc:
        sys.stderr.write(f"EPUB conversion failed: {str(exc)}\n")
        sys.exit(1)
    finally:
        if doc is not None:
            try:
                doc.close()
            except Exception:
                pass


def main():
    parser = argparse.ArgumentParser(description="PDF to EPUB 3 Converter")
    parser.add_argument("--pdf", required=True, help="Path to input PDF file")
    parser.add_argument("--output", required=True, help="Path to output EPUB file")
    parser.add_argument("--title", required=False, default=None, help="EPUB book title")
    parser.add_argument("--author", required=False, default=None, help="EPUB book author")
    args = parser.parse_args()

    convert_pdf_to_epub(args.pdf, args.output, title=args.title, author=args.author)


if __name__ == "__main__":
    main()
