import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { uiLabels } from '../constants/labels';
import { type Video } from '../components/VideoCard';

export default function VideoPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { videoPage, auth, videoCard } = uiLabels;

    // Стани для роботи з API
    const [allVideos, setAllVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Завантаження даних з бекенду
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('http://localhost:8080/');

                if (!response.ok) {
                    throw new Error(`HTTP помилка: статускод ${response.status}`);
                }

                const data = await response.json();
                setAllVideos(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Невідома помилка при отриманні даних');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideos();
    }, []);

    // Логіка захисту маршруту
    useEffect(() => {
        if (!user) {
            navigate('/login', {
                state: { toastMessage: auth.toastAuthRequired }
            });
        }
    }, [user, navigate, auth.toastAuthRequired]);

    // Блокуємо рендер контенту, якщо користувач не авторизований
    if (!user) return null;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen text-white text-xl">
                Завантаження відео...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen text-red-500 text-xl">
                Помилка: {error}
            </div>
        );
    }

    // Шукаємо відео після завантаження
    const video = allVideos.find((v) => v.id === id);

    if (!video) {
        return (
            <div className="flex items-center justify-center h-screen text-white text-4xl">
                {videoPage.videoNotFound}
            </div>
        );
    }

    // Форматування дати для виводу
    const formattedDate = new Date(video.posted_at).toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="w-full grid px-4 py-2 lg:px-6 lg:py-4 grid-cols-1 lg:grid-cols-[8fr_2fr] gap-6">

            <div className="w-full flex flex-col">
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>

                <h1 className="text-3xl font-bold text-white mt-4 line-clamp-2">
                    {video.title}
                </h1>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex-shrink-0"></div>
                        <div>
                            {/* snake_case */}
                            <div className="text-white font-bold">{video.channel_name}</div>
                            <div className="text-gray-400 text-sm">{videoPage.subscribers('1.2 млн')}</div>
                        </div>
                        <button className="ml-4 bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                            {videoPage.subscribeBtn}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-full">
                        <button className="text-white px-4 py-1.5 border-r border-gray-700 hover:bg-gray-700 rounded-l-full text-sm font-medium">
                            👍 126 тис.
                        </button>
                        <button className="text-white px-4 py-1.5 hover:bg-gray-700 rounded-r-full text-sm">
                            👎
                        </button>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-gray-800 rounded-xl hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="text-white text-base font-bold">
                        {/* Передаємо відформатовану дату */}
                        {videoPage.viewsInfo(video.views, formattedDate)}
                    </div>
                    <p className="text-white text-base mt-1 whitespace-pre-wrap">
                        {video.description}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-4 sticky top-20 lg:mt-1 lg:w-full">
                <h3 className="text-white font-semibold text-2xl mb-1">{videoPage.similarVideos}</h3>

                <div className="flex flex-col gap-3">
                    {allVideos
                        .filter(v => v.category === video.category && v.id !== id)
                        .map((v) => (
                            <Link to={`/watch/${v.id}`} key={v.id} className="flex gap-2 group cursor-pointer">
                                <div className="relative w-40 h-24 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden">
                                    <img
                                        src={v.thumbnail_url} // snake_case
                                        alt=""
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-white text-sm font-bold line-clamp-2 leading-tight group-hover:text-blue-400">
                                        {v.title}
                                    </h4>
                                    <p className="text-gray-400 text-xs mt-1 hover:text-white">{v.channel_name}</p> {/* snake_case */}
                                    <p className="text-gray-400 text-xs">
                                        {videoCard.views(v.views)}
                                    </p>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>

        </div>
    );
}