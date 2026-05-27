import { Link } from "wouter";
import { tools } from "../config/tools.config";
import { useLocale } from "../hooks/use-locale";

// ─── Design tokens (mirrors index.css) ───────────────────
const D = {
  surface:     "rgba(255,255,255,0.04)",
  surfaceHov:  "rgba(255,255,255,0.08)",
  border:      "rgba(255,255,255,0.10)",
  borderSub:   "rgba(255,255,255,0.06)",
  inset:       "inset 2px 4px 16px 0px rgba(248,248,248,0.06)",
  t1:          "#f4f4f5",
  t2:          "#a1a1aa",
  t3:          "#71717a",
  accent:      "#1A6BFF",
  accentDim:   "rgba(26,107,255,0.12)",
};

// ─── Blueprint grid backdrop ──────────────────────────────
const GRID: React.CSSProperties = {
  position: "absolute", inset: 0, pointerEvents: "none",
  backgroundImage: `
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
  `,
  backgroundSize: "24px 24px",
  maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
  WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
};

// ─── Thin Lucide-style icon ───────────────────────────────
function Icon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
const IC = {
  arrow:  "M5 12h14M12 5l7 7-7 7",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  zap:    "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  globe:  "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  file:   "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  img:    "M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h4l2 3h3a2 2 0 0 1 2 2zM12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  lock:   "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  calc:   "M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM8 6h1M12 6h1M16 6h1M8 10h1M12 10h1M16 10h1M8 14h1M12 14h1M16 14h1M8 18h8",
  type:   "M4 7V4h16v3M9 20h6M12 4v16",
  eye:    "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22",
  check:  "M20 6L9 17l-5-5",
};

// ─── Bento category config ────────────────────────────────
const BENTO = [
  { id: "pdf",        label: "PDF",     title: "PDF Tools",       colSpan: 2, accent: "#1A6BFF", icon: IC.file   },
  { id: "image",      label: "IMAGE",   title: "Image Tools",     colSpan: 1, accent: "#8B5CF6", icon: IC.img    },
  { id: "word",       label: "DOCS",    title: "Document Tools",  colSpan: 1, accent: "#10B981", icon: IC.type   },
  { id: "calculators",label: "UTILITY", title: "Calculators",     colSpan: 1, accent: "#F59E0B", icon: IC.calc   },
  { id: "privacy",    label: "PRIVACY", title: "Privacy Tools",   colSpan: 1, accent: "#EC4899", icon: IC.eye    },
] as const;

// hex→rgb helper for inline accent tints
function hexRgb(hex: string) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

