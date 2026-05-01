import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MOCK_USERS } from '../data/mockUsers';
import { useAuth } from '../context/AuthContext';
import { uiLabels } from '../constants/labels';

// Визначаємо ліміти згідно із загальними стандартами
const MAX_EMAIL_LENGTH = 100;
const MAX_PASSWORD_LENGTH = 128;

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Імпортуємо конфігурацію текстів для сторінки авторизації
    const { auth } = uiLabels;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [toastMessage, setToastMessage] = useState<string>(() => {
        return location.state?.toastMessage || '';
    });

    useEffect(() => {
        if (toastMessage) {
            window.history.replaceState({}, document.title);

            const timer = setTimeout(() => {
                setToastMessage('');
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);

        if (foundUser) {
            login({
                id: foundUser.id,
                email: foundUser.email,
                name: foundUser.name,
                role: foundUser.role
            });
            navigate('/');
        } else {
            // Використовуємо текст помилки з конфігурації
            setError(auth.errorInvalidData);
        }
    };

    return (
        <div className="relative flex items-center justify-center h-full min-h-[80vh] w-full">

            {toastMessage && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 transition-opacity duration-300 border border-blue-500">
                    {toastMessage}
                </div>
            )}

            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-white text-center">
                    {auth.loginTitle}
                </h2>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400">
                            {auth.emailLabel}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.slice(0, MAX_EMAIL_LENGTH))}
                            required
                            maxLength={MAX_EMAIL_LENGTH}
                            className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder={auth.emailPlaceholder}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400">
                            {auth.passwordLabel}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value.slice(0, MAX_PASSWORD_LENGTH))}
                            required
                            maxLength={MAX_PASSWORD_LENGTH}
                            className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder={auth.passwordPlaceholder}
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-2 transition-colors"
                    >
                        {auth.submitBtn}
                    </button>
                </form>

                <p className="text-gray-400 text-sm text-center">
                    {auth.noAccountText}{' '}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        {auth.registerLink}
                    </Link>
                </p>
            </div>
        </div>
    );
}