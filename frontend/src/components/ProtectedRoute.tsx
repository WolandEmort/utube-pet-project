import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    // Зроблено опціональним. Якщо не передати, перевірятиметься лише факт авторизації
    requiredRole?: string;
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
    const { user } = useAuth();

    // 1. Перевірка наявності авторизації
    if (!user) {
        // replace замінює поточний запис в history API, щоб користувач
        // не міг повернутися на захищену сторінку кнопкою "Назад"
        return <Navigate to="/login" replace />;
    }

    // 2. Перевірка ролі (якщо вона вимагається для цього маршруту)
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    // 3. Доступ дозволено, монтуємо вкладені компоненти
    return <Outlet />;
}