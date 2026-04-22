import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Стан для випадаючого меню
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Стан для форми пошуку
    const [searchQuery, setSearchQuery] = useState('');

    // Закриття меню при кліку поза його межами
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        setIsMenuOpen(false);
        logout();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Маршрутизація на майбутню сторінку пошуку з передачею query-параметра
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="h-16 bg-gray-900 border-b border-gray-800 text-white flex items-center justify-between px-4 lg:px-6 sticky top-0 z-50">

            {/* 1. ЛІВИЙ БЛОК: Логотип */}
            <div className="flex-shrink-0 w-32 md:w-48">
                <Link to="/" className="font-bold text-xl tracking-tight">
                    YouTube Clone
                </Link>
            </div>

            {/* 2. ЦЕНТРАЛЬНИЙ БЛОК: Пошук */}
            {/* hidden md:flex приховує пошук на мобільних пристроях для економії місця */}
            <form
                onSubmit={handleSearch}
                className="hidden md:flex flex-1 max-w-[600px] items-center mx-4"
            >
                <div className="flex w-full border border-gray-700 rounded-full overflow-hidden bg-gray-900 focus-within:border-blue-500">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Введіть запит"
                        className="w-full bg-transparent text-white px-4 py-2 focus:outline-none text-sm"
                    />
                    <button
                        type="submit"
                        className="bg-gray-800 px-5 py-2 border-l border-gray-700 hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                        {/* SVG іконка лупи */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </button>
                </div>
            </form>

            {/* 3. ПРАВИЙ БЛОК: Авторизація / Меню */}
            <div className="flex-shrink-0 w-32 md:w-48 flex justify-end items-center gap-4">
                {user ? (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white uppercase hover:ring-2 hover:ring-blue-400 transition-all focus:outline-none"
                            title={user.name}
                        >
                            {user.name?.charAt(0)}
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-12 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl flex flex-col py-2 overflow-hidden z-50">
                                <div className="px-4 py-3 border-b border-gray-800">
                                    <p className="text-sm font-medium truncate">{user.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                </div>

                                <div className="py-1">
                                    <Link
                                        to="/history"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                                    >
                                        Історія перегляду
                                    </Link>
                                </div>

                                <div className="border-t border-gray-800 py-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                                    >
                                        Вийти
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors whitespace-nowrap"
                    >
                        Увійти
                    </Link>
                )}
            </div>

        </header>
    );
}