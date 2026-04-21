import { createContext, useContext, useState } from 'react';
// Явний імпорт типів
import type { ReactNode } from 'react';
import type { User } from '../data/mockUsers';

interface AuthContextType {
    user: Partial<User> | null;
    login: (userData: Partial<User>) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // Синхронна ініціалізація стану без useEffect
    const [user, setUser] = useState<Partial<User> | null>(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData: Partial<User>) => {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}


// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}