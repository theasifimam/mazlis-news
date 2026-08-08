"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ShieldAlert, ArrowUpRight, BookOpen } from "lucide-react";

export default function TechnicalAnalysis({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="my-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#8e9947] dark:text-[#b6c173] mb-2">
            <ShieldAlert size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Deep Investigation
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-outfit tracking-tight text-[#1b2111] dark:text-[#f2f5e8]">
            Intelligence Reports
          </h2>
        </div>
        <p className="text-[#788544] dark:text-[#a0ab6c] text-xs md:text-sm font-medium max-w-md">
          In-depth technical breakdowns and systemic analysis compiled by expert investigative journalists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, idx) => {
          const topicName = article.topic?.[0]?.name || article.category || "ANALYSIS";
          const articleDate = article.createdAt ? format(new Date(article.createdAt), "MMM dd, yyyy") : "Recent";
          const articleLink = `/articles/${article.slug}-${article._id || article.id}`;

          return (
            <div
              key={article._id || article.id || idx}
              className="group relative p-6 sm:p-7 rounded-[2rem] border border-[#e1e7d4] dark:border-[#2d3624] bg-white dark:bg-[#191f13] android-tile android-haptic flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#2e371a] dark:text-[#e2e8c2] px-3 py-1 rounded-full bg-[#b6c173]/20 border border-[#b6c173]/30">
                    {topicName}
                  </span>
                  <span className="text-xs font-semibold text-[#788544] dark:text-[#a0ab6c] flex items-center gap-1">
                    <BookOpen size={13} />
                    {articleDate}
                  </span>
                </div>

                <Link href={articleLink}>
                  <h3 className="text-lg font-bold font-outfit leading-snug mb-3 line-clamp-3 text-[#1b2111] dark:text-[#f2f5e8] group-hover:text-[#8e9947] dark:group-hover:text-[#b6c173] transition-colors">
                    {article.title}
                  </h3>
                </Link>
              </div>

              <div className="pt-4 border-t border-[#e1e7d4] dark:border-[#2d3624] flex items-center justify-between mt-4">
                <span className="text-xs font-semibold text-[#788544] dark:text-[#a0ab6c]">
                  By {article.author?.fullName || article.author || "Editorial"}
                </span>
                <Link
                  href={articleLink}
                  className="w-8 h-8 rounded-full bg-[#b6c173] text-[#1b2111] flex items-center justify-center hover:bg-[#a3ae61] transition-all shadow-md shadow-[#b6c173]/25 android-haptic"
                >
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}