import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();

    // Стан для видимості меню
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Реф для прив'язки до контейнера меню
    const menuRef = useRef<HTMLDivElement>(null);

    // Закриття меню при кліку поза його межами
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Якщо меню відкрите і клік відбувся не по елементах всередині menuRef
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        // Обов'язкове очищення слухача при розмонтуванні компонента
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        setIsMenuOpen(false); // Закриваємо меню перед виходом
        logout();
    };

    return (
        <header className="h-16 bg-gray-900 border-b border-gray-800 text-white flex items-center justify-between px-6 sticky top-0 z-50">
            <Link to="/" className="font-bold text-xl">
                YouTube Clone
            </Link>

            <div className="flex items-center gap-4">
                {user ? (
                    // Контейнер з relative для правильного позиціонування absolute-меню
                    <div className="relative" ref={menuRef}>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white uppercase hover:ring-2 hover:ring-blue-400 transition-all focus:outline-none"
                            title={user.name}
                        >
                            {user.name?.charAt(0)}
                        </button>

                        {/* Випадаюче меню */}
                        {isMenuOpen && (
                            <div className="absolute right-0 top-12 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl flex flex-col py-2 overflow-hidden z-50">
                                {/* Інформація про користувача */}
                                <div className="px-4 py-3 border-b border-gray-800">
                                    <p className="text-sm font-medium truncate">{user.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                </div>

                                {/* Блок посилань */}
                                <div className="py-1">
                                    <Link
                                        to="/history"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                                    >
                                        Історія перегляду
                                    </Link>
                                </div>

                                {/* Блок деструктивних дій */}
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
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors"
                    >
                        Увійти
                    </Link>
                )}
            </div>
        </header>
    );
}