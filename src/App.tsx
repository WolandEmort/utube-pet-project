import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage'; // Імпортуємо створену сторінку

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>

                    {/* Властивість index вказує, що HomePage відрендериться за замовчуванням для шляху "/" */}
                    <Route index element={<HomePage />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}