import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import VideoPage from './pages/VideoPage'; // Додано імпорт

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />

                    {/* Додано маршрут для сторінки відео */}
                    <Route path="watch/:id" element={<VideoPage />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}