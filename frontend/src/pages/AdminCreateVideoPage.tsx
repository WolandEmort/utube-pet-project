import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uiLabels } from '../constants/labels';

export default function AdminCreateVideoPage() {
    const navigate = useNavigate();
    const { admin } = uiLabels;

    // Стан для форми. Поля відповідають очікуванням бекенду (VideoController)
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        channel_name: '',
        thumbnail_url: '',
        category: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(admin.errorCreate);
            }

            // У разі успіху повертаємось на головну сторінку адмінки
            navigate('/admin');
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(admin.errorCreate);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">{admin.createTitle}</h1>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-5">

                <div className="flex flex-col gap-1">
                    <label htmlFor="id" className="text-sm font-medium text-gray-300">{admin.formIdLabel}</label>
                    <input
                        type="text"
                        id="id"
                        name="id"
                        required
                        placeholder={admin.formIdPlaceholder}
                        value={formData.id}
                        onChange={handleChange}
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="title" className="text-sm font-medium text-gray-300">{admin.formTitleLabel}</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="channel_name" className="text-sm font-medium text-gray-300">{admin.formChannelLabel}</label>
                    <input
                        type="text"
                        id="channel_name"
                        name="channel_name"
                        required
                        value={formData.channel_name}
                        onChange={handleChange}
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="thumbnail_url" className="text-sm font-medium text-gray-300">{admin.formThumbLabel}</label>
                    <input
                        type="url"
                        id="thumbnail_url"
                        name="thumbnail_url"
                        required
                        value={formData.thumbnail_url}
                        onChange={handleChange}
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="category" className="text-sm font-medium text-gray-300">{admin.formCategoryLabel}</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="text-sm font-medium text-gray-300">{admin.formDescLabel}</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        required
                        value={formData.description}
                        onChange={handleChange}
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin')}
                        className="px-5 py-2 rounded-lg text-white font-medium hover:bg-gray-800 transition-colors"
                    >
                        {admin.cancelBtn}
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                    >
                        {isLoading ? '...' : admin.submitBtn}
                    </button>
                </div>

            </form>
        </div>
    );
}