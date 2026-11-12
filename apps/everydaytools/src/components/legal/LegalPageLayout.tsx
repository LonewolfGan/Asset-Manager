import React from "react";
import { Check, FileText, Mail, ArrowUpRight } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface LegalPageLayoutProps {
  title: string;
  /** @deprecated AI pill badges have been eliminated per design system contract */
  badge?: string;
  effectiveDate: string;
  summaryTitle: string;
  summaryPoints: string[];
  /** @deprecated TOC sidebar eliminated in favor of clean single-column editorial layout */
  tocTitle?: string;
  sections: LegalSection[];
  contactTitle: string;
  contactText: string;
  contactEmail: string;
  lang: "fr" | "en";
}

export function LegalPageLayout({
  title,
  effectiveDate,
  summaryTitle,
  summaryPoints,
  sections,
  contactTitle,
  contactText,
  contactEmail,
  lang,
}: LegalPageLayoutProps) {
  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-transparent text-foreground py-12 sm:py-20">
      {/* Resend-inspired reading container: max-w-4xl centered without any breadcrumbs */}
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Resend-style Monumental Header */}
        <header className="text-center pt-2 pb-2 space-y-3">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-[-0.04em] text-foreground text-balance">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground font-normal">
            {lang === "fr" ? "Dernière mise à jour :" : "Last update:"} {effectiveDate}
          </p>
        </header>

        {/* 1. Official Registry Component: MagicCard (Magic UI) + Card (shadcn) for Executive Summary */}
        {summaryPoints && summaryPoints.length > 0 && (
          <MagicCard
            data-testid="legal-summary-card"
            className="rounded-2xl sm:rounded-3xl border border-border/70 bg-surface/50 shadow-sm"
            gradientColor="#262626"
          >
            <CardHeader className="p-6 sm:p-8 pb-3 sm:pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-surface-raised border border-border/60 flex items-center justify-center text-foreground/80 shrink-0">
                  <FileText className="w-3.5 h-3.5" strokeWidth={1.75} />
                </span>
                <CardTitle className="text-base sm:text-lg font-medium text-foreground tracking-tight font-display">
                  {summaryTitle}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 pt-0">
              <ul className="space-y-3.5">
                {summaryPoints.map((pt, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3.5 text-sm sm:text-base leading-relaxed text-muted-foreground"
                  >
                    <span
                      className="w-5 h-5 rounded-full bg-surface-raised border border-border/60 flex items-center justify-center shrink-0 mt-0.5 text-foreground/90"
                      aria-hidden="true"
                    >
                      <Check className="w-3 h-3" strokeWidth={2.5} />
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </MagicCard>
        )}

        {/* Resend-style Linear Legal Clauses (H2 stacked directly above text) */}
        <div className="space-y-12 sm:space-y-16">
          {sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground font-display mb-4">
                {sec.title}
              </h2>
              <div className="text-base leading-7 text-muted-foreground space-y-4 text-pretty [&_p]:leading-7 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:leading-7">
                {sec.content}
              </div>
            </section>
          ))}
        </div>

        {/* 2. Official Registry Component: MagicCard (Magic UI) + InteractiveHoverButton for Legal Inquiries */}
        <MagicCard
          data-testid="legal-inquiry-card"
          className="rounded-2xl sm:rounded-3xl border border-border/70 bg-surface/40 p-6 sm:p-8 shadow-sm"
          gradientColor="#262626"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 w-full">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-surface-raised border border-border/60 flex items-center justify-center text-foreground shrink-0 shadow-sm mt-0.5">
                <Mail className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg sm:text-xl font-semibold tracking-tight text-foreground font-display">
                  {contactTitle}
                </CardTitle>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {contactText}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <a href={`mailto:${contactEmail}`} className="inline-flex">
                <InteractiveHoverButton
                  className="h-11 px-5 text-xs sm:text-sm font-mono"
                  icon={<ArrowUpRight className="size-4 shrink-0" />}
                >
                  {contactEmail}
                </InteractiveHoverButton>
              </a>
            </div>
          </div>
        </MagicCard>
      </div>
    </div>
  );
}
