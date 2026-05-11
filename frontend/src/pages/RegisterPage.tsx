import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uiLabels } from '../constants/labels';

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 100;
const MAX_PASSWORD_LENGTH = 128;

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    // Деструктуризуємо і спільні тексти (auth), і специфічні для реєстрації (register)
    const { auth, register: registerLabels } = uiLabels;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(registerLabels.errorUnknown);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center h-full min-h-[80vh] w-full">
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-white text-center">
                    {registerLabels.title}
                </h2>

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400">
                            {registerLabels.nameLabel}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
                            required
                            maxLength={MAX_NAME_LENGTH}
                            disabled={isSubmitting}
                            className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                            placeholder={registerLabels.namePlaceholder}
                        />
                    </div>

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
                        {isSubmitting ? registerLabels.loadingBtn : registerLabels.submitBtn}
                    </button>
                </form>

                <p className="text-gray-400 text-sm text-center">
                    {registerLabels.haveAccountText}{' '}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        {registerLabels.loginLink}
                    </Link>
                </p>
            </div>
        </div>
    );
}