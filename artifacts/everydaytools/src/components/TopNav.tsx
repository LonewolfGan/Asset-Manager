import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";

type NavLink = { label: string; href: string };
type NavPair = [NavLink | null, NavLink | null];

const GROUPS: { id: string; label: string; pairs: NavPair[] }[] = [
  {
    id: "documents",
    label: "Convert Documents",
    pairs: [
      [{ label: "PDF to Word", href: "/pdf-to-word" }, { label: "PDF to Text", href: "/pdf-to-text" }],
      [{ label: "PDF to HTML", href: "/pdf-to-html" }, { label: "PDF to EPUB", href: "/pdf-to-epub" }],
      [{ label: "Merge PDFs", href: "/pdf-merge" }, { label: "Split PDF", href: "/pdf-split" }],
      [{ label: "Rotate PDF", href: "/pdf-rotate" }, { label: "Unlock PDF", href: "/pdf-unlock" }],
      [{ label: "Protect PDF", href: "/pdf-protect" }, { label: "Add Page Numbers", href: "/pdf-page-numbers" }],
      [{ label: "Watermark PDF", href: "/pdf-watermark" }, null],
      [null, null],
      [{ label: "Word to Text", href: "/word-to-text" }, { label: "Word to HTML", href: "/word-to-html" }],
      [{ label: "Word to EPUB", href: "/word-to-epub" }, { label: "Markdown to PDF", href: "/markdown-to-pdf" }],
      [{ label: "Markdown to Word", href: "/markdown-to-docx" }, { label: "HTML to PDF", href: "/html-to-pdf" }],
      [{ label: "Text to PDF", href: "/txt-to-pdf" }, { label: "Text to Word", href: "/txt-to-docx" }],
    ],
  },
  {
    id: "images",
    label: "Convert Images",
    pairs: [
      [{ label: "Image Converter", href: "/image-converter" }, { label: "HEIC to JPG", href: "/heic-to-jpg" }],
      [{ label: "Resize Image", href: "/image-resize" }, { label: "Crop Image", href: "/image-crop" }],
      [{ label: "Image to PDF", href: "/image-to-pdf" }, { label: "PDF to Image", href: "/pdf-to-image" }],
      [{ label: "Background Remover", href: "/background-remover" }, null],
    ],
  },
  {
    id: "tools",
    label: "Tools",
    pairs: [
      [{ label: "PDF Compressor", href: "/pdf-compress" }, { label: "Image Compressor", href: "/image-compress" }],
      [{ label: "Background Remover", href: "/background-remover" }, { label: "Metadata Cleaner", href: "/metadata-cleaner" }],
      [{ label: "AI Text Scrubber", href: "/ai-text-scrubber" }, { label: "Password Generator", href: "/password-generator" }],
      [{ label: "Currency Converter", href: "/currency-converter" }, { label: "Unit Converter", href: "/unit-converter" }],
      [{ label: "Percentage Calculator", href: "/percentage-calc" }, null],
    ],
  },
];

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

