import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoCard, { type Video } from '../components/VideoCard';
import { uiLabels } from '../constants/labels';

const MAX_QUERY_LENGTH = 100;

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const { search } = uiLabels;

    // Змінили назву стану з allVideos на results, оскільки тепер тут лише результати
    const [results, setResults] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const rawQuery = searchParams.get('q') || '';
    const query = rawQuery.slice(0, MAX_QUERY_LENGTH);

    useEffect(() => {
        // Якщо запит порожній, не робимо зайвий виклик до БД
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const fetchSearchResults = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Додаємо параметр пошуку до URL. encodeURIComponent захищає від спецсимволів в URL
                const url = `http://localhost:8080/?q=${encodeURIComponent(query.trim())}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP помилка: статускод ${response.status}`);
                }

                const data = await response.json();
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

        fetchSearchResults();
    }, [query]); // Залежність від query: запит відправиться заново, якщо зміниться текст пошуку

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