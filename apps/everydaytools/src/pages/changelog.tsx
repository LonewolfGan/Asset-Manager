import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { useLocale } from "@/hooks/use-locale";
import { CHANGELOG_RELEASES } from "@/config/changelog-data";
import { Timeline, TimelineEntry } from "@/components/ui/timeline";
import Breadcrumb from "@/components/Breadcrumb";

export function Changelog() {
  const { isFr } = useLocale();

  const timelineData: TimelineEntry[] = CHANGELOG_RELEASES.map((release) => {
    const title = isFr ? release.titleFr : release.titleEn;
    const summary = isFr ? release.summaryFr : release.summaryEn;
    const changes = isFr ? release.changesFr : release.changesEn;
    const date = isFr ? release.dateFr : release.dateEn;

    return {
      title,
      version: release.version,
      date,
      isoDate: release.isoDate,
      content: (
        <div className="space-y-4 max-w-3xl">
          <h2 className="font-display text-2xl sm:text-3xl font-normal tracking-[-0.03em] text-foreground text-balance">
            {title}
          </h2>

          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground text-pretty">
            {summary}
          </p>

          <ul className="space-y-2.5 pt-1 text-sm sm:text-base text-muted-foreground list-disc pl-5 leading-relaxed">
            {changes.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>

          {release.tools && release.tools.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-muted-foreground">
              <span className="text-foreground/70 font-semibold">{isFr ? "Outils associés :" : "Related tools:"}</span>
              {release.tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={isFr ? `/fr/${tool.slug}` : `/${tool.slug}`}
                  className="underline underline-offset-4 decoration-border hover:decoration-foreground text-foreground transition-colors"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          )}

          {release.metrics && release.metrics.length > 0 && (
            <div className="pt-1 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-muted-foreground">
              {release.metrics.map((m, idx) => (
                <span key={idx}>
                  <span className="text-foreground/70">{isFr ? m.labelFr : m.labelEn} :</span>{" "}
                  <span className="text-foreground font-semibold">{m.value}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      ),
    };
  });

  return (
    <>
      <Helmet>
        <title>{isFr ? "Mises à jour — EverydayTools Hub" : "Changelog — EverydayTools Hub"}</title>
        <meta
          name="description"
          content={
            isFr
              ? "Journal des évolutions d'EverydayTools Hub : nouveaux moteurs natifs, optimisation des performances et respect de votre vie privée."
              : "Product changelog for EverydayTools Hub: native conversion engines, speed optimizations, and privacy hardening."
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://everydaytools.qzz.io${isFr ? "/fr/changelog" : "/changelog"}`} />
        <link rel="alternate" hrefLang="en" href="https://everydaytools.qzz.io/changelog" />
        <link rel="alternate" hrefLang="fr" href="https://everydaytools.qzz.io/fr/changelog" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/changelog" />
      </Helmet>

      <main className="w-full min-h-[calc(100vh-140px)] bg-transparent text-foreground">
        <div className="container-wide" style={{ paddingTop: "28px", paddingBottom: "96px" }}>
          
          {/* Site-wide Breadcrumb navigation */}
          <Breadcrumb items={[isFr ? "Accueil" : "Home", isFr ? "Mises à jour" : "Changelog"]} />

          {/* Left-Aligned Monumental Header (matching ToolPageLayout) */}
          <header className="mt-4 mb-12 sm:mb-16">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-[-0.04em] text-foreground text-balance">
              {isFr ? "Mises à jour" : "Changelog"}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-normal max-w-2xl mt-3 text-pretty leading-relaxed">
              {isFr
                ? "L'évolution continue d'EverydayTools Hub : nouveaux moteurs natifs, gains de rapidité et renforcement de la confidentialité."
                : "Continuous evolution of EverydayTools Hub: native engines, performance speedups, and privacy hardening."}
            </p>
          </header>

          {/* Full-width 21st.dev Continuous Animated Timeline Rail */}
          <div className="relative pl-4 sm:pl-6">
            <Timeline data={timelineData} />
          </div>

        </div>
      </main>
    </>
  );
}

export default Changelog;
