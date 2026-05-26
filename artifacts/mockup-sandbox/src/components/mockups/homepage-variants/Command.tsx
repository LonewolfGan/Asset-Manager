
const BLUE = "#1A6BFF";
const DARK = "#0e0e10";
const SURFACE = "#16161a";
const BORDER = "#252530";
const BORDER2 = "#2e2e3c";
const TEXT = "#e8e8f0";
const MUTED = "#7070888";
const DIM = "#505060";

const SECTIONS = [
  {
    path: "/pdf",
    label: "PDF Tools",
    count: 14,
    tools: [
      { cmd: "pdf-to-word", desc: "Convert PDF to editable DOCX" },
      { cmd: "pdf-to-text", desc: "Extract all text from PDF" },
      { cmd: "compress-pdf", desc: "Reduce PDF file size" },
      { cmd: "merge-pdfs", desc: "Combine multiple PDFs" },
      { cmd: "split-pdf", desc: "Separate pages into files" },
      { cmd: "pdf-protect", desc: "Add password protection" },
      { cmd: "pdf-watermark", desc: "Add text watermark to pages" },
    ],
  },
  {
    path: "/image",
    label: "Image Tools",
    count: 9,
    tools: [
      { cmd: "image-converter", desc: "PNG · JPEG · WEBP · AVIF · BMP" },
      { cmd: "heic-to-jpg", desc: "Convert iPhone HEIC photos" },
      { cmd: "compress-image", desc: "Reduce image file size" },
      { cmd: "background-remover", desc: "AI removal, on-device only" },
      { cmd: "resize-image", desc: "Set exact pixel dimensions" },
      { cmd: "crop-image", desc: "Free crop with drag handles" },
    ],
  },
  {
    path: "/tools",
    label: "Utility Tools",
    count: 5,
    tools: [
      { cmd: "password-generator", desc: "Cryptographic randomness, entropy display" },
      { cmd: "currency-converter", desc: "Live rates, 170+ currencies" },
      { cmd: "unit-converter", desc: "10 categories, 100+ units" },
      { cmd: "percentage-calc", desc: "Discounts, tips, ratios" },
    ],
  },
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

export function Command() {
  return (
    <div style={{ background: DARK, minHeight: "100vh", fontFamily: "'Geist Mono', monospace", color: TEXT }}>

      {/* Nav — minimal, monospace */}
      <nav style={{ borderBottom: `1px solid ${BORDER}`, height: 44, display: "flex", alignItems: "center", padding: "0 32px", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Mark size={22} />
          <span style={{ fontFamily: "'Geist', sans-serif", fontSize: 14, fontWeight: 500, color: TEXT, letterSpacing: "-0.01em" }}>EverydayTools</span>
        </div>
        <div style={{ width: 1, height: 16, background: BORDER2 }}/>
        {["pdf", "image", "tools"].map(s => (
          <span key={s} style={{ fontSize: 12, color: DIM, cursor: "pointer" }}>/{s}</span>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 11, color: DIM }}>no account · no upload</span>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 32px 80px" }}>

        {/* Hero — prompt style */}
        <div style={{ marginBottom: 64, borderLeft: `2px solid ${BLUE}`, paddingLeft: 20 }}>
          <div style={{ fontSize: 11, color: BLUE, marginBottom: 12, letterSpacing: "0.08em" }}>
            everydaytools.app ~ tools
          </div>
          <div style={{ fontSize: 11, color: DIM, marginBottom: 8 }}>
            <span style={{ color: BLUE }}>→ </span>ls --all
          </div>
          <h1 style={{
            fontFamily: "'Geist', sans-serif",
            fontSize: 42,
            fontWeight: 600,
            color: TEXT,
            letterSpacing: "-0.035em",
            margin: "0 0 16px",
            lineHeight: 1.1,
          }}>
            28 tools.<br/>
            <span style={{ color: BLUE }}>0 uploads.</span>
          </h1>
          <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 14, color: "#606070", margin: 0, lineHeight: 1.6 }}>
            Every file stays in your browser. No accounts, no servers, no tracking.
          </p>
        </div>

        {/* Tool listing — terminal style */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {SECTIONS.map((sec, si) => (
            <div key={sec.path} style={{ marginBottom: 48 }}>

              {/* Section header — like a directory listing */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 2,
                padding: "8px 0",
              }}>
                <span style={{ color: BLUE, fontSize: 12 }}>{sec.path}</span>
                <span style={{ color: DIM, fontSize: 11 }}>{sec.count} tools</span>
                <div style={{ flex: 1, height: 1, background: BORDER }}/>
              </div>

              {/* Tool rows */}
              <div style={{ borderLeft: `1px solid ${BORDER}`, marginLeft: 0 }}>
                {sec.tools.map((tool, i) => (
                  <div
                    key={tool.cmd}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "240px 1fr",
                      alignItems: "center",
                      padding: "9px 16px",
                      borderBottom: `1px solid ${BORDER}`,
                      cursor: "pointer",
                      gap: 16,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: BLUE, opacity: 0.5, fontSize: 11, userSelect: "none" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span style={{ fontSize: 12, color: TEXT, letterSpacing: "-0.01em" }}>
                        {tool.cmd}
                      </span>
                    </div>
                    <span style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: "#505060" }}>
                      {tool.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer line */}
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 24, display: "flex", gap: 20 }}>
          {["privacy", "terms", "github"].map(l => (
            <span key={l} style={{ fontSize: 11, color: DIM }}>{l}</span>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 11, color: DIM }}>© 2025 EverydayTools</span>
        </div>
      </div>
    </div>
  );
}
