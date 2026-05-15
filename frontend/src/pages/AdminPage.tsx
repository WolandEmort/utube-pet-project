import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 1. Додано імпорт
import { uiLabels } from '../constants/labels';
import { type Video } from '../components/VideoCard';

export default function AdminPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { admin, videoPage } = uiLabels;

    const fetchVideos = async () => {
        try {
            const response = await fetch('http://localhost:8080/');
            const data = await response.json();
            setVideos(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchVideos();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm(admin.confirmDelete)) return;

        try {
            const response = await fetch(`http://localhost:8080/videos/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setVideos(prev => prev.filter(v => v.id !== id));
            }
        } catch (err) {
            console.error('Помилка DELETE запиту:', err);
            alert(admin.errorDelete);
        }
    };

    if (isLoading) return <div className="text-white p-10 text-center">{videoPage.loading}</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* 2. Flex-контейнер для заголовка та кнопки */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">{admin.title}</h1>
                <Link
                    to="/admin/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    {admin.addVideoBtn}
                </Link>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-gray-800 text-gray-300 uppercase text-xs">
                        <th className="px-6 py-4 font-medium">{admin.tableTitle}</th>
                        <th className="px-6 py-4 font-medium">{admin.tableCategory}</th>
                        <th className="px-6 py-4 font-medium">{admin.tableDate}</th>
                        <th className="px-6 py-4 font-medium text-right">{admin.tableActions}</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                    {videos.map((video) => (
                        <tr key={video.id} className="hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4 text-white font-medium">{video.title}</td>
                            <td className="px-6 py-4 text-gray-400">
                                    <span className="bg-gray-800 px-2 py-1 rounded text-xs">
                                        {video.category}
                                    </span>
                            </td>
                            <td className="px-6 py-4 text-gray-400 text-sm">
                                {new Date(video.posted_at).toLocaleDateString('uk-UA')}
                            </td>
                            <td className="px-6 py-4 text-right space-x-4">
                                <Link
                                    to={`/admin/edit/${video.id}`}
                                    className="text-blue-500 hover:text-blue-400 text-sm font-bold transition-colors"
                                >
                                    {admin.editBtn}
                                </Link>
                                <button
                                    onClick={() => void handleDelete(video.id)}
                                    className="text-red-500 hover:text-red-400 text-sm font-bold transition-colors"
                                >
                                    {admin.deleteBtn}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {videos.length === 0 && (
                    <div className="p-10 text-center text-gray-500">{admin.emptyText}</div>
                )}
            </div>
        </div>
    );
}