import React, { useState, useEffect, type ReactNode } from 'react';
import { AuthContext, type AuthContextType } from './AuthContext';
import { LoginService } from '../../features/login/services/LoginService';
import type { User } from '../../features/login/model/User';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Verificar si hay sesión guardada al montar el componente
    useEffect(() => {
        const savedUser: User | null = JSON.parse(sessionStorage.getItem('user') || '{}');
        console.log(savedUser);

        if (savedUser) {
            setIsAuthenticated(true);
            setUser(savedUser);
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<void> => {
        setLoading(true);
        try {
            const response = await LoginService.login(username, password);
            console.log(response);
            if (response.user) {
                setIsAuthenticated(true);
                setUser(response.user);
                sessionStorage.setItem('user', JSON.stringify(response.user));
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        sessionStorage.removeItem('user');
    };

    const value: AuthContextType = {
        isAuthenticated,
        user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
