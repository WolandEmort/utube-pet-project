import { useState } from 'react';
import VideoCard from '../components/VideoCard';
import { MOCK_VIDEOS } from '../data/mockVideos';
import { uiLabels } from '../constants/labels';

// Технічний ідентифікатор для логіки, який не залежить від мови інтерфейсу
const ALL_CATEGORY_ID = 'all';

export default function HomePage() {
    const { home } = uiLabels;

    // 1. Стан зберігає 'all' або назву категорії з бекенду (string)
    const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY_ID);

    // 2. В масив додаємо 'all' замість локалізованого тексту
    const categories = [ALL_CATEGORY_ID, ...new Set(MOCK_VIDEOS.map((video) => video.category))];

    // 3. Фільтрація працює з технічним ID
    const filteredVideos = activeCategory === ALL_CATEGORY_ID
        ? MOCK_VIDEOS
        : MOCK_VIDEOS.filter((video) => video.category === activeCategory);

    return (
        <div className="flex flex-col h-full">
            <div className="sticky top-16 z-40 bg-gray-900 border-b border-gray-800 px-4 py-3 flex gap-3 overflow-x-auto no-scrollbar">
                {categories.map((categoryId) => {
                    // 4. Підміна технічного ID на локалізований текст безпосередньо перед рендером
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