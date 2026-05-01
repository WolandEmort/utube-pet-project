import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import VideoPage from './pages/VideoPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import SearchPage from './pages/SearchPage';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="watch/:id" element={<VideoPage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="search" element={<SearchPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}