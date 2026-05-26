import { tools } from "../config/tools.config";
import ToolCard from "../components/ToolCard";
import AdSlot from "../components/AdSlot";
import { useLocale } from "../contexts/locale-context";

const CATEGORY_IDS = ['pdf', 'word', 'image', 'privacy', 'calculators'] as const;

export default function Home() {
  const { t } = useLocale();

  return (
    <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '64px 20px 96px' }}>
      {/* Page header */}
      <div style={{ marginBottom: 64 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-5xl)', fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.1, margin: '0 0 16px' }}>
          {t.home.title}
        </h1>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', margin: 0, maxWidth: 480 }}>
          {t.home.subtitle}
        </p>
      </div>

      {/* Tool grid by category */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
        {CATEGORY_IDS.map(catId => {
          const items = tools.filter(tool => tool.category === catId);
          if (!items.length) return null;
          const categoryLabel = t.home.categories[catId] ?? catId;
          return (
            <section key={catId} id={catId} style={{ scrollMarginTop: 64 }}>
              <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', margin: '0 0 12px' }}>
                {categoryLabel}
              </h2>
              {/* Table-style grid: container provides top+left border, cells provide right+bottom */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                borderTop: '1px solid var(--border)',
                borderLeft: '1px solid var(--border)',
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
