import { useState, useEffect } from 'react';
import VideoCard, { type Video } from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';
import { uiLabels } from '../constants/labels';

export default function HistoryPage() {
    const { user } = useAuth();
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const { history: labels } = uiLabels;

    useEffect(() => {
        if (!user?.id) {
            setIsLoading(false);
            return;
        }

        const fetchHistory = async () => {
            try {
                const response = await fetch(`http://localhost:8080/history?user_id=${user.id}`);

                if (!response.ok) {
                    throw new Error(labels.errorLoad);
                }

                const data = await response.json();
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

        fetchHistory();
    }, [user?.id, labels.errorLoad, labels.errorUnknown]);

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