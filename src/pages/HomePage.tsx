import { useState } from 'react';
import VideoCard from '../components/VideoCard';
import { MOCK_VIDEOS } from '../data/mockVideos';

export default function HomePage() {
    // 1. Стан для відстеження активної категорії
    const [activeCategory, setActiveCategory] = useState('Всі');

    // 2. Динамічне отримання унікальних категорій з MOCK_VIDEOS
    // Використовуємо Set, щоб відкинути дублікати, і розгортаємо в масив
    const categories = ['Всі', ...new Set(MOCK_VIDEOS.map((video) => video.category))];

    // 3. Фільтрація відео залежно від обраної категорії
    const filteredVideos = activeCategory === 'Всі'
        ? MOCK_VIDEOS
        : MOCK_VIDEOS.filter((video) => video.category === activeCategory);

    return (
        <div className="flex flex-col h-full">
            {/* Секція фільтрів */}
            <div className="sticky top-16 z-40 bg-gray-900 border-b border-gray-800 px-4 py-3 flex gap-3 overflow-x-auto no-scrollbar">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            activeCategory === category
                                ? 'bg-white text-black'
                                : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Секція сітки відео */}
            <div className="p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredVideos.map((video) => (
                        <VideoCard key={video.id} {...video} />
                    ))}
                </div>

                {/* Обробка порожнього результату, якщо після фільтрації немає відео */}
                {filteredVideos.length === 0 && (
                    <div className="text-gray-400 text-center mt-10 w-full col-span-full">
                        Відео в цій категорії не знайдено.
                    </div>
                )}
            </div>
        </div>
    );
}