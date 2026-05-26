import { Link, useLocation } from "wouter";
import { tools, categories } from "@/config/tools";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Moon, Sun, Monitor } from "lucide-react";
import { usePreferences } from "@/hooks/use-preferences";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 border-r border-border bg-sidebar h-[100dvh] flex flex-col sticky top-0 flex-shrink-0 overflow-y-auto">
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2 text-foreground font-serif text-xl tracking-tight">
          <div className="h-8 w-8 bg-primary rounded flex items-center justify-center text-white">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          EverydayTools
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-6">
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3 px-2">Overview</h4>
          <Link 
            href="/"
            className={cn(
              "flex items-center gap-3 px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
              location === "/" 
                ? "bg-primary/10 text-primary" 
                : "text-sidebar-foreground hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Hub Home
          </Link>
        </div>

        {categories.map(category => (
          <div key={category}>
            <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3 px-2">
              {category}
            </h4>
            <div className="space-y-1">
              {tools.filter(t => t.category === category).map(tool => (
                <Link 
                  key={tool.id}
                  href={tool.path}
                  className={cn(
                    "flex items-center gap-3 px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
                    location === tool.path
                      ? "bg-primary/10 text-primary" 
                      : "text-sidebar-foreground hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                >
                  <tool.icon className="h-4 w-4" />
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export function Topbar() {
  const [location] = useLocation();
  const { prefs, updatePrefs } = usePreferences();
  
  const currentTool = tools.find(t => t.path === location);

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="font-medium">
        {currentTool ? currentTool.name : "Hub"}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            {prefs.theme === 'dark' ? <Moon className="h-4 w-4" /> : 
             prefs.theme === 'light' ? <Sun className="h-4 w-4" /> : 
             <Monitor className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => updatePrefs({ theme: 'light' })}>
            <Sun className="h-4 w-4 mr-2" /> Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updatePrefs({ theme: 'dark' })}>
            <Moon className="h-4 w-4 mr-2" /> Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updatePrefs({ theme: 'system' })}>
            <Monitor className="h-4 w-4 mr-2" /> System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
