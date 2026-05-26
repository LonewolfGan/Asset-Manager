import { useState } from 'react';

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQSection({ faqs }: { faqs: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <section style={{ marginTop: 64 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 400, letterSpacing: '-0.03em', marginBottom: 24, color: 'var(--text-primary)' }}>
        Frequently Asked Questions
      </h2>
      <div style={{ borderTop: '1px solid var(--border)' }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid var(--border)' }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}
              aria-expanded={open === i}
            >
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 500, color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>{faq.q}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: 'var(--text-tertiary)', transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 120ms ease' }}>
                <path d="M2 4.5l5 5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {open === i && (
              <div style={{ paddingBottom: 14, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7, fontFamily: 'var(--font-ui)' }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
