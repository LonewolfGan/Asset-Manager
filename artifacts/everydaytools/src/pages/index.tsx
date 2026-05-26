import { Link } from "wouter";
import { tools } from "../config/tools.config";
import ToolCard from "../components/ToolCard";
import AdSlot from "../components/AdSlot";

export default function Home() {
  const categories = [
    { id: 'pdf', title: 'PDF Tools', items: tools.filter(t => t.category === 'pdf') },
    { id: 'word', title: 'Word & Docs', items: tools.filter(t => t.category === 'word') },
    { id: 'image', title: 'Image Tools', items: tools.filter(t => t.category === 'image') },
    { id: 'privacy', title: 'Privacy', items: tools.filter(t => t.category === 'privacy') },
    { id: 'calculators', title: 'Calculators', items: tools.filter(t => t.category === 'calculators') }
  ];

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8 space-y-16">
      {categories.map(category => (
        <section key={category.id} id={category.id} className="scroll-mt-20">
          <div className="mb-6">
            <h2 className="font-serif text-3xl text-[var(--text)]">{category.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {category.items.map(tool => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      ))}

      <div className="mt-12 flex justify-center">
        <AdSlot type="horizontal" />
      </div>
    </div>
  );
}
