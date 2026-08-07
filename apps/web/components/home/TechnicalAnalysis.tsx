"use client";

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ShieldAlert, ArrowUpRight, BookOpen } from 'lucide-react';

interface TechnicalAnalysisProps {
  articles: any[];
}

export default function TechnicalAnalysis({ articles }: TechnicalAnalysisProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="my-20 pt-16 border-t border-zinc-200/60 dark:border-zinc-800/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
            <ShieldAlert size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">
              Deep Investigation
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-outfit tracking-tight text-zinc-900 dark:text-white">
            Intelligence Reports
          </h2>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light max-w-md">
          In-depth technical breakdowns and systemic analysis compiled by expert investigative journalists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, idx) => {
          const topicName = article.topic?.[0]?.name || article.category || 'ANALYSIS';
          const articleDate = article.createdAt ? format(new Date(article.createdAt), 'MMM dd, yyyy') : 'Recent';
          const articleLink = `/articles/${article.slug}-${article._id || article.id}`;

          return (
            <div
              key={article._id || article.id || idx}
              className="group relative p-8 rounded-2xl md:rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#121215] transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    {topicName}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                    <BookOpen size={12} />
                    {articleDate}
                  </span>
                </div>

                <Link href={articleLink}>
                  <h3 className="text-xl font-bold font-outfit leading-snug mb-4 line-clamp-3 text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {article.title}
                  </h3>
                </Link>
              </div>

              <div className="pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between mt-6">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  By {article.author?.fullName || article.author || 'Editorial'}
                </span>
                <Link
                  href={articleLink}
                  className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-950 transition-all duration-300"
                >
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