function NavDropdown({
  group,
  isOpen,
  onOpen,
  onClose,
  currentPath,
}: {
  group: (typeof GROUPS)[number];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  currentPath: string;
}) {
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const allLinks = group.pairs.flatMap((p) => p.filter(Boolean)) as NavLink[];
  const isActive = allLinks.some((l) => l.href === currentPath);

  const clearLeave = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  };

  const scheduleClose = () => {
    clearLeave();
    leaveTimer.current = setTimeout(onClose, 120);
  };

  useEffect(() => () => clearLeave(), []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      buttonRef.current?.focus();
    }
    if ((e.key === "Enter" || e.key === " ") && !isOpen) {
      e.preventDefault();
      onOpen();
    }
    if (e.key === "ArrowDown" && isOpen) {
      e.preventDefault();
      const links = panelRef.current?.querySelectorAll("a");
      if (links?.length) (links[0] as HTMLAnchorElement).focus();
    }
  };

  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    const links = Array.from(panelRef.current?.querySelectorAll("a") ?? []);
    const idx = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      (links[idx + 1] as HTMLAnchorElement | undefined)?.focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (idx === 0) buttonRef.current?.focus();
      else (links[idx - 1] as HTMLAnchorElement | undefined)?.focus();
    }
    if (e.key === "Escape") {
      onClose();
      buttonRef.current?.focus();
    }
  };

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => { clearLeave(); onOpen(); }}
      onMouseLeave={scheduleClose}
    >
      <button
        ref={buttonRef}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onKeyDown={handleKeyDown}
        onClick={() => (isOpen ? onClose() : onOpen())}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "6px 2px",
          fontFamily: "IBM Plex Sans, sans-serif",
          fontSize: 14,
          fontWeight: 500,
          color: isActive ? "var(--accent)" : "var(--muted)",
          display: "flex",
          alignItems: "center",
          gap: 4,
          borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
          transition: "color 0.15s, border-color 0.15s",
        }}
      >
        {group.label}
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          style={{
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
            marginTop: 1,
          }}
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          role="menu"
          onKeyDown={handlePanelKeyDown}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow-md)",
            minWidth: 360,
            padding: "8px 0",
            zIndex: 100,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0,
            }}
          >
            {group.pairs.map((pair, pi) =>
              pair[0] === null && pair[1] === null ? (
                <div
                  key={pi}
                  style={{
                    gridColumn: "1 / -1",
                    borderTop: "1px solid var(--border)",
                    margin: "4px 12px",
                  }}
                />
              ) : (
                pair.map((link, li) =>
                  link ? (
                    <Link
                      key={`${pi}-${li}`}
                      href={link.href}
                      role="menuitem"
                      onClick={onClose}
                      style={{
                        display: "block",
                        padding: "7px 16px",
                        fontFamily: "IBM Plex Sans, sans-serif",
                        fontSize: 13.5,
                        color: currentPath === link.href ? "var(--accent)" : "var(--text)",
                        textDecoration: "none",
                        borderBottom: currentPath === link.href ? "1px solid var(--accent)" : "none",
                        whiteSpace: "nowrap",
                        transition: "background 0.1s, color 0.1s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#F0F4FF";
                        (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color =
                          currentPath === link.href ? "var(--accent)" : "var(--text)";
                      }}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <div key={`${pi}-${li}`} />
                  )
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileDrawer({
  open,
  onClose,
  currentPath,
}: {
  open: boolean;
  onClose: () => void;
  currentPath: string;
}) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 200,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(320px, 90vw)",
          background: "var(--surface)",
          zIndex: 201,
          overflowY: "auto",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 20, color: "var(--text)" }}>
            EverydayTools
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "var(--muted)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, padding: "8px 0" }}>
          {GROUPS.map((group) => {
            const allLinks = group.pairs.flatMap((p) => p.filter(Boolean)) as NavLink[];
            const isExpanded = expandedGroup === group.id;
            return (
              <div key={group.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <button
                  onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "14px 20px",
                    fontFamily: "IBM Plex Sans, sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textAlign: "left",
                  }}
                >
                  {group.label}
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
                  >
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {isExpanded && (
                  <div style={{ paddingBottom: 8 }}>
                    {allLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        style={{
                          display: "block",
                          padding: "9px 28px",
                          fontFamily: "IBM Plex Sans, sans-serif",
                          fontSize: 13.5,
                          color: currentPath === link.href ? "var(--accent)" : "var(--muted)",
                          textDecoration: "none",
                          fontWeight: currentPath === link.href ? 500 : 400,
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ padding: "16px 20px" }}>
            <div
              style={{
                display: "flex",
                gap: 8,
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 13,
              }}
            >
              <button style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 4, padding: "5px 10px", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
                EN
              </button>
              <button style={{ background: "none", color: "var(--muted)", border: "1px solid var(--border)", borderRadius: 4, padding: "5px 10px", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
                FR
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function TopNav() {
  const [location] = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useOutsideClick(navRef, () => setOpenGroup(null));

  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "0 1px 0 var(--border)",
        }}
      >
        <div
          ref={navRef}
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 20px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                background: "var(--accent)",
                color: "#fff",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "DM Serif Display, serif",
                fontSize: 17,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              E
            </div>
            <span
              style={{
                fontFamily: "DM Serif Display, serif",
                fontSize: 20,
                color: "var(--text)",
                letterSpacing: "-0.3px",
              }}
            >
              EverydayTools
            </span>
          </Link>

          {/* Desktop */}
          <div
            className="hidden md:flex"
            style={{ alignItems: "center", gap: 28, flex: 1 }}
          >
            {GROUPS.map((group) => (
              <NavDropdown
                key={group.id}
                group={group}
                isOpen={openGroup === group.id}
                onOpen={() => setOpenGroup(group.id)}
                onClose={() => setOpenGroup(null)}
                currentPath={location}
              />
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            {/* Locale switcher */}
            <div
              className="hidden md:flex"
              style={{
                alignItems: "center",
                gap: 0,
                border: "1px solid var(--border)",
                borderRadius: 6,
                overflow: "hidden",
              }}
            >
              {(["EN", "FR"] as const).map((lang, i) => (
                <button
                  key={lang}
                  style={{
                    background: lang === "EN" ? "var(--accent)" : "transparent",
                    color: lang === "EN" ? "#fff" : "var(--muted)",
                    border: "none",
                    padding: "4px 10px",
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    borderLeft: i === 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              className="flex md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 6,
                color: "var(--text)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        currentPath={location}
      />
    </>
  );
}
