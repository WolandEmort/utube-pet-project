import { useSearchParams } from 'react-router-dom';
import { MOCK_VIDEOS } from '../data/mockVideos';
import VideoCard from '../components/VideoCard';

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const results = MOCK_VIDEOS.filter((video) => {
        const lowerCaseQuery = query.toLowerCase();
        return (
            video.title.toLowerCase().includes(lowerCaseQuery) ||
            video.channelName.toLowerCase().includes(lowerCaseQuery) ||
            video.category.toLowerCase().includes(lowerCaseQuery)
        );
    });

    return (
        <div className="w-full max-w-[1100px] mx-auto p-4 lg:p-6">
            <h2 className="text-xl font-bold text-white mb-6">
                Результати за запитом: "{query}"
            </h2>

            <div className="flex flex-col gap-4">
                {results.map((video) => (
                    <VideoCard
                        key={video.id}
                        {...video}
                        layout="horizontal"
                    />
                ))}
            </div>
        </div>
    );
}