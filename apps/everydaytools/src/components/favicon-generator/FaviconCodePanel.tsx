import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeWorkspace } from '@/components/ui/code-workspace';

interface FaviconCodePanelProps {
  activeCodeTab: 'html' | 'manifest' | 'nextjs';
  onTabChange: (tab: 'html' | 'manifest' | 'nextjs') => void;
  activeCodeSnippet: string;
  onDownloadManifestFile: () => void;
  isFr: boolean;
}

export function FaviconCodePanel({
  activeCodeTab,
  onTabChange,
  activeCodeSnippet,
  onDownloadManifestFile,
  isFr,
}: FaviconCodePanelProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {isFr ? "Code d'Intégration Production" : 'Production Integration Code'}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {isFr
              ? 'Insérez ces balises dans votre projet pour lier les favicons et le manifest'
              : 'Insert these tags in your project to link favicons and manifest'}
          </p>
        </div>

        <Tabs
          value={activeCodeTab}
          onValueChange={(v) => onTabChange(v as 'html' | 'manifest' | 'nextjs')}
        >
          <TabsList className="h-8 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10">
            <TabsTrigger
              value="html"
              className="text-xs px-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-zinc-50"
            >
              HTML &lt;head&gt;
            </TabsTrigger>
            <TabsTrigger
              value="manifest"
              className="text-xs px-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-zinc-50"
            >
              Web Manifest
            </TabsTrigger>
            <TabsTrigger
              value="nextjs"
              className="text-xs px-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-zinc-50"
            >
              Next.js
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CodeWorkspace
        mode="preview"
        value={activeCodeSnippet}
        format={activeCodeTab === 'html' ? 'html' : activeCodeTab === 'manifest' ? 'json' : 'typescript'}
        formatLabel={
          activeCodeTab === 'html'
            ? 'HTML <head>'
            : activeCodeTab === 'manifest'
            ? 'Web Manifest'
            : 'Next.js App Router'
        }
        downloadFilename={activeCodeTab === 'manifest' ? 'site.webmanifest' : undefined}
        onDownload={activeCodeTab === 'manifest' ? onDownloadManifestFile : undefined}
        minHeight="220px"
        maxHeight="380px"
      />
    </div>
  );
}
