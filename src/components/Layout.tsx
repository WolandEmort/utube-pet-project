import { Outlet } from 'react-router-dom';
import Header from './Header'; // Якщо перейменуєш файли, зміни на './Header'
import Footer from './Footer'; // Якщо перейменуєш файли, зміни на './Footer'

export default function Layout() {
    return (
        // min-h-screen гарантує, що контейнер займе мінімум 100% висоти вікна браузера
        // flex-col вибудовує елементи (header, main, footer) вертикально
        <div className="min-h-screen flex flex-col bg-gray-950">

            <Header />
            <main className="flex-1 flex flex-col text-white">
                <Outlet />
            </main>

            <Footer />

        </div>
    );
}