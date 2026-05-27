
// Premium dark — Vercel / Linear / Raycast aesthetic
// Strict adherence to brief: zinc-950 bg, glassmorphism cards, bento grid, blueprint grid, no colored gradients

import { useState } from "react";

// ─── Design tokens ────────────────────────────────────────
const T = {
  bg:       "#08090a",        // zinc-950
  surface:  "rgba(255,255,255,0.04)",
  surfaceHover: "rgba(255,255,255,0.08)",
  border:   "rgba(255,255,255,0.10)",
  borderSubtle: "rgba(255,255,255,0.06)",
  text1:    "#f4f4f5",        // zinc-100
  text2:    "#a1a1aa",        // zinc-400
  text3:    "#71717a",        // zinc-500
  accent:   "#1A6BFF",
  accentDim: "rgba(26,107,255,0.12)",
  inset:    "inset 2px 4px 16px 0px rgba(248,248,248,0.06)",
};

// ─── Blueprint grid (hero backdrop) ───────────────────────
const GRID_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage: `
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
  `,
  backgroundSize: "24px 24px",
  maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
  WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
  pointerEvents: "none",
};

// ─── Thin Lucide-style icon SVGs ──────────────────────────
function Icon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
const ICONS = {
  arrowRight:   "M5 12h14M12 5l7 7-7 7",
  shield:       "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  zap:          "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  layers:       "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  globe:        "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  fileText:     "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  image:        "M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h4l2 3h3a2 2 0 0 1 2 2zM12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  lock:         "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  calculator:   "M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM8 6h1M12 6h1M16 6h1M8 10h1M12 10h1M16 10h1M8 14h1M12 14h1M16 14h1M8 18h8",
  eyeOff:       "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22",
  check:        "M20 6L9 17l-5-5",
  external:     "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3",
};

