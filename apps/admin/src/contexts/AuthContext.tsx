'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useRouter, usePathname } from 'next/navigation';

interface User {
    _id: string;
    id?: string;
    username: string;
    email: string;
    role: string;
    fullName: string;
    avatar?: string;
    profilePicture?: {
        url: string;
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    checkUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data.data.user);
        } catch (error) {
            console.error('Session check failed:', error);
            setUser(null);
            if (pathname !== '/signin') {
                router.push('/signin');
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: any) => {
        const { data } = await api.post('/auth/admin/signin', credentials);
        const user = data.data.user;
        const token = data.data.token;

        setUser(user);
        
        // Sync with lib/auth.ts storage keys
        if (typeof window !== 'undefined') {
            localStorage.setItem('mazlis_admin_token', token);
            localStorage.setItem('mazlis_admin_user', JSON.stringify(user));
        }

        router.push('/dashboard');
    };

    const logout = async () => {
        try {
            await api.post('/auth/signout');
            setUser(null);
            router.push('/signin');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
