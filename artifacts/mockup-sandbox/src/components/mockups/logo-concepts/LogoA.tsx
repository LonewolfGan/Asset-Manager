
export function LogoA() {
  const dark = "#1A1916";
  const light = "#F7F6F3";
  const blue = "#1A6BFF";

  const Mark = ({ bg, fg, accent, size = 64 }: { bg: string; fg: string; accent: string; size?: number }) => {
    const u = size / 8;
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx={size * 0.18} fill={bg} />
        <rect x="14" y="15" width="36" height="7" rx="2" fill={accent} />
        <rect x="14" y="28" width="28" height="7" rx="2" fill={fg} />
        <rect x="14" y="41" width="36" height="7" rx="2" fill={fg} />
      </svg>
    );
  };

  const Wordmark = ({ color, size = 28 }: { color: string; size?: number }) => (
    <span style={{
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 500,
      fontSize: size,
      letterSpacing: "-0.02em",
      color,
      lineHeight: 1,
    }}>
      EverydayTools
    </span>
  );

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", background: "#F0EFE9", minHeight: "100vh", padding: "48px 40px", display: "flex", flexDirection: "column", gap: 56 }}>

      <div>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.12em", color: "#6B6960", textTransform: "uppercase", marginBottom: 20 }}>Logo A — Stacked Bars</p>
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#6B6960", marginBottom: 32, maxWidth: 520 }}>
          Three horizontal bars forming an "E" — top bar accented in blue to signal precision and a focal point. Clean, geometric, instantly legible at any size.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

        <div style={{ background: dark, borderRadius: 16, padding: "48px 56px", display: "flex", alignItems: "center", gap: 20 }}>
          <Mark bg={dark} fg={light} accent={blue} size={64} />
          <Wordmark color={light} size={30} />
        </div>

        <div style={{ background: light, borderRadius: 16, padding: "48px 56px", border: "1px solid #E0DFD9", display: "flex", alignItems: "center", gap: 20 }}>
          <Mark bg={light} fg={dark} accent={blue} size={64} />
          <Wordmark color={dark} size={30} />
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>

          <div style={{ background: dark, borderRadius: 12, padding: "32px 40px", flex: 1, minWidth: 200 }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#6B6960", textTransform: "uppercase", marginBottom: 20 }}>Icon sizes</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
              <Mark bg={dark} fg={light} accent={blue} size={96} />
              <Mark bg={dark} fg={light} accent={blue} size={48} />
              <Mark bg={dark} fg={light} accent={blue} size={32} />
              <Mark bg={dark} fg={light} accent={blue} size={20} />
            </div>
          </div>

          <div style={{ background: "#E8E7E1", borderRadius: 12, padding: "32px 40px", flex: 1, minWidth: 200 }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#6B6960", textTransform: "uppercase", marginBottom: 20 }}>Monochrome</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
              <Mark bg={dark} fg={light} accent={light} size={64} />
              <Mark bg={light} fg={dark} accent={dark} size={64} />
            </div>
          </div>
        </div>

        <div style={{ background: blue, borderRadius: 12, padding: "32px 40px", display: "flex", alignItems: "center", gap: 20 }}>
          <Mark bg={blue} fg={light} accent={light} size={52} />
          <Wordmark color={light} size={24} />
        </div>

        <div style={{ background: dark, borderRadius: 12, padding: "24px 32px", display: "flex", alignItems: "center", gap: 14 }}>
          <Mark bg={dark} fg={light} accent={blue} size={36} />
          <Wordmark color={light} size={18} />
        </div>
      </div>

      <div>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#9B9A94", textTransform: "uppercase", marginBottom: 12 }}>SVG source — mark only</p>
        <pre style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#6B6960", background: "#E4E3DC", borderRadius: 8, padding: "16px 20px", overflowX: "auto", lineHeight: 1.6 }}>{`<svg width="64" height="64" viewBox="0 0 64 64"
     fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="11" fill="#1A1916"/>
  <rect x="14" y="15" width="36" height="7" rx="2" fill="#1A6BFF"/>
  <rect x="14" y="28" width="28" height="7" rx="2" fill="#F7F6F3"/>
  <rect x="14" y="41" width="36" height="7" rx="2" fill="#F7F6F3"/>
</svg>`}</pre>
      </div>

    </div>
  );
}
