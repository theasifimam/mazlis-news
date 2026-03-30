"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    FileEdit,
    BookOpen,
    Users,
    User,
    Hash,
    Bell,
    Search,
    LogOut,
    ChevronRight,
    PanelLeftClose,
    Sun,
    Moon,
    FileText,
    ShieldAlert,
    Cookie,
    HelpCircle,
    Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const NAV_ITEMS = [
    {
        group: 'Overview', items: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { name: 'My Profile', href: '/profile', icon: User },
        ]
    },
    {
        group: 'Content', items: [
            { name: 'Article Editor', href: '/articles/new', icon: FileEdit },
            { name: 'Drafts', href: '/articles/drafts', icon: BookOpen },
            { name: 'Published', href: '/articles/published', icon: BookOpen },
            { name: 'Topics', href: '/topics', icon: Hash },
        ]
    },
    {
        group: 'Management', items: [
            { name: 'Users', href: '/users', icon: Users },
            { name: 'Audit Logs', href: '/logs', icon: Bell },
        ]
    },
    {
        group: 'System Pages', items: [
            { name: 'About', href: '/legal/about', icon: Info },
            { name: 'Terms of Service', href: '/legal/terms-conditions', icon: ShieldAlert },
            { name: 'Privacy Policy', href: '/legal/privacy-policy', icon: FileText },
            { name: 'Cookie Policy', href: '/legal/cookie-usage', icon: Cookie },
            { name: 'Help & FAQ', href: '/legal/faq', icon: HelpCircle },
        ]
    },
];

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:5000';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    // Close mobile menu on path change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);


    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!loading && !user && pathname !== '/signin') {
            router.push('/signin');
        }
    }, [user, loading, pathname, router]);

    if (loading || !mounted || !user) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-zinc-900 border-t-[#E2FF54] rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 italic">Verifying Protocol Clearance...</span>
                </div>
            </div>
        );
    }

    const avatarUrl = user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${STORAGE_URL}${user.avatar}`) : user?.profilePicture?.url;

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-800 dark:text-zinc-400 overflow-hidden font-sans transition-colors duration-300">
            {/* Toggle Overlay for Mobile */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[221] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ 
                    width: isCollapsed ? 80 : 288,
                    x: isMobileMenuOpen ? 0 : (mounted && window.innerWidth < 1024 ? -288 : 0)
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-zinc-950/95 backdrop-blur-xl shrink-0 fixed lg:relative h-full transition-colors duration-300 z-[222] ${isMobileMenuOpen ? 'shadow-2xl shadow-black/50' : ''}`}
            >
                {/* Toggle Button (Desktop) */}
                <div className={`absolute top-8 z-[223] hidden lg:flex transition-all duration-300 ${isCollapsed ? 'right-0 translate-x-1/2 top-12' : 'right-4'}`}>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white shadow-sm ${isCollapsed ? 'scale-110' : ''}`}
                        title={isCollapsed ? "Expand" : "Collapse"}
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <PanelLeftClose size={20} />}
                    </button>
                </div>

                <div className={`p-8 pb-12 flex flex-col gap-1 ${isCollapsed ? 'items-center px-0' : ''}`}>
                    <Link href="/" className="font-outfit font-black text-2xl tracking-tighter text-black dark:text-white leading-none">
                        {isCollapsed ? 'M.' : 'MAZLIS.'}
                    </Link>
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-500 dark:text-zinc-600 truncate"
                            >
                                Control Hub
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="flex-1 px-4 flex flex-col gap-10 overflow-y-auto no-scrollbar">
                    {NAV_ITEMS.map((group) => (
                        <div key={group.group} className="flex flex-col gap-4">
                            <AnimatePresence mode="wait">
                                {!isCollapsed && (
                                    <motion.h3
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 dark:text-zinc-700 truncate"
                                    >
                                        {group.group}
                                    </motion.h3>
                                )}
                            </AnimatePresence>
                            <div className="flex flex-col gap-1">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            title={isCollapsed ? item.name : ""}
                                            className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                                ? 'bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white shadow-sm shadow-black/5 dark:shadow-zinc-950/50 border border-zinc-200 dark:border-zinc-800'
                                                : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/40 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer'
                                                } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-black dark:text-white' : 'text-zinc-500 dark:text-zinc-600 group-hover:text-zinc-800 dark:group-hover:text-zinc-400'} />
                                                {!isCollapsed && (
                                                    <span className={`text-[13px] font-bold tracking-tight uppercase ${isActive ? 'tracking-wider' : ''} truncate`}>
                                                        {item.name}
                                                    </span>
                                                )}
                                            </div>
                                            {!isCollapsed && isActive && (
                                                <motion.div layoutId="active" className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] dark:shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className={`p-6 mt-auto border-t border-zinc-200 dark:border-zinc-900 flex flex-col gap-4 transition-colors duration-300 ${isCollapsed ? 'items-center px-0' : ''}`}>
                    <Link href="/profile" className={`flex items-center gap-4 px-2 group/user cursor-pointer transition-opacity hover:opacity-80 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                        <Avatar className="w-11 h-11 border-2 border-zinc-200 dark:border-zinc-800/50 shadow-sm shrink-0 transition-transform group-hover/user:scale-105">
                            <AvatarImage src={avatarUrl || ""} className="object-cover" />
                            <AvatarFallback className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-black uppercase text-xs">
                                {user?.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || "AD"}
                            </AvatarFallback>
                        </Avatar>
                        {!isCollapsed && (
                            <div className="flex flex-col leading-tight truncate">
                                <span className="text-[13px] font-black text-black dark:text-white tracking-tight uppercase truncate">
                                    {user?.fullName || "Admin User"}
                                </span>
                                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-widest leading-none mt-0.5 truncate">
                                    {user?.role || "Primary Root"}
                                </span>
                            </div>
                        )}
                    </Link>
                    <div className="flex flex-col gap-1">
                        <button
                            title={isCollapsed ? (theme === 'dark' ? "Switch to Light Protocol" : "Switch to Dark Protocol") : ""}
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all text-zinc-500 dark:text-zinc-600 ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-widest truncate">{theme === 'dark' ? 'Light Protocol' : 'Dark Protocol'}</span>}
                        </button>
                        <button
                            title={isCollapsed ? "Terminate Session" : ""}
                            onClick={() => setIsLogoutDialogOpen(true)}
                            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-zinc-500 dark:text-zinc-600 ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            <LogOut size={16} />
                            {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-widest truncate">Terminate Session</span>}
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Panel */}
            <div className="flex-1 flex flex-col relative overflow-hidden transition-colors duration-300">
                {/* Global Masthead */}
                <header className="h-16 border-b border-zinc-200 dark:border-zinc-900 px-4 md:px-12 flex items-center justify-between bg-white/50 dark:bg-zinc-950/20 backdrop-blur-md z-40 transition-colors duration-300">
                    <div className="flex items-center gap-4 md:gap-8">
                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm active:scale-90"
                        >
                            <LayoutDashboard size={20} />
                        </button>
                        
                        <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-500 group cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <Search size={18} />
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] border-b border-transparent group-hover:border-zinc-400 dark:group-hover:border-zinc-500 pb-0.5 hidden md:inline">Global Protocol Search</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900/50 px-3 md:px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="hidden sm:inline">System Online</span>
                        </div>
                        <button className="relative w-9 h-9 md:w-10 md:h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all text-zinc-600 dark:text-zinc-400">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-zinc-950"></span>
                        </button>

                        <Link href="/profile" className="flex items-center gap-3 pl-3 md:pl-4 border-l border-zinc-200 dark:border-zinc-800 ml-1 md:ml-2 group/header-user cursor-pointer transition-opacity hover:opacity-80">
                            <div className="flex flex-col items-end leading-none hidden xs:flex">
                                <span className="text-[11px] font-black text-black dark:text-white uppercase truncate max-w-[100px] md:max-w-[120px]">
                                    {user?.fullName?.split(' ')[0] || "Admin"}
                                </span>
                                <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-widest mt-0.5">
                                    {user?.role || "Root"}
                                </span>
                            </div>
                            <Avatar className="w-9 h-9 md:w-10 md:h-10 border border-zinc-200 dark:border-zinc-800/50 shadow-sm shrink-0 transition-transform group-hover/header-user:scale-105">
                                <AvatarImage src={avatarUrl || ""} className="object-cover" />
                                <AvatarFallback className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-black uppercase text-xs">
                                    {user?.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || "AD"}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                    </div>
                </header>

                {/* Content Viewport */}
                <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.03),transparent)] dark:bg-[radial-gradient(circle_at_top_right,rgba(24,24,27,0.3),transparent)]">
                    {children}
                </main>
            </div>

            {/* Logout Confirmation Dialog */}
            <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                <DialogContent className="max-w-[400px] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 rounded-[32px] gap-8">
                    <DialogHeader className="gap-4">
                        <div className="w-16 h-16 rounded-[24px] bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                            <LogOut size={32} />
                        </div>
                        <DialogTitle className="text-2xl font-black font-outfit uppercase tracking-tighter text-zinc-900 dark:text-white leading-none">
                            Sign Out Now?
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-[13px] font-medium leading-relaxed">
                            You are about to sign out of Mazlis News. You'll need to re-authenticate to access your Intel library.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                        <Button
                            variant="ghost"
                            onClick={() => setIsLogoutDialogOpen(false)}
                            className="flex-1 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all h-12"
                        >
                            Stay Signed In
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setIsLogoutDialogOpen(false);
                                logout();
                            }}
                            className="flex-1 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-[11px] font-black uppercase tracking-widest transition-all h-12 shadow-lg shadow-red-500/20"
                        >
                            Confirm Sign Out
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
