
export function LogoC() {
  const dark = "#1A1916";
  const light = "#F7F6F3";
  const blue = "#1A6BFF";

  const Mark = ({ bg, fg, accent, size = 64 }: { bg: string; fg: string; accent: string; size?: number }) => {
    const s = size;
    const sw = Math.max(1.5, s * 0.055);
    const pad = s * 0.18;
    const bracketW = s * 0.22;
    const bracketH = s * 0.56;
    const midY = s / 2;
    const topY = midY - bracketH / 2;
    const botY = midY + bracketH / 2;
    const leftX = pad;
    const rightX = s - pad;
    const eX = s * 0.38;
    const eW = s * 0.28;
    const eH1 = s * 0.11;
    const eGap = s * 0.1;
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width={s} height={s} rx={s * 0.18} fill={bg} />
        <path
          d={`M ${leftX + bracketW} ${topY} L ${leftX} ${topY} L ${leftX} ${botY} L ${leftX + bracketW} ${botY}`}
          stroke={accent} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d={`M ${rightX - bracketW} ${topY} L ${rightX} ${topY} L ${rightX} ${botY} L ${rightX - bracketW} ${botY}`}
          stroke={fg} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" opacity="0.5"
        />
        <line x1={eX} y1={midY - eH1 - eGap} x2={eX + eW} y2={midY - eH1 - eGap} stroke={fg} strokeWidth={sw * 0.85} strokeLinecap="round" />
        <line x1={eX} y1={midY} x2={eX + eW * 0.72} y2={midY} stroke={fg} strokeWidth={sw * 0.85} strokeLinecap="round" />
        <line x1={eX} y1={midY + eH1 + eGap} x2={eX + eW} y2={midY + eH1 + eGap} stroke={fg} strokeWidth={sw * 0.85} strokeLinecap="round" />
        <line x1={eX} y1={midY - eH1 - eGap} x2={eX} y2={midY + eH1 + eGap} stroke={fg} strokeWidth={sw * 0.85} strokeLinecap="round" />
      </svg>
    );
  };

  const Wordmark = ({ color, size = 28 }: { color: string; size?: number }) => (
    <span style={{
      fontFamily: "'IBM Plex Mono', monospace",
      fontWeight: 400,
      fontSize: size,
      letterSpacing: "-0.03em",
      color,
      lineHeight: 1,
    }}>
      EverydayTools
    </span>
  );

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", background: "#F0EFE9", minHeight: "100vh", padding: "48px 40px", display: "flex", flexDirection: "column", gap: 56 }}>

      <div>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.12em", color: "#6B6960", textTransform: "uppercase", marginBottom: 20 }}>Logo C — Bracket Mark</p>
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#6B6960", marginBottom: 32, maxWidth: 520 }}>
          Square brackets frame the "E" letterform — a nod to developer tooling, code, and the monospace precision of the brand. Blue left bracket as the active anchor; muted right bracket recedes. IBM Plex Mono wordmark reinforces the technical voice.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

        <div style={{ background: dark, borderRadius: 16, padding: "48px 56px", display: "flex", alignItems: "center", gap: 20 }}>
          <Mark bg={dark} fg={light} accent={blue} size={64} />
          <Wordmark color={light} size={26} />
        </div>

        <div style={{ background: light, borderRadius: 16, padding: "48px 56px", border: "1px solid #E0DFD9", display: "flex", alignItems: "center", gap: 20 }}>
          <Mark bg={light} fg={dark} accent={blue} size={64} />
          <Wordmark color={dark} size={26} />
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
          <Wordmark color={light} size={22} />
        </div>

        <div style={{ background: dark, borderRadius: 12, padding: "24px 32px", display: "flex", alignItems: "center", gap: 14 }}>
          <Mark bg={dark} fg={light} accent={blue} size={36} />
          <Wordmark color={light} size={15} />
        </div>
      </div>

      <div>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#9B9A94", textTransform: "uppercase", marginBottom: 12 }}>SVG source — mark only</p>
        <pre style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#6B6960", background: "#E4E3DC", borderRadius: 8, padding: "16px 20px", overflowX: "auto", lineHeight: 1.6 }}>{`<svg width="64" height="64" viewBox="0 0 64 64"
     fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="11" fill="#1A1916"/>
  <!-- left bracket (blue) -->
  <path d="M 25.5 18 L 11.5 18 L 11.5 46 L 25.5 46"
        stroke="#1A6BFF" stroke-width="3.5"
        stroke-linecap="round" stroke-linejoin="round"/>
  <!-- right bracket (muted) -->
  <path d="M 38.5 18 L 52.5 18 L 52.5 46 L 38.5 46"
        stroke="rgba(247,246,243,0.5)" stroke-width="3.5"
        stroke-linecap="round" stroke-linejoin="round"/>
  <!-- E letterform -->
  <line x1="24.3" y1="25"   x2="42.3" y2="25"   stroke="#F7F6F3" stroke-width="3" stroke-linecap="round"/>
  <line x1="24.3" y1="32"   x2="37.3" y2="32"   stroke="#F7F6F3" stroke-width="3" stroke-linecap="round"/>
  <line x1="24.3" y1="39"   x2="42.3" y2="39"   stroke="#F7F6F3" stroke-width="3" stroke-linecap="round"/>
  <line x1="24.3" y1="25"   x2="24.3" y2="39"   stroke="#F7F6F3" stroke-width="3" stroke-linecap="round"/>
</svg>`}</pre>
      </div>

    </div>
  );
}
