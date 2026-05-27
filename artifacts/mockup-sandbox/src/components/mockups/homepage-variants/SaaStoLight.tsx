
// SaaSto-inspired light theme homepage for EverydayTools

const C = {
  bg: "#FFFFFF",
  bgTint: "#F7F5FF",
  bgTint2: "#FFF5FB",
  purple: "#7B61FF",
  blue: "#1A6BFF",
  pink: "#FF61B6",
  orange: "#FF9843",
  dark: "#12002E",
  darkMid: "#3D3066",
  muted: "#7A7395",
  border: "#EAE8F5",
  cardBg: "#FFFFFF",
};

function Blob({ style }: { style: React.CSSProperties }) {
  return (
    <div style={{
      position: "absolute",
      borderRadius: "50%",
      filter: "blur(80px)",
      opacity: 0.35,
      pointerEvents: "none",
      ...style,
    }} />
  );
}

function Nav() {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${C.border}`,
      height: 64,
      display: "flex", alignItems: "center",
      padding: "0 64px", gap: 40,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginRight: 8 }}>
        <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
          <rect width="64" height="64" rx="11" fill="#1A1916"/>
          <rect x="14" y="15" width="36" height="7" rx="2" fill="#1A6BFF"/>
          <rect x="14" y="28" width="28" height="7" rx="2" fill="#F7F6F3"/>
          <rect x="14" y="41" width="36" height="7" rx="2" fill="#F7F6F3"/>
        </svg>
        <span style={{ fontSize: 16, fontWeight: 600, color: C.dark, letterSpacing: "-0.02em", fontFamily: "'Geist', sans-serif" }}>
          EverydayTools
        </span>
      </div>
      <div style={{ display: "flex", gap: 28 }}>
        {["Convert Documents", "Convert Images", "Tools", "About"].map(l => (
          <span key={l} style={{ fontSize: 14, color: C.muted, cursor: "pointer", fontFamily: "'Geist', sans-serif", fontWeight: 500 }}>{l}</span>
        ))}
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 14, color: C.muted, cursor: "pointer", fontFamily: "'Geist', sans-serif" }}>Sign in</span>
        <div style={{
          background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
          color: "#fff", borderRadius: 10, padding: "9px 22px",
          fontSize: 14, fontWeight: 600, cursor: "pointer",
          fontFamily: "'Geist', sans-serif",
          boxShadow: "0 4px 14px rgba(123,97,255,0.35)",
        }}>
          Get Started Free
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section style={{
      position: "relative",
      overflow: "hidden",
      padding: "100px 64px 80px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 60,
      alignItems: "center",
      background: C.bg,
    }}>
      <Blob style={{ width: 600, height: 600, background: C.purple, top: -200, left: -150 }} />
      <Blob style={{ width: 400, height: 400, background: C.pink, top: 100, right: -100 }} />
      <Blob style={{ width: 300, height: 300, background: C.blue, bottom: -100, left: 300 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(123,97,255,0.08)",
          border: `1px solid rgba(123,97,255,0.2)`,
          borderRadius: 100, padding: "6px 14px 6px 8px",
          marginBottom: 28,
        }}>
          <span style={{
            background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
            color: "#fff", borderRadius: 100, padding: "2px 10px",
            fontSize: 11, fontWeight: 700, fontFamily: "'Geist', sans-serif",
            letterSpacing: "0.05em", textTransform: "uppercase",
          }}>New</span>
          <span style={{ fontSize: 13, color: C.purple, fontWeight: 500, fontFamily: "'Geist', sans-serif" }}>
            AI Background Remover — now on-device
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: 58,
          fontWeight: 400,
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          margin: "0 0 20px",
          color: C.dark,
        }}>
          Every tool you<br />
          reach for,{" "}
          <span style={{
            backgroundImage: `linear-gradient(135deg, ${C.purple} 0%, ${C.blue} 60%, ${C.pink} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            daily.
          </span>
        </h1>

        {/* Subtext */}
        <p style={{
          fontFamily: "'Geist', sans-serif",
          fontSize: 17,
          color: C.muted,
          lineHeight: 1.7,
          maxWidth: 460,
          margin: "0 0 36px",
        }}>
          28 free browser-based tools for PDFs, images, privacy &amp; calculations. No uploads, no accounts — your files never leave your device.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
            color: "#fff",
            borderRadius: 12,
            padding: "13px 28px",
            fontSize: 15, fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Geist', sans-serif",
            boxShadow: "0 6px 20px rgba(123,97,255,0.4)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            Explore All Tools
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{
            background: "transparent",
            color: C.dark,
            border: `2px solid ${C.border}`,
            borderRadius: 12,
            padding: "11px 24px",
            fontSize: 15, fontWeight: 500,
            cursor: "pointer",
            fontFamily: "'Geist', sans-serif",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke={C.purple} strokeWidth="1.5"/><path d="M7 6.5l4 2.5-4 2.5V6.5z" fill={C.purple}/></svg>
            Watch demo
          </div>
        </div>

        {/* Trust line */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 32 }}>
          <div style={{ display: "flex" }}>
            {["#7B61FF","#1A6BFF","#FF61B6","#FF9843","#22C55E"].map((c, i) => (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: "50%",
                background: c, border: "2px solid #fff",
                marginLeft: i === 0 ? 0 : -8,
              }}/>
            ))}
          </div>
          <span style={{ fontSize: 13, color: C.muted, fontFamily: "'Geist', sans-serif" }}>
            <strong style={{ color: C.dark }}>50,000+</strong> people use EverydayTools monthly
          </span>
        </div>
      </div>

      {/* Hero visual — browser mockup with tool cards */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          background: "#FFFFFF",
          borderRadius: 20,
          boxShadow: "0 24px 80px rgba(123,97,255,0.18), 0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
          border: `1px solid ${C.border}`,
        }}>
          {/* Browser chrome */}
          <div style={{ background: "#F3F2F8", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${C.border}` }}>
            {["#FF5F57","#FFBD2E","#28C940"].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }}/>
            ))}
            <div style={{ flex: 1, background: "#E8E6F5", borderRadius: 6, height: 22, marginLeft: 8, display: "flex", alignItems: "center", paddingLeft: 10 }}>
              <span style={{ fontSize: 11, color: C.muted, fontFamily: "'Geist Mono', monospace" }}>everydaytools.app</span>
            </div>
          </div>
          {/* Tool preview grid inside browser */}
          <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "PDF to Word", cat: "PDF", color: C.purple },
              { label: "Background Remover", cat: "AI", color: C.pink },
              { label: "Image Converter", cat: "IMAGE", color: C.blue },
              { label: "Password Generator", cat: "UTILITY", color: C.orange },
              { label: "Compress PDF", cat: "PDF", color: C.purple },
              { label: "Currency Converter", cat: "UTILITY", color: "#22C55E" },
            ].map(t => (
              <div key={t.label} style={{
                background: C.bgTint,
                borderRadius: 10,
                padding: "12px 14px",
                border: `1px solid ${C.border}`,
                display: "flex", flexDirection: "column", gap: 4,
              }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
                  color: t.color, fontFamily: "'Geist', sans-serif",
                  textTransform: "uppercase",
                }}>{t.cat}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.dark, fontFamily: "'Geist', sans-serif" }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating decorative elements */}
        <div style={{
          position: "absolute", top: -24, right: -20,
          background: "#fff",
          borderRadius: 14, padding: "10px 14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
          display: "flex", alignItems: "center", gap: 8,
          border: `1px solid ${C.border}`,
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 14 }}>🔒</span>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.dark, fontFamily: "'Geist', sans-serif" }}>100% Private</div>
            <div style={{ fontSize: 10, color: C.muted, fontFamily: "'Geist', sans-serif" }}>Files never uploaded</div>
          </div>
        </div>

        <div style={{
          position: "absolute", bottom: -20, left: -20,
          background: "#fff",
          borderRadius: 14, padding: "10px 14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
          display: "flex", alignItems: "center", gap: 8,
          border: `1px solid ${C.border}`,
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${C.pink}, ${C.orange})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 14 }}>⚡</span>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.dark, fontFamily: "'Geist', sans-serif" }}>28 Tools</div>
            <div style={{ fontSize: 10, color: C.muted, fontFamily: "'Geist', sans-serif" }}>All completely free</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { num: "28", label: "Free Tools", color: C.purple },
    { num: "0", label: "Files Uploaded", color: C.pink },
    { num: "170+", label: "Currencies", color: C.blue },
    { num: "100%", label: "Client-side", color: C.orange },
  ];
  return (
    <section style={{
      background: C.dark,
      padding: "48px 64px",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 0,
    }}>
      {stats.map((s, i) => (
        <div key={s.label} style={{
          textAlign: "center",
          padding: "0 24px",
          borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
        }}>
          <div style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: 48, fontWeight: 400,
            backgroundImage: `linear-gradient(135deg, ${s.color}, #fff)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.1,
          }}>{s.num}</div>
          <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.55)", marginTop: 6 }}>{s.label}</div>
        </div>
      ))}
    </section>
  );
}

