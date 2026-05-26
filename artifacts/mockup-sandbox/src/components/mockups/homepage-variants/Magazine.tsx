
const BLUE = "#1A6BFF";
const DARK = "#111113";
const SURFACE = "#18181b";
const CARD2 = "#1e1e22";
const BORDER = "#2e2e36";
const TEXT = "#f0f0f0";
const MUTED = "#8c8c9a";

const FEATURED = [
  {
    slug: "background-remover",
    label: "AI · Image",
    title: "Background Remover",
    desc: "On-device AI strips backgrounds from any photo. Nothing leaves your browser. Works on portraits, products, and complex scenes.",
    badge: "AI-powered",
    fmts: ["PNG"],
    big: true,
  },
  {
    slug: "pdf-to-word",
    label: "PDF · Document",
    title: "PDF to Word",
    desc: "Convert PDF files to editable DOCX format. Tables, columns, and formatting preserved.",
    badge: "",
    fmts: ["PDF", "DOCX"],
    big: false,
  },
  {
    slug: "image-converter",
    label: "Image",
    title: "Image Converter",
    desc: "Batch convert between PNG, JPEG, WEBP, AVIF, BMP, GIF, TIFF, ICO and SVG.",
    badge: "Batch 20 files",
    fmts: ["PNG","JPEG","WEBP"],
    big: false,
  },
];

const QUICK = [
  { cat: "PDF", tools: ["Compress PDF", "Merge PDFs", "Split PDF", "PDF to Text", "PDF to HTML", "PDF Protect"] },
  { cat: "Image", tools: ["Compress Image", "Resize Image", "Crop Image", "HEIC to JPG", "Image to PDF"] },
  { cat: "Privacy", tools: ["Metadata Cleaner", "AI Text Scrubber"] },
  { cat: "Calculators", tools: ["Password Generator", "Currency Converter", "Unit Converter", "Percentage Calc"] },
];

function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="11" fill="#1A1916"/>
      <rect x="14" y="15" width="36" height="7" rx="2" fill={BLUE}/>
      <rect x="14" y="28" width="28" height="7" rx="2" fill="#F7F6F3"/>
      <rect x="14" y="41" width="36" height="7" rx="2" fill="#F7F6F3"/>
    </svg>
  );
}

export function Magazine() {
  return (
    <div style={{ background: DARK, minHeight: "100vh", fontFamily: "'Geist', sans-serif", color: TEXT }}>

      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${BORDER}`, height: 52, display: "flex", alignItems: "center", padding: "0 40px", gap: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <Mark size={28} />
          <span style={{ fontSize: 16, fontWeight: 500, color: TEXT, letterSpacing: "-0.02em" }}>EverydayTools</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Convert Documents", "Convert Images", "Tools"].map(l => (
            <span key={l} style={{ fontSize: 13, color: MUTED, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12, color: MUTED }}>No account needed</div>
      </nav>

      {/* Hero band */}
      <div style={{
        borderBottom: `1px solid ${BORDER}`,
        padding: "40px 40px 36px",
        maxWidth: 1100,
        margin: "0 auto",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 40,
      }}>
        <div>
          <h1 style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: 52,
            fontWeight: 300,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            margin: "0 0 12px",
            color: TEXT,
          }}>
            Browser tools<br/>for everyday work.
          </h1>
          <p style={{ fontSize: 14, color: MUTED, margin: 0, lineHeight: 1.6 }}>
            28 free tools — PDF, images, privacy, calculators. Nothing uploaded.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {["PDF", "Image", "Privacy", "Calc"].map((cat) => (
            <div key={cat} style={{
              padding: "6px 14px",
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              fontSize: 12,
              color: MUTED,
              cursor: "pointer",
            }}>
              {cat}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 40px 80px" }}>

        {/* Featured grid — magazine layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto auto", gap: 12, marginBottom: 64 }}>

          {/* Big feature card */}
          <div style={{
            gridRow: "1 / 3",
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            padding: "36px 32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 320,
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: BLUE, borderRadius: "10px 10px 0 0" }}/>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: BLUE, background: "rgba(26,107,255,0.12)", padding: "3px 7px", borderRadius: 3 }}>
                  {FEATURED[0].badge}
                </span>
                <span style={{ fontSize: 11, color: MUTED, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {FEATURED[0].label}
                </span>
              </div>
              <h3 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 34, fontWeight: 300, letterSpacing: "-0.02em", color: TEXT, margin: "0 0 14px", lineHeight: 1.1 }}>
                {FEATURED[0].title}
              </h3>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, margin: 0, maxWidth: 360 }}>
                {FEATURED[0].desc}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: BLUE, color: "#fff", borderRadius: 4, padding: "8px 18px",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
              }}>
                Try it free
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              {FEATURED[0].fmts.map(f => (
                <span key={f} style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: BLUE, background: "rgba(26,107,255,0.1)", borderRadius: 3, padding: "2px 6px" }}>
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Two smaller feature cards */}
          {FEATURED.slice(1).map(item => (
            <div key={item.slug} style={{
              background: CARD2,
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
              padding: "24px 24px 20px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: MUTED, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {item.label}
                </span>
              </div>
              <h3 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 22, fontWeight: 300, letterSpacing: "-0.02em", color: TEXT, margin: 0, lineHeight: 1.2 }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.55, margin: 0 }}>
                {item.desc}
              </p>
              <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                {item.fmts.map(f => (
                  <span key={f} style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: BLUE, background: "rgba(26,107,255,0.1)", borderRadius: 3, padding: "2px 6px" }}>
                    {f}
                  </span>
                ))}
                {item.badge && (
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: MUTED, background: "rgba(255,255,255,0.04)", borderRadius: 3, padding: "2px 6px" }}>
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick-access index — compact 4-column */}
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <span style={{ fontSize: 11, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>All tools</span>
            <div style={{ flex: 1, height: 1, background: BORDER }}/>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
            {QUICK.map(q => (
              <div key={q.cat}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 3, height: 14, background: BLUE, borderRadius: 2 }}/>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: BLUE, letterSpacing: "0.06em", textTransform: "uppercase" }}>{q.cat}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {q.tools.map(t => (
                    <span key={t} style={{ fontSize: 13, color: MUTED, padding: "4px 0", cursor: "pointer", lineHeight: 1.3 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
