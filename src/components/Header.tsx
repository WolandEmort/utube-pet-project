import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="h-16 bg-gray-900 border-b border-gray-800 text-white flex items-center justify-between px-6 sticky top-0 z-50">
            <Link to="/" className="font-bold text-xl">
                YouTube Clone
            </Link>

            <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors"
            >
                Увійти
            </Link>
        </header>
    );
}