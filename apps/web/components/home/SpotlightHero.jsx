"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Sparkles, TrendingUp } from "lucide-react";
import { getImageUrl } from "@/lib/config";
import BookmarkButton from "../BookmarkButton";






export default function SpotlightHero({
  leadArticle,
  trendingArticles
}) {
  if (!leadArticle) return null;

  const leadLink = `/articles/${leadArticle.slug}-${leadArticle.id || leadArticle._id}`;

  return (
    <section className="w-full mb-16 pt-24 md:pt-28">
      <div className="max-w-350 mx-auto px-6 lg:px-12">
        {/* Dateline Subheader */}
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-zinc-200/60 dark:border-zinc-800/60 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-900 dark:text-white font-bold">
              MAZLIS DISPATCH
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-zinc-400">
              INDEPENDENT JOURNALISM
            </span>
          </div>
          <div>
            <span>
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Main Story Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 group">
            {/* Cover Image */}
            <div className="relative aspect-video w-full rounded-4xl md:rounded-4xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-sm">
              <Link href={leadLink} className="block w-full h-full">
                <Image
                  src={getImageUrl(leadArticle.imageUrl || leadArticle.image)}
                  alt={leadArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                  unoptimized />
                
              </Link>
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/10">
                <Sparkles size={12} className="text-amber-400 fill-amber-400" />
                <span>Lead Investigation</span>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <BookmarkButton articleId={leadArticle.id || leadArticle._id} />
              </div>
            </div>

            {/* Main Story Content */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <span className="text-emerald-600 dark:text-emerald-400 font-black">
                  {leadArticle.category ||
                  leadArticle.topic?.[0]?.name ||
                  "EDITORIAL"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {leadArticle.date}
                </span>
              </div>

              <Link href={leadLink}>
                <h1 className="text-2xl md:text-4xl font-black font-outfit text-zinc-900 dark:text-white leading-tight tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                  {leadArticle.title}
                </h1>
              </Link>

              {leadArticle.content &&
              <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base font-light leading-relaxed line-clamp-3">
                  {leadArticle.content.replace(/<[^>]*>?/gm, "")}
                </p>
              }

              <div className="flex items-center justify-between pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-900 dark:text-white uppercase">
                    {leadArticle.author?.charAt(0) || "M"}
                  </div>
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                    By {leadArticle.author}
                  </span>
                </div>

                <Link
                  href={leadLink}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors group/link">
                  
                  Read Investigation
                  <ArrowUpRight
                    size={16}
                    className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Trending Dispatches (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:border-l lg:border-zinc-200/60 lg:dark:border-zinc-800/60 lg:pl-10">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-500" />
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-zinc-900 dark:text-white">
                  Trending Dispatches
                </h3>
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Ranked
              </span>
            </div>

            <div className="flex flex-col gap-6 divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
              {trendingArticles.slice(0, 4).map((item, idx) => {
                const itemLink = `/articles/${item.slug}-${item.id || item._id}`;
                return (
                  <div
                    key={item.id || item._id || idx}
                    className={`flex items-start gap-4 group transition-colors ${idx > 0 ? "pt-6" : ""}`}>
                    
                    <span className="font-outfit text-2xl font-black text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                      0{idx + 1}
                    </span>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                        {item.category || item.topic?.[0]?.name || "SIGNAL"}
                      </span>
                      <Link href={itemLink}>
                        <h4 className="text-base font-bold font-outfit leading-snug line-clamp-2 text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-500 dark:group-hover:text-zinc-300 transition-colors">
                          {item.title}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400 uppercase tracking-wider mt-1">
                        <span>By {item.author}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>);

              })}
            </div>
          </div>
        </div>
      </div>
    </section>);

}