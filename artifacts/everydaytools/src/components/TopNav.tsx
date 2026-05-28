import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { useLocale } from "@/hooks/use-locale";

type NavEntry = { href: string } | null;
type NavPair = [NavEntry, NavEntry];

const GROUPS: { id: string; pairs: NavPair[] }[] = [
  {
    id: "documents",
    pairs: [
      [{ href: "/pdf-to-word" }, { href: "/pdf-to-text" }],
      [{ href: "/pdf-to-html" }, { href: "/pdf-to-epub" }],
      [{ href: "/pdf-merge" }, { href: "/pdf-split" }],
      [{ href: "/pdf-rotate" }, { href: "/pdf-unlock" }],
      [{ href: "/pdf-protect" }, { href: "/pdf-page-numbers" }],
      [{ href: "/pdf-watermark" }, null],
      [null, null],
      [{ href: "/word-to-text" }, { href: "/word-to-html" }],
      [{ href: "/word-to-epub" }, { href: "/markdown-to-pdf" }],
      [{ href: "/markdown-to-docx" }, { href: "/html-to-pdf" }],
      [{ href: "/txt-to-pdf" }, { href: "/txt-to-docx" }],
    ],
  },
  {
    id: "images",
    pairs: [
      [{ href: "/image-converter" }, { href: "/heic-to-jpg" }],
      [{ href: "/image-resize" }, { href: "/image-crop" }],
      [{ href: "/image-to-pdf" }, { href: "/pdf-to-image" }],
      [{ href: "/background-remover" }, null],
    ],
  },
  {
    id: "tools",
    pairs: [
      [{ href: "/pdf-compress" }, { href: "/image-compress" }],
      [{ href: "/background-remover" }, { href: "/metadata-cleaner" }],
      [{ href: "/ai-text-scrubber" }, { href: "/password-generator" }],
      [{ href: "/currency-converter" }, { href: "/unit-converter" }],
      [{ href: "/percentage-calc" }, { href: "/qr-code-generator" }],
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
  const { t } = useLocale();
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const allLinks = group.pairs.flatMap((p) => p.filter(Boolean)) as { href: string }[];
  const isActive = allLinks.some((l) => l.href === currentPath);
  const groupLabel = (t.nav.groups as Record<string, string>)[group.id] ?? group.id;

  const clearLeave = () => { if (leaveTimer.current) clearTimeout(leaveTimer.current); };
  const scheduleClose = () => { clearLeave(); leaveTimer.current = setTimeout(onClose, 250); };
  useEffect(() => clearLeave, []);

  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    const links = Array.from(panelRef.current?.querySelectorAll("a") ?? []);
    const idx = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") { e.preventDefault(); (links[idx + 1] as HTMLAnchorElement | undefined)?.focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); idx === 0 ? buttonRef.current?.focus() : (links[idx - 1] as HTMLAnchorElement | undefined)?.focus(); }
    if (e.key === "Escape") { onClose(); buttonRef.current?.focus(); }
  };

  const linkLabel = (href: string) => t.nav.links[href.slice(1)] ?? href.slice(1);

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
        {groupLabel}
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
            top: "calc(100% + 4px)",
            left: 0,
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            minWidth: 340,
            padding: 8,
            zIndex: 100,
            boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {group.pairs.map((pair, pi) =>
              pair[0] === null && pair[1] === null ? (
                <div key={pi} style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--border)", margin: "4px 0" }} />
              ) : (
                pair.map((entry, li) =>
                  entry ? (
                    <Link
                      key={`${pi}-${li}`}
                      href={entry.href}
                      role="menuitem"
                      onClick={onClose}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: 34,
                        padding: "0 10px",
                        fontFamily: "var(--font-ui)",
                        fontSize: "var(--text-sm)",
                        color: currentPath === entry.href ? "var(--accent)" : "var(--text-secondary)",
                        textDecoration: "none",
                        borderRadius: 8,
                        whiteSpace: "nowrap",
                        transition: "background 120ms ease, color 120ms ease",
                        fontWeight: currentPath === entry.href ? 500 : 400,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)";
                        (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = currentPath === entry.href ? "var(--accent)" : "var(--text-secondary)";
                      }}
                    >
                      {linkLabel(entry.href)}
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
  const { locale, setLocale, t } = useLocale();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const linkLabel = (href: string) => t.nav.links[href.slice(1)] ?? href.slice(1);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(300px, 88vw)", background: "var(--bg-surface)", zIndex: 201, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="22" height="22" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="64" height="64" rx="11" fill="#EDEDEE"/>
              <rect x="14" y="15" width="36" height="7" rx="2" fill="#FF6B35"/>
              <rect x="14" y="28" width="28" height="7" rx="2" fill="#1A1916"/>
              <rect x="14" y="41" width="36" height="7" rx="2" fill="#1A1916"/>
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>EverydayTools</span>
          </div>
          <button onClick={onClose} aria-label="Close menu" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--text-secondary)" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Mobile search */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          <label style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--bg-elevated)", border: "1px solid var(--border)",
            borderRadius: 12, padding: "8px 12px", cursor: "text", width: "100%",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="search"
              placeholder={t.nav.searchPlaceholder}
              style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--text-primary)", width: "100%", fontFamily: "var(--font-ui)" }}
              onChange={(e) => {
                window.dispatchEvent(new CustomEvent("et:search", { detail: e.target.value }));
              }}
            />
          </label>
        </div>

        <div style={{ flex: 1 }}>
          {GROUPS.map((group) => {
            const allLinks = group.pairs.flatMap((p) => p.filter(Boolean)) as { href: string }[];
            const isExpanded = expandedGroup === group.id;
            const groupLabel = (t.nav.groups as Record<string, string>)[group.id] ?? group.id;
            return (
              <div key={group.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <button
                  onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                  style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "13px 20px", fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  {groupLabel}
                  <svg width="9" height="5" viewBox="0 0 9 5" fill="none" style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 120ms ease" }}>
                    <path d="M1 1l3.5 3L8 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {isExpanded && (
                  <div style={{ paddingBottom: 6 }}>
                    {allLinks.map((entry) => (
                      <Link key={entry.href} href={entry.href} onClick={onClose} style={{ display: "block", padding: "8px 28px", fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", color: currentPath === entry.href ? "var(--accent)" : "var(--text-secondary)", textDecoration: "none", fontWeight: currentPath === entry.href ? 500 : 400 }}>
                        {linkLabel(entry.href)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
          <button onClick={toggle} style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 10, background: "transparent", color: "var(--text-secondary)", fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", cursor: "pointer" }}>
            {theme === 'dark' ? t.ui.lightMode : t.ui.darkMode}
          </button>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
            {(["EN", "FR"] as const).map((lang, i) => (
              <button key={lang} onClick={() => setLocale(lang)} style={{ background: lang === locale ? "var(--bg-subtle)" : "transparent", color: lang === locale ? "var(--text-primary)" : "var(--text-secondary)", border: "none", borderLeft: i === 1 ? "1px solid var(--border)" : "none", padding: "4px 10px", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>
                {lang}
              </button>
            ))}
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
  const [searchQuery, setSearchQuery] = useState("");
  const navRef = useRef<HTMLDivElement>(null);
  const { theme, toggle } = useTheme();
  const { locale, setLocale, t } = useLocale();

  useOutsideClick(navRef, () => setOpenGroup(null));

  useEffect(() => { setOpenGroup(null); setMobileOpen(false); }, [location]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    window.dispatchEvent(new CustomEvent("et:search", { detail: value }));
  };

  return (
    <>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
        <div
          ref={navRef}
          style={{ maxWidth: "var(--content-wide)", margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", gap: 0 }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0, marginRight: 32 }}>
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="64" height="64" rx="11" fill="#EDEDEE"/>
              <rect x="14" y="15" width="36" height="7" rx="2" fill="#FF6B35"/>
              <rect x="14" y="28" width="28" height="7" rx="2" fill="#1A1916"/>
              <rect x="14" y="41" width="36" height="7" rx="2" fill="#1A1916"/>
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>
              EverydayTools
            </span>
          </Link>

          {/* Desktop nav dropdowns */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 24 }}>
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

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Search — desktop */}
          <label
            className="hidden md:flex"
            style={{
              width: 212,
              alignItems: "center",
              gap: 8,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-input)",
              padding: "7px 14px",
              cursor: "text",
              transition: "border-color 150ms ease, box-shadow 150ms ease",
            }}
            onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(255,107,53,0.12)"; }}
            onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="search"
              placeholder={t.nav.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              aria-label="Search tools"
              style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--text-primary)", width: "100%", fontFamily: "var(--font-ui)" }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--text-tertiary)", display: "flex", alignItems: "center", flexShrink: 0 }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </button>
            )}
          </label>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
            {/* Locale */}
            <div className="hidden md:flex" style={{ alignItems: "center", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              {(["EN", "FR"] as const).map((lang, i) => (
                <button
                  key={lang}
                  onClick={() => setLocale(lang)}
                  style={{
                    background: lang === locale ? "var(--bg-subtle)" : "transparent",
                    color: lang === locale ? "var(--text-primary)" : "var(--text-secondary)",
                    border: "none",
                    borderLeft: i === 1 ? "1px solid var(--border)" : "none",
                    padding: "5px 10px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background 120ms ease, color 120ms ease",
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="hidden md:flex"
              style={{ width: 34, height: 34, alignItems: "center", justifyContent: "center", background: "none", border: "1px solid var(--border)", borderRadius: 10, cursor: "pointer", color: "var(--text-secondary)", transition: "background 150ms ease, color 150ms ease, border-color 150ms ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
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
            <button className="flex md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu" style={{ background: "none", border: "1px solid var(--border)", borderRadius: 10, cursor: "pointer", padding: "7px", color: "var(--text-secondary)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 5h12M2 8h12M2 11h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      </nav>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} currentPath={location} />
    </>
  );
}
