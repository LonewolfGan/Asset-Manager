import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

interface FormatSelectorProps {
  options: Array<{value: string, label: string}>;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function FormatSelector({ options, value, onChange, placeholder = "Select option..." }: FormatSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find(o => o.value === value);

  const filteredOptions = options.filter(o => 
    o.label.toLowerCase().includes(search.toLowerCase()) || 
    o.value.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault();
      setIsOpen(true);
      return;
    }
    
    if (!isOpen) return;

    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between border border-[var(--border)] rounded-md px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-sm"
        style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
      >
        <span className={selectedOption ? "text-[var(--text)]" : "text-[var(--muted)]"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-[var(--muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full border border-[var(--border)] rounded-md shadow-lg overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
          <div className="p-2 border-b border-[var(--border)]">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-[var(--muted)]" />
              <input
                type="text"
                autoFocus
                className="w-full pl-8 pr-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded text-sm focus:outline-none focus:border-[var(--accent)]"
                style={{ color: 'var(--text-primary)' }}
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <ul 
            ref={listRef}
            className="max-h-[260px] overflow-y-auto py-1 outline-none"
            tabIndex={-1}
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-sm text-[var(--muted)] text-center">No results found</li>
            ) : (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-[var(--bg)] ${
                    value === opt.value ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--text)]'
                  }`}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  {opt.label}
                  {value === opt.value && <Check className="w-4 h-4" />}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
