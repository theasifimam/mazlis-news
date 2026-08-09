import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-[#191f13] text-[#1b2111] dark:text-[#f2f5e8] pt-12 pb-28 md:pb-12 px-6 lg:px-12 border-t border-[#e1e7d4] dark:border-[#2d3624] mt-auto">
      <div className="max-w-350 mx-auto flex flex-col lg:flex-row justify-between items-start gap-12 border-b border-[#e1e7d4] dark:border-[#2d3624] pb-10">

        {/* Brand */}
        <div className="flex flex-col gap-4 max-w-sm">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#b6c173] text-[#1b2111] flex items-center justify-center font-bold text-xs shadow-md shadow-[#b6c173]/25">
              M
            </span>
            <span className="font-outfit font-black text-2xl tracking-tight text-[#1b2111] dark:text-[#f2f5e8]">
              MAZLIS<span className="text-[#8e9947] dark:text-[#b6c173]">.</span>
            </span>
          </Link>
          <p className="text-xs font-medium text-[#788544] dark:text-[#a0ab6c] leading-relaxed">
            An independent publication dedicated to systems architecture, technology, and intelligence.
          </p>
        </div>

        {/* Dynamic Navigation */}
        <div className="flex flex-wrap gap-8 sm:gap-16">
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8e9947] dark:text-[#b6c173]">Directory</h4>
            <nav className="flex flex-col gap-2 text-xs font-semibold">
              <Link href="/about" className="text-[#4a5426] dark:text-[#c4cb9a] hover:text-[#8e9947] dark:hover:text-[#b6c173] transition-colors">About Us</Link>
              <Link href="/contact" className="text-[#4a5426] dark:text-[#c4cb9a] hover:text-[#8e9947] dark:hover:text-[#b6c173] transition-colors">Contact</Link>
              <Link href="/legal/faq" className="text-[#4a5426] dark:text-[#c4cb9a] hover:text-[#8e9947] dark:hover:text-[#b6c173] transition-colors">Help & FAQ</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8e9947] dark:text-[#b6c173]">Legal Policies</h4>
            <nav className="flex flex-col gap-2 text-xs font-semibold">
              <Link href="/legal/privacy-policy" className="text-[#4a5426] dark:text-[#c4cb9a] hover:text-[#8e9947] dark:hover:text-[#b6c173] transition-colors">Privacy Policy</Link>
              <Link href="/legal/terms-conditions" className="text-[#4a5426] dark:text-[#c4cb9a] hover:text-[#8e9947] dark:hover:text-[#b6c173] transition-colors">Terms of Service</Link>
              <Link href="/legal/cookie-usage" className="text-[#4a5426] dark:text-[#c4cb9a] hover:text-[#8e9947] dark:hover:text-[#b6c173] transition-colors">Cookie Usage</Link>
            </nav>
          </div>
        </div>

      </div>

      {/* Bottom Status Bar */}
      <div className="max-w-350 mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#788544] dark:text-[#a0ab6c]">
        <p>&copy; {new Date().getFullYear()} MAZLIS NEWS. All rights reserved.</p>
        <span className="text-xs text-[#788544] dark:text-[#a0ab6c]">Pixel Tablet UI • #B6C173 Accent</span>
      </div>
    </footer>
  );
}