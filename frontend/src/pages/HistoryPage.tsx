import { useState, useEffect } from 'react';
import VideoCard, { type Video } from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';

export default function HistoryPage() {
    const { user } = useAuth();
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Захист: якщо об'єкт user порожній (неавторизований), запит не виконується
        if (!user?.id) {
            setIsLoading(false);
            return;
        }

        const fetchHistory = async () => {
            try {
                const response = await fetch(`http://localhost:8080/history?user_id=${user.id}`);

                if (!response.ok) {
                    throw new Error('Помилка завантаження історії');
                }

                const data = await response.json();
                setVideos(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Невідома помилка');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [user?.id]); // Залежність від ID користувача

    if (isLoading) {
        return <div className="text-white p-6 text-center">Завантаження історії...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-6 text-center">{error}</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 w-full">
            <h1 className="text-2xl font-bold text-white mb-6">Історія переглядів</h1>

            {videos.length === 0 ? (
                <p className="text-gray-400">Ви ще не переглянули жодного відео.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {videos.map((video) => (
                        <div key={video.id} className="w-full">
                            {/* Використовуємо горизонтальний лейаут для списку історії */}
                            <VideoCard layout="horizontal" {...video} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}