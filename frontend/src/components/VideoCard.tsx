import { Link } from 'react-router-dom';
import { uiLabels } from '../constants/labels';

// Інтерфейс відповідає схемі даних, яку віддає бекенд (PostgreSQL -> PHP JSON)
export interface Video {
    id: string;
    title: string;
    description: string;
    channel_name: string;
    views: number;
    thumbnail_url: string;
    category: string;
    posted_at: string;
    viewed_at?: string; // Додано опціональне поле для сторінки історії
}

interface VideoCardProps extends Video {
    layout?: 'vertical' | 'horizontal';
}

export default function VideoCard({ layout = 'vertical', ...video }: VideoCardProps) {
    const isHorizontal = layout === 'horizontal';
    const { videoCard } = uiLabels;

    // Конвертуємо SQL timestamp публікації у локалізований формат дати
    const formattedPostedDate = new Date(video.posted_at).toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Конвертуємо SQL timestamp перегляду (якщо він є) у формат дати та часу
    const formattedViewedDate = video.viewed_at
        ? new Date(video.viewed_at).toLocaleString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : null;

    return (
        <Link
            to={`/watch/${video.id}`}
            className={`group flex ${
                isHorizontal ? 'flex-row gap-4 w-full' : 'flex-col gap-2'
            }`}
        >
            {/* Секція прев'ю */}
            <div
                className={`relative flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden aspect-video ${
                    isHorizontal ? 'w-full max-w-[240px] md:max-w-[360px]' : 'w-full'
                }`}
            >
                <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
            </div>

            {/* Секція контенту */}
            <div className={`flex ${isHorizontal ? 'flex-col flex-1 py-1' : 'flex-row gap-3'}`}>

                {/* Аватар показуємо тільки у вертикальному лейауті */}
                {!isHorizontal && (
                    <div className="w-9 h-9 rounded-full bg-gray-700 flex-shrink-0 mt-1" />
                )}

                <div className="flex flex-col">
                    <h3
                        className={`text-white font-medium line-clamp-2 transition-colors ${
                            isHorizontal ? 'text-lg md:text-xl group-hover:text-blue-400' : 'text-sm'
                        }`}
                    >
                        {video.title}
                    </h3>

                    <div className={`${isHorizontal ? 'mt-1' : 'mt-0'}`}>
                        <p className="text-gray-400 text-sm hover:text-white transition-colors">
                            {video.channel_name}
                        </p>
                        <p className="text-gray-400 text-sm">
                            {videoCard.views(video.views)} • {formattedPostedDate}
                        </p>

                        {/* Динамічний вивід дати перегляду виключно для сторінки історії */}
                        {formattedViewedDate && (
                            <p className="text-gray-500 text-xs mt-1 font-medium">
                                Переглянуто: {formattedViewedDate}
                            </p>
                        )}
                    </div>

                    {/* Вивід динамічного опису для горизонтального лейауту */}
                    {isHorizontal && (
                        <p className="text-gray-400 text-xs mt-3 line-clamp-2 hidden md:block">
                            {video.description}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}