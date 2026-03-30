"use client";

import React from 'react';
import {
    Eye,
    BarChart3,
    Share2,
    MoreVertical,
    Globe,
    ArrowUpRight,
    Trash2,
    Edit3,
    FileText,
    AlertCircle,
    Loader2
} from 'lucide-react';
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
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Button,
    Badge,
    Skeleton,
    Card,
    CardContent
} from "@/components/ui";

export default function PublishedPage() {
    const [articles, setArticles] = React.useState<Article[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [stats, setStats] = React.useState({ total: 0, views: 0 });
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);
    const [submitting, setSubmitting] = React.useState(false);

    const fetchArticles = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await articlesApi.list({ status: 'published' });
            if (res.success && res.data) {
                // Handle nested structure if necessary
                const data = (res.data as any).data || res.data;
                setArticles(Array.isArray(data) ? data : []);

                // Simple stats calc
                const totalViews = Array.isArray(data) ? data.reduce((acc, curr) => acc + (curr.readCount || 0), 0) : 0;
                setStats({ total: data.length, views: totalViews });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load articles");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const handleDelete = async () => {
        if (!selectedArticle) return;

        setSubmitting(true);
        const toastId = toast.loading("Decommissioning signal...");
        try {
            const res = await articlesApi.delete(selectedArticle._id);
            if (res.success) {
                toast.success("Signal decommissioned from archive", { id: toastId });
                setIsDeleteOpen(false);
                setSelectedArticle(null);
                fetchArticles();
            } else {
                toast.error(res.error || "Failed to decommission signal", { id: toastId });
            }
        } catch (error) {
            toast.error("An error occurred", { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div className="p-12 flex flex-col gap-12 max-w-[1600px] mx-auto text-zinc-900 dark:text-zinc-400 transition-colors duration-300">
            {/* Header */}
            <section className="flex items-end justify-between">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <span className="w-12 h-[1px] bg-zinc-400 dark:bg-zinc-800"></span>
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Live Records</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black font-outfit uppercase tracking-tighter text-zinc-900 dark:text-white">
                        Mazlis Published.
                    </h1>
                </div>
            </section>

            {/* Grid Container */}
            <section className="flex flex-col gap-1 border-y border-zinc-200 dark:border-zinc-900 min-h-[400px]">
                {loading ? (
                    <div className="flex-1 space-y-8 py-32 px-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-12">
                                    <Skeleton className="w-8 h-8 rounded-full" />
                                    <div className="space-y-3">
                                        <Skeleton className="h-10 w-[400px]" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Skeleton className="w-12 h-12 rounded-full" />
                                    <Skeleton className="w-12 h-12 rounded-full" />
                                    <Skeleton className="w-12 h-12 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : articles.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-6 py-32 opacity-50 grayscale transition-all hover:grayscale-0">
                        <div className="w-24 h-24 rounded-full border border-dashed border-zinc-300 dark:border-zinc-800 flex items-center justify-center">
                            <FileText size={40} className="text-zinc-300 dark:text-zinc-800" />
                        </div>
                        <div className="text-center flex flex-col gap-1">
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">No Dispatches Found</span>
                            <p className="text-sm font-light text-zinc-400">The archive is currently empty of published records.</p>
                        </div>
                        <Link href="/articles/new" className="mt-4 px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                            Write an Article
                        </Link>
                    </div>
                ) : (
                    <AnimatePresence>
                        {articles.map((item, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                key={item._id}
                                className="group py-10 flex items-center justify-between hover:px-10 transition-all cursor-pointer relative overflow-hidden"
                            >
                                {/* Background Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-center gap-12 relative z-10">
                                    <span className="text-xl font-black italic text-zinc-900 dark:text-zinc-800 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors">
                                        {(i + 1).toString().padStart(3, '0')}
                                    </span>
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-xl md:text-2xl font-black font-outfit uppercase tracking-tighter text-zinc-800 dark:text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-colors">{item.title.substring(0, 50)}...</h2>
                                        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-600">
                                            <span className="text-zinc-600 dark:text-zinc-500 font-black">{item.author?.fullName || 'Anonymous'}</span>
                                            <span>&bull;</span>
                                            <span>{formatDistanceToNow(new Date(item.createdAt))} ago</span>
                                            <span>&bull;</span>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold uppercase tracking-widest text-[9px] px-3">
                                                    <Globe size={10} className="mr-1" /> PUBLIC RELEASE
                                                </Badge>
                                                {item.topic.length > 0 && (
                                                    <Badge variant="outline" className="border-emerald-500/20 text-emerald-600 dark:text-emerald-500/60 font-black uppercase tracking-widest text-[9px] px-3">
                                                        {item.topic[0]?.name}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-16 relative z-10">
                                    <div className="hidden md:flex flex-col items-end gap-1">
                                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 dark:text-zinc-700">Audit Data</span>
                                        <div className="flex items-center gap-2">
                                            <BarChart3 size={14} className="text-emerald-600 dark:text-emerald-500" />
                                            <span className="text-2xl font-black font-outfit text-zinc-900 dark:text-white italic tracking-tighter">
                                                {item.readCount?.toLocaleString() || 0}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full h-12 w-12 border border-border/50 hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-500 dark:text-zinc-700 hover:text-emerald-600 dark:hover:text-emerald-500 transition-all bg-white dark:bg-zinc-950/50"
                                        >
                                            <Link href={`/articles/edit/${item._id}`}>
                                                <Edit3 size={18} />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedArticle(item);
                                                setIsDeleteOpen(true);
                                            }}
                                            className="rounded-full h-12 w-12 border border-border/50 hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-500 dark:text-zinc-700 hover:text-red-500 dark:group-hover:text-red-400 transition-all bg-white dark:bg-zinc-950/50"
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full h-12 w-12 border border-border/50 hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-500 dark:text-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-all bg-white dark:bg-zinc-950/50"
                                        >
                                            <Link
                                                href={`http://localhost:3000/articles/${item._id}`}
                                                target="_blank"
                                            >
                                                <ArrowUpRight size={18} />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </section>

            {/* Footer Insight */}
            <Card className="mt-12 bg-white dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-8 p-12 rounded-[3rem]">
                <div className="flex flex-col gap-2">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Archive Health</h3>
                    <p className="text-zinc-500 dark:text-zinc-600 text-sm max-w-md italic font-light">"All published dispatches are currently mirrored across redundant distributed storage nodes. Global availability is at 99.98%."</p>
                </div>
                <div className="flex gap-4">
                    <Card className="p-6 bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 flex flex-col gap-1 items-center min-w-[120px] rounded-3xl shadow-none">
                        <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-700 uppercase">Records</span>
                        <span className="text-3xl font-black font-outfit text-zinc-900 dark:text-white">{stats.total}</span>
                    </Card>
                    <Card className="p-6 bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 flex flex-col gap-1 items-center min-w-[120px] rounded-3xl shadow-none">
                        <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-700 uppercase">Total Impressions</span>
                        <span className="text-3xl font-black font-outfit text-zinc-900 dark:text-white">
                            {stats.views >= 1000 ? `${(stats.views / 1000).toFixed(1)}K` : stats.views}
                        </span>
                    </Card>
                </div>
            </Card>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="max-w-[400px] z-[999] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 rounded-[32px] gap-8">
                    <DialogHeader className="gap-4">
                        <div className="w-16 h-16 rounded-[24px] bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                            <AlertCircle size={32} />
                        </div>
                        <DialogTitle className="text-2xl font-black font-outfit uppercase tracking-tighter text-zinc-900 dark:text-white leading-none">
                            Delete Article?
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-[13px] font-medium leading-relaxed">
                            Are you sure you want to permanently delete <strong className="text-zinc-900 dark:text-white">"{selectedArticle?.title}"</strong>? This will remove the article from the public domain.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDeleteOpen(false)}
                            className="flex-1 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-500 h-14"
                        >
                            Abstain
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={submitting}
                            className="flex-1 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-[11px] font-black uppercase tracking-widest transition-all h-14 shadow-lg shadow-red-500/20"
                        >
                            {submitting ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
                            Confirm Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
