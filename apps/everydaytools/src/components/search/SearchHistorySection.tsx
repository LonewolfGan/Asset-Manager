import React from 'react';

export interface SearchHistorySectionProps {
  history: string[];
  locale: string;
  onSelectQuery: (q: string) => void;
  onRemoveQuery: (q: string) => void;
  onClearHistory: () => void;
}

export const SearchHistorySection: React.FC<SearchHistorySectionProps> = ({
  history,
  locale,
  onSelectQuery,
  onRemoveQuery,
  onClearHistory,
}) => {
  if (history.length === 0) return null;

  return (
    <div
      style={{
        padding: '12px 16px 8px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-tertiary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {locale === 'FR' ? 'Recherches récentes' : 'Recent searches'}
        </span>
        <button
          type="button"
          onClick={onClearHistory}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 10,
            fontFamily: 'var(--font-ui)',
            color: 'var(--text-tertiary)',
            padding: '1px 0',
            transition: 'color 120ms',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)';
          }}
        >
          {locale === 'FR' ? 'Tout effacer' : 'Clear all'}
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {history.map((q) => (
          <div
            key={q}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 6px 4px 11px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-card)',
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-ui)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'border-color 120ms, background 120ms',
              userSelect: 'none',
            }}
            onClick={() => onSelectQuery(q)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
            }}
          >
            {q}
            <button
              type="button"
              aria-label={
                locale === 'FR'
                  ? `Supprimer "${q}" de l'historique`
                  : `Remove "${q}" from history`
              }
              onClick={(e) => {
                e.stopPropagation();
                onRemoveQuery(q);
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: '0 2px',
                cursor: 'pointer',
                color: 'var(--text-tertiary)',
                fontSize: 13,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 'var(--radius-sm)',
                transition: 'color 100ms',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)';
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
