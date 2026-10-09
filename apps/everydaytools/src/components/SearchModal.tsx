import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';
import { useSearchHistory } from '@/hooks/use-search-history';
import { useSearchFilter } from '@/hooks/use-search-filter';
import { SearchHistorySection } from '@/components/search/SearchHistorySection';
import { SearchResultRow } from '@/components/search/SearchResultRow';
import { SearchModalFooter } from '@/components/search/SearchModalFooter';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const kbdStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 18,
  height: 18,
  padding: '0 4px',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-strong)',
  borderRadius: 'var(--radius-sm)',
  fontSize: 10,
  fontFamily: 'var(--font-mono)',
  color: 'var(--text-secondary)',
  lineHeight: 1,
};

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const { t, locale } = useLocale();
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);

  const { history, saveQuery, removeQuery, clearAll } = useSearchHistory(open);
  const { results, trimmed } = useSearchFilter(query, t.tools);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIdx(0);
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 30);
    return () => clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.children[activeIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const handleNavigate = useCallback(() => {
    if (query.trim()) {
      saveQuery(query);
    }
    onClose();
  }, [query, saveQuery, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIdx]) {
      (listRef.current?.children[activeIdx] as HTMLAnchorElement)?.click();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!open) return null;

  const showHistory = !trimmed && history.length > 0;
  const sectionLabel = trimmed
    ? locale === 'FR'
      ? `${results.length} résultat${results.length > 1 ? 's' : ''}`
      : `${results.length} result${results.length !== 1 ? 's' : ''}`
    : locale === 'FR'
    ? 'Suggestions'
    : 'Suggestions';

  const searchPlaceholder =
    t.nav.searchPlaceholder || (locale === 'FR' ? 'Rechercher un outil…' : 'Search tools…');

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 500,
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
        }}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-label={searchPlaceholder}
        onKeyDown={handleKeyDown}
        style={{
          position: 'fixed',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(580px, calc(100vw - 32px))',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-xl)',
          zIndex: 501,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-hover)',
          outline: 'none',
        }}
      >
        {/* Search input with unified Lucide Search icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 16px',
            height: 52,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <Search
            size={16}
            strokeWidth={2}
            style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}
          />

          <input
            ref={inputRef}
            type="text"
            role="searchbox"
            aria-autocomplete="list"
            aria-controls="search-results-list"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-ui)',
              color: 'var(--text-primary)',
              height: '100%',
            }}
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={locale === 'FR' ? 'Effacer la recherche' : 'Clear search'}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-tertiary)',
                fontSize: 16,
                padding: '0 4px',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              ×
            </button>
          )}

          <kbd style={kbdStyle}>ESC</kbd>
        </div>

        {/* Recent searches */}
        {showHistory && (
          <SearchHistorySection
            history={history}
            locale={locale}
            onSelectQuery={(q) => setQuery(q)}
            onRemoveQuery={removeQuery}
            onClearHistory={clearAll}
          />
        )}

        {/* Section label */}
        <div
          style={{
            padding: '8px 16px 4px',
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-tertiary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {sectionLabel}
        </div>

        {/* Results */}
        <div
          ref={listRef}
          id="search-results-list"
          style={{ maxHeight: 340, overflowY: 'auto' }}
          role="listbox"
        >
          {results.length > 0 ? (
            results.map((tool, i) => {
              const isActive = i === activeIdx;
              const toolTitle = t.tools[tool.slug]?.title ?? tool.title;
              const toolDescription = t.tools[tool.slug]?.description ?? tool.description;

              return (
                <SearchResultRow
                  key={tool.slug}
                  slug={tool.slug}
                  title={toolTitle}
                  description={toolDescription}
                  formats={tool.formats}
                  icon={tool.icon}
                  isActive={isActive}
                  onNavigate={handleNavigate}
                  onMouseEnter={() => setActiveIdx(i)}
                />
              );
            })
          ) : (
            <div
              style={{
                padding: '28px 16px',
                textAlign: 'center',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-ui)',
                color: 'var(--text-secondary)',
              }}
            >
              {locale === 'FR'
                ? `Aucun outil trouvé pour « ${query} »`
                : `No tools found for “${query}”`}
            </div>
          )}
        </div>

        {/* Footer */}
        <SearchModalFooter locale={locale} />
      </div>
    </>
  );
}
