"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import dynamic from "next/dynamic";
import { ThemeToggle } from "./ThemeToggle";
import AuthModal from "./AuthModal";
import { LogOut, Menu, ArrowLeft, Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearCredentials } from "@/lib/store/authSlice";
import { useSignoutMutation } from "@/lib/api/authApi";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

// Dynamic imports for improved initial load performance
const Sidebar = dynamic(() => import("./header/Sidebar"), { ssr: false });
const LogoutConfirm = dynamic(() => import("./header/LogoutConfirm"), {
  ssr: false,
});

export default function Header() {
  const [currentTime, setCurrentTime] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [authTab, setAuthTab] = useState("signin");

  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isInitialized } = useAppSelector(
    (s) => s.auth,
  );
  const [signout] = useSignoutMutation();

  const handleLogout = async () => {
    try {
      await signout().unwrap();
    } catch {
      /* ignore */
    } finally {
      dispatch(clearCredentials());
      setIsLogoutConfirmOpen(false);
      setIsMenuOpen(false);
      toast.success("Signed out successfully.");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Articles", href: "/articles" },
    { label: "About", href: "/about" },
  ];

  const pathname = usePathname();
  const isArticlePage = pathname.includes("/articles/");

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 pt-4 transition-all duration-300">
        <div className="max-w-350 mx-auto bg-white/95 dark:bg-[#1a1c18]/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-full px-5 md:px-6 h-14 md:h-16 flex items-center justify-between shadow-md transition-all duration-300">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            {isArticlePage ? (
              <Link
                href="/"
                className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/60 android-haptic text-slate-800 dark:text-slate-100"
              >
                <ArrowLeft size={20} strokeWidth={2} />
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/60 android-haptic md:hidden text-slate-800 dark:text-slate-100"
                >
                  <Menu size={20} strokeWidth={2} />
                </button>

                <Link href="/" className="flex items-center gap-2 group">
                  <span className="w-8 h-8 rounded-full bg-[#5d6b33] dark:bg-[#c2d08a] text-white dark:text-[#2d340e] flex items-center justify-center font-bold text-xs shadow-md shadow-[#5d6b33]/25">
                    M
                  </span>
                  <span className="hidden min-[380px]:inline-block font-outfit font-black text-xl tracking-tight text-slate-900 dark:text-white">
                    MAZLIS<span className="text-[#5d6b33] dark:text-[#c2d08a]">.</span>
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/50 p-1 rounded-full border border-slate-200/50 dark:border-slate-700/50">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all android-haptic ${
                    isActive
                      ? "bg-[#5d6b33] dark:bg-[#c2d08a] text-white dark:text-[#2d340e] shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/search"
              className="hidden sm:inline-flex p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 android-haptic"
              title="Search"
            >
              <Search size={18} />
            </Link>

            {!isInitialized ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 android-haptic text-xs font-bold text-slate-850 dark:text-slate-200"
                >
                  <span className="w-5.5 h-5.5 rounded-full bg-[#5d6b33] dark:bg-[#c2d08a] text-white dark:text-[#2d340e] text-[10px] flex items-center justify-center font-black">
                    {user.fullName?.[0]?.toUpperCase() || "U"}
                  </span>
                  <span className="hidden sm:inline">
                    {user.fullName.split(" ")[0]}
                  </span>
                </Link>
                <button
                  onClick={() => setIsLogoutConfirmOpen(true)}
                  className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500 transition-colors android-haptic"
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthTab("signin");
                  setIsAuthOpen(true);
                }}
                className="px-5 py-1.5 rounded-full bg-[#5d6b33] dark:bg-[#c2d08a] text-white dark:text-[#2d340e] text-xs font-bold shadow-md shadow-[#5d6b33]/20 android-haptic"
              >
                Sign In
              </button>
            )}

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-800" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <Sidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        isAuthenticated={isAuthenticated}
        isInitialized={isInitialized}
        onLogoutClick={() => setIsLogoutConfirmOpen(true)}
        onSignInClick={() => {
          setIsMenuOpen(false);
          setAuthTab("signin");
          setIsAuthOpen(true);
        }}
        navLinks={navLinks}
        currentTime={currentTime}
      />

      <LogoutConfirm
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onOpenChange={setIsAuthOpen}
        defaultTab={authTab}
      />
    </>
  );
}
