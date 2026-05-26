
const BLUE = "#1A6BFF";
const DARK = "#111113";
const SURFACE = "#18181b";
const ELEVATED = "#222228";
const BORDER = "#2e2e36";
const TEXT = "#f0f0f0";
const MUTED = "#8c8c9a";
const FAINT = "#3a3a44";

const CATEGORIES = [
  {
    id: "PDF",
    desc: "Convert, compress, merge, split, protect",
    tools: [
      { name: "PDF to Word", desc: "Editable DOCX in seconds", fmts: ["PDF","DOCX"] },
      { name: "PDF to Text", desc: "Extract all text content", fmts: ["PDF","TXT"] },
      { name: "Compress PDF", desc: "Reduce file size without quality loss", fmts: ["PDF"] },
      { name: "Merge PDFs", desc: "Combine multiple files into one", fmts: ["PDF"] },
      { name: "Split PDF", desc: "Separate pages or ranges", fmts: ["PDF"] },
      { name: "PDF to HTML", desc: "Convert to semantic markup", fmts: ["PDF","HTML"] },
    ],
  },
  {
    id: "IMAGE",
    desc: "Convert, resize, compress, remove backgrounds",
    tools: [
      { name: "Image Converter", desc: "PNG, JPEG, WEBP, AVIF, BMP and more", fmts: ["PNG","JPEG","WEBP"] },
      { name: "HEIC to JPG", desc: "Convert iPhone photos instantly", fmts: ["HEIC","JPG"] },
      { name: "Compress Image", desc: "Smaller files, same quality", fmts: ["PNG","JPEG","WEBP"] },
      { name: "Background Remover", desc: "On-device AI, nothing uploaded", fmts: ["PNG"] },
      { name: "Resize Image", desc: "Exact pixel dimensions", fmts: ["PNG","JPEG"] },
      { name: "Crop Image", desc: "Free crop with handles", fmts: ["PNG","JPEG"] },
    ],
  },
  {
    id: "UTILITY",
    desc: "Password, currency, units, calculations",
    tools: [
      { name: "Password Generator", desc: "Cryptographic randomness, entropy shown", fmts: [] },
      { name: "Currency Converter", desc: "Live rates, 170+ currencies", fmts: [] },
      { name: "Unit Converter", desc: "10 categories, 100+ units", fmts: [] },
      { name: "Percentage Calculator", desc: "Discounts, tips, ratios instantly", fmts: [] },
    ],
  },
];

function Mark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="11" fill={DARK}/>
      <rect x="14" y="15" width="36" height="7" rx="2" fill={BLUE}/>
      <rect x="14" y="28" width="28" height="7" rx="2" fill={TEXT}/>
      <rect x="14" y="41" width="36" height="7" rx="2" fill={TEXT}/>
    </svg>
  );
}

function Card({ name, desc, fmts }: { name: string; desc: string; fmts: string[] }) {
  return (
    <div style={{
      padding: "18px 20px 16px",
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      borderRadius: 6,
      display: "flex",
      flexDirection: "column",
      gap: 6,
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        left: 0, top: 0, bottom: 0,
        width: 3,
        background: BLUE,
        borderRadius: "3px 0 0 3px",
        opacity: 0.7,
      }}/>
      <span style={{ fontFamily: "'Geist', sans-serif", fontSize: 14, fontWeight: 500, color: TEXT, lineHeight: 1.2, marginLeft: 4 }}>
        {name}
      </span>
      <span style={{ fontFamily: "'Geist', sans-serif", fontSize: 12.5, color: MUTED, lineHeight: 1.4, marginLeft: 4 }}>
        {desc}
      </span>
      {fmts.length > 0 && (
        <div style={{ display: "flex", gap: 4, marginTop: 2, marginLeft: 4 }}>
          {fmts.map(f => (
            <span key={f} style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: BLUE, background: "rgba(26,107,255,0.12)", borderRadius: 3, padding: "2px 5px" }}>
              {f}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function Editorial() {
  return (
    <div style={{ background: DARK, minHeight: "100vh", fontFamily: "'Geist', sans-serif" }}>
      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${BORDER}`, height: 52, display: "flex", alignItems: "center", padding: "0 40px", gap: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <Mark size={28} />
          <span style={{ fontSize: 16, fontWeight: 500, color: TEXT, letterSpacing: "-0.02em" }}>EverydayTools</span>
        </div>
        <div style={{ display: "flex", gap: 24, marginLeft: 8 }}>
          {["Convert Documents", "Convert Images", "Tools"].map(l => (
            <span key={l} style={{ fontSize: 13, color: MUTED, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: MUTED, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 3, padding: "3px 8px" }}>EN</span>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 3, padding: "3px 8px" }}>FR</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 40px 96px" }}>

        {/* Hero — editorial, asymmetric */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginBottom: 100, alignItems: "end" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
              <div style={{ width: 28, height: 1, background: BLUE }}/>
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: BLUE, letterSpacing: "0.12em", textTransform: "uppercase" }}>Free — No account</span>
            </div>
            <h1 style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: 64,
              fontWeight: 300,
              color: TEXT,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "0 0 24px",
            }}>
              Every tool<br />you reach<br />for, daily.
            </h1>
            <p style={{ fontSize: 15, color: MUTED, maxWidth: 380, lineHeight: 1.7, margin: 0 }}>
              Browser-based document and image tools. Nothing leaves your device.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", paddingBottom: 4 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
              {["PDF Tools", "Image Tools", "Privacy Tools", "Calculators"].map((cat, i) => (
                <div key={cat} style={{ display: "flex", alignItems: "center", gap: 10, opacity: i === 0 ? 1 : 0.45 }}>
                  <span style={{ fontSize: 13, color: i === 0 ? TEXT : MUTED }}>{cat}</span>
                  <div style={{ width: i === 0 ? 32 : 16, height: 1, background: i === 0 ? BLUE : FAINT }}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div style={{ display: "flex", flexDirection: "column", gap: 72 }}>
          {CATEGORIES.map(cat => (
            <section key={cat.id}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 24 }}>
                <h2 style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: 36,
                  fontWeight: 300,
                  color: TEXT,
                  letterSpacing: "-0.02em",
                  margin: 0,
                  lineHeight: 1,
                }}>
                  {cat.id}
                </h2>
                <span style={{ fontSize: 13, color: MUTED, paddingBottom: 2 }}>{cat.desc}</span>
                <div style={{ flex: 1, height: 1, background: BORDER }}/>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {cat.tools.map(t => <Card key={t.name} {...t} />)}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
