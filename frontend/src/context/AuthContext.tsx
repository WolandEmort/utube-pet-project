import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// 1. Інтерфейс відповідає структурі даних з БД (id, name, email)
export interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:8080';

export function AuthProvider({ children }: { children: ReactNode }) {
    // Синхронна ініціалізація стану
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        // Якщо сервер повертає статус 400, 401 тощо, response.ok буде false
        if (!response.ok) {
            throw new Error(data.error || 'Помилка авторизації');
        }

        // Зберігаємо дані після успішної відповіді 200 OK
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        setUser(data.user);
    };

    const register = async (name: string, email: string, password: string) => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        // Якщо сервер повертає статус 409 (дубль email) або 400, генеруємо помилку
        if (!response.ok) {
            throw new Error(data.error || 'Помилка реєстрації');
        }

        // Після успішного створення одразу виконуємо логін
        await login(email, password);
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
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