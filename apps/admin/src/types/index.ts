/**
 * Mazlis Admin Panel - Type Definitions
 */

// ═══════════════════════════════════════════════════════════════════════════
// USER TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type UserRole = "user" | "moderator" | "admin" | "super_admin";
export type UserStatus = "active" | "suspended" | "deleted";

export interface User {
    id: string;
    email: string;
    username: string;
    name: string;
    avatar?: string;
    role: UserRole;
    status: UserStatus;
    trustScore: number;
    createdAt: string;
    lastActiveAt?: string;
}

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: "super_admin" | "admin" | "moderator";
    avatar?: string;
    createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ContentType = "post" | "story" | "reel" | "comment";
export type ContentStatus = "active" | "removed" | "expired";

export interface Post {
    id: string;
    authorId: string;
    author?: User;
    content: string;
    mediaUrls?: string[];
    status: ContentStatus;
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    updatedAt?: string;
}

export interface Story {
    id: string;
    authorId: string;
    author?: User;
    mediaUrl: string;
    mediaType: "image" | "video";
    viewsCount: number;
    status: ContentStatus;
    expiresAt: string;
    createdAt: string;
}

export interface Reel {
    id: string;
    authorId: string;
    author?: User;
    videoUrl: string;
    thumbnailUrl?: string;
    caption?: string;
    duration: number;
    viewsCount: number;
    likesCount: number;
    status: ContentStatus;
    createdAt: string;
}

export interface Comment {
    id: string;
    authorId: string;
    author?: User;
    parentId: string;
    parentType: "post" | "reel";
    content: string;
    likesCount: number;
    status: ContentStatus;
    createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// REPORT TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ReportType = "user" | "post" | "comment" | "story" | "reel";
export type ReportStatus = "pending" | "resolved" | "dismissed";
export type ReportReason =
    | "spam"
    | "harassment"
    | "hate_speech"
    | "violence"
    | "nudity"
    | "misinformation"
    | "copyright"
    | "other";

export interface Report {
    id: string;
    type: ReportType;
    reason: ReportReason;
    description?: string;
    status: ReportStatus;
    reporterId: string;
    reporter?: User;
    targetId: string;
    targetType: ReportType;
    resolution?: ReportResolution;
    createdAt: string;
    resolvedAt?: string;
}

export interface ReportResolution {
    action: "warn" | "remove_content" | "suspend_user" | "ban_user" | "no_action";
    note?: string;
    resolvedBy: string;
    resolvedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TRUST & ABUSE TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type TrustLevel = "excellent" | "good" | "moderate" | "low" | "critical";

export interface TrustScore {
    userId: string;
    score: number;
    level: TrustLevel;
    factors: TrustFactors;
    history: TrustHistoryEntry[];
    updatedAt: string;
}

export interface TrustFactors {
    reportCount: number;
    warningCount: number;
    contentQuality: number;
    accountAge: number;
    verificationStatus: boolean;
    engagementQuality: number;
}

export interface TrustHistoryEntry {
    date: string;
    score: number;
    change: number;
    reason: string;
}

export interface AbusePattern {
    id: string;
    type: string;
    description: string;
    severity: "low" | "medium" | "high" | "critical";
    occurrences: number;
    affectedUsers: number;
    detectedAt: string;
    lastSeenAt: string;
    status: "active" | "mitigated" | "resolved";
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    totalPosts: number;
    totalStories: number;
    totalReels: number;
    totalReports: number;
    pendingReports: number;
    averageTrustScore: number;
}

export interface ActivityItem {
    id: string;
    type: "report" | "action" | "resolved" | "system";
    description: string;
    actor?: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════════════
// API TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasMore: boolean;
}

export interface ListParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICATION TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type NotificationType =
    | "new_report"
    | "trust_alert"
    | "user_appeal"
    | "system_update"
    | "action_required";

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    actionUrl?: string;
    createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS TYPES
// ═══════════════════════════════════════════════════════════════

export interface AdminSettings {
    notifications: NotificationSettings;
    security: SecuritySettings;
    display: DisplaySettings;
}

export interface NotificationSettings {
    newReports: boolean;
    trustAlerts: boolean;
    userAppeals: boolean;
    systemUpdates: boolean;
}

export interface SecuritySettings {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    apiAccessEnabled: boolean;
}

export interface DisplaySettings {
    theme: "dark" | "light" | "system";
    language: string;
    timezone: string;
    dateFormat: string;
}
