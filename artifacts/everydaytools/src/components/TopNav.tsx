import { Link } from "wouter";

export default function TopNav() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[var(--border)] shadow-sm">
      <div className="max-w-[1100px] mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 bg-[var(--accent)] text-white rounded flex items-center justify-center font-bold text-lg">
            E
          </div>
          <span className="font-serif text-2xl text-[var(--text)]">EverydayTools</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-[var(--muted)] font-medium text-sm">
          <Link href="/#pdf" className="hover:text-[var(--accent)] transition-colors">PDF Tools</Link>
          <Link href="/#word" className="hover:text-[var(--accent)] transition-colors">Word & Docs</Link>
          <Link href="/#image" className="hover:text-[var(--accent)] transition-colors">Image Tools</Link>
          <Link href="/#privacy" className="hover:text-[var(--accent)] transition-colors">Privacy</Link>
          <Link href="/#calculators" className="hover:text-[var(--accent)] transition-colors">Calculators</Link>
        </div>

        {/* Mobile menu could go here */}
      </div>
    </nav>
  );
}
