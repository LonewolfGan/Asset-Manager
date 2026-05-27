import { useState } from "react";

type ToolCategory = "Documents" | "Images" | "Privacy" | "Calculators";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: React.ReactNode;
  badge?: string;
}

const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const ScissorsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88"/>
    <line x1="14.47" y1="14.48" x2="20" y2="20"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const KeyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);

const DollarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const RulerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l18 18M3 9l6-6M21 15l-6 6M6 6l3 3M12 3l3 3M3 12l3 3M15 15l3 3"/>
  </svg>
);

const PercentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="5" x2="5" y2="19"/>
    <circle cx="6.5" cy="6.5" r="2.5"/>
    <circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
);

const TypeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7"/>
    <line x1="9" y1="20" x2="15" y2="20"/>
    <line x1="12" y1="4" x2="12" y2="20"/>
  </svg>
);

const TOOLS: Tool[] = [
  { id: "doc-convert", name: "Document Converter", description: "Convert between PDF, DOCX, TXT, and HTML formats.", category: "Documents", icon: <FileTextIcon /> },
  { id: "img-convert", name: "Image Converter", description: "Batch convert images across PNG, JPEG, WebP, AVIF, and more.", category: "Images", icon: <ImageIcon /> },
  { id: "bg-remove", name: "Background Remover", description: "Remove image backgrounds with AI — processed on the server.", category: "Images", icon: <ScissorsIcon />, badge: "AI" },
  { id: "metadata", name: "Metadata Cleaner", description: "Strip EXIF data, author info, and embedded properties from files.", category: "Privacy", icon: <ShieldIcon /> },
  { id: "ai-scrub", name: "AI Text Scrubber", description: "Remove invisible characters and flatten AI-generated phrasing.", category: "Privacy", icon: <TypeIcon />, badge: "AI" },
  { id: "password", name: "Password Generator", description: "Generate cryptographically secure passwords with entropy scoring.", category: "Privacy", icon: <KeyIcon /> },
  { id: "currency", name: "Currency Converter", description: "Convert between 150+ currencies using live exchange rates.", category: "Calculators", icon: <DollarIcon /> },
  { id: "unit", name: "Unit Converter", description: "Length, weight, temperature, volume, area and more — 10 categories.", category: "Calculators", icon: <RulerIcon /> },
  { id: "tip", name: "Tip & Percentage Calculator", description: "Split bills and calculate tips or percentage values instantly.", category: "Calculators", icon: <PercentIcon /> },
];

const CATEGORIES: ToolCategory[] = ["Documents", "Images", "Privacy", "Calculators"];

