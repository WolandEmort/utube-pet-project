import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { uiLabels } from '../constants/labels';
import { type Video } from '../components/VideoCard';
import { useApi } from '../hooks/useApi'; // Імпортуємо наш хук

export default function VideoPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { request } = useApi(); // Ініціалізуємо хук

    const { videoPage, auth, videoCard } = uiLabels;

    const [allVideos, setAllVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                // Використовуємо хук
                const data = await request('/');
                setAllVideos(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(`${videoPage.errorPrefix} ${err.message}`);
                } else {
                    setError(videoPage.errorUnknown);
                }
            } finally {
                setIsLoading(false);
            }
        };

        void fetchVideos();
    }, [request, videoPage.errorPrefix, videoPage.errorUnknown]);

    useEffect(() => {
        if (!user) {
            navigate('/login', {
                state: { toastMessage: auth.toastAuthRequired }
            });
        }
    }, [user, navigate, auth.toastAuthRequired]);

    useEffect(() => {
        if (!id || !user?.id) return;

        const recordHistory = async () => {
            try {
                // Використовуємо хук.
                // Не передаємо user_id, бекенд його бере з JWT токена
                await request('/history', {
                    method: 'POST',
                    body: JSON.stringify({ video_id: id })
                });
            } catch (error) {
                console.error('Помилка виконання POST /history:', error);
            }
        };

        void recordHistory();
    }, [id, user?.id, request]);

    if (!user) return null;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen text-white text-xl">
                {videoPage.loading}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen text-red-500 text-xl">
                {error}
            </div>
        );
    }

    const video = allVideos.find((v) => v.id === id);

    if (!video) {
        return (
            <div className="flex items-center justify-center h-screen text-white text-4xl">
                {videoPage.videoNotFound}
            </div>
        );
    }

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
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full border-0"
                        referrerPolicy="strict-origin-when-cross-origin"
                    ></iframe>
                </div>

                <h1 className="text-3xl font-bold text-white mt-4 line-clamp-2">
                    {video.title}
                </h1>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex-shrink-0"></div>
                        <div>
                            <div className="text-white font-bold">{video.channel_name}</div>
                            <div className="text-gray-400 text-sm">{videoPage.subscribers(videoPage.mockSubscribersCount)}</div>
                        </div>
                        <button className="ml-4 bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                            {videoPage.subscribeBtn}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-full">
                        <button className="text-white px-4 py-1.5 border-r border-gray-700 hover:bg-gray-700 rounded-l-full text-sm font-medium">
                            {videoPage.likeBtn} {videoPage.mockLikesCount}
                        </button>
                        <button className="text-white px-4 py-1.5 hover:bg-gray-700 rounded-r-full text-sm">
                            {videoPage.dislikeBtn}
                        </button>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-gray-800 rounded-xl hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="text-white text-base font-bold">
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
                                        src={v.thumbnail_url}
                                        alt=""
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-white text-sm font-bold line-clamp-2 leading-tight group-hover:text-blue-400">
                                        {v.title}
                                    </h4>
                                    <p className="text-gray-400 text-xs mt-1 hover:text-white">{v.channel_name}</p>
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