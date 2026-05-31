import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { tools } from "@/config/tools.config";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const kbdStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 18,
  height: 18,
  padding: "0 4px",
  background: "var(--bg-elevated)",
  border: "1px solid var(--border-strong)",
  borderRadius: "var(--radius-sm)",
  fontSize: 10,
  fontFamily: "var(--font-mono)",
  color: "var(--text-secondary)",
  lineHeight: 1,
};

const SUGGESTED_SLUGS = [
  "pdf-to-word", "image-converter", "background-remover",
  "password-generator", "metadata-cleaner", "unit-converter",
];

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim().toLowerCase();
  const results = trimmed
    ? tools.filter(
        (t) =>
          t.title.toLowerCase().includes(trimmed) ||
          t.description.toLowerCase().includes(trimmed) ||
          t.formats.some((f) => f.toLowerCase().includes(trimmed))
      ).slice(0, 9)
    : tools.filter((t) => SUGGESTED_SLUGS.includes(t.slug)).sort(
        (a, b) => SUGGESTED_SLUGS.indexOf(a.slug) - SUGGESTED_SLUGS.indexOf(b.slug)
      );

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIdx(0);
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.children[activeIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIdx]) {
      (listRef.current?.children[activeIdx] as HTMLAnchorElement)?.click();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  const sectionLabel = trimmed ? `${results.length} result${results.length !== 1 ? "s" : ""}` : "Suggestions";

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 500,
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
        }}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search tools"
        style={{
          position: "fixed",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(580px, calc(100vw - 32px))",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-xl)",
          zIndex: 501,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 16px",
            height: 52,
            borderBottom: "1px solid var(--border)",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-tertiary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tools…"
            aria-label="Search tools"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "var(--text-base)",
              fontFamily: "var(--font-ui)",
              color: "var(--text-primary)",
              lineHeight: 1.5,
            }}
          />

          <kbd style={kbdStyle}>Esc</kbd>
        </div>

        {/* Section label */}
        <div
          style={{
            padding: "8px 16px 4px",
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            color: "var(--text-tertiary)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {sectionLabel}
        </div>

        {/* Results */}
        <div
          ref={listRef}
          style={{ maxHeight: 340, overflowY: "auto" }}
          role="listbox"
        >
          {results.length > 0 ? (
            results.map((tool, i) => {
              const Icon = tool.icon;
              const isActive = i === activeIdx;
              return (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  role="option"
                  aria-selected={isActive}
                  onClick={onClose}
                  onMouseEnter={() => setActiveIdx(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "9px 16px",
                    background: isActive ? "var(--bg-elevated)" : "transparent",
                    textDecoration: "none",
                    transition: "background 80ms ease",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: isActive ? "var(--bg-hover)" : "var(--bg-elevated)",
                      borderRadius: "var(--radius-md)",
                      color: isActive ? "var(--accent)" : "var(--text-secondary)",
                      transition: "background 80ms ease, color 80ms ease",
                    }}
                  >
                    <Icon size={15} strokeWidth={1.75} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "var(--text-sm)",
                        fontFamily: "var(--font-ui)",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {tool.title}
                    </div>
                    <div
                      style={{
                        fontSize: "var(--text-xs)",
                        fontFamily: "var(--font-ui)",
                        color: "var(--text-secondary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: 1.4,
                        marginTop: 1,
                      }}
                    >
                      {tool.description}
                    </div>
                  </div>

                  {tool.formats.length > 0 && (
                    <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                      {tool.formats.slice(0, 3).map((f) => (
                        <span
                          key={f}
                          style={{
                            fontSize: 9,
                            fontFamily: "var(--font-mono)",
                            color: "var(--text-tertiary)",
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-sm)",
                            padding: "1px 5px",
                            letterSpacing: "0.04em",
                            lineHeight: 1.6,
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })
          ) : (
            <div
              style={{
                padding: "28px 16px",
                textAlign: "center",
                fontSize: "var(--text-sm)",
                fontFamily: "var(--font-ui)",
                color: "var(--text-secondary)",
              }}
            >
              No tools found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "8px 16px",
            borderTop: "1px solid var(--border)",
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            color: "var(--text-tertiary)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <kbd style={kbdStyle}>↑</kbd>
            <kbd style={kbdStyle}>↓</kbd>
            navigate
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <kbd style={kbdStyle}>↵</kbd>
            open
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <kbd style={kbdStyle}>Esc</kbd>
            close
          </span>
        </div>
      </div>
    </>
  );
}
