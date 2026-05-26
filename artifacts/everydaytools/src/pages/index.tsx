import { tools } from "../config/tools.config";
import ToolCard from "../components/ToolCard";
import AdSlot from "../components/AdSlot";
import { useLocale } from "../hooks/use-locale";

const CATEGORY_IDS = ['pdf', 'word', 'image', 'privacy', 'calculators'] as const;

export default function Home() {
  const { t } = useLocale();

  return (
    <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '64px 20px 96px' }}>
      {/* Page header */}
      <div style={{ marginBottom: 80 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-5xl)', fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.1, margin: '0 0 16px' }}>
          {t.home.title}
        </h1>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', margin: 0, maxWidth: 480, lineHeight: 1.625 }}>
          {t.home.subtitle}
        </p>
      </div>

      {/* Tool grid by category */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
        {CATEGORY_IDS.map(catId => {
          const items = tools.filter(tool => tool.category === catId);
          if (!items.length) return null;
          const categoryLabel = t.home.categories[catId] ?? catId;
          return (
            <section key={catId} id={catId} style={{ scrollMarginTop: 64 }}>
              <h2 style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                margin: '0 0 8px',
                paddingBottom: 8,
                borderBottom: '1px solid var(--border)',
              }}>
                {categoryLabel}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 12,
              }}>
                {items.map(tool => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div style={{ marginTop: 80, display: 'flex', justifyContent: 'center' }}>
        <AdSlot type="horizontal" />
      </div>
    </div>
  );
}
