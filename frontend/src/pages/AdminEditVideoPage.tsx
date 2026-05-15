import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { uiLabels } from '../constants/labels';
import { type Video } from '../components/VideoCard';

export default function AdminEditVideoPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { admin, videoPage } = uiLabels;
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        channel_name: '',
        thumbnail_url: '',
        category: ''
    });

    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchVideoData = async () => {
            try {
                const response = await fetch('http://localhost:8080/');
                const videos: Video[] = await response.json();
                const video = videos.find(v => v.id === id);

                if (video) {
                    setFormData({
                        title: video.title,
                        description: video.description,
                        channel_name: video.channel_name,
                        thumbnail_url: video.thumbnail_url,
                        category: video.category
                    });
                } else {
                    setError('Відео не знайдено');
                }
                // 2. Видалено невикористану змінну err
            } catch {
                setError('Помилка завантаження даних');
            } finally {
                setIsPageLoading(false);
            }
        };

        void fetchVideoData();
    }, [id]);

    // 1. Використання імпортованих типів
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 1. Використання імпортованих типів
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8080/videos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            // 3. Замість throw перериваємо виконання через return
            if (!response.ok) {
                setError(admin.errorUpdate);
                setIsSubmitting(false);
                return;
            }

            navigate('/admin');
        } catch (err) {
            console.error('Помилка виконання PUT запиту:', err);
            setError(err instanceof Error ? err.message : admin.errorUpdate);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPageLoading) return <div className="text-white p-10 text-center">{videoPage.loading}</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">{admin.editTitle} (ID: {id})</h1>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <label htmlFor="title" className="text-sm font-medium text-gray-300">{admin.formTitleLabel}</label>
                    <input
                        type="text" id="title" name="title" required value={formData.title} onChange={handleChange}
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="channel_name" className="text-sm font-medium text-gray-300">{admin.formChannelLabel}</label>
                    <input
                        type="text" id="channel_name" name="channel_name" required value={formData.channel_name} onChange={handleChange}
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="thumbnail_url" className="text-sm font-medium text-gray-300">{admin.formThumbLabel}</label>
                    <input
                        type="url" id="thumbnail_url" name="thumbnail_url" required value={formData.thumbnail_url} onChange={handleChange}
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="category" className="text-sm font-medium text-gray-300">{admin.formCategoryLabel}</label>
                    <input
                        type="text" id="category" name="category" required value={formData.category} onChange={handleChange}
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="text-sm font-medium text-gray-300">{admin.formDescLabel}</label>
                    <textarea
                        id="description" name="description" rows={4} required value={formData.description} onChange={handleChange}
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 resize-none"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        type="button" onClick={() => navigate('/admin')}
                        className="px-5 py-2 rounded-lg text-white font-medium hover:bg-gray-800 transition-colors"
                    >
                        {admin.cancelBtn}
                    </button>
                    <button
                        type="submit" disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                    >
                        {isSubmitting ? '...' : admin.updateBtn}
                    </button>
                </div>
            </form>
        </div>
    );
}