"use client";

import React from "react";
import Link from "next/link";
import ArticleCard from "../ArticleCard";
import { format } from "date-fns";
import { Sparkles, ArrowRight } from "lucide-react";






export default function BreakingNews({
  articles,
  selectedCategory = "ALL"
}) {
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
    <section className="mb-14">
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#e1e7d4] dark:border-[#2d3624]">
        <div className="flex items-center gap-3">
          <h2 className="text-xl md:text-2xl font-black font-outfit tracking-tight text-[#1b2111] dark:text-[#f2f5e8]">
            {selectedCategory === "ALL" ?
            "Latest Dispatches" :
            `${selectedCategory} Dispatches`}
          </h2>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#b6c173]/20 text-[#2e371a] dark:text-[#e2e8c2] border border-[#b6c173]/30">
            {filteredArticles.length}
          </span>
        </div>
        <Link
          href="/articles"
          className="group text-xs font-bold text-[#8e9947] dark:text-[#b6c173] hover:underline inline-flex items-center gap-1">
          
          <span>View Archive</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {filteredArticles.length === 0 ?
      <div className="py-16 text-center text-[#788544] dark:text-[#a0ab6c] text-sm font-medium bg-white dark:bg-[#191f13] rounded-[2rem] border border-[#e1e7d4] dark:border-[#2d3624]">
          No dispatches found under "{selectedCategory}".
        </div> :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) =>
        <ArticleCard
          key={article._id || article.id}
          article={{
            id: article._id || article.id,
            slug: article.slug,
            title: article.title,
            category: article.category || article.topic?.[0]?.name || "FEATURED",
            author:
            article.author?.fullName || article.author || "Anonymous",
            date: article.createdAt ?
            format(new Date(article.createdAt), "MMM dd, yyyy") :
            article.date || "Recent",
            imageUrl: article.image || article.imageUrl,
            views: article.readCount || article.views
          }}
          variant="vertical" />

        )}
        </div>
      }
    </section>);

}