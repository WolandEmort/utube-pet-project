import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoCard, { type Video } from '../components/VideoCard';
import { uiLabels } from '../constants/labels';
import { useApi } from '../hooks/useApi';

const MAX_QUERY_LENGTH = 100;

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const { search } = uiLabels;
    const { request } = useApi();

    const rawQuery = searchParams.get('q') || '';
    const query = rawQuery.slice(0, MAX_QUERY_LENGTH);

    const [results, setResults] = useState<Video[]>([]);
    // 1. Ініціалізуємо isLoading залежно від наявності запиту в URL
    const [isLoading, setIsLoading] = useState<boolean>(() => !!query.trim());
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        const fetchSearchResults = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const endpoint = `/?q=${encodeURIComponent(query.trim())}`;
                const data = await request(endpoint);
                setResults(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Невідома помилка при отриманні даних');
            } finally {
                setIsLoading(false);
            }
        };

        void fetchSearchResults();
    }, [query, request]);

    // 2. Видалено ранні return для isLoading та error.
    // Макет сторінки залишається стабільним.

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

            {/* 3. Умовний рендеринг відбувається виключно в контейнері списку */}
            <div className="flex flex-col gap-4">
                {isLoading ? (
                    <div className="text-gray-400 text-lg mt-10">
                        Пошук відео...
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-lg mt-10">
                        Помилка підключення до API: {error}
                    </div>
                ) : results.length > 0 ? (
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