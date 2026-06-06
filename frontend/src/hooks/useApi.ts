import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// eslint-disable-next-line
interface FetchOptions extends RequestInit {
}

export function useApi() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const request = useCallback(async (endpoint: string, options: FetchOptions = {}) => {
        const headers = new Headers(options.headers || {});

        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }

        if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
            headers.append('Content-Type', 'application/json');
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // Глобальне перехоплення помилки авторизації
        if (response.status === 401) {
            logout();
            navigate('/login');
            throw new Error('Сесія закінчилась. Будь ласка, авторизуйтесь знову.');
        }

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        }

        if (!response.ok) {
            const errorMessage = data?.error || `HTTP помилка: статускод ${response.status}`;
            throw new Error(errorMessage);
        }

        return data;
    }, [token, logout, navigate]); // Залежності, які використовуються всередині useCallback

    return { request };
}