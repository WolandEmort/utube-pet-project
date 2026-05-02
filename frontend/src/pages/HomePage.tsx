import { useState, useEffect } from 'react';
import VideoCard, { type Video } from '../components/VideoCard';
import { uiLabels } from '../constants/labels';

const ALL_CATEGORY_ID = 'all';

export default function HomePage() {
    const { home } = uiLabels;

    // 1. Додаємо стани для зберігання даних з сервера, статусу завантаження та помилок
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY_ID);

    // 2. Хук useEffect для виконання GET-запиту при монтуванні компонента
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('http://localhost:8080/');

                if (!response.ok) {
                    throw new Error(`HTTP помилка: статускод ${response.status}`);
                }

                const data = await response.json();
                setVideos(data);
            } catch (err) {
                // Перевіряємо тип помилки перед присвоєнням
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

    // 3. Динамічне формування категорій на основі даних з бекенду
    const categories = [ALL_CATEGORY_ID, ...new Set(videos.map((video) => video.category))];

    // 4. Фільтрація отриманого масиву
    const filteredVideos = activeCategory === ALL_CATEGORY_ID
        ? videos
        : videos.filter((video) => video.category === activeCategory);

    // 5. Рендеринг стану завантаження
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                Завантаження відео...
            </div>
        );
    }

    // 6. Рендеринг стану помилки мережі або сервера
    if (error) {
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                Помилка підключення до API: {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="sticky top-16 z-40 bg-gray-900 border-b border-gray-800 px-4 py-3 flex gap-3 overflow-x-auto no-scrollbar">
                {categories.map((categoryId) => {
                    const label = categoryId === ALL_CATEGORY_ID ? home.categoryAll : categoryId;

                    return (
                        <button
                            key={categoryId}
                            onClick={() => setActiveCategory(categoryId)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                activeCategory === categoryId
                                    ? 'bg-white text-black'
                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            <div className="p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredVideos.map((video) => (
                        <VideoCard key={video.id} {...video} />
                    ))}
                </div>

                {filteredVideos.length === 0 && (
                    <div className="text-gray-400 text-center mt-10 w-full col-span-full">
                        {home.noVideosInCategory}
                    </div>
                )}
            </div>
        </div>
    );
}