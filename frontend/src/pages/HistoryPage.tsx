import { useState, useEffect } from 'react';
import VideoCard, { type Video } from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';
import { uiLabels } from '../constants/labels';
import { useApi } from '../hooks/useApi';

export default function HistoryPage() {
    const { user } = useAuth();
    const { request } = useApi();
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const { history: labels } = uiLabels;

    useEffect(() => {
        // Залишаємо базову перевірку, щоб не робити зайвий запит, якщо юзера немає
        if (!user) {
            setIsLoading(false);
            return;
        }

        const fetchHistory = async () => {
            try {
                // Використовуємо хук useApi.
                // Параметр ?user_id= більше не потрібен, оскільки бекенд бере ID з токена
                const data = await request('/history');
                setVideos(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError(labels.errorUnknown);
                }
            } finally {
                setIsLoading(false);
            }
        };

        void fetchHistory();
    }, [user, request, labels.errorUnknown]);

    if (isLoading) {
        return <div className="text-white p-6 text-center">{labels.loading}</div>;
    }

    if (error) {
        return <div className="text-red-500 p-6 text-center">{error}</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 w-full">
            <h1 className="text-2xl font-bold text-white mb-6">
                {labels.title}
            </h1>

            {videos.length === 0 ? (
                <p className="text-gray-400">{labels.emptyText}</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {videos.map((video) => (
                        <div key={video.id} className="w-full">
                            <VideoCard layout="horizontal" {...video} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}