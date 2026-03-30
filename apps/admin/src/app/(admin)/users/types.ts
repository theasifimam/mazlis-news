import { 
    ShieldCheck, 
    ShieldAlert, 
    Shield, 
    Users,
    Mail,
    Activity,
    MoreVertical
} from 'lucide-react';

export interface User {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    role: "reader" | "author" | "editor" | "admin";
    status: "active" | "suspended" | "pending";
    isVerified: boolean;
    avatar?: string;
    createdAt: string;
    lastLogin?: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export const ROLE_CONFIG = {
    admin: { label: "Admin", icon: ShieldCheck, color: "text-emerald-600 dark:text-emerald-500" },
    editor: { label: "Editor", icon: ShieldAlert, color: "text-blue-600 dark:text-blue-500" },
    author: { label: "Author", icon: Shield, color: "text-violet-600 dark:text-violet-500" },
    reader: { label: "Reader", icon: Shield, color: "text-zinc-500 dark:text-zinc-400" },
};

export const STATUS_CONFIG = {
    active: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-500" },
    suspended: { dot: "bg-red-500", text: "text-red-600 dark:text-red-500" },
    pending: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-500" },
};

export const initials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || "??";
export const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
