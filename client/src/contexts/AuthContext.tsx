import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authApi, getToken, setToken, removeToken, profileApi, Branch, Year, Section } from '@/services/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: {
        name: string;
        email: string;
        password: string;
        branch?: Branch;
        year?: Year;
        section?: Section;
        registrationNumber?: string;
    }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = getToken();
            if (token) {
                try {
                    const userData = await profileApi.get();
                    setUser(userData);
                } catch {
                    removeToken();
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authApi.login({ email, password });
        setToken(response.token);
        setUser(response.user);
    };

    const register = async (data: {
        name: string;
        email: string;
        password: string;
        branch?: Branch;
        year?: Year;
        section?: Section;
        registrationNumber?: string;
    }) => {
        const response = await authApi.register({ ...data, role: 'student' });
        setToken(response.token);
        setUser(response.user);
    };

    const logout = () => {
        removeToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
