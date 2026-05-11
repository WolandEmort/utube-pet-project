import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uiLabels } from '../constants/labels';

const MAX_EMAIL_LENGTH = 100;
const MAX_PASSWORD_LENGTH = 128;

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const { auth } = uiLabels;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Стан для блокування форми під час відправки запиту
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Функція тепер асинхронна
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // Викликаємо метод з AuthContext, який робить fetch до PHP-бекенду
            await login(email, password);

            // Якщо Promise вирішився успішно (помилок не було), переходимо на головну сторінку
            navigate('/');
        } catch (err) {
            // Перехоплюємо помилку, яку згенерував throw new Error() у AuthContext
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(auth.errorInvalidData);
            }
        } finally {
            // Знімаємо блокування кнопки незалежно від результату (успіх чи помилка)
            setIsSubmitting(false);
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
                            disabled={isSubmitting}
                            className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
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
                            disabled={isSubmitting}
                            className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                            placeholder={auth.passwordPlaceholder}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-2 transition-colors disabled:opacity-50 flex justify-center items-center"
                    >
                        {isSubmitting ? 'Завантаження...' : auth.submitBtn}
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