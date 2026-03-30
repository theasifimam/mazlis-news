import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../api/authApi";

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isInitialized: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isInitialized = true;
            if (typeof window !== "undefined") {
                localStorage.setItem("mazlis_token", action.payload.token);
                localStorage.setItem("mazlis_user", JSON.stringify(action.payload.user));
            }
        },
        clearCredentials(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isInitialized = true;
            if (typeof window !== "undefined") {
                localStorage.removeItem("mazlis_token");
                localStorage.removeItem("mazlis_user");
            }
        },
        // Hydrate from localStorage on app load
        hydrateAuth(state) {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("mazlis_token");
                const userStr = localStorage.getItem("mazlis_user");
                if (token && userStr) {
                    try {
                        state.user = JSON.parse(userStr);
                        state.token = token;
                        state.isAuthenticated = true;
                    } catch {
                        // corrupted data
                    }
                }
                state.isInitialized = true;
            }
        },
        toggleBookmark(state, action: PayloadAction<string>) {
            if (state.user) {
                const articleId = action.payload;
                if (!state.user.bookmarks) state.user.bookmarks = [];
                
                const isBookmarked = state.user.bookmarks.some((b: any) => 
                    (typeof b === 'string' ? b : b._id) === articleId
                );

                if (isBookmarked) {
                    state.user.bookmarks = state.user.bookmarks.filter((b: any) => 
                        (typeof b === 'string' ? b : b._id) !== articleId
                    );
                } else {
                    state.user.bookmarks.push(articleId as any);
                }

                if (typeof window !== "undefined") {
                    localStorage.setItem("mazlis_user", JSON.stringify(state.user));
                }
            }
        },
    },
    extraReducers: (builder) => {
        // We can't import authApi here because of circular dependency
        // But we can listen for fulfilled actions if we want, or just update credentials manually in components
    },
});

export const { setCredentials, clearCredentials, hydrateAuth, toggleBookmark } = authSlice.actions;
export default authSlice.reducer;
