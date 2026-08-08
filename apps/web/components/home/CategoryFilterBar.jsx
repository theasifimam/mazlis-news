"use client";

import { motion } from "framer-motion";







const CATEGORY_ICONS = {
  ALL: "🌟",
  INVESTIGATION: "🛡️",
  TECHNOLOGY: "⚡",
  PHILOSOPHY: "💡",
  ARCHITECTURE: "🏛️",
  SYSTEMS: "⚙️",
};

export default function CategoryFilterBar({
  categories,
  activeCategory,
  onSelectCategory
}) {
  return (
    <div className="w-full pb-2 mb-6 transition-all">
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2">
        {categories.map((cat) => {
          const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
          const icon = CATEGORY_ICONS[cat.toUpperCase()] || "📌";

          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`relative px-5 py-2.5 rounded-full text-xs font-bold transition-all android-haptic shrink-0 flex items-center gap-2 ${
                isActive
                  ? "bg-[#b6c173] text-[#1b2111] shadow-md shadow-[#b6c173]/30"
                  : "bg-white dark:bg-[#191f13] border border-[#e1e7d4] dark:border-[#2d3624] text-[#4a5426] dark:text-[#c4cb9a] hover:bg-[#edf1e4] dark:hover:bg-[#21281a]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 bg-[#b6c173] rounded-full -z-10 shadow-md shadow-[#b6c173]/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="text-sm">{icon}</span>
              <span className="relative z-10 font-outfit uppercase tracking-wider text-[11px]">
                {cat}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}