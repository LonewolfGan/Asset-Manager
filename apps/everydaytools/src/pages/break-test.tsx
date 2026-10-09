import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import ToolProcessor from "@/components/ToolProcessor";
import ResultPanel from "@/components/ResultPanel";
import { Download, Trash2, ArrowRight } from "lucide-react";

export default function BreakTestPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const variants = ["primary", "secondary", "ghost", "danger"] as const;
  const sizes = ["sm", "md", "lg"] as const;

  return (
    <div
      style={{
        padding: 40,
        background: "var(--bg-base)",
        minHeight: "100vh",
        color: "var(--text-primary)",
        fontFamily: "var(--font-ui)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 700 }}>
          /break Harness: Unified Button
        </h1>
        <Button variant="secondary" onClick={toggleTheme}>
          Mode: {theme} (Toggle)
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <section>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: 16 }}>
            1. All Variants × Default Size (md)
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
            {variants.map((v) => (
              <div key={v} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>variant="{v}"</span>
                <Button variant={v}>Click {v}</Button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: 16 }}>
            2. All Sizes (sm, md, lg) for Primary & Secondary
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {sizes.map((s) => (
              <div key={s} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <span style={{ width: 80, fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>size="{s}"</span>
                <Button variant="primary" size={s}>
                  Primary {s}
                </Button>
                <Button variant="secondary" size={s}>
                  Secondary {s}
                </Button>
                <Button variant="primary" size={s}>
                  <Download /> With Icon
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: 16 }}>
            3. States: Normal, Disabled, Loading
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>Normal</span>
              <Button variant="primary">Process File</Button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>Disabled</span>
              <Button variant="primary" disabled>Process File</Button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>Loading</span>
              <Button variant="primary" loading>Processing...</Button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>Secondary Loading</span>
              <Button variant="secondary" loading>Saving...</Button>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: 16 }}>
            4. Edge Cases (/break stress test)
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 500 }}>
            <div>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>Full Width CTA</span>
              <Button variant="primary" size="lg" fullWidth>
                <Download /> Download Processed Document (12.4 MB)
              </Button>
            </div>
            <div>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>Long Unbroken Label</span>
              <Button variant="secondary" style={{ maxWidth: 300 }}>
                SupercalifragilisticexpialidociousLongFileNameWithoutSpaces.pdf
              </Button>
            </div>
            <div>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>Danger with Icon</span>
              <Button variant="danger">
                <Trash2 /> Delete Original File
              </Button>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: 16 }}>
            5. FileUpload: Idle State
          </h2>
          <FileUpload
            accept={[".png", ".jpg", ".pdf", ".docx"]}
            maxSizeMB={20}
            onFiles={() => {}}
          />
        </section>

        <section>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: 16 }}>
            6. FileUpload: With Real Image File Preloaded
          </h2>
          <FileUpload
            accept={[".png", ".jpg", ".webp"]}
            maxSizeMB={20}
            files={[
              new File(
                [
                  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#FF6B35"/><circle cx="100" cy="100" r="50" fill="#FFFFFF"/></svg>'
                ],
                "design-asset-mockup.png",
                { type: "image/svg+xml" }
              )
            ]}
            onFiles={() => {}}
          />
        </section>

        <section>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: 16 }}>
            7. FileUpload: With DOCX File Preloaded
          </h2>
          <FileUpload
            accept={[".docx", ".pdf"]}
            maxSizeMB={25}
            files={[
              new File(
                [new Uint8Array(2048)],
                "quarterly-report-confidential.docx",
                { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
              )
            ]}
            onFiles={() => {}}
          />
        </section>

        <section>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: 16 }}>
            8. ToolProcessor: QUICK (&lt;2s)
          </h2>
          <ToolProcessor status="processing" category="quick" />
        </section>

        <section>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: 16 }}>
            9. ToolProcessor: MEDIUM (2-10s)
          </h2>
          <ToolProcessor
            status="processing"
            category="medium"
            steps={["Reading PDF document...", "Compressing visual assets...", "Saving final output..."]}
          />
        </section>

        <section>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: 16 }}>
            10. ToolProcessor: HEAVY (10s+) with Before Preview
          </h2>
          <ToolProcessor
            status="processing"
            category="heavy"
            beforePreview={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="%23334155"/><circle cx="300" cy="200" r="100" fill="%23FF6B35"/><text x="300" y="208" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="white">Original Portrait</text></svg>`}
            steps={["Analyzing your image...", "Detecting subjects & edges...", "Removing background...", "Polishing output..."]}
          />
        </section>

        <section>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: 16 }}>
            11. ToolProcessor: SUCCESS with Comparison Slider (comparisonMode=true)
          </h2>
          <ToolProcessor
            status="success"
            comparisonMode={true}
            beforePreview={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="%23475569"/><circle cx="300" cy="200" r="100" fill="%23FF6B35"/><text x="300" y="208" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="white">Original Portrait</text></svg>`}
            afterPreview={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="%230f172a"/><circle cx="300" cy="200" r="100" fill="%23FF6B35"/><text x="300" y="208" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="white">Clean Cutout</text></svg>`}
            onReset={() => {}}
          />
        </section>

        <section>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: 16 }}>
            12. ToolProcessor: ERROR State
          </h2>
          <ToolProcessor
            status="error"
            errorMessage="The PDF file is password protected. Please unlock it before compressing."
            onRetry={() => {}}
            onReset={() => {}}
          />
        </section>

        <section>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: 16 }}>
            13. ResultPanel: Compression Result
          </h2>
          <ResultPanel
            filename="financial-annual-report.pdf"
            sizeBefore={4500000}
            sizeAfter={1125000}
            downloadUrl="#"
            onReset={() => {}}
          />
        </section>
      </div>
    </div>
  );
}
