import { useParams } from 'react-router-dom';
import { MOCK_VIDEOS } from '../data/mockVideos';

export default function VideoPage() {
    const { id } = useParams<{ id: string }>();
    const video = MOCK_VIDEOS.find((v) => v.id === id);

    if (!video) {
        return (
            <div className="flex items-center justify-center h-screen text-white text-4xl">
                Відео не знайдено
            </div>
        );
    }

    return (
        <div className="w-full grid px-4 py-2 lg:px-6 lg:py-4 grid-cols-1 lg:grid-cols-[1fr_350px] xl:grid-cols-[1fr_400px] gap-6">

            {/* ОСНОВНИЙ КОНТЕНТ (ПЛЕЄР ТА ІНФО) — займає fill space */}
            <div className="w-full flex flex-col">
                {/* aspect-video автоматично адаптує висоту до fill-ширини */}
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>

                <h1 className="text-xl md:text-4xl font-bold text-white mt-4 line-clamp-2">
                    {video.title}
                </h1>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex-shrink-0"></div>
                        <div>
                            <div className="text-white font-bold">{video.channelName}</div>
                            <div className="text-gray-400 text-sm">1.2 млн підписників</div>
                        </div>
                        <button className="ml-4 bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                            Підписатися
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-full">
                        <button className="text-white px-4 py-1.5 border-r border-gray-700 hover:bg-gray-700 rounded-l-full text-sm font-medium">
                            👍 126 тис.
                        </button>
                        <button className="text-white px-4 py-1.5 hover:bg-gray-700 rounded-r-full text-sm">
                            👎
                        </button>
                    </div>
                </div>

                {/* Опис відео */}
                <div className="mt-4 p-4 bg-gray-800 rounded-xl hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="text-white text-bg font-bold">
                        {video.views.toLocaleString('uk-UA')} переглядів • {video.postedAt}
                    </div>
                    <p className="text-white text-bg mt-1 whitespace-pre-wrap">
                        Це тестовий опис до відео. Тут зазвичай знаходиться інформація про випуск, посилання на соцмережі та таймкоди...
                    </p>
                </div>
            </div>

            {/* ПРАВА ЧАСТИНА: САЙДБАР (притиснутий справа зверху) */}
            {/* ОНОВЛЕНО: Додано sticky top-20 та lg:mt-1 */}
            <div className="flex flex-col gap-4 sticky top-20 lg:mt-1 lg:w-full">
                <h3 className="text-white font-semibold text-2xl mb-1">Схожі відео</h3>

                <div className="flex flex-col gap-3">
                    {MOCK_VIDEOS.filter(v => v.id !== id).map((v) => (
                        <div key={v.id} className="flex gap-2 group cursor-pointer">
                            <div className="relative w-40 h-24 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden">
                                <img src={v.thumbnailUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h4 className="text-white text-sm font-bold line-clamp-2 leading-tight group-hover:text-blue-400">
                                    {v.title}
                                </h4>
                                <p className="text-gray-400 text-xs mt-1 hover:text-white">{v.channelName}</p>
                                <p className="text-gray-400 text-xs">{v.views.toLocaleString('uk-UA')} переглядів</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}