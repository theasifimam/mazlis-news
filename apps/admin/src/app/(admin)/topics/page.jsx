"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Hash,
  Plus,
  MoreVertical,
  Layers,
  ChevronRight,
  Loader2,
  Trash2,
  Edit3,
  AlertCircle,
  Search } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { topicsApi, Topic } from '@/lib/api';
import { toast } from 'sonner';
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
  Input,
  Textarea,
  Badge,
  Skeleton,
  Card,
  CardContent } from
"@/components/ui";

const TREND_COLORS = {
  Rising: 'bg-emerald-500',
  Stable: 'bg-blue-500',
  Declining: 'bg-amber-500',
  New: 'bg-red-500'
};

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trend, setTrend] = useState('Stable');

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await topicsApi.list();
      if (response.success && response.data?.data) {
        setTopics(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load nodes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Name is required");
    setSubmitting(true);
    const toastId = toast.loading("Defining new node...");
    try {
      const res = await topicsApi.create({ name, description, trend });
      toast.success("Node defined successfully", { id: toastId });
      setIsAddOpen(false);
      resetForm();
      fetchTopics();
    } catch (error) {
      toast.error("Failed to define node", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedTopic || !name.trim()) return;
    setSubmitting(true);
    const toastId = toast.loading("Updating node matrix...");
    try {
      await topicsApi.update(selectedTopic._id, { name, description, trend });
      toast.success("Node updated successfully", { id: toastId });
      setIsEditOpen(false);
      resetForm();
      fetchTopics();
    } catch (error) {
      toast.error("Failed to update node", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTopic) return;
    setSubmitting(true);
    const toastId = toast.loading("Decommissioning node...");
    try {
      await topicsApi.delete(selectedTopic._id);
      toast.success("Node decommissioned", { id: toastId });
      setIsDeleteOpen(false);
      setSelectedTopic(null);
      fetchTopics();
    } catch (error) {
      toast.error("Failed to decommission node", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setTrend('Stable');
    setSelectedTopic(null);
  };

  const openEdit = (topic) => {
    setSelectedTopic(topic);
    setName(topic.name);
    setDescription(topic.description || '');
    setTrend(topic.trend || 'Stable');
    setIsEditOpen(true);
  };

  const filteredTopics = topics.filter((t) =>
  t.name.toLowerCase().includes(search.toLowerCase()) ||
  t.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 md:p-12 flex flex-col gap-8 md:gap-12 max-w-[1600px] mx-auto text-zinc-900 dark:text-zinc-400 transition-colors duration-300">
            {/* Header */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-2 md:mt-0">
                <div className="flex flex-col gap-3 md:gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        <span className="w-8 md:w-12 h-[1px] bg-zinc-400 dark:bg-zinc-800"></span>
                        <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Taxonomy Control</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-black font-outfit uppercase tracking-tighter text-zinc-900 dark:text-white leading-none">
                        Mazlis Topics.
                    </h1>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative group w-full sm:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors z-10" size={14} />
                        <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full py-3 md:py-4 pl-10 md:pl-12 pr-6 text-[11px] font-bold w-full sm:w-48 md:w-64 h-11 md:h-14" />
            
                    </div>
                    <Button
            onClick={() => {resetForm();setIsAddOpen(true);}}
            className="rounded-full w-full sm:w-auto px-6 md:px-8 h-11 md:h-14 font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl shadow-black/10 dark:shadow-white/5">
            
                        <Plus size={16} className="mr-2" />
                        Define New
                    </Button>
                </div>
            </section>

            {/* Topics Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {loading ?
        <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-zinc-300" size={32} />
                        <Skeleton className="h-4 w-48 rounded-full" />
                    </div> :
        filteredTopics.length === 0 ?
        <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 opacity-50">
                        <Hash size={48} className="text-zinc-200 dark:text-zinc-800" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">No topics detected in current scan</span>
                    </div> :

        filteredTopics.map((topic, i) =>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          key={topic._id}>
          
                            <Card
            className="group relative p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer overflow-hidden shadow-none">
            
                                <div className="relative z-10 flex flex-col gap-8">
                                    <div className="flex items-center justify-between">
                                        <div className={`p-3 rounded-2xl ${TREND_COLORS[topic.trend || 'Stable']} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                                            <Hash size={20} />
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {e.stopPropagation();openEdit(topic);}}
                    className="text-zinc-400 hover:text-emerald-500 rounded-lg h-10 w-10">
                    
                                                <Edit3 size={18} />
                                            </Button>
                                            <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {e.stopPropagation();setSelectedTopic(topic);setIsDeleteOpen(true);}}
                    className="text-zinc-400 hover:text-red-500 rounded-lg h-10 w-10">
                    
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-xl md:text-2xl font-black font-outfit tracking-tighter text-zinc-800 dark:text-white uppercase transition-colors leading-tight">{topic.name}</h3>
                                        <p className="text-[9px] md:text-[10px] font-medium text-zinc-500 line-clamp-2 min-h-[24px] md:min-h-[30px]">{topic.description || 'No description provided for this node index.'}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-4 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-700">Articles</span>
                                            <span className="text-xl font-black font-outfit text-zinc-900 dark:text-white leading-none transition-colors">{topic.articlesCount || 0}</span>
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-700">Trend</span>
                                            <Badge variant="secondary" className="bg-transparent border-none text-lg md:text-xl font-black font-outfit text-zinc-900 dark:text-white italic p-0 h-auto shadow-none">
                                                {topic.trend || 'Stable'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Background Element */}
                                <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full ${TREND_COLORS[topic.trend || 'Stable']} opacity-[0.03] group-hover:opacity-[0.08] blur-3xl transition-opacity`} />
                            </Card>
                        </motion.div>
        )
        }
            </section>

            {/* Modals */}
            <TopicDialog
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title="Define New Node"
        onConfirm={handleCreate}
        submitting={submitting}
        form={{ name, setName, description, setDescription, trend, setTrend }} />
      

            <TopicDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Update Node Matrix"
        onConfirm={handleUpdate}
        submitting={submitting}
        form={{ name, setName, description, setDescription, trend, setTrend }} />
      

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="max-w-[400px] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 rounded-[32px] gap-8">
                    <DialogHeader className="gap-4">
                        <div className="w-16 h-16 rounded-[24px] bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                            <AlertCircle size={32} />
                        </div>
                        <DialogTitle className="text-2xl font-black font-outfit uppercase tracking-tighter">Decommission Entity?</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-[13px] font-medium leading-relaxed">
                            Are you sure you want to delete <strong className="text-zinc-900 dark:text-white">"{selectedTopic?.name}"</strong>? This will detach it from all associated article dispatches.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                        <Button
              variant="ghost"
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-500 h-14">
              
                            Abstain
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

            {/* Deep Management View */}
            <Card className="bg-[#09090b] rounded-[2rem] md:rounded-[3rem] border-zinc-900 p-6 sm:p-8 md:p-12 shadow-2xl shadow-black/20">
                <div className="flex items-center justify-between mb-8 md:mb-12">
                    <div className="flex flex-col gap-1 md:gap-2">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Cross-Node Analytics</span>
                        <h2 className="text-2xl md:text-3xl font-black font-outfit uppercase tracking-tighter text-white">Hierarchical Relations</h2>
                    </div>
                </div>

                <div className="flex flex-col divide-y divide-zinc-900">
                    {['Sub-node Structures', 'Cross-linking Metrics', 'Metadata Ingestion Rules', 'Archival Weights'].map((item, i) =>
          <div key={i} className="py-6 md:py-8 flex items-center justify-between group cursor-pointer lg:hover:px-6 transition-all">
                            <div className="flex items-center gap-4 md:gap-6 min-w-0">
                                <span className="text-[10px] md:text-sm font-black italic text-zinc-800 shrink-0">DATA.0{i + 1}</span>
                                <span className="text-base md:text-xl font-bold font-outfit uppercase tracking-tight text-zinc-400 group-hover:text-white transition-colors truncate">{item}</span>
                            </div>
                            <ChevronRight size={18} className="text-zinc-800 group-hover:text-white transition-all transform group-hover:translate-x-2 shrink-0" />
                        </div>
          )}
                </div>
            </Card>
        </div>);

}

function TopicDialog({ isOpen, setIsOpen, title, onConfirm, submitting, form }) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-[480px] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-10 rounded-[40px] gap-8">
                <DialogHeader className="gap-2">
                    <DialogTitle className="text-3xl font-black font-outfit uppercase tracking-tighter">{title}</DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                        Configure node metadata and topological status.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Node Name</label>
                        <Input
              value={form.name}
              onChange={(e) => form.setName(e.target.value)}
              placeholder="e.g. INFRASTRUCTURE"
              className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors h-14" />
            
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Observation Note</label>
                        <Textarea
              value={form.description}
              onChange={(e) => form.setDescription(e.target.value)}
              placeholder="Define the scope of this information node..."
              className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-zinc-400 h-32 resize-none" />
            
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Trend Calibration</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Rising', 'Stable', 'Declining', 'New'].map((t) =>
              <Button
                key={t}
                type="button"
                variant={form.trend === t ? 'default' : 'outline'}
                onClick={() => form.setTrend(t)}
                className={`rounded-xl text-[10px] font-black uppercase tracking-widest transition-all h-12 shadow-none ${form.trend === t ? '' : 'text-zinc-400'}`}>
                
                                    {t}
                                </Button>
              )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button
            onClick={onConfirm}
            disabled={submitting}
            loading={submitting}
            className="w-full py-8 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 transition-all">
            
                        Commit Calibration
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>);

}