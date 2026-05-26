
export function LogoB() {
  const dark = "#1A1916";
  const light = "#F7F6F3";
  const blue = "#1A6BFF";

  const Mark = ({ bg, dotColor, accentColor, size = 64 }: { bg: string; dotColor: string; accentColor: string; size?: number }) => {
    const pad = size * 0.2;
    const inner = size - pad * 2;
    const dot = inner / 4;
    const gap = inner / 4;
    const r = dot * 0.35;
    const dots = [
      { col: 0, row: 0, accent: true },
      { col: 1, row: 0, accent: false },
      { col: 2, row: 0, accent: false },
      { col: 0, row: 1, accent: false },
      { col: 1, row: 1, accent: false },
      { col: 2, row: 1, accent: false },
      { col: 0, row: 2, accent: false },
      { col: 1, row: 2, accent: false },
      { col: 2, row: 2, accent: false },
    ];
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width={size} height={size} rx={size * 0.18} fill={bg} />
        {dots.map(({ col, row, accent }, i) => {
          const cx = pad + col * gap + dot / 2;
          const cy = pad + row * gap + dot / 2;
          return <circle key={i} cx={cx} cy={cy} r={r} fill={accent ? accentColor : dotColor} />;
        })}
      </svg>
    );
  };

  const Wordmark = ({ color, size = 28, serif = true }: { color: string; size?: number; serif?: boolean }) => (
    <span style={{
      fontFamily: serif ? "'DM Serif Display', serif" : "'IBM Plex Sans', sans-serif",
      fontWeight: 400,
      fontSize: size,
      letterSpacing: serif ? "-0.01em" : "-0.02em",
      color,
      lineHeight: 1,
    }}>
      EverydayTools
    </span>
  );

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", background: "#F0EFE9", minHeight: "100vh", padding: "48px 40px", display: "flex", flexDirection: "column", gap: 56 }}>

      <div>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.12em", color: "#6B6960", textTransform: "uppercase", marginBottom: 20 }}>Logo B — Grid Mark</p>
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#6B6960", marginBottom: 32, maxWidth: 520 }}>
          Nine dots in a 3×3 grid — the top-left node in blue anchors the eye and signals the starting point of every task. Paired with DM Serif Display for an editorial, premium register.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

        <div style={{ background: dark, borderRadius: 16, padding: "48px 56px", display: "flex", alignItems: "center", gap: 20 }}>
          <Mark bg={dark} dotColor="rgba(247,246,243,0.35)" accentColor={blue} size={64} />
          <Wordmark color={light} size={32} />
        </div>

        <div style={{ background: light, borderRadius: 16, padding: "48px 56px", border: "1px solid #E0DFD9", display: "flex", alignItems: "center", gap: 20 }}>
          <Mark bg={light} dotColor="rgba(26,25,22,0.2)" accentColor={blue} size={64} />
          <Wordmark color={dark} size={32} />
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>

          <div style={{ background: dark, borderRadius: 12, padding: "32px 40px", flex: 1, minWidth: 200 }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#6B6960", textTransform: "uppercase", marginBottom: 20 }}>Icon sizes</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
              <Mark bg={dark} dotColor="rgba(247,246,243,0.35)" accentColor={blue} size={96} />
              <Mark bg={dark} dotColor="rgba(247,246,243,0.35)" accentColor={blue} size={48} />
              <Mark bg={dark} dotColor="rgba(247,246,243,0.35)" accentColor={blue} size={32} />
              <Mark bg={dark} dotColor="rgba(247,246,243,0.35)" accentColor={blue} size={20} />
            </div>
          </div>

          <div style={{ background: "#E8E7E1", borderRadius: 12, padding: "32px 40px", flex: 1, minWidth: 200 }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#6B6960", textTransform: "uppercase", marginBottom: 20 }}>Monochrome</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
              <Mark bg={dark} dotColor="rgba(247,246,243,0.5)" accentColor={light} size={64} />
              <Mark bg={light} dotColor="rgba(26,25,22,0.3)" accentColor={dark} size={64} />
            </div>
          </div>
        </div>

        <div style={{ background: blue, borderRadius: 12, padding: "32px 40px", display: "flex", alignItems: "center", gap: 20 }}>
          <Mark bg={blue} dotColor="rgba(255,255,255,0.4)" accentColor={light} size={52} />
          <Wordmark color={light} size={26} />
        </div>

        <div style={{ background: dark, borderRadius: 12, padding: "24px 32px", display: "flex", alignItems: "center", gap: 14 }}>
          <Mark bg={dark} dotColor="rgba(247,246,243,0.35)" accentColor={blue} size={36} />
          <Wordmark color={light} size={18} />
        </div>
      </div>

      <div>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#9B9A94", textTransform: "uppercase", marginBottom: 12 }}>SVG source — mark only</p>
        <pre style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#6B6960", background: "#E4E3DC", borderRadius: 8, padding: "16px 20px", overflowX: "auto", lineHeight: 1.6 }}>{`<svg width="64" height="64" viewBox="0 0 64 64"
     fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="11" fill="#1A1916"/>
  <!-- accent dot (top-left) -->
  <circle cx="18.7" cy="18.7" r="4.5" fill="#1A6BFF"/>
  <!-- row 1 -->
  <circle cx="32"   cy="18.7" r="4.5" fill="rgba(247,246,243,0.35)"/>
  <circle cx="45.3" cy="18.7" r="4.5" fill="rgba(247,246,243,0.35)"/>
  <!-- row 2 -->
  <circle cx="18.7" cy="32"   r="4.5" fill="rgba(247,246,243,0.35)"/>
  <circle cx="32"   cy="32"   r="4.5" fill="rgba(247,246,243,0.35)"/>
  <circle cx="45.3" cy="32"   r="4.5" fill="rgba(247,246,243,0.35)"/>
  <!-- row 3 -->
  <circle cx="18.7" cy="45.3" r="4.5" fill="rgba(247,246,243,0.35)"/>
  <circle cx="32"   cy="45.3" r="4.5" fill="rgba(247,246,243,0.35)"/>
  <circle cx="45.3" cy="45.3" r="4.5" fill="rgba(247,246,243,0.35)"/>
</svg>`}</pre>
      </div>

    </div>
  );
}