// ─── Shared card wrapper ───────────────────────────────────
function Card({
  children, style, hoverable = false,
}: { children: React.ReactNode; style?: React.CSSProperties; hoverable?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => hoverable && setHovered(true)}
      onMouseLeave={() => hoverable && setHovered(false)}
      style={{
        background: hovered ? T.surfaceHover : T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        boxShadow: T.inset,
        transition: "background 200ms ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Nav ───────────────────────────────────────────────────
function Nav() {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(8,9,10,0.80)",
      backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${T.borderSubtle}`,
      height: 56,
      display: "flex", alignItems: "center",
      padding: "0 48px", gap: 32,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
          <rect width="64" height="64" rx="10" fill="#1A1916"/>
          <rect x="14" y="15" width="36" height="7" rx="2" fill="#1A6BFF"/>
          <rect x="14" y="28" width="28" height="7" rx="2" fill="#F7F6F3"/>
          <rect x="14" y="41" width="36" height="7" rx="2" fill="#F7F6F3"/>
        </svg>
        <span style={{ fontSize: 15, fontWeight: 600, color: T.text1, letterSpacing: "-0.02em", fontFamily: "'Geist', sans-serif" }}>
          EverydayTools
        </span>
      </div>

      <div style={{ display: "flex", gap: 2 }}>
        {["Documents", "Images", "Tools", "Changelog"].map(l => (
          <span key={l} style={{
            fontSize: 13.5, color: T.text3, cursor: "pointer",
            fontFamily: "'Geist', sans-serif", fontWeight: 500,
            padding: "6px 12px", borderRadius: 6,
            transition: "color 150ms",
          }}>{l}</span>
        ))}
      </div>

      <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 13.5, color: T.text3, cursor: "pointer", fontFamily: "'Geist', sans-serif", padding: "6px 12px" }}>
          Log in
        </span>
        <div style={{
          background: T.text1,
          color: T.bg,
          borderRadius: 8, padding: "7px 16px",
          fontSize: 13.5, fontWeight: 600, cursor: "pointer",
          fontFamily: "'Geist', sans-serif",
          letterSpacing: "-0.01em",
        }}>
          Open app →
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ──────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      position: "relative",
      padding: "120px 48px 100px",
      overflow: "hidden",
    }}>
      {/* Blueprint grid */}
      <div style={GRID_STYLE} />

      {/* Subtle accent glow behind text */}
      <div style={{
        position: "absolute",
        top: -80, left: "50%", transform: "translateX(-50%)",
        width: 600, height: 400,
        background: "radial-gradient(ellipse, rgba(26,107,255,0.10) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto", textAlign: "center" }}>

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: T.accentDim,
          border: `1px solid rgba(26,107,255,0.2)`,
          borderRadius: 100, padding: "5px 12px 5px 8px",
          marginBottom: 32,
        }}>
          <span style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 10, fontWeight: 700,
            color: T.accent,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "rgba(26,107,255,0.15)",
            borderRadius: 100, padding: "2px 8px",
          }}>New</span>
          <span style={{ fontSize: 13, color: T.text2, fontFamily: "'Geist', sans-serif", letterSpacing: "-0.01em" }}>
            AI Background Remover — fully on-device
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Geist', sans-serif",
          fontSize: 62,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1.06,
          color: T.text1,
          margin: "0 0 24px",
        }}>
          Built different,<br />
          <span style={{ color: T.text3 }}>on purpose.</span>
        </h1>

        {/* Sub-headline */}
        <p style={{
          fontFamily: "'Geist', sans-serif",
          fontSize: 18,
          color: T.text2,
          lineHeight: 1.7,
          maxWidth: 520,
          margin: "0 auto 44px",
          letterSpacing: "-0.01em",
        }}>
          28 browser-based tools for PDFs, images, privacy &amp; calculations.
          Your files never leave your device — not even for a millisecond.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: T.text1,
            color: T.bg,
            borderRadius: 9, padding: "11px 24px",
            fontSize: 14, fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Geist', sans-serif",
            letterSpacing: "-0.02em",
          }}>
            Explore all tools
            <Icon d={ICONS.arrowRight} size={14} />
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent",
            color: T.text2,
            border: `1px solid ${T.border}`,
            borderRadius: 9, padding: "10px 20px",
            fontSize: 14, fontWeight: 500,
            cursor: "pointer",
            fontFamily: "'Geist', sans-serif",
            letterSpacing: "-0.01em",
          }}>
            View on GitHub
            <Icon d={ICONS.external} size={13} />
          </div>
        </div>

        {/* Social proof line */}
        <p style={{
          marginTop: 36, fontSize: 13, color: T.text3,
          fontFamily: "'Geist', sans-serif", letterSpacing: "-0.01em",
        }}>
          Free forever · No account · No uploads
        </p>
      </div>
    </section>
  );
}

// ─── Stats bar ─────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { num: "28", unit: "Tools" },
    { num: "0",  unit: "Files uploaded" },
    { num: "170+", unit: "Currencies" },
    { num: "100%", unit: "Client-side" },
  ];
  return (
    <div style={{
      borderTop: `1px solid ${T.borderSubtle}`,
      borderBottom: `1px solid ${T.borderSubtle}`,
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      padding: "0 48px",
    }}>
      {stats.map((s, i) => (
        <div key={s.unit} style={{
          padding: "36px 0",
          textAlign: "center",
          borderRight: i < stats.length - 1 ? `1px solid ${T.borderSubtle}` : "none",
        }}>
          <div style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 36, fontWeight: 700,
            color: T.text1,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}>{s.num}</div>
          <div style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 10, fontWeight: 500,
            color: T.text3,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginTop: 8,
          }}>{s.unit}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Features (glassmorphism 4-up) ─────────────────────────
function Features() {
  const features = [
    { icon: ICONS.shield,  title: "Zero uploads, ever",   desc: "Every operation executes inside your browser tab. Your documents and images are never transmitted anywhere." },
    { icon: ICONS.zap,     title: "Instant — no queue",   desc: "No server round-trips. Processing starts the moment you drop a file, not when a job slot opens up." },
    { icon: ICONS.layers,  title: "28 tools, one place",  desc: "PDF, image, privacy, and calculator tools in a single lightweight app. No juggling five different sites." },
    { icon: ICONS.globe,   title: "EN & FR — more coming", desc: "Full English and French support across every tool and error message. More languages on the roadmap." },
  ];
  return (
    <section style={{ padding: "80px 48px" }}>
      <div style={{ marginBottom: 48 }}>
        <span style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: 11, color: T.accent,
          letterSpacing: "0.12em", textTransform: "uppercase",
          fontWeight: 600,
        }}>WHY EVERYDAYTOOLS</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {features.map((f) => {
          const [hov, setHov] = useState(false);
          return (
            <div
              key={f.title}
              onMouseEnter={() => setHov(true)}
              onMouseLeave={() => setHov(false)}
              style={{
                background: hov ? T.surfaceHover : T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                boxShadow: T.inset,
                padding: "28px 24px",
                transition: "background 200ms ease",
                cursor: "default",
              }}
            >
              <div style={{
                color: T.text2,
                marginBottom: 20,
                transform: hov ? "translateX(2px)" : "translateX(0)",
                transition: "transform 200ms ease",
              }}>
                <Icon d={f.icon} size={18} />
              </div>
              <h3 style={{
                fontFamily: "'Geist', sans-serif",
                fontSize: 15, fontWeight: 600,
                color: T.text1,
                letterSpacing: "-0.02em",
                margin: "0 0 10px",
                transform: hov ? "translateX(2px)" : "translateX(0)",
                transition: "transform 200ms ease",
              }}>{f.title}</h3>
              <p style={{
                fontFamily: "'Geist', sans-serif",
                fontSize: 13.5, color: T.text3,
                lineHeight: 1.65, margin: 0,
                letterSpacing: "-0.01em",
              }}>{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Bento tool categories ──────────────────────────────────
function ToolsBento() {
  const cats = [
    {
      icon: ICONS.fileText, label: "PDF", title: "PDF Tools",
      count: "14", colSpan: 2,
      tools: ["PDF to Word", "PDF to Text", "PDF to HTML", "Compress PDF", "Merge PDFs", "Split PDF", "PDF Protect", "PDF Watermark"],
      accent: T.accent,
    },
    {
      icon: ICONS.image, label: "IMAGE", title: "Image Tools",
      count: "09", colSpan: 1,
      tools: ["Image Converter", "HEIC to JPG", "Compress Image", "Background Remover", "Resize Image", "Crop Image"],
      accent: "#8B5CF6",
    },
    {
      icon: ICONS.eyeOff, label: "PRIVACY", title: "Privacy Tools",
      count: "02", colSpan: 1,
      tools: ["Metadata Cleaner", "AI Text Scrubber"],
      accent: "#EC4899",
    },
    {
      icon: ICONS.calculator, label: "UTILITY", title: "Calculators",
      count: "04", colSpan: 2,
      tools: ["Password Generator", "Currency Converter", "Unit Converter", "Percentage Calculator"],
      accent: "#10B981",
    },
  ];

  return (
    <section style={{ padding: "0 48px 80px" }}>
      <div style={{ marginBottom: 48, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div>
          <span style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 11, color: T.accent,
            letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
          }}>TOOL INDEX</span>
          <h2 style={{
            fontFamily: "'Geist', sans-serif",
            fontSize: 36, fontWeight: 700,
            letterSpacing: "-0.04em", color: T.text1,
            margin: "10px 0 0",
          }}>28 tools, four categories.</h2>
        </div>
        <span style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: 11, color: T.text3,
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>All free · No signup</span>
      </div>

      {/* Bento grid — 3 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {cats.map(cat => {
          const [hov, setHov] = useState(false);
          return (
            <div
              key={cat.title}
              onMouseEnter={() => setHov(true)}
              onMouseLeave={() => setHov(false)}
              style={{
                gridColumn: `span ${cat.colSpan}`,
                background: hov ? T.surfaceHover : T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                boxShadow: T.inset,
                padding: "28px 28px 24px",
                transition: "background 200ms ease",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  transform: hov ? "translateX(2px)" : "translateX(0)",
                  transition: "transform 200ms ease",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `rgba(${cat.accent.replace('#','').match(/.{2}/g)?.map(h=>parseInt(h,16)).join(',')}, 0.12)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: cat.accent,
                  }}>
                    <Icon d={cat.icon} size={16} />
                  </div>
                  <span style={{
                    fontFamily: "'Geist', sans-serif",
                    fontSize: 16, fontWeight: 600,
                    color: T.text1, letterSpacing: "-0.02em",
                  }}>{cat.title}</span>
                </div>
                <span style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 11, fontWeight: 700,
                  color: cat.accent,
                  background: `rgba(${cat.accent.replace('#','').match(/.{2}/g)?.map(h=>parseInt(h,16)).join(',')}, 0.10)`,
                  border: `1px solid rgba(${cat.accent.replace('#','').match(/.{2}/g)?.map(h=>parseInt(h,16)).join(',')}, 0.20)`,
                  borderRadius: 100,
                  padding: "3px 10px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>{cat.count} TOOLS</span>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: cat.colSpan === 2 ? "repeat(2, 1fr)" : "1fr",
                gap: "6px 20px",
              }}>
                {cat.tools.map(t => (
                  <div key={t} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "5px 0",
                    borderTop: `1px solid ${T.borderSubtle}`,
                  }}>
                    <Icon d={ICONS.check} size={12} />
                    <span style={{
                      fontFamily: "'Geist', sans-serif",
                      fontSize: 13, color: T.text3,
                      letterSpacing: "-0.01em",
                    }}>{t}</span>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: 20,
                display: "flex", alignItems: "center", gap: 6,
                color: cat.accent,
                fontFamily: "'Geist', sans-serif",
                fontSize: 13, fontWeight: 500,
                opacity: hov ? 1 : 0.7,
                transition: "opacity 200ms ease",
              }}>
                Open {cat.title}
                <Icon d={ICONS.arrowRight} size={13} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Privacy commitment ─────────────────────────────────────
