import { useSearchParams } from 'react-router-dom';
import { MOCK_VIDEOS } from '../data/mockVideos';
import VideoCard from '../components/VideoCard';
import { uiLabels } from '../constants/labels';

const MAX_QUERY_LENGTH = 100;

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const { search } = uiLabels;

    const rawQuery = searchParams.get('q') || '';

    const query = rawQuery.slice(0, MAX_QUERY_LENGTH);

    const results = MOCK_VIDEOS.filter((video) => {
        if (!query.trim()) return false;

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
                {search.resultsFor} "{query}"

                {rawQuery.length > MAX_QUERY_LENGTH && (
                    <span className="text-sm text-gray-400 ml-2 font-normal">
                        {search.queryTrimmed(MAX_QUERY_LENGTH)}
                    </span>
                )}
            </h2>

            <div className="flex flex-col gap-4">
                {results.length > 0 ? (
                    results.map((video) => (
                        <VideoCard
                            key={video.id}
                            {...video}
                            layout="horizontal"
                        />
                    ))
                ) : (
                    <div className="text-gray-400 text-lg mt-10">
                        {search.noResults}
                    </div>
                )}
            </div>
        </div>
    );
}