import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, ArrowUpRight } from "lucide-react";
import { getImageUrl } from "@/lib/config";
import BookmarkButton from "./BookmarkButton";

export default function ArticleCard({ article, variant = "horizontal" }) {
  const articleLink = `/articles/${article.slug}-${article.id}`;

  if (variant === "vertical") {
    return (
      <div className="flex flex-col gap-4 group cursor-pointer p-4 sm:p-5 rounded-[2.25rem] bg-white dark:bg-[#191f13] border border-[#e1e7d4] dark:border-[#2d3624] shadow-xs hover:shadow-xl transition-all duration-300 android-tile android-haptic">
        
        {/* Cover Image Frame */}
        <div className="relative aspect-[16/10] w-full rounded-[1.75rem] overflow-hidden bg-[#edf1e4] dark:bg-[#21281a] border border-[#e1e7d4]/60 dark:border-[#2d3624]">
          <Link href={articleLink} className="block w-full h-full">
            <Image
              src={getImageUrl(article.imageUrl)}
              alt={article.title || "Mazlis News Article"}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              unoptimized
            />
          </Link>

          {/* Category Chip Badge */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="px-3.5 py-1.5 rounded-full bg-[#b6c173] text-[#1b2111] text-[10px] font-bold shadow-md shadow-[#b6c173]/25 tracking-wider uppercase">
              {article.category || "FEATURED"}
            </span>
          </div>

          {/* Glass Bookmark Pill */}
          <div className="absolute top-3.5 right-3.5 z-20">
            <BookmarkButton articleId={article.id} className="bg-black/30! text-white! backdrop-blur-md! border-white/20! p-2.5! rounded-full! hover:bg-[#b6c173]! hover:text-[#1b2111]!" />
          </div>
        </div>

        {/* Content Details */}
        <div className="flex flex-col gap-2.5 px-1 pb-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#788544] dark:text-[#a0ab6c]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#b6c173] text-[#1b2111] text-[10px] font-black flex items-center justify-center">
                {article.author?.charAt(0) || "M"}
              </div>
              <span className="text-[#8e9947] dark:text-[#b6c173] font-bold">
                {article.author}
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-[11px]">
              <Clock size={12} className="text-[#8e9947] dark:text-[#b6c173]" />
              {article.date}
            </span>
          </div>

          <Link href={articleLink}>
            <h3 className="text-base sm:text-lg font-bold font-outfit leading-tight line-clamp-2 text-[#1b2111] dark:text-[#f2f5e8] group-hover:text-[#8e9947] dark:group-hover:text-[#b6c173] transition-colors">
              {article.title}
            </h3>
          </Link>
        </div>

      </div>
    );
  }

  return (
    <div className="flex gap-4 items-center group p-3.5 rounded-[1.75rem] bg-white dark:bg-[#191f13] border border-[#e1e7d4] dark:border-[#2d3624] shadow-xs hover:shadow-lg transition-all duration-300 android-tile android-haptic relative cursor-pointer">
      <Link
        href={articleLink}
        className="relative w-22 h-22 shrink-0 rounded-[1.35rem] overflow-hidden bg-[#edf1e4] dark:bg-[#21281a] border border-[#e1e7d4]/60 dark:border-[#2d3624]"
      >
        <Image
          src={getImageUrl(article.imageUrl)}
          alt={article.title || "Mazlis News Article"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
      </Link>

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <Link href={articleLink}>
          <h3 className="text-sm font-bold font-outfit leading-snug line-clamp-2 text-[#1b2111] dark:text-[#f2f5e8] group-hover:text-[#8e9947] dark:group-hover:text-[#b6c173] transition-colors">
            {article.title}
          </h3>
        </Link>
        <div className="flex items-center gap-3 text-xs font-semibold text-[#788544] dark:text-[#a0ab6c]">
          <div className="flex items-center gap-1 text-[#8e9947] dark:text-[#b6c173]">
            <Clock size={12} />
            <span>{article.date}</span>
          </div>
          {article.views && (
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{article.views.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0">
        <BookmarkButton
          articleId={article.id}
          className="bg-transparent! text-[#788544]! hover:text-[#1b2111]! dark:hover:text-white! p-2! border-none! shadow-none!"
        />
      </div>
    </div>
  );
}