import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";

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
    const fn = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", fn);
    document.addEventListener("touchstart", fn);
    return () => {
      document.removeEventListener("mousedown", fn);
      document.removeEventListener("touchstart", fn);
    };
  }, [ref, handler]);
}

function NavDropdown({
  group, isOpen, onOpen, onClose, currentPath,
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

  const clearLeave = () => { if (leaveTimer.current) clearTimeout(leaveTimer.current); };
  const scheduleClose = () => { clearLeave(); leaveTimer.current = setTimeout(onClose, 130); };
  useEffect(() => clearLeave, []);

  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    const links = Array.from(panelRef.current?.querySelectorAll("a") ?? []);
    const idx = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") { e.preventDefault(); (links[idx + 1] as HTMLAnchorElement | undefined)?.focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); idx === 0 ? buttonRef.current?.focus() : (links[idx - 1] as HTMLAnchorElement | undefined)?.focus(); }
    if (e.key === "Escape") { onClose(); buttonRef.current?.focus(); }
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
        onClick={() => (isOpen ? onClose() : onOpen())}
        onKeyDown={(e) => {
          if (e.key === "Escape") { onClose(); buttonRef.current?.focus(); }
          if ((e.key === "Enter" || e.key === " ") && !isOpen) { e.preventDefault(); onOpen(); }
          if (e.key === "ArrowDown" && isOpen) { e.preventDefault(); const links = panelRef.current?.querySelectorAll("a"); if (links?.length) (links[0] as HTMLAnchorElement).focus(); }
        }}
        style={{
          background: "none",
          border: "none",
          borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
          cursor: "pointer",
          padding: "6px 0",
          fontFamily: "var(--font-ui)",
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
          display: "flex",
          alignItems: "center",
          gap: 5,
          transition: "color 120ms ease, border-color 120ms ease",
        }}
        onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
        onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
      >
        {group.label}
        <svg width="9" height="5" viewBox="0 0 9 5" fill="none" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 120ms ease", flexShrink: 0 }}>
          <path d="M1 1l3.5 3L8 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          role="menu"
          onKeyDown={handlePanelKeyDown}
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            left: 0,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            minWidth: 340,
            padding: 8,
            zIndex: 100,
            opacity: 1,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {group.pairs.map((pair, pi) =>
              pair[0] === null && pair[1] === null ? (
                <div key={pi} style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--border)", margin: "4px 0" }} />
              ) : (
                pair.map((link, li) =>
                  link ? (
                    <Link
                      key={`${pi}-${li}`}
                      href={link.href}
                      role="menuitem"
                      onClick={onClose}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: 32,
                        padding: "0 10px",
                        fontFamily: "var(--font-ui)",
                        fontSize: "var(--text-sm)",
                        color: currentPath === link.href ? "var(--text-primary)" : "var(--text-secondary)",
                        textDecoration: "none",
                        borderRadius: 4,
                        whiteSpace: "nowrap",
                        transition: "background 120ms ease, color 120ms ease",
                        fontWeight: currentPath === link.href ? 500 : 400,
                        borderBottom: currentPath === link.href ? "1px solid var(--accent)" : "none",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "var(--bg-subtle)";
                        (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = currentPath === link.href ? "var(--text-primary)" : "var(--text-secondary)";
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

function MobileDrawer({ open, onClose, currentPath }: { open: boolean; onClose: () => void; currentPath: string }) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(300px, 88vw)", background: "var(--bg-surface)", zIndex: 201, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-primary)", fontWeight: 400 }}>EverydayTools</span>
          <button onClick={onClose} aria-label="Close menu" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--text-secondary)" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div style={{ flex: 1 }}>
          {GROUPS.map((group) => {
            const allLinks = group.pairs.flatMap((p) => p.filter(Boolean)) as NavLink[];
            const isExpanded = expandedGroup === group.id;
            return (
              <div key={group.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <button
                  onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                  style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "13px 20px", fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  {group.label}
                  <svg width="9" height="5" viewBox="0 0 9 5" fill="none" style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 120ms ease" }}>
                    <path d="M1 1l3.5 3L8 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {isExpanded && (
                  <div style={{ paddingBottom: 6 }}>
                    {allLinks.map((link) => (
                      <Link key={link.href} href={link.href} onClick={onClose} style={{ display: "block", padding: "8px 28px", fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", color: currentPath === link.href ? "var(--text-primary)" : "var(--text-secondary)", textDecoration: "none", fontWeight: currentPath === link.href ? 500 : 400 }}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
          <button onClick={toggle} style={{ padding: "6px 12px", border: "1px solid var(--border-strong)", borderRadius: 4, background: "transparent", color: "var(--text-secondary)", fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", cursor: "pointer" }}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
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
  const { theme, toggle } = useTheme();

  useOutsideClick(navRef, () => setOpenGroup(null));

  useEffect(() => { setOpenGroup(null); setMobileOpen(false); }, [location]);

  return (
    <>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
        <div
          ref={navRef}
          style={{ maxWidth: "var(--content-wide)", margin: "0 auto", padding: "0 20px", height: 52, display: "flex", alignItems: "center", gap: 32 }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, background: "var(--accent)", color: "var(--accent-text)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 500, lineHeight: 1 }}>
              E
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-primary)", letterSpacing: "-0.03em", fontWeight: 400 }}>
              EverydayTools
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 24, flex: 1 }}>
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

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            {/* Locale */}
            <div className="hidden md:flex" style={{ alignItems: "center", border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden" }}>
              {(["EN", "FR"] as const).map((lang, i) => (
                <button key={lang} style={{ background: lang === "EN" ? "var(--bg-subtle)" : "transparent", color: lang === "EN" ? "var(--text-primary)" : "var(--text-secondary)", border: "none", borderLeft: i === 1 ? "1px solid var(--border)" : "none", padding: "4px 10px", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, cursor: "pointer", transition: "background 120ms ease" }}>
                  {lang}
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="hidden md:flex"
              style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center", background: "none", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", color: "var(--text-secondary)", transition: "background 120ms ease, color 120ms ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-subtle)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
            >
              {theme === "dark" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* Mobile hamburger */}
            <button className="flex md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu" style={{ background: "none", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", padding: "6px", color: "var(--text-secondary)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 5h12M2 8h12M2 11h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      </nav>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} currentPath={location} />
    </>
  );
}