function ToolCard({ tool, isActive, onSelect }: { tool: Tool; isActive: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full text-left p-4 rounded-xl border transition-all duration-150 group
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        ${isActive
          ? "bg-[#1A1916] border-[#1A6BFF]/60 shadow-[0_0_0_1px_rgba(26,107,255,0.3)]"
          : "bg-[#1A1916] border-white/[0.07] hover:border-white/[0.16] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`
          mt-0.5 flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
          ${isActive ? "bg-[#1A6BFF]/20 text-[#1A6BFF]" : "bg-white/[0.06] text-white/50 group-hover:text-white/75"}
          transition-colors
        `}>
          {tool.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-white/80"}`}>
              {tool.name}
            </span>
            {tool.badge && (
              <span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#1A6BFF]/20 text-[#6EA8FF] leading-none">
                {tool.badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-white/40 leading-snug line-clamp-2">{tool.description}</p>
        </div>
      </div>
    </button>
  );
}

function ToolsGrid({ tools, selectedId, onSelect }: { tools: Tool[]; selectedId: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {tools.map(tool => (
        <ToolCard key={tool.id} tool={tool} isActive={selectedId === tool.id} onSelect={() => onSelect(tool.id)} />
      ))}
    </div>
  );
}

function UploadZone() {
  return (
    <div className="border-2 border-dashed border-white/[0.1] rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center hover:border-white/[0.2] transition-colors cursor-pointer">
      <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center text-white/30">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </div>
      <div>
        <p className="text-sm text-white/60">Drop files here or <span className="text-[#1A6BFF]">browse</span></p>
        <p className="text-xs text-white/30 mt-1">PDF, DOCX, TXT up to 50 MB</p>
      </div>
    </div>
  );
}

function DocConverterDetail() {
  const [format, setFormat] = useState<"pdf-to-txt" | "docx-to-html" | "docx-to-txt" | "txt-to-pdf">("pdf-to-txt");
  const formats = [
    { id: "pdf-to-txt", label: "PDF → TXT" },
    { id: "docx-to-html", label: "DOCX → HTML" },
    { id: "docx-to-txt", label: "DOCX → TXT" },
    { id: "txt-to-pdf", label: "TXT → PDF" },
  ] as const;
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">Conversion type</p>
        <div className="grid grid-cols-2 gap-2">
          {formats.map(f => (
            <button key={f.id} type="button" onClick={() => setFormat(f.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${format === f.id ? "bg-[#1A6BFF] border-[#1A6BFF] text-white" : "bg-white/[0.04] border-white/[0.08] text-white/60 hover:text-white/80 hover:border-white/[0.15]"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <UploadZone />
      <button type="button" className="w-full py-2.5 px-4 rounded-lg bg-[#1A6BFF] text-white text-sm font-medium hover:bg-blue-500 transition-colors">
        Convert
      </button>
    </div>
  );
}

function PasswordDetail() {
  const [length, setLength] = useState(20);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const toggle = (k: keyof typeof opts) => setOpts(o => ({ ...o, [k]: !o[k] }));
  const generated = "J#7kP$mN2@xQr!uV9wYz";
  return (
    <div className="space-y-5">
      <div>
        <div className="flex justify-between mb-2">
          <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Length</p>
          <span className="text-xs font-mono text-white/60">{length}</span>
        </div>
        <input type="range" min={8} max={64} value={length} onChange={e => setLength(+e.target.value)}
          className="w-full accent-[#1A6BFF]" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(opts) as (keyof typeof opts)[]).map(k => (
          <label key={k} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={opts[k]} onChange={() => toggle(k)} className="accent-[#1A6BFF] w-3.5 h-3.5" />
            <span className="text-sm text-white/60 capitalize">{k}</span>
          </label>
        ))}
      </div>
      <div className="bg-[#0F0F0E] rounded-lg p-3 flex items-center justify-between gap-3 border border-white/[0.06]">
        <code className="text-sm font-mono text-[#6EA8FF] truncate">{generated}</code>
        <button type="button" className="flex-shrink-0 text-white/40 hover:text-white/70 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div className="h-full w-4/5 rounded-full bg-emerald-500" />
        </div>
        <span className="text-xs text-emerald-400 font-medium">Strong · 128 bits</span>
      </div>
      <button type="button" className="w-full py-2.5 rounded-lg bg-[#1A6BFF] text-white text-sm font-medium hover:bg-blue-500 transition-colors">
        Generate New
      </button>
    </div>
  );
}

function CurrencyDetail() {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-white/40 font-medium uppercase tracking-wider block mb-2">Amount</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
          className="w-full bg-[#0F0F0E] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#1A6BFF]/60" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[{ label: "From", val: from, set: setFrom }, { label: "To", val: to, set: setTo }].map(({ label, val, set }) => (
          <div key={label}>
            <label className="text-xs text-white/40 font-medium uppercase tracking-wider block mb-2">{label}</label>
            <select value={val} onChange={e => set(e.target.value)}
              className="w-full bg-[#0F0F0E] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#1A6BFF]/60">
              {["USD","EUR","GBP","JPY","CAD","AUD","CHF","CNY","INR"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div className="bg-[#0F0F0E] rounded-xl p-4 border border-white/[0.06] text-center space-y-1">
        <p className="text-2xl font-semibold text-white">0.92 EUR</p>
        <p className="text-xs text-white/40">1 USD = 0.9217 EUR · Updated 2 min ago</p>
      </div>
    </div>
  );
}

function GenericFileDetail({ tool }: { tool: Tool }) {
  return (
    <div className="space-y-5">
      <UploadZone />
      <button type="button" className="w-full py-2.5 px-4 rounded-lg bg-[#1A6BFF] text-white text-sm font-medium hover:bg-blue-500 transition-colors">
        Process with {tool.name}
      </button>
    </div>
  );
}

function ToolDetail({ tool }: { tool: Tool }) {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#1A6BFF]/15 flex items-center justify-center text-[#1A6BFF]">
            {tool.icon}
          </div>
          <h2 className="text-base font-semibold text-white">{tool.name}</h2>
          {tool.badge && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#1A6BFF]/20 text-[#6EA8FF] leading-none">
              {tool.badge}
            </span>
          )}
        </div>
        <p className="text-sm text-white/45 leading-relaxed ml-11">{tool.description}</p>
      </div>
      <div className="flex-1 overflow-auto">
        {tool.id === "doc-convert" && <DocConverterDetail />}
        {tool.id === "password" && <PasswordDetail />}
        {tool.id === "currency" && <CurrencyDetail />}
        {!["doc-convert","password","currency"].includes(tool.id) && <GenericFileDetail tool={tool} />}
      </div>
    </div>
  );
}

function EmptyDetail() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center gap-4 px-6">
      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/20">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h6M3 15h6"/>
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-white/50">No tool selected</p>
        <p className="text-xs text-white/25 mt-1">Pick a tool from the grid to get started.</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedId, setSelectedId] = useState<string | null>("doc-convert");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "All">("All");

  const filteredTools = activeCategory === "All"
    ? TOOLS
    : TOOLS.filter(t => t.category === activeCategory);

  const selectedTool = TOOLS.find(t => t.id === selectedId) ?? null;

  return (
    <div className="min-h-screen bg-[#0F0F0E] text-white" style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <header className="h-14 border-b border-white/[0.07] flex items-center px-5 gap-6 sticky top-0 bg-[#0F0F0E]/95 backdrop-blur z-20">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-6 h-6 bg-[#1A6BFF] rounded-[5px] grid grid-cols-2 gap-[2px] p-1">
            {[0,1,2,3].map(i => <div key={i} className="bg-white rounded-[1px]" />)}
          </div>
          <span className="font-semibold text-sm tracking-tight text-white">EverydayTools</span>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none flex-1">
          {(["All", ...CATEGORIES] as const).map(cat => (
            <button key={cat} type="button" onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors
                ${activeCategory === cat ? "bg-white/[0.08] text-white" : "text-white/45 hover:text-white/70"}`}>
              {cat}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-white/40 text-xs w-44">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span>Search tools...</span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex h-[calc(100vh-56px)]">

        {/* Tools grid panel */}
        <div className="flex-1 min-w-0 overflow-y-auto p-5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-sm font-medium text-white/50">
              {activeCategory === "All" ? `All tools` : activeCategory}
              <span className="ml-1.5 text-white/25">{filteredTools.length}</span>
            </h1>
          </div>
          <ToolsGrid tools={filteredTools} selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        {/* Divider */}
        <div className="w-px bg-white/[0.07] flex-shrink-0" />

        {/* Detail panel */}
        <div className="w-[340px] flex-shrink-0 overflow-y-auto p-5">
          {selectedTool ? <ToolDetail tool={selectedTool} /> : <EmptyDetail />}
        </div>
      </div>
    </div>
  );
}
