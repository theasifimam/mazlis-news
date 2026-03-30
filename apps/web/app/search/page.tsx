"use client";

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import { useGetArticlesQuery } from '@/lib/api/articlesApi';
import { useGetTopicsQuery } from '@/lib/api/topicsApi';
import { Loader2 } from 'lucide-react';

// Dynamic imports for improved initial load and bundle splitting
const SearchHero = dynamic(() => import('@/components/search/SearchHero'), { 
    ssr: false,
    loading: () => <div className="w-full h-[70vh] md:h-[75vh] bg-zinc-900 animate-pulse" />
});

const SearchFilters = dynamic(() => import('@/components/search/SearchFilters'), { 
    ssr: false 
});

const ArticleGrid = dynamic(() => import('@/components/search/ArticleGrid'), { 
    ssr: false,
    loading: () => (
        <div className="flex flex-col gap-8 py-10">
            <div className="h-4 w-40 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 4].map(i => (
                    <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl" />
                ))}
            </div>
        </div>
    )
});

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

    // Update debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data: topicsResponse, isLoading: topicsLoading } = useGetTopicsQuery();
    const topics = useMemo(() => topicsResponse?.data || [], [topicsResponse]);
    const displayTopics = useMemo(() => [
        { _id: 'all', name: 'All' },
        ...topics
    ], [topics]);

    // Set initial active topic if not set
    useEffect(() => {
        if (!activeTopicId) {
            setActiveTopicId('all');
        }
    }, [activeTopicId]);

    const { data: articlesResponse, isLoading: articlesLoading } = useGetArticlesQuery(
        {
            topic: (activeTopicId && activeTopicId !== 'all') ? activeTopicId : undefined,
            status: 'published',
            search: debouncedSearch || undefined
        }
    );

    const articles = useMemo(() => articlesResponse?.data || [], [articlesResponse]);

    const activeTopicName = useMemo(() => 
        displayTopics.find(t => t._id === activeTopicId)?.name || 'All', 
    [displayTopics, activeTopicId]);

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
            <Header />

            <main className="flex-1 w-full flex flex-col">
                {/* Discover Hero Section */}
                <SearchHero />

                {/* Content Island with Top Radius */}
                <div className="relative w-full bg-background rounded-t-[2.5rem] md:rounded-t-[4rem] -mt-12 z-30 pt-10 flex flex-col items-center">
                    <div className="w-full max-w-[1400px] px-6 lg:px-12 flex flex-col gap-6">
                        
                        {/* Search & Topic Filters */}
                        <SearchFilters 
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            topics={displayTopics}
                            topicsLoading={topicsLoading}
                            activeTopicId={activeTopicId}
                            onTopicChange={setActiveTopicId}
                        />

                        {/* Article Grid - Deferred Results */}
                        <ArticleGrid 
                            articles={articles}
                            loading={articlesLoading}
                            searchQuery={searchQuery}
                            activeTopicName={activeTopicName}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
