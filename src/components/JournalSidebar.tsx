import { PlusCircle, BookText, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useJournalStore } from '@/hooks/useJournalStore';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};
const formatEntryDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return format(date, 'P, p'); // e.g., 10/22/2024, 9:25 AM
};
export function JournalSidebar() {
  const entries = useJournalStore((s) => s.entries);
  const selectedEntryId = useJournalStore((s) => s.selectedEntryId);
  const selectEntry = useJournalStore((s) => s.selectEntry);
  const createNewEntry = useJournalStore((s) => s.createNewEntry);
  const isLoading = useJournalStore((s) => s.isLoading);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  return (
    <div className="flex flex-col h-full bg-background/50 border-r">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <BookText className="w-6 h-6 text-foreground" />
          <h1 className="text-xl font-display font-bold text-foreground">Clarity</h1>
        </div>
      </div>
      <div className="p-4">
        <Button onClick={createNewEntry} className="w-full transition-transform hover:scale-105 active:scale-95">
          <PlusCircle className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="p-4 pt-0 space-y-2"
        >
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          ) : entries.length > 0 ? (
            entries.map((entry) => (
              <motion.div key={entry.id} variants={itemVariants}>
                <button
                  onClick={() => selectEntry(entry.id)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg transition-colors duration-200',
                    selectedEntryId === entry.id
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent/50'
                  )}
                >
                  <h3 className="font-semibold text-sm truncate">{entry.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {formatEntryDate(entry.updatedAt)}
                  </p>
                </button>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground p-4">
              No entries yet.
            </div>
          )}
        </motion.div>
      </ScrollArea>
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground truncate" title={user?.id}>
            {user?.id}
          </p>
          <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}