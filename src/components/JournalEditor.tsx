import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'react-use';
import { Loader2, Check } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useJournalStore } from '@/hooks/useJournalStore';
import { JournalEmptyState } from './JournalEmptyState';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
export function JournalEditor() {
  const selectedEntryId = useJournalStore((s) => s.selectedEntryId);
  const selectedEntry = useJournalStore((s) => s.entries.find(e => e.id === s.selectedEntryId));
  const updateEntry = useJournalStore((s) => s.updateEntry);
  const isLoading = useJournalStore((s) => s.isLoading);
  const isSaving = useJournalStore((s) => s.isSaving);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const initialLoadRef = useRef(true);
  useEffect(() => {
    if (selectedEntry) {
      setTitle(selectedEntry.title);
      setContent(selectedEntry.content);
      setIsDirty(false);
      initialLoadRef.current = true;
    } else if (!isLoading) {
      setTitle('');
      setContent('');
      setIsDirty(false);
    }
  }, [selectedEntryId, selectedEntry, isLoading]);
  const handleSave = () => {
    if (selectedEntryId && isDirty) {
      updateEntry(selectedEntryId, title, content);
      setIsDirty(false);
    }
  };
  useDebounce(
    () => {
      if (isDirty) {
        handleSave();
      }
    },
    1500,
    [title, content, isDirty]
  );
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }
    if (selectedEntry && (title !== selectedEntry.title || content !== selectedEntry.content)) {
      setIsDirty(true);
    }
  }, [title, content, selectedEntry]);
  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }
  if (!selectedEntry) {
    return <JournalEmptyState />;
  }
  return (
    <motion.div
      key={selectedEntry.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full p-4 sm:p-6 lg:p-8"
    >
      <div className="flex items-center justify-between mb-6 h-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Note</span>
          <span>{format(new Date(selectedEntry.updatedAt), 'HH:mm')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
              <span>Saved</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="w-1 self-stretch bg-amber-400 rounded-full" />
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry Title"
          className="text-3xl md:text-4xl font-display font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto mb-4 bg-transparent"
        />
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something beautiful..."
        className="flex-1 w-full text-lg leading-relaxed border-none shadow-none focus-visible:ring-0 px-0 resize-none bg-transparent"
      />
    </motion.div>
  );
}