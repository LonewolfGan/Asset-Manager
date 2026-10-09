import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useLocale } from "@/hooks/use-locale";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  WEBSITE_SCHEMA,
  ORGANIZATION_SCHEMA,
  ITEM_LIST_SCHEMA,
  CATEGORIES,
  CATEGORY_MAP,
  DASH_TOOLS,
  filterDashTools,
  groupToolsByCategory,
} from "@/lib/home-tools-data";
import {
  ToolCard,
  HomeHero,
  CategoryFilterBar,
  CategorySection,
} from "@/components/home";

export default function DashboardHome() {
  const { t, locale } = useLocale();
  const isMobile = useIsMobile();
  const [query, setQuery] = useState("");
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      setQuery((e as CustomEvent<string>).detail ?? "");
    };
    window.addEventListener("et:search", handler);
    return () => window.removeEventListener("et:search", handler);
  }, []);

  const filteredTools = useMemo(() => {
    return filterDashTools(query, DASH_TOOLS, t);
  }, [query, t]);

  const isSearching = query.trim().length > 0;

  const groupedTools = useMemo(() => {
    return groupToolsByCategory(filteredTools);
  }, [filteredTools]);

  return (
    <>
      <Helmet>
        <link rel="canonical" href={`https://everydaytools.qzz.io/${locale.toLowerCase()}`} />
        <link rel="alternate" hrefLang="en" href="https://everydaytools.qzz.io/en" />
        <link rel="alternate" hrefLang="fr" href="https://everydaytools.qzz.io/fr" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/en" />
        <script type="application/ld+json">{JSON.stringify(WEBSITE_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(ORGANIZATION_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(ITEM_LIST_SCHEMA)}</script>
      </Helmet>

      <div style={{ flex: 1, background: "var(--bg-base)" }}>
        {/* Hero section — full width */}
        {!isSearching && <HomeHero />}

        {/* Tools area */}
        <div style={{ paddingTop: 40, paddingBottom: 80 }}>
          <div className="container-wide">
            {/* Category filter bar */}
            {!isSearching && (
              <CategoryFilterBar
                categories={CATEGORIES}
                activeKey={activeKey}
                isMobile={isMobile}
                onSelect={(key) => {
                  setActiveKey(key);
                  if (key !== null) {
                    const el = document.getElementById(`cat-${key}`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              />
            )}

            {/* Search results */}
            {isSearching && (
              <div style={{ marginBottom: 24 }}>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--text-secondary)",
                    margin: 0,
                    fontFamily: "var(--font-ui)",
                  }}
                >
                  {t.home.resultCount(filteredTools.length)} {t.home.resultsFor} &ldquo;
                  <strong style={{ color: "var(--text-primary)" }}>{query}</strong>&rdquo;
                </p>
              </div>
            )}

            {/* No results */}
            {filteredTools.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    margin: "0 0 12px",
                    fontFamily: "var(--font-ui)",
                  }}
                >
                  {t.home.noResults(query)}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    window.dispatchEvent(new CustomEvent("et:search", { detail: "" }));
                  }}
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--accent)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-ui)",
                    padding: 0,
                  }}
                >
                  {t.home.clearSearch}
                </button>
              </div>
            )}

            {/* Flat search grid */}
            {isSearching && filteredTools.length > 0 && (
              <div className="tool-grid">
                {filteredTools.map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    cat={CATEGORY_MAP[tool.categoryKey] ?? CATEGORIES[0]}
                  />
                ))}
              </div>
            )}

            {/* All tools flat grid */}
            {!isSearching && activeKey === null && (
              <div className="tool-grid">
                {DASH_TOOLS.map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    cat={CATEGORY_MAP[tool.categoryKey] ?? CATEGORIES[0]}
                  />
                ))}
              </div>
            )}

            {/* Single category section */}
            {!isSearching &&
              activeKey !== null &&
              groupedTools
                .filter((g) => g.cat.key === activeKey)
                .map(({ cat, tools: catTools }) => (
                  <CategorySection
                    key={cat.key}
                    cat={cat}
                    tools={catTools}
                    isMobile={isMobile}
                  />
                ))}
          </div>
        </div>
      </div>
    </>
  );
}
