"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  FileEdit,
  Trash2,
  Clock,
  FileText,
  Plus,
  Loader2,
  ArrowUpRight,
  AlertCircle,
  Send } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { articlesApi, Article } from '@/lib/api';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle } from
"@/components/ui/dialog";
import {
  Button,
  Badge,
  Skeleton,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle } from
"@/components/ui";

export default function DraftsPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await articlesApi.list({ status: 'draft', limit: '50' });
      if (res.success && res.data) {
        const data = res.data.data || res.data;
        setDrafts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load drafts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  const handlePublish = async () => {
    if (!selectedArticle) return;
    setSubmitting(true);
    const toastId = toast.loading("Publishing signal...");
    try {
      const res = await articlesApi.publish(selectedArticle._id);
      if (res.success) {
        toast.success("Signal published to the archive!", { id: toastId });
        setIsPublishOpen(false);
        setSelectedArticle(null);
        fetchDrafts();
      } else {
        toast.error(res.error || "Failed to publish signal", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedArticle) return;
    setSubmitting(true);
    const toastId = toast.loading("Purging draft...");
    try {
      const res = await articlesApi.delete(selectedArticle._id);
      if (res.success) {
        toast.success("Draft purged from staging area", { id: toastId });
        setIsDeleteOpen(false);
        setSelectedArticle(null);
        fetchDrafts();
      } else {
        toast.error(res.error || "Failed to delete draft", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate word count from HTML content
  const getWordCount = (html) => {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text ? text.split(' ').length : 0;
  };

  return (
    <div className="p-12 flex flex-col gap-12 max-w-[1600px] mx-auto text-zinc-900 dark:text-zinc-400 transition-colors duration-300">
            {/* Header */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <span className="w-12 h-[1px] bg-zinc-400 dark:bg-zinc-800"></span>
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Work in Progress</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black font-outfit uppercase tracking-tighter text-zinc-900 dark:text-white">
                        Drafts Area.
                    </h1>
                </div>
                <Link
          href="/articles/new"
          className="flex items-center gap-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-8 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xl shadow-black/10 dark:shadow-white/5 transition-all">
          
                    <Plus size={18} />
                    New Article
                </Link>
            </section>

            {/* Draft Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[300px]">
                {loading ?
        <>
                        {[1, 2, 3].map((i) =>
          <Card key={i} className="p-8 rounded-[2.5rem] border-zinc-200 dark:border-zinc-900 shadow-none space-y-8">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-16" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-8 rounded-lg" />
                                        <Skeleton className="h-8 w-8 rounded-lg" />
                                        <Skeleton className="h-8 w-8 rounded-lg" />
                                    </div>
                                </div>
                                <Skeleton className="w-full aspect-video rounded-2xl" />
                                <div className="space-y-3">
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </Card>
          )}
                    </> :
        drafts.length === 0 ?
        <div className="col-span-full flex flex-col items-center justify-center gap-6 py-32 opacity-50">
                        <div className="w-24 h-24 rounded-full border border-dashed border-zinc-300 dark:border-zinc-800 flex items-center justify-center">
                            <FileText size={40} className="text-zinc-300 dark:text-zinc-800" />
                        </div>
                        <div className="text-center flex flex-col gap-1">
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">No Drafts in Drafts Area</span>
                            <p className="text-sm font-light text-zinc-400">The drafts area is clear. Start a new article to begin.</p>
                        </div>
                        <Link
            href="/articles/new"
            className="mt-4 px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
            
                            Initialize New Article
                        </Link>
                    </div> :

        <AnimatePresence>
                        {drafts.map((draft, i) => {
            const wordCount = getWordCount(draft.content);
            const readTime = Math.ceil(wordCount / 200);
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                key={draft._id}>
                
                                    <Card
                  className="group p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all flex flex-col gap-8 relative overflow-hidden shadow-none">
                  
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black italic text-zinc-500 dark:text-zinc-700 tracking-tighter">
                                                REF_{(i + 1).toString().padStart(3, '0')}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-zinc-500 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-white">
                        
                                                    <Link href={`/articles/edit/${draft._id}`}>
                                                        <FileEdit size={16} />
                                                    </Link>
                                                </Button>
                                                <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {setSelectedArticle(draft);setIsPublishOpen(true);}}
                        className="h-9 w-9 text-zinc-500 dark:text-zinc-600 hover:text-emerald-600 dark:hover:text-emerald-500">
                        
                                                    <Send size={16} />
                                                </Button>
                                                <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {setSelectedArticle(draft);setIsDeleteOpen(true);}}
                        className="h-9 w-9 text-zinc-500 dark:text-zinc-600 hover:text-red-600 dark:hover:text-red-500">
                        
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Hero Image thumb */}
                                        {draft.image &&
                  <div className="w-full aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                                <img
                      src={`http://localhost:5000${draft.image}`}
                      alt={draft.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    
                                            </div>
                  }

                                        {/* Content */}
                                        <div className="flex flex-col gap-3">
                                            <h3 className="text-2xl font-black font-outfit uppercase tracking-tighter text-zinc-800 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white transition-colors leading-tight line-clamp-2">
                                                {draft.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-600">
                                                <span className="truncate max-w-[120px]">{draft.author?.fullName || 'Anonymous'}</span>
                                                <span>&bull;</span>
                                                <div className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {formatDistanceToNow(new Date(draft.updatedAt))} ago
                                                </div>
                                            </div>
                                            {draft.topic?.length > 0 &&
                    <div className="flex flex-wrap gap-2 mt-1">
                                                    {draft.topic.map((t) =>
                      <Badge
                        key={t._id || t}
                        variant="outline"
                        className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 rounded-full text-[9px] font-black uppercase tracking-widest border-zinc-200 dark:border-zinc-700">
                        
                                                            {t.name || t}
                                                        </Badge>
                      )}
                                                </div>
                    }
                                        </div>

                                        {/* Stats */}
                                        <div className="mt-auto flex flex-col gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Words</span>
                                                    <span className="text-lg font-black font-outfit text-zinc-900 dark:text-white leading-none">{wordCount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex flex-col text-right">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Read Time</span>
                                                    <span className="text-lg font-black font-outfit text-zinc-900 dark:text-white leading-none">{readTime}M</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Draft Badge */}
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Badge className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border-amber-200 dark:border-amber-500/20 shadow-none hover:bg-amber-50 dark:hover:bg-amber-500/10">
                                                Draft
                                            </Badge>
                                        </div>
                                    </Card>
                                </motion.div>);

          })}

                        {/* New Signal Trigger */}
                        <Link
            href="/articles/new"
            className="flex flex-col items-center justify-center gap-6 p-8 rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-all text-zinc-500 dark:text-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-500 group">
            
                            <div className="w-16 h-16 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-transparent shadow-sm dark:shadow-none transition-all">
                                <Plus size={24} />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Initialize New Article</span>
                        </Link>
                    </AnimatePresence>
        }
            </section>

            {/* Publish Confirmation */}
            <Dialog open={isPublishOpen} onOpenChange={setIsPublishOpen}>
                <DialogContent className="max-w-[400px] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 rounded-[32px] gap-8">
                    <DialogHeader className="gap-4">
                        <div className="w-16 h-16 rounded-[24px] bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
                            <Send size={32} />
                        </div>
                        <DialogTitle className="text-2xl font-black font-outfit uppercase tracking-tighter text-zinc-900 dark:text-white leading-none">
                            Publish Article?
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-[13px] font-medium leading-relaxed">
                            Ready to publish <strong className="text-zinc-900 dark:text-white">"{selectedArticle?.title}"</strong> to the live archive? This will make it publicly available.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                        <Button
              variant="ghost"
              onClick={() => setIsPublishOpen(false)}
              className="flex-1 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-500 h-14">
              
                            Abort
                        </Button>
                        <Button
              onClick={handlePublish}
              disabled={submitting}
              className="flex-1 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest transition-all h-14 shadow-lg shadow-emerald-500/20">
              
                            {submitting ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
                            Publish Article
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="max-w-[400px] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 rounded-[32px] gap-8">
                    <DialogHeader className="gap-4">
                        <div className="w-16 h-16 rounded-[24px] bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                            <AlertCircle size={32} />
                        </div>
                        <DialogTitle className="text-2xl font-black font-outfit uppercase tracking-tighter text-zinc-900 dark:text-white leading-none">
                            Delete Draft?
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-[13px] font-medium leading-relaxed">
                            Are you sure you want to permanently delete <strong className="text-zinc-900 dark:text-white">"{selectedArticle?.title}"</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                        <Button
              variant="ghost"
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-500 h-14">
              
                            Cancel
                        </Button>
                        <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
              className="flex-1 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-[11px] font-black uppercase tracking-widest transition-all h-14 shadow-lg shadow-red-500/20">
              
                            {submitting ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
                            Confirm Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>);

}