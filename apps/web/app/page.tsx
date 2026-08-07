"use client";

import React, { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SpotlightHero from "@/components/home/SpotlightHero";
import CategoryFilterBar from "@/components/home/CategoryFilterBar";
import BreakingNews from "@/components/home/BreakingNews";
import TechnicalAnalysis from "@/components/home/TechnicalAnalysis";
import NewsletterBanner from "@/components/home/NewsletterBanner";
import { useGetArticlesQuery } from "@/lib/api/articlesApi";
import { format } from "date-fns";

const CATEGORIES = [
  "ALL",
  "INVESTIGATION",
  "TECHNOLOGY",
  "PHILOSOPHY",
  "ARCHITECTURE",
  "SYSTEMS",
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const { data: response, isLoading } = useGetArticlesQuery({ limit: 16 });
  const articles = response?.data || [];

  const formattedArticles = useMemo(() => {
    return articles.map((a: any) => ({
      ...a,
      id: a._id,
      category: a.topic?.[0]?.name || "INVESTIGATION",
      imageUrl: a.image,
      author: a.author?.fullName || "Anonymous",
      date: a.createdAt
        ? format(new Date(a.createdAt), "MMM dd, yyyy")
        : "Recent",
    }));
  }, [articles]);

  const leadArticle = formattedArticles[0];
  const trendingArticles = useMemo(
    () => formattedArticles.slice(1, 5),
    [formattedArticles],
  );

  const mostReadArticles = useMemo(() => {
    return [...formattedArticles]
      .sort((a: any, b: any) => (b.readCount || 0) - (a.readCount || 0))
      .slice(0, 3);
  }, [formattedArticles]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500">
      <Header />

      <main className="flex-1 w-full pb-20 flex flex-col">
        {/* Spotlight Hero Section */}
        {!isLoading && leadArticle ? (
          <SpotlightHero
            leadArticle={leadArticle}
            trendingArticles={trendingArticles}
          />
        ) : (
          <div className="max-w-350 mx-auto px-6 lg:px-12 w-full pt-28 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-137.5">
              <div className="lg:col-span-7 rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
              <div className="lg:col-span-5 rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
            </div>
          </div>
        )}

        {/* Content Island with Topic Filtering */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full pt-10 flex flex-col gap-16">
          {/* Interactive Category Filter Pills */}
          <CategoryFilterBar
            categories={CATEGORIES}
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Breaking / Main Articles Grid */}
          {!isLoading ? (
            <BreakingNews
              articles={formattedArticles}
              selectedCategory={selectedCategory}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col gap-4 animate-pulse">
                  <div className="aspect-4/3 w-full rounded-4xl bg-zinc-100 dark:bg-zinc-900" />
                  <div className="h-6 w-3/4 bg-zinc-100 dark:bg-zinc-900 rounded-md" />
                </div>
              ))}
            </div>
          )}

          {/* Newsletter Banner */}
          <div className="py-8">
            <NewsletterBanner />
          </div>

          {/* Intelligence & Technical Analysis Section */}
          {!isLoading && (
            <div className="pb-16 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-16">
              <TechnicalAnalysis articles={mostReadArticles} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
