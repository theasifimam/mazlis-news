"use client";

import React from "react";
import Link from "next/link";
import ArticleCard from "../ArticleCard";
import { format } from "date-fns";
import { Sparkles, ArrowRight } from "lucide-react";

interface BreakingNewsProps {
  articles: any[];
  selectedCategory?: string;
}

export default function BreakingNews({
  articles,
  selectedCategory = "ALL",
}: BreakingNewsProps) {
  const filteredArticles = React.useMemo(() => {
    if (!articles || articles.length === 0) return [];
    if (selectedCategory === "ALL") return articles;
    return articles.filter((a) => {
      const topic = a.topic?.[0]?.name || a.category || "";
      return topic.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [articles, selectedCategory]);

  if (!articles || articles.length === 0) return null;

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="flex items-center gap-3">
          <Sparkles size={18} className="text-amber-500" />
          <h2 className="text-2xl md:text-3xl font-black font-outfit tracking-tight text-zinc-900 dark:text-white">
            {selectedCategory === "ALL"
              ? "Latest Dispatches"
              : `${selectedCategory} Dispatches`}
          </h2>
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
            {filteredArticles.length}
          </span>
        </div>
        <Link
          href="/articles"
          className="group text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-[0.25em] inline-flex items-center gap-1"
        >
          View Archive
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="py-16 text-center text-zinc-400 text-sm font-medium">
          No dispatches found under "{selectedCategory}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article._id || article.id}
              article={{
                id: article._id || article.id,
                slug: article.slug,
                title: article.title,
                author:
                  article.author?.fullName || article.author || "Anonymous",
                date: article.createdAt
                  ? format(new Date(article.createdAt), "MMM dd, yyyy")
                  : article.date || "Recent",
                imageUrl: article.image || article.imageUrl,
                views: article.readCount || article.views,
              }}
              variant="vertical"
            />
          ))}
        </div>
      )}
    </section>
  );
}
