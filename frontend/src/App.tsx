import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import VideoPage from './pages/VideoPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import SearchPage from './pages/SearchPage';
import RegisterPage from "./pages/RegisterPage.tsx";
import HistoryPage from './pages/HistoryPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from "./pages/AdminPage.tsx";
import AdminCreateVideoPage from './pages/AdminCreateVideoPage';
import AdminEditVideoPage from './pages/AdminEditVideoPage';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="watch/:id" element={<VideoPage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="search" element={<SearchPage />} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="history" element={<HistoryPage />} />
                        </Route>
                        <Route element={<ProtectedRoute requiredRole="admin" />}>
                            <Route path="admin" element={<AdminPage />} />
                            <Route path="admin/create" element={<AdminCreateVideoPage />} />
                            <Route path="admin/edit/:id" element={<AdminEditVideoPage />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}