function Privacy() {
  const items = [
    { icon: ICONS.lock,   title: "No server upload",  desc: "All computation — PDF parsing, image encoding, AI inference — runs in your browser's WASM sandbox." },
    { icon: ICONS.eyeOff, title: "No account required", desc: "Open a tool, use it, close the tab. Zero sign-up friction. No email, no password, no OAuth dance." },
    { icon: ICONS.shield, title: "No data retained",   desc: "When you close the tab, everything is gone. No localStorage for sensitive data. No telemetry of your files." },
  ];
  return (
    <section style={{
      padding: "80px 48px",
      borderTop: `1px solid ${T.borderSubtle}`,
      borderBottom: `1px solid ${T.borderSubtle}`,
    }}>
      <div style={{ marginBottom: 48 }}>
        <span style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: 11, color: T.accent,
          letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
        }}>PRIVACY BY DESIGN</span>
        <h2 style={{
          fontFamily: "'Geist', sans-serif",
          fontSize: 36, fontWeight: 700,
          letterSpacing: "-0.04em", color: T.text1,
          margin: "10px 0 0",
        }}>Your privacy is not negotiable.</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {items.map(item => {
          const [hov, setHov] = useState(false);
          return (
            <div
              key={item.title}
              onMouseEnter={() => setHov(true)}
              onMouseLeave={() => setHov(false)}
              style={{
                background: hov ? T.surfaceHover : T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                boxShadow: T.inset,
                padding: "28px 24px",
                transition: "background 200ms ease",
              }}
            >
              <div style={{
                color: T.text2, marginBottom: 18,
                transform: hov ? "translateX(2px)" : "translateX(0)",
                transition: "transform 200ms ease",
              }}>
                <Icon d={item.icon} size={18} />
              </div>
              <h3 style={{
                fontFamily: "'Geist', sans-serif",
                fontSize: 15, fontWeight: 600, color: T.text1,
                letterSpacing: "-0.02em", margin: "0 0 10px",
                transform: hov ? "translateX(2px)" : "translateX(0)",
                transition: "transform 200ms ease",
              }}>{item.title}</h3>
              <p style={{
                fontFamily: "'Geist', sans-serif",
                fontSize: 13.5, color: T.text3,
                lineHeight: 1.65, margin: 0, letterSpacing: "-0.01em",
              }}>{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── CTA ───────────────────────────────────────────────────
function CTA() {
  return (
    <section style={{ padding: "100px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={GRID_STYLE} />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500, height: 300,
        background: "radial-gradient(ellipse, rgba(26,107,255,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h2 style={{
          fontFamily: "'Geist', sans-serif",
          fontSize: 52, fontWeight: 700,
          letterSpacing: "-0.04em", color: T.text1,
          margin: "0 0 16px", lineHeight: 1.08,
        }}>
          Start using your tools.<br />
          <span style={{ color: T.text3 }}>Right now. For free.</span>
        </h2>
        <p style={{
          fontFamily: "'Geist', sans-serif",
          fontSize: 16, color: T.text2,
          maxWidth: 400, margin: "0 auto 40px",
          lineHeight: 1.7, letterSpacing: "-0.01em",
        }}>
          No account. No credit card. 28 tools available the moment you open the app.
        </p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: T.text1, color: T.bg,
          borderRadius: 9, padding: "13px 28px",
          fontSize: 15, fontWeight: 600, cursor: "pointer",
          fontFamily: "'Geist', sans-serif", letterSpacing: "-0.02em",
        }}>
          Open EverydayTools
          <Icon d={ICONS.arrowRight} size={15} />
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────
function Footer() {
  const cols = [
    { head: "TOOLS",   links: ["PDF Tools", "Image Tools", "Privacy Tools", "Calculators"] },
    { head: "PRODUCT", links: ["Changelog", "Privacy Policy", "Terms of Use"] },
    { head: "LANGUAGE",links: ["English", "Français"] },
  ];
  return (
    <footer style={{
      borderTop: `1px solid ${T.borderSubtle}`,
      padding: "48px 48px 36px",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="10" fill="#1A1916"/>
              <rect x="14" y="15" width="36" height="7" rx="2" fill="#1A6BFF"/>
              <rect x="14" y="28" width="28" height="7" rx="2" fill="#F7F6F3"/>
              <rect x="14" y="41" width="36" height="7" rx="2" fill="#F7F6F3"/>
            </svg>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.text1, fontFamily: "'Geist', sans-serif", letterSpacing: "-0.02em" }}>EverydayTools</span>
          </div>
          <p style={{ fontSize: 13, color: T.text3, lineHeight: 1.7, maxWidth: 240, fontFamily: "'Geist', sans-serif", letterSpacing: "-0.01em", margin: 0 }}>
            Browser-based tools for everyday digital tasks. Private by design. Free forever.
          </p>
        </div>
        {cols.map(col => (
          <div key={col.head}>
            <div style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 10, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: T.text3, marginBottom: 14,
            }}>{col.head}</div>
            {col.links.map(l => (
              <div key={l} style={{
                fontSize: 13, color: T.text3,
                fontFamily: "'Geist', sans-serif",
                letterSpacing: "-0.01em",
                marginBottom: 9, cursor: "pointer",
              }}>{l}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{
        borderTop: `1px solid ${T.borderSubtle}`,
        paddingTop: 24,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 12, color: T.text3, fontFamily: "'Geist Mono', monospace", letterSpacing: "0.04em" }}>
          © 2025 EVERYDAYTOOLS
        </span>
        <span style={{ fontSize: 12, color: T.text3, fontFamily: "'Geist Mono', monospace", letterSpacing: "0.04em" }}>
          MADE IN THE BROWSER
        </span>
      </div>
    </footer>
  );
}

// ─── Root export ───────────────────────────────────────────
export function SaaStoLight() {
  return (
    <div style={{
      background: T.bg,
      color: T.text1,
      minWidth: 1200,
      minHeight: "100vh",
      fontFamily: "'Geist', sans-serif",
    }}>
      <Nav />
      <Hero />
      <StatsBar />
      <Features />
      <ToolsBento />
      <Privacy />
      <CTA />
      <Footer />
    </div>
  );
}
