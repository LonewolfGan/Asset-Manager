import React, { useRef } from "react";
import { Link } from "wouter";
import { useLocale } from "@/hooks/use-locale";
import { SLUG_ICON_MAP, type NavGroupDef } from "@/config/top-nav-groups";

export interface NavDropdownProps {
  group: NavGroupDef;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  clearTimer: () => void;
  currentPath: string;
}

export function NavDropdown({
  group,
  isOpen,
  onOpen,
  onClose,
  clearTimer,
  currentPath,
}: NavDropdownProps) {
  const { t } = useLocale();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const allLinks = group.pairs.flatMap((p) => p.filter(Boolean)) as { href: string }[];
  const isActive = allLinks.some((l) => l.href === currentPath);
  const groupLabel = (t.nav.groups as Record<string, string>)[group.id] ?? group.id;

  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    const links = Array.from(panelRef.current?.querySelectorAll("a") ?? []);
    const idx = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      (links[idx + 1] as HTMLAnchorElement | undefined)?.focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (idx === 0) {
        buttonRef.current?.focus();
      } else {
        (links[idx - 1] as HTMLAnchorElement | undefined)?.focus();
      }
    }
    if (e.key === "Escape") {
      onClose();
      buttonRef.current?.focus();
    }
  };

  const linkLabel = (href: string) => {
    const slug = href.slice(1);
    return t.nav.links[slug] ?? t.tools[slug]?.title ?? slug;
  };

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => {
        clearTimer();
        onOpen();
      }}
    >
      <button
        ref={buttonRef}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? onClose() : onOpen())}
        onKeyDown={(e) => {
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
          color: (isActive || isOpen) ? "var(--text-primary)" : "var(--text-secondary)",
          display: "flex",
          alignItems: "center",
          gap: 5,
          whiteSpace: "nowrap",
          transition: "color 120ms ease, border-color 120ms ease",
        }}
      >
        {groupLabel}
        <svg
          width="9"
          height="5"
          viewBox="0 0 9 5"
          fill="none"
          style={{
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 120ms ease",
            flexShrink: 0,
          }}
        >
          <path
            d="M1 1l3.5 3L8 1"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
            borderRadius: "var(--radius-card)",
            minWidth: 340,
            maxHeight: "calc(100vh - 90px)",
            overflowY: "auto",
            padding: 8,
            zIndex: 100,
            boxShadow: "var(--shadow-hover)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {group.pairs.map((pair, pi) =>
              pair[0] === null && pair[1] === null ? (
                <div
                  key={pi}
                  style={{
                    gridColumn: "1 / -1",
                    borderTop: "1px solid var(--border)",
                    margin: "4px 0",
                  }}
                />
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
                        gap: 8,
                        height: 34,
                        padding: "0 10px",
                        fontFamily: "var(--font-ui)",
                        fontSize: "var(--text-sm)",
                        color: currentPath === entry.href ? "var(--accent)" : "var(--text-secondary)",
                        textDecoration: "none",
                        borderRadius: "var(--radius-md)",
                        whiteSpace: "nowrap",
                        transition: "background 120ms ease, color 120ms ease",
                        fontWeight: currentPath === entry.href ? 500 : 400,
                        overflow: "visible",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)";
                        (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color =
                          currentPath === entry.href ? "var(--accent)" : "var(--text-secondary)";
                      }}
                    >
                      {(() => {
                        const I = SLUG_ICON_MAP[entry.href.slice(1)];
                        return I ? <I size={14} strokeWidth={1.5} style={{ flexShrink: 0 }} /> : null;
                      })()}
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
