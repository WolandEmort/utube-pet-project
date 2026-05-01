import { Link } from 'react-router-dom';
import type { Video } from '../data/mockVideos';
import { uiLabels } from '../constants/labels';

interface VideoCardProps extends Video {
    layout?: 'vertical' | 'horizontal';
}

export default function VideoCard({ layout = 'vertical', ...video }: VideoCardProps) {
    const isHorizontal = layout === 'horizontal';
    const { videoCard } = uiLabels;

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
                    src={video.thumbnailUrl}
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
                            {video.channelName}
                        </p>
                        <p className="text-gray-400 text-sm">
                            {/* Використовуємо функцію з конфігурації для форматування */}
                            {videoCard.views(video.views)} • {video.postedAt}
                        </p>
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