// ─── Shared GlassCard ─────────────────────────────────────
function GlassCard({
  children, style, pad = "28px 24px",
}: { children: React.ReactNode; style?: React.CSSProperties; pad?: string }) {
  return (
    <div
      className="glass-card"
      style={{
        background: D.surface,
        border: `1px solid ${D.border}`,
        borderRadius: 12,
        boxShadow: D.inset,
        padding: pad,
        transition: "background 200ms ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      position: "relative", overflow: "hidden",
      padding: "108px 20px 96px",
      textAlign: "center",
    }}>
      <div style={GRID} />
      <div style={{
        position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)",
        width: 640, height: 420, pointerEvents: "none",
        background: "radial-gradient(ellipse, rgba(26,107,255,0.09) 0%, transparent 70%)",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: D.accentDim, border: `1px solid rgba(26,107,255,0.2)`,
          borderRadius: 100, padding: "5px 14px 5px 8px", marginBottom: 36,
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
            color: D.accent, letterSpacing: "0.10em", textTransform: "uppercase",
            background: "rgba(26,107,255,0.15)", borderRadius: 100, padding: "2px 9px",
          }}>New</span>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: D.t2, letterSpacing: "-0.01em" }}>
            AI Background Remover — fully on-device
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "var(--font-ui)",
          fontSize: "clamp(40px, 5.5vw, 64px)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1.06,
          color: D.t1,
          margin: "0 0 22px",
        }}>
          Built different,<br />
          <span style={{ color: D.t3 }}>on purpose.</span>
        </h1>

        {/* Subtext */}
        <p style={{
          fontFamily: "var(--font-ui)", fontSize: 17,
          color: D.t2, lineHeight: 1.7,
          maxWidth: 500, margin: "0 auto 44px",
          letterSpacing: "-0.01em",
        }}>
          28 free browser-based tools for PDFs, images, privacy &amp; calculations.
          Your files never leave your device — not even for a millisecond.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/#tools" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: D.t1, color: "#08090a",
            borderRadius: 9, padding: "11px 24px",
            fontSize: 14, fontWeight: 600,
            textDecoration: "none",
            fontFamily: "var(--font-ui)", letterSpacing: "-0.02em",
          }}>
            Explore all tools <Icon d={IC.arrow} size={14} />
          </Link>
          <a href="#why" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "transparent", color: D.t2,
            border: `1px solid ${D.border}`,
            borderRadius: 9, padding: "10px 20px",
            fontSize: 14, fontWeight: 500,
            textDecoration: "none",
            fontFamily: "var(--font-ui)", letterSpacing: "-0.01em",
          }}>
            How it works
          </a>
        </div>

        <p style={{
          marginTop: 36, fontSize: 12.5, color: D.t3,
          fontFamily: "var(--font-mono)", letterSpacing: "0.06em",
          textTransform: "uppercase",
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
    { num: "28",   label: "Free Tools" },
    { num: "0",    label: "Files Uploaded" },
    { num: "170+", label: "Currencies" },
    { num: "100%", label: "Client-Side" },
  ];
  return (
    <div style={{
      borderTop: `1px solid ${D.borderSub}`,
      borderBottom: `1px solid ${D.borderSub}`,
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      maxWidth: "var(--content-wide)", margin: "0 auto",
    }}>
      {stats.map((s, i) => (
        <div key={s.label} style={{
          padding: "32px 0", textAlign: "center",
          borderRight: i < stats.length - 1 ? `1px solid ${D.borderSub}` : "none",
        }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 38, fontWeight: 700,
            color: D.t1, letterSpacing: "-0.04em", lineHeight: 1,
          }}>{s.num}</div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 500,
            color: D.t3, letterSpacing: "0.14em",
            textTransform: "uppercase", marginTop: 8,
          }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Features ─────────────────────────────────────────────
const FEATURES = [
  { icon: IC.shield, title: "Zero uploads, ever",    desc: "Every operation executes inside your browser tab. Your documents and images are never transmitted to any server." },
  { icon: IC.zap,    title: "Instant — no queue",    desc: "No server round-trips. Processing starts the moment you drop a file, not when a remote job slot opens up." },
  { icon: IC.layers, title: "28 tools, one place",   desc: "PDF, image, privacy, and calculator tools under one lightweight app. No juggling five different sites." },
  { icon: IC.globe,  title: "EN & FR supported",     desc: "Full English and French support across every tool and every error message. More languages on the roadmap." },
];

function Features() {
  return (
    <section id="why" style={{ padding: "80px 20px", maxWidth: "var(--content-wide)", margin: "0 auto" }}>
      <p style={{
        fontFamily: "var(--font-mono)", fontSize: 11, color: D.accent,
        letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
        marginBottom: 40,
      }}>Why EverydayTools</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
        {FEATURES.map(f => (
          <GlassCard key={f.title} style={{ cursor: "default" }}>
            <div style={{ color: D.t2, marginBottom: 20 }}>
              <Icon d={f.icon} size={18} />
            </div>
            <h3 style={{
              fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 600,
              color: D.t1, letterSpacing: "-0.02em", margin: "0 0 10px",
            }}>{f.title}</h3>
            <p style={{
              fontFamily: "var(--font-ui)", fontSize: 13.5, color: D.t3,
              lineHeight: 1.65, margin: 0, letterSpacing: "-0.01em",
            }}>{f.desc}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

// ─── Bento tool categories ─────────────────────────────────
function ToolsBento() {
  return (
    <section id="tools" style={{ padding: "0 20px 80px", maxWidth: "var(--content-wide)", margin: "0 auto" }}>
      <div style={{
        display: "flex", alignItems: "baseline",
        justifyContent: "space-between", marginBottom: 40,
        flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 11, color: D.accent,
            letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
            margin: "0 0 10px",
          }}>Tool Index</p>
          <h2 style={{
            fontFamily: "var(--font-ui)", fontSize: "clamp(26px, 3vw, 36px)",
            fontWeight: 700, letterSpacing: "-0.04em", color: D.t1, margin: 0,
          }}>28 tools, five categories.</h2>
        </div>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 11, color: D.t3,
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>All free · No signup</span>
      </div>

      {/* Bento grid — 3 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {BENTO.map(cat => {
          const catTools = tools.filter(t => t.category === cat.id);
          const rgb = hexRgb(cat.accent);
          return (
            <div
              key={cat.id}
              className="bento-card"
              style={{
                gridColumn: `span ${cat.colSpan}`,
                background: D.surface,
                border: `1px solid ${D.border}`,
                borderRadius: 12,
                boxShadow: D.inset,
                padding: "26px 26px 22px",
                transition: "background 200ms ease",
              }}
            >
              {/* Header */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 18,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `rgba(${rgb}, 0.12)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: cat.accent, flexShrink: 0,
                  }}>
                    <Icon d={cat.icon} size={16} />
                  </div>
                  <span style={{
                    fontFamily: "var(--font-ui)", fontSize: 15.5, fontWeight: 600,
                    color: D.t1, letterSpacing: "-0.02em",
                  }}>{cat.title}</span>
                </div>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
                  color: cat.accent,
                  background: `rgba(${rgb}, 0.10)`,
                  border: `1px solid rgba(${rgb}, 0.20)`,
                  borderRadius: 100, padding: "3px 10px",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}>
                  {String(catTools.length).padStart(2, "0")} Tools
                </span>
              </div>

              {/* Tool links */}
              <div style={{
                display: "grid",
                gridTemplateColumns: cat.colSpan === 2 ? "repeat(2, 1fr)" : "1fr",
                gap: "0 20px",
              }}>
                {catTools.map(tool => (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "6px 0",
                      borderTop: `1px solid ${D.borderSub}`,
                      color: D.t3,
                      textDecoration: "none",
                      fontFamily: "var(--font-ui)", fontSize: 13,
                      letterSpacing: "-0.01em",
                      transition: "color 150ms ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = D.t1)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = D.t3)}
                  >
                    <Icon d={IC.check} size={11} />
                    {tool.title}
                  </Link>
                ))}
              </div>

              {/* Footer CTA */}
              <div style={{ marginTop: 16 }}>
                <Link href={`/${catTools[0]?.slug ?? ""}`} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  color: cat.accent, textDecoration: "none",
                  fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500,
                }}>
                  Open {cat.title} <Icon d={IC.arrow} size={12} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Privacy strip ─────────────────────────────────────────
const PRIVACY_ITEMS = [
  { icon: IC.lock,   title: "No server upload",    desc: "All computation — PDF parsing, image encoding, AI inference — runs in your browser's WebAssembly sandbox." },
  { icon: IC.eye,    title: "No account required",  desc: "Open a tool, use it, close the tab. Zero sign-up friction. No email, no password, no OAuth dance." },
  { icon: IC.shield, title: "No data retained",     desc: "When you close the tab, everything is gone. No localStorage for sensitive data. No telemetry of your files." },
];

function Privacy() {
  return (
    <section style={{
      borderTop: `1px solid ${D.borderSub}`,
      borderBottom: `1px solid ${D.borderSub}`,
      padding: "80px 20px",
    }}>
      <div style={{ maxWidth: "var(--content-wide)", margin: "0 auto" }}>
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 11, color: D.accent,
          letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
          marginBottom: 10,
        }}>Privacy by Design</p>
        <h2 style={{
          fontFamily: "var(--font-ui)", fontSize: "clamp(24px, 3vw, 34px)",
          fontWeight: 700, letterSpacing: "-0.04em", color: D.t1,
          margin: "0 0 40px",
        }}>Your privacy is not negotiable.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {PRIVACY_ITEMS.map(item => (
            <GlassCard key={item.title} style={{ cursor: "default" }}>
              <div style={{ color: D.t2, marginBottom: 18 }}>
                <Icon d={item.icon} size={18} />
              </div>
              <h3 style={{
                fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 600,
                color: D.t1, letterSpacing: "-0.02em", margin: "0 0 10px",
              }}>{item.title}</h3>
              <p style={{
                fontFamily: "var(--font-ui)", fontSize: 13.5, color: D.t3,
                lineHeight: 1.65, margin: 0, letterSpacing: "-0.01em",
              }}>{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────
function CTA() {
  return (
    <section style={{
      position: "relative", overflow: "hidden",
      padding: "100px 20px", textAlign: "center",
    }}>
      <div style={GRID} />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500, height: 300, pointerEvents: "none",
        background: "radial-gradient(ellipse, rgba(26,107,255,0.07) 0%, transparent 70%)",
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h2 style={{
          fontFamily: "var(--font-ui)",
          fontSize: "clamp(32px, 4.5vw, 52px)",
          fontWeight: 700, letterSpacing: "-0.04em",
          color: D.t1, margin: "0 0 16px", lineHeight: 1.08,
        }}>
          Start using your tools.<br />
          <span style={{ color: D.t3 }}>Right now. For free.</span>
        </h2>
        <p style={{
          fontFamily: "var(--font-ui)", fontSize: 16, color: D.t2,
          maxWidth: 400, margin: "0 auto 40px",
          lineHeight: 1.7, letterSpacing: "-0.01em",
        }}>
          No account. No credit card. 28 tools ready the moment you open the app.
        </p>
        <Link href="/#tools" style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: D.t1, color: "#08090a",
          borderRadius: 9, padding: "13px 28px",
          fontSize: 15, fontWeight: 600,
          textDecoration: "none",
          fontFamily: "var(--font-ui)", letterSpacing: "-0.02em",
        }}>
          Explore all tools <Icon d={IC.arrow} size={15} />
        </Link>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────
export default function Home() {
  return (
    <div>
      <Hero />
      <StatsBar />
      <Features />
      <ToolsBento />
      <Privacy />
      <CTA />
    </div>
  );
}
