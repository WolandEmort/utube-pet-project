import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoCard, { type Video } from '../components/VideoCard';
import { uiLabels } from '../constants/labels';
import { useApi } from '../hooks/useApi'; // 1. Імпорт хука

const MAX_QUERY_LENGTH = 100;

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const { search } = uiLabels;
    const { request } = useApi(); // 2. Ініціалізація хука

    const [results, setResults] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const rawQuery = searchParams.get('q') || '';
    const query = rawQuery.slice(0, MAX_QUERY_LENGTH);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const fetchSearchResults = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 3. Формуємо endpoint з параметром і викликаємо request
                const endpoint = `/?q=${encodeURIComponent(query.trim())}`;
                const data = await request(endpoint);
                setResults(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Невідома помилка при отриманні даних');
                }
            } finally {
                setIsLoading(false);
            }
        };

        void fetchSearchResults();
    }, [query, request]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh] text-gray-400">
                Пошук відео...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-[50vh] text-red-500">
                Помилка підключення до API: {error}
            </div>
        );
    }

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