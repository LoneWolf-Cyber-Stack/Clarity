import { Feather } from 'lucide-react';
import { useJournalStore } from '@/hooks/useJournalStore';
import { Button } from '@/components/ui/button';
export function JournalEmptyState() {
  const createNewEntry = useJournalStore((s) => s.createNewEntry);
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
        <Feather className="w-10 h-10 text-primary/50" />
      </div>
      <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
        Your journal awaits
      </h2>
      <p className="text-muted-foreground max-w-sm mb-6">
        Capture your thoughts, quotes, or insights. Every great journey begins with a single word.
      </p>
      <Button onClick={createNewEntry} className="transition-transform hover:scale-105 active:scale-95">
        Create Your First Entry
      </Button>
    </div>
  );
}