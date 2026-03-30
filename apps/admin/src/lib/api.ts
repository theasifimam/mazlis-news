/**
 * Mazlis Admin Panel - API Utilities
 * Frontend API client scaffolding
 * 
 * NOTE: This is a placeholder implementation.
 * Replace base URL and implement actual endpoints when connecting to backend.
 */

import { getAuthHeaders, logout } from "./auth";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";


// Types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: any;
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ApiError {
    status: number;
    message: string;
    code?: string;
}

/**
 * Build full API URL
 */
function buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${cleanEndpoint}`;
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    // Handle errors (401, 403, 500, etc.)
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Return error details without forcing a logout to prevent unintended data loss in editors
        return {
            success: false,
            error: errorData.message || `Request failed with status ${response.status}`,
        };
    }

    // Parse successful response
    try {
        const data = await response.json();
        return { success: true, data };
    } catch {
        return { success: true };
    }
}

/**
 * Generic GET request
 */
export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(buildUrl(endpoint), {
            method: "GET",
            headers: {
                ...getAuthHeaders(),
                "ngrok-skip-browser-warning": "true"
            } as HeadersInit,
            credentials: "include", // Ensure cookies are sent
        });
        return handleResponse<T>(response);
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Network error",
        };
    }
}

/**
 * Generic POST request
 */
export async function apiPost<T>(
    endpoint: string,
    body?: unknown
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(buildUrl(endpoint), {
            method: "POST",
            headers: {
                ...getAuthHeaders(),
                "ngrok-skip-browser-warning": "true"
            } as HeadersInit,
            body: body ? JSON.stringify(body) : undefined,
            credentials: "include",
        });
        return handleResponse<T>(response);
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Network error",
        };
    }
}

/**
 * Generic PUT request
 */
export async function apiPut<T>(
    endpoint: string,
    body?: unknown
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(buildUrl(endpoint), {
            method: "PUT",
            headers: {
                ...getAuthHeaders(),
                "ngrok-skip-browser-warning": "true"
            } as HeadersInit,
            body: body ? JSON.stringify(body) : undefined,
            credentials: "include",
        });
        return handleResponse<T>(response);
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Network error",
        };
    }
}

/**
 * Generic PATCH request
 */
export async function apiPatch<T>(
    endpoint: string,
    body?: unknown
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(buildUrl(endpoint), {
            method: "PATCH",
            headers: {
                ...getAuthHeaders(),
                "ngrok-skip-browser-warning": "true"
            } as HeadersInit,
            body: body ? JSON.stringify(body) : undefined,
            credentials: "include",
        });
        return handleResponse<T>(response);
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Network error",
        };
    }
}

/**
 * Generic DELETE request
 */
export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(buildUrl(endpoint), {
            method: "DELETE",
            headers: {
                ...getAuthHeaders(),
                "ngrok-skip-browser-warning": "true"
            } as HeadersInit,
            credentials: "include",
        });
        return handleResponse<T>(response);
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Network error",
        };
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN API ENDPOINTS (Placeholders)
// ═══════════════════════════════════════════════════════════════════════════

export interface DataWrapper<T> {
    data: T;
}

/**
 * Admin Dashboard Stats
 */
export const dashboardApi = {
    getStats: () => apiGet<DataWrapper<DashboardStats>>("/admin/dashboard/stats"),
    getRecentActivity: () => apiGet<DataWrapper<Activity[]>>("/admin/dashboard/activity"),
    getEngagementStats: () => apiGet<DataWrapper<EngagementPoint[]>>("/admin/dashboard/engagement"),
    getGrowthStats: () => apiGet<DataWrapper<GrowthPoint[]>>("/admin/dashboard/growth"),
    getLogs: () => apiGet<DataWrapper<string[]>>("/admin/logs"),
};

/**
 * Users Management
 */
export const usersApi = {
    list: (params?: ListParams) =>
        apiGet<PaginatedResponse<User>>(`/admin/users?${new URLSearchParams(params as Record<string, string>)}`),
    get: (id: string) => apiGet<User>(`/admin/users/${id}`),
    update: (id: string, data: Partial<User>) => apiPatch<User>(`/admin/users/${id}`, data),
    suspend: (id: string, reason: string, duration?: string) => apiPost(`/admin/users/${id}/suspend`, { reason, duration }),
    unsuspend: (id: string) => apiPost(`/admin/users/${id}/unsuspend`),
    ban: (id: string, reason: string) => apiPost(`/admin/users/${id}/ban`, { reason }),
    unban: (id: string) => apiPost(`/admin/users/${id}/unban`),
    shadowRestrict: (id: string, enabled: boolean) => apiPost(`/admin/users/${id}/shadow-restrict`, { enabled }),
    warn: (id: string, templateId: string) => apiPost(`/admin/users/${id}/warn`, { templateId }),
    delete: (id: string) => apiDelete(`/admin/users/${id}`),
};

/**
 * Reports Management
 */
export const reportsApi = {
    list: (params?: ListParams) =>
        apiGet<PaginatedResponse<Report>>(`/admin/reports?${new URLSearchParams(params as Record<string, string>)}`),
    get: (id: string) => apiGet<Report>(`/admin/reports/${id}`),
    resolve: (id: string, action: ReportAction) => apiPost(`/admin/reports/${id}/resolve`, action),
    dismiss: (id: string, reason: string) => apiPost(`/admin/reports/${id}/dismiss`, { reason }),
};

/**
 * Content Management
 */
export const contentApi = {
    posts: {
        list: (params?: ListParams) => apiGet<PaginatedResponse<Post>>(`/admin/content/posts?${new URLSearchParams(params as Record<string, string>)}`),
        get: (id: string) => apiGet<Post>(`/admin/content/posts/${id}`),
        remove: (id: string, reason: string) => apiDelete(`/admin/content/posts/${id}?reason=${reason}`),
    },
    stories: {
        list: (params?: ListParams) => apiGet<PaginatedResponse<Story>>(`/admin/content/stories?${new URLSearchParams(params as Record<string, string>)}`),
        get: (id: string) => apiGet<Story>(`/admin/content/stories/${id}`),
        remove: (id: string, reason: string) => apiDelete(`/admin/content/stories/${id}?reason=${reason}`),
    },
    reels: {
        list: (params?: ListParams) => apiGet<PaginatedResponse<Reel>>(`/admin/content/reels?${new URLSearchParams(params as Record<string, string>)}`),
        get: (id: string) => apiGet<Reel>(`/admin/content/reels/${id}`),
        remove: (id: string, reason: string) => apiDelete(`/admin/content/reels/${id}?reason=${reason}`),
    },
};

/**
 * Article Management
 */
export const articlesApi = {
    list: (params?: { status?: 'draft' | 'published'; page?: string; limit?: string; topic?: string; author?: string }) =>
        apiGet<ApiResponse<Article[]>>(`/articles?${new URLSearchParams(params as Record<string, string>)}`),
    get: (id: string) => apiGet<ApiResponse<Article>>(`/articles/${id}`),
    create: (formData: FormData) => {
        // Special case for multipart/form-data: do not set Content-Type header
        const authHeaders = getAuthHeaders() as Record<string, string>;
        const headers: Record<string, string> = { ...authHeaders, "ngrok-skip-browser-warning": "true" };
        delete headers["Content-Type"];

        return fetch(buildUrl("/articles"), {
            method: "POST",
            headers: headers as HeadersInit,
            body: formData,
            credentials: "include",
        }).then(res => handleResponse<Article>(res));
    },
    update: (id: string, formData: FormData) => {
        // Special case for multipart/form-data: do not set Content-Type header
        const authHeaders = getAuthHeaders() as Record<string, string>;
        const headers: Record<string, string> = { ...authHeaders, "ngrok-skip-browser-warning": "true" };
        delete headers["Content-Type"];

        return fetch(buildUrl(`/articles/${id}`), {
            method: "PATCH",
            headers: headers as HeadersInit,
            body: formData,
            credentials: "include",
        }).then(res => handleResponse<Article>(res));
    },
    publish: (id: string) => apiPatch<Article>(`/articles/${id}/publish`),
    delete: (id: string) => apiDelete<ApiResponse<any>>(`/articles/${id}`),
};

/**
 * Topics Management
 */
export const topicsApi = {
    list: () => apiGet<ApiResponse<Topic[]>>("/topics"),
    create: (data: Partial<Topic>) => apiPost<Topic>("/topics", data),
    update: (id: string, data: Partial<Topic>) => apiPatch<Topic>(`/topics/${id}`, data),
    delete: (id: string) => apiDelete(`/topics/${id}`),
};

/**
 * Pages Management
 */
export const pagesApi = {
    list: () => apiGet<Page[]>("/pages"),
    get: (slug: string) => apiGet<Page>(`/pages/${slug}`),
    update: (slug: string, data: Partial<Page>) => apiPatch<Page>(`/pages/${slug}`, data),
};

/**
 * Trust & Abuse
 */
export const trustApi = {
    getOverview: () => apiGet<TrustOverview>("/admin/trust/overview"),
    getUserTrustScore: (userId: string) => apiGet<TrustScore>(`/admin/trust/users/${userId}`),
    getAbusePatterns: () => apiGet<AbusePattern[]>("/admin/trust/abuse-patterns"),
    getFlaggedUsers: () => apiGet<FlaggedUser[]>("/admin/trust/users/flagged"),
};

/**
 * Feedback & Support
 */
export const feedbackApi = {
    list: (params?: ListParams) => apiGet<PaginatedResponse<Feedback>>(`/support/admin/feedback?${new URLSearchParams(params as Record<string, string>)}`),
};

export const bugReportApi = {
    list: (params?: ListParams) => apiGet<PaginatedResponse<BugReport>>(`/support/admin/bug-reports?${new URLSearchParams(params as Record<string, string>)}`),
    update: (id: string, data: Partial<BugReport>) => apiPatch<BugReport>(`/support/admin/bug-reports/${id}`, data),
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS (Placeholder types for API responses)
// ═══════════════════════════════════════════════════════════════════════════

export interface FlaggedUser {
    userId: string;
    username: string;
    fullName: string;
    avatar?: string;
    trustScore: number;
    reportCount: number;
    riskLevel: string;
    status: string;
}

interface ListParams {
    page?: string;
    pageSize?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    status?: string;
}

interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    totalPosts: number;
    totalReports: number;
    pendingReports: number;
}

interface Activity {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    actor?: string;
}

interface User {
    _id: string;
    email: string;
    username: string;
    fullName: string;
    profilePicture?: { url: string };
    status: "active" | "suspended" | "deleted";
    createdAt: string;
    lastActiveAt?: string;
}

interface Report {
    id: string;
    type: "user" | "post" | "comment" | "story" | "reel";
    reason: string;
    status: "pending" | "resolved" | "dismissed";
    reporterId: string;
    targetId: string;
    createdAt: string;
}

interface ReportAction {
    action: "warn" | "remove_content" | "suspend_user" | "ban_user";
    note?: string;
}

interface Post {
    id: string;
    authorId: string;
    content: string;
    mediaUrls?: string[];
    status: "active" | "removed";
    createdAt: string;
}

interface Story {
    id: string;
    authorId: string;
    mediaUrl: string;
    expiresAt: string;
    status: "active" | "expired" | "removed";
    createdAt: string;
}

interface Reel {
    id: string;
    authorId: string;
    videoUrl: string;
    caption?: string;
    status: "active" | "removed";
    createdAt: string;
}

export interface Topic {
    _id: string;
    name: string;
    description?: string;
    articlesCount?: number;
    trend?: 'Rising' | 'Stable' | 'Declining' | 'New';
    isParent?: boolean;
    parent?: string;
}

export interface Article {
    _id: string;
    title: string;
    content: string;
    image: string;
    author: {
        _id: string;
        fullName: string;
        avatar?: string;
    };
    topic: Topic[];
    readCount: number;
    status: 'draft' | 'published';
    createdAt: string;
    updatedAt: string;
}

export interface TrustOverview {
    averageTrustScore: number;
    lowTrustUsers: number;
    flaggedContent: number;
    abuseIncidents: number;
}

interface TrustScore {
    userId: string;
    score: number;
    factors: {
        reportCount: number;
        warningCount: number;
        contentQuality: number;
        accountAge: number;
    };
}

export interface AbusePattern {
    id: string;
    type: string;
    description: string;
    occurrences: number;
    lastSeen: string;
}

export interface EngagementPoint {
    timestamp: string;
    value: number;
    label?: string;
}

export interface GrowthPoint {
    timestamp: string;
    value: number;
    label?: string;
}

export interface Feedback {
    _id: string;
    user: User;
    content: string;
    rating: number;
    category: string;
    createdAt: string;
}

export interface BugReport {
    _id: string;
    user: User;
    title: string;
    description: string;
    stepsToReproduce?: string;
    deviceInfo: {
        platform: string;
        version: string;
        appVersion: string;
        model: string;
    };
    severity: "low" | "medium" | "high" | "critical";
    status: "open" | "in_progress" | "resolved" | "closed";
    adminNotes?: string;
    createdAt: string;
}

export interface Page {
    _id: string;
    title: string;
    slug: string;
    content: string;
    lastUpdated: string;
}
