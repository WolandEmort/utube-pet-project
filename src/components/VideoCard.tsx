import type { Video } from '../data/mockVideos';
import { Link } from 'react-router-dom';

export default function VideoCard({ id, thumbnailUrl, title, channelName, views, postedAt }: Video) {
    return (
        <Link to={`/watch/${id}`} className="flex flex-col gap-2 cursor-pointer group">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-800">
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                />
            </div>

            <div className="flex gap-3 mt-1">
                <div className="w-9 h-9 rounded-full bg-gray-700 flex-shrink-0"></div>

                <div className="flex flex-col">
                    <h3 className="text-white text-base font-semibold line-clamp-2 leading-tight">
                        {title}
                    </h3>
                    <span className="text-gray-400 text-sm mt-1 hover:text-white">
            {channelName}
          </span>
                    <div className="text-gray-400 text-sm flex items-center gap-1">
                        <span>{views.toLocaleString('uk-UA')} переглядів</span>
                        <span className="text-[10px]">•</span>
                        <span>{postedAt}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}