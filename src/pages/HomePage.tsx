import React, { useEffect } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { JournalSidebar } from '@/components/JournalSidebar';
import { JournalEditor } from '@/components/JournalEditor';
import { useJournalStore } from '@/hooks/useJournalStore';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Toaster } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
export function HomePage() {
  const fetchEntries = useJournalStore((s) => s.fetchEntries);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      fetchEntries();
    }
  }, [isAuthenticated, fetchEntries]);
  return (
    <div className="h-screen w-screen bg-background text-foreground font-sans overflow-hidden relative">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <ThemeToggle className="absolute top-4 right-4 z-50" />
      <div className="max-w-7xl mx-auto h-full">
        <div className="py-8 md:py-10 lg:py-12 h-full">
          <div className="h-full rounded-lg overflow-hidden bg-background/80 backdrop-blur-sm">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
                <JournalSidebar />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={70}>
                <JournalEditor />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
      <Toaster richColors closeButton />
    </div>
  );
}