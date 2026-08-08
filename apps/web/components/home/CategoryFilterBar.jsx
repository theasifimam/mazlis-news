"use client";

import { motion } from "framer-motion";







export default function CategoryFilterBar({
  categories,
  activeCategory,
  onSelectCategory
}) {
  return (
    <div className="w-full border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4 mb-10 transition-all">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar min-w-max">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mr-2 shrink-0">
          Topics:
        </span>
        {categories.map((cat) => {
          const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              isActive ?
              "text-white dark:text-zinc-950 font-black" :
              "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"}`
              }>
              
              {isActive &&
              <motion.div
                layoutId="activeCategoryPill"
                className="absolute inset-0 bg-zinc-900 dark:bg-white rounded-full -z-10 shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }} />

              }
              <span
                className={`relative z-10 ${isActive ? "text-white dark:text-zinc-950" : ""}`}>
                
                {cat}
              </span>
            </button>);

        })}
      </div>
    </div>);

}