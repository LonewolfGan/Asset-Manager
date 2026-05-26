import { Link } from "wouter";
import { tools } from "@/config/tools";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredTools = tools.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="space-y-4">
        <h1 className="font-serif text-4xl text-foreground">EverydayTools Hub</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          A precision instrument for everyday digital tasks. Everything runs locally in your browser.
          Zero server round-trips. Zero data uploads. Complete privacy.
        </p>
      </div>

      <div>
        <Input 
          type="search" 
          placeholder="Search tools..." 
          className="max-w-md bg-white dark:bg-card"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => (
          <Link key={tool.id} href={tool.path}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-border group active:scale-[0.98] transition-transform">
              <CardHeader>
                <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-white transition-colors">
                  <tool.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">{tool.name}</CardTitle>
                <CardDescription className="text-sm mt-1 leading-relaxed">
                  {tool.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      
      {filteredTools.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No tools found matching your search.
        </div>
      )}
    </div>
  );
}
