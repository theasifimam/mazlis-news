"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Sparkles,
  Flame,
  Compass,
  ChevronRight,
  Eye,
  Calendar,
  ShieldAlert,
  BookOpen,
} from "lucide-react";
import { getImageUrl } from "@/lib/config";
import BookmarkButton from "../BookmarkButton";

export default function SpotlightHero({ leadArticle, trendingArticles = [] }) {
  if (!leadArticle) return null;

  const leadLink = `/articles/${leadArticle.slug}-${leadArticle.id || leadArticle._id}`;

  return (
    <section className="w-full mb-10 pt-24 md:pt-28">
      <div className="max-w-350 mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Lead featured story card (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5 bg-white dark:bg-[#1a1c18] border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 rounded-[2rem] shadow-sm group transition-all duration-300">
            
            {/* Featured Image Frame */}
            <div className="relative aspect-[16/10] w-full rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
              <Link href={leadLink} className="block w-full h-full">
                <Image
                  src={getImageUrl(leadArticle.imageUrl || leadArticle.image)}
                  alt={leadArticle.title}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                  priority
                  unoptimized
                />
              </Link>
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3.5 py-1.5 rounded-full bg-[#5d6b33] dark:bg-[#c2d08a] text-white dark:text-[#2d340e] text-[10px] font-bold tracking-wider uppercase shadow-sm">
                  Featured
                </span>
              </div>
            </div>

            {/* Featured Story Details */}
            <div className="flex flex-col gap-3 px-1">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>{leadArticle.category || "INTELLIGENCE"}</span>
                <span>•</span>
                <span>{leadArticle.date}</span>
              </div>

              <Link href={leadLink}>
                <h1 className="text-2xl sm:text-3xl font-black font-outfit text-slate-900 dark:text-white leading-tight tracking-tight hover:text-[#5d6b33] dark:hover:text-[#c2d08a] transition-colors">
                  {leadArticle.title}
                </h1>
              </Link>

              {leadArticle.content && (
                <p className="text-slate-650 dark:text-slate-350 text-sm leading-relaxed line-clamp-2">
                  {leadArticle.content.replace(/<[^>]*>?/gm, "")}
                </p>
              )}
            </div>

            {/* Author bar & Read button */}
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-200/60 dark:border-slate-800/60 px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#5d6b33] dark:bg-[#c2d08a] text-white dark:text-[#2d340e] font-black text-xs flex items-center justify-center">
                  {leadArticle.author?.charAt(0) || "M"}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-900 dark:text-white">{leadArticle.author}</span>
                  <span className="text-[9px] text-slate-400 font-semibold">Editorial Staff</span>
                </div>
              </div>

              <Link
                href={leadLink}
                className="inline-flex items-center gap-1 px-5 py-2 rounded-full bg-[#5d6b33] dark:bg-[#c2d08a] text-white dark:text-[#2d340e] text-xs font-bold shadow-sm hover:opacity-90 transition-all android-haptic"
              >
                <span>Read Story</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

          </div>

          {/* Right Column: Trending glance story list (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Right Widget Header */}
            <div className="flex items-center justify-between pb-3 mb-1 border-b border-slate-200/80 dark:border-slate-800/80">
              <h3 className="text-base font-bold font-outfit text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5d6b33] dark:bg-[#c2d08a] animate-pulse" />
                Trending Feed
              </h3>
              <span className="text-[11px] font-bold text-slate-400">Latest Signals</span>
            </div>

            {/* Story List Stack */}
            <div className="flex flex-col gap-3">
              {trendingArticles.slice(0, 3).map((item, idx) => {
                const itemLink = `/articles/${item.slug}-${item.id || item._id}`;
                return (
                  <Link
                    key={item.id || item._id || idx}
                    href={itemLink}
                    className="group flex gap-4 p-4 rounded-[1.25rem] bg-white dark:bg-[#1a1c18] border border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-[#272825]/50 transition-all shadow-xs duration-300"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-[#5d6b33] dark:text-[#c2d08a] font-outfit font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>

                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-[#5d6b33] dark:text-[#c2d08a] tracking-wider uppercase">
                        {item.category || "INTELLIGENCE"}
                      </span>
                      <h4 className="text-sm font-bold font-outfit leading-snug line-clamp-2 text-slate-900 dark:text-white group-hover:text-[#5d6b33] dark:group-hover:text-[#c2d08a] transition-colors">
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
