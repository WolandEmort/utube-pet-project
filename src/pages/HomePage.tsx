import VideoCard from '../components/VideoCard';
import { MOCK_VIDEOS } from '../data/mockVideos'; // Імпорт нашої "БД"

export default function HomePage() {
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">

                {MOCK_VIDEOS.map((video) => (
                    <VideoCard
                        key={video.id}
                        {...video}
                    />
                ))}
            </div>
        </div>
    );
}