function Features() {
  const features = [
    { icon: "🛡️", title: "Zero uploads, ever", desc: "Every tool runs entirely in your browser. Your PDFs, images, and passwords never touch a server.", color: C.purple, bg: "#F0ECFF" },
    { icon: "⚡", title: "Instant & free", desc: "No account. No paywall. No ads. Open a tool, use it, leave. As fast and simple as that.", color: C.blue, bg: "#E8F0FF" },
    { icon: "🎨", title: "28 tools in one place", desc: "From PDF conversion to AI background removal to tip calculators — everything you reach for daily.", color: C.pink, bg: "#FFE8F5" },
    { icon: "🌍", title: "Multilingual", desc: "Full support for English and French, with more languages on the way. Tools for everyone.", color: C.orange, bg: "#FFF0E0" },
  ];
  return (
    <section style={{ background: C.bgTint, padding: "100px 64px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(123,97,255,0.08)", border: `1px solid rgba(123,97,255,0.15)`,
          borderRadius: 100, padding: "5px 14px", marginBottom: 20,
        }}>
          <span style={{ fontSize: 12, color: C.purple, fontWeight: 600, fontFamily: "'Geist', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Why EverydayTools
          </span>
        </div>
        <h2 style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: 44, fontWeight: 400, letterSpacing: "-0.025em",
          color: C.dark, margin: "0 0 16px", lineHeight: 1.15,
        }}>
          Built different,{" "}
          <span style={{ backgroundImage: `linear-gradient(135deg, ${C.purple}, ${C.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            on purpose
          </span>
        </h2>
        <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 16, color: C.muted, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
          We built the tool suite we wished existed — private, fast, and free. No strings attached.
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        {features.map(f => (
          <div key={f.title} style={{
            background: "#fff",
            borderRadius: 20,
            padding: "32px 28px",
            border: `1px solid ${C.border}`,
            boxShadow: "0 2px 12px rgba(123,97,255,0.06)",
            display: "flex", flexDirection: "column", gap: 16,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: f.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26,
            }}>
              {f.icon}
            </div>
            <div>
              <h3 style={{ fontFamily: "'Geist', sans-serif", fontSize: 17, fontWeight: 700, color: C.dark, margin: "0 0 8px" }}>
                {f.title}
              </h3>
              <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ToolCategories() {
  const cats = [
    { label: "PDF Tools", count: 14, color: C.purple, bg: "#F0ECFF", tools: ["PDF to Word", "PDF to Text", "Compress PDF", "Merge PDFs", "Split PDF", "+9 more"] },
    { label: "Image Tools", count: 9, color: C.blue, bg: "#E8F0FF", tools: ["Image Converter", "HEIC to JPG", "Compress Image", "Background Remover", "+5 more"] },
    { label: "Privacy Tools", count: 2, color: C.pink, bg: "#FFE8F5", tools: ["Metadata Cleaner", "AI Text Scrubber"] },
    { label: "Calculators", count: 4, color: C.orange, bg: "#FFF0E0", tools: ["Password Generator", "Currency Converter", "Unit Converter", "Percentage Calc"] },
  ];
  return (
    <section style={{ background: C.bg, padding: "100px 64px" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(26,107,255,0.07)", border: `1px solid rgba(26,107,255,0.15)`,
          borderRadius: 100, padding: "5px 14px", marginBottom: 20,
        }}>
          <span style={{ fontSize: 12, color: C.blue, fontWeight: 600, fontFamily: "'Geist', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            All Tools
          </span>
        </div>
        <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 44, fontWeight: 400, letterSpacing: "-0.025em", color: C.dark, margin: "0 0 16px", lineHeight: 1.15 }}>
          28 tools, four categories
        </h2>
        <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 16, color: C.muted, maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>
          Every tool you need, organized where you'd expect it.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        {cats.map(cat => (
          <div key={cat.label} style={{
            background: cat.bg, borderRadius: 20, padding: "28px 24px",
            display: "flex", flexDirection: "column", gap: 20,
            border: `1px solid rgba(0,0,0,0.04)`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontFamily: "'Geist', sans-serif", fontSize: 17, fontWeight: 700, color: C.dark, margin: 0 }}>{cat.label}</h3>
              <span style={{
                fontFamily: "'Geist', sans-serif", fontSize: 12, fontWeight: 600,
                color: cat.color, background: "#fff", borderRadius: 100,
                padding: "3px 10px", border: `1px solid ${cat.color}22`,
              }}>{cat.count}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {cat.tools.map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: cat.color, flexShrink: 0 }}/>
                  <span style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: C.darkMid, fontWeight: t.startsWith("+") ? 600 : 400 }}>{t}</span>
                </div>
              ))}
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              color: cat.color, cursor: "pointer",
              fontFamily: "'Geist', sans-serif", fontSize: 13, fontWeight: 600,
            }}>
              Explore {cat.label}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PrivacyStrip() {
  const items = [
    { icon: "🔒", title: "No server uploads", desc: "All processing happens in your browser tab. Nothing is sent anywhere." },
    { icon: "🚫", title: "No account needed", desc: "Just open a tool and use it. No sign-up, no email, no friction." },
    { icon: "🗑️", title: "No data retained", desc: "Close the tab and everything is gone. No logs, no history, no tracking." },
  ];
  return (
    <section style={{
      background: C.dark,
      padding: "100px 64px",
      position: "relative",
      overflow: "hidden",
    }}>
      <Blob style={{ width: 500, height: 500, background: C.purple, top: -200, right: -100, opacity: 0.15 }} />
      <Blob style={{ width: 400, height: 400, background: C.blue, bottom: -200, left: -100, opacity: 0.12 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 44, fontWeight: 400, letterSpacing: "-0.025em", color: "#fff", margin: "0 0 16px", lineHeight: 1.15 }}>
            Your privacy is{" "}
            <span style={{ backgroundImage: `linear-gradient(135deg, ${C.purple}, ${C.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              not negotiable
            </span>
          </h2>
          <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
            Every tool is engineered from the ground up to keep your data on your device.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {items.map(item => (
            <div key={item.title} style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "32px 28px",
              backdropFilter: "blur(8px)",
            }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontFamily: "'Geist', sans-serif", fontSize: 17, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>{item.title}</h3>
              <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section style={{
      background: C.bgTint,
      padding: "100px 64px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      <Blob style={{ width: 500, height: 500, background: C.purple, top: -200, left: "50%", transform: "translateX(-50%)", opacity: 0.2 }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 52, fontWeight: 400, letterSpacing: "-0.03em", color: C.dark, margin: "0 0 20px", lineHeight: 1.1 }}>
          Start using your tools.<br />
          <span style={{ backgroundImage: `linear-gradient(135deg, ${C.purple}, ${C.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Right now. For free.
          </span>
        </h2>
        <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 17, color: C.muted, maxWidth: 440, margin: "0 auto 40px", lineHeight: 1.7 }}>
          No account. No credit card. Just 28 tools ready to use the moment you click.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
            color: "#fff", borderRadius: 12, padding: "15px 36px",
            fontSize: 16, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Geist', sans-serif",
            boxShadow: "0 8px 28px rgba(123,97,255,0.4)",
          }}>
            Explore All 28 Tools
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: C.dark, padding: "60px 64px 40px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
            <svg width="26" height="26" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="11" fill="#1A1916"/>
              <rect x="14" y="15" width="36" height="7" rx="2" fill="#1A6BFF"/>
              <rect x="14" y="28" width="28" height="7" rx="2" fill="#F7F6F3"/>
              <rect x="14" y="41" width="36" height="7" rx="2" fill="#F7F6F3"/>
            </svg>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", fontFamily: "'Geist', sans-serif" }}>EverydayTools</span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 260, fontFamily: "'Geist', sans-serif", margin: 0 }}>
            Browser-based tools for everyday digital tasks. Private, free, and always available.
          </p>
        </div>
        {[
          { heading: "Tools", links: ["PDF Tools", "Image Tools", "Privacy Tools", "Calculators"] },
          { heading: "Company", links: ["About", "Privacy Policy", "Terms"] },
          { heading: "Language", links: ["English", "Français"] },
        ].map(col => (
          <div key={col.heading}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontFamily: "'Geist', sans-serif", marginBottom: 16 }}>{col.heading}</div>
            {col.links.map(l => (
              <div key={l} style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontFamily: "'Geist', sans-serif", marginBottom: 10, cursor: "pointer" }}>{l}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "'Geist', sans-serif" }}>© 2025 EverydayTools. All rights reserved.</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "'Geist', sans-serif" }}>Made with care, in the browser.</span>
      </div>
    </footer>
  );
}

export function SaaStoLight() {
  return (
    <div style={{ fontFamily: "'Geist', sans-serif", background: C.bg, minWidth: 1200 }}>
      <Nav />
      <Hero />
      <StatsBar />
      <Features />
      <ToolCategories />
      <PrivacyStrip />
      <CTASection />
      <Footer />
    </div>
  );
}
