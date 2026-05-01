export interface Video {
    id: string;
    thumbnailUrl: string;
    title: string;
    channelName: string;
    views: number;
    postedAt: string;
    category: string;
    description: string;
}

export const MOCK_VIDEOS: Video[] = [
    // --- FRONTEND & DEVELOPMENT ---
    {
        id: "bMknfKXIFA8",
        thumbnailUrl: "https://img.youtube.com/vi/bMknfKXIFA8/hqdefault.jpg",
        title: "React Course - Beginner's Tutorial for React 18",
        channelName: "freeCodeCamp.org",
        views: 3200000,
        postedAt: "2 роки тому",
        category: "Development",
        description: "Повний курс з React 18. Включає створення проєктів з нуля, роботу зі станом (useState), побічними ефектами (useEffect) та формами."
    },
    {
        id: "zQnBQ4tB3ZA",
        thumbnailUrl: "https://img.youtube.com/vi/zQnBQ4tB3ZA/hqdefault.jpg",
        title: "TypeScript in 100 Seconds",
        channelName: "Fireship",
        views: 1100000,
        postedAt: "3 роки тому",
        category: "Development",
        description: "Швидкий вступ до TypeScript. Пояснюється статична типізація, робота з інтерфейсами та компіляція в JavaScript."
    },
    {
        id: "Tn6-PIqc4UM",
        thumbnailUrl: "https://img.youtube.com/vi/Tn6-PIqc4UM/hqdefault.jpg",
        title: "React in 100 Seconds",
        channelName: "Fireship",
        views: 1500000,
        postedAt: "2 роки тому",
        category: "Development",
        description: "Огляд React. Розглядаються базові концепції, хуки та алгоритм роботи Virtual DOM."
    },

    {
        id: "dGcsHMXbSOA",
        thumbnailUrl: "https://img.youtube.com/vi/dGcsHMXbSOA/hqdefault.jpg",
        title: "Tailwind CSS Full Course",
        channelName: "freeCodeCamp.org",
        views: 890000,
        postedAt: "8 місяців тому",
        category: "Development",
        description: "Посібник з використання utility-first фреймворку Tailwind CSS. Створення адаптивних лейаутів та оптимізація білда."
    },
    {
        id: "k5E2AVpwsko",
        thumbnailUrl: "https://img.youtube.com/vi/k5E2AVpwsko/hqdefault.jpg",
        title: "Angular in 100 Seconds",
        channelName: "Fireship",
        views: 850000,
        postedAt: "1 рік тому",
        category: "Development",
        description: "Пояснення компонентної архітектури Angular, dependency injection та використання TypeScript у фреймворку."
    },
    {
        id: "yfoY53QXEnI",
        thumbnailUrl: "https://img.youtube.com/vi/yfoY53QXEnI/hqdefault.jpg",
        title: "CSS Crash Course For Absolute Beginners",
        channelName: "Traversy Media",
        views: 3400000,
        postedAt: "6 років тому",
        category: "Development",
        description: "Основи CSS: селектори, блокова модель, позиціонування та базові стилі для веб-сторінок."
    },
    {
        id: "UB1O30fR-EE",
        thumbnailUrl: "https://img.youtube.com/vi/UB1O30fR-EE/hqdefault.jpg",
        title: "HTML Crash Course For Absolute Beginners",
        channelName: "Traversy Media",
        views: 4500000,
        postedAt: "6 років тому",
        category: "Development",
        description: "Основи HTML: структура документа, теги, семантична розмітка та форми."
    },
    {
        id: "RGOj5yH7evk",
        thumbnailUrl: "https://img.youtube.com/vi/RGOj5yH7evk/hqdefault.jpg",
        title: "Git and GitHub for Beginners",
        channelName: "freeCodeCamp.org",
        views: 2100000,
        postedAt: "3 роки тому",
        category: "Development",
        description: "Системи контролю версій. Робота з репозиторіями, коміти, гілки та злиття (merge) у Git."
    },

    {
        id: "mr15Xzb1Ook",
        thumbnailUrl: "https://img.youtube.com/vi/mr15Xzb1Ook/hqdefault.jpg",
        title: "Tailwind CSS in 100 Seconds",
        channelName: "Fireship",
        views: 1300000,
        postedAt: "2 роки тому",
        category: "Development",
        description: "Як працює utility-first CSS. Швидке створення адаптивних інтерфейсів."
    },
    {
        id: "rfscVS0vtbw",
        thumbnailUrl: "https://img.youtube.com/vi/rfscVS0vtbw/hqdefault.jpg",
        title: "Learn Python - Full Course for Beginners",
        channelName: "freeCodeCamp.org",
        views: 41000000,
        postedAt: "5 років тому",
        category: "Development",
        description: "Базовий синтаксис Python, структури даних та алгоритми для бекенд-розробки."
    },

    // --- PUBLIC DOMAIN & MUSIC ---
    {
        id: "aqz-KE-bpKQ",
        thumbnailUrl: "https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg",
        title: "Big Buck Bunny 4K (Official Blender Foundation)",
        channelName: "Blender",
        views: 12000000,
        postedAt: "15 років тому",
        category: "Entertainment",
        description: "Відкритий короткометражний анімаційний фільм від Blender Foundation. Використовується для тестування відеоплеєрів."
    },
    {
        id: "jfKfPfyJRdk",
        thumbnailUrl: "https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg",
        title: "lofi hip hop radio - beats to relax/study to",
        channelName: "Lofi Girl",
        views: 75000000,
        postedAt: "1 рік тому",
        category: "Music",
        description: "Музична трансляція з лоу-фай хіп-хопом. Відмінно підходить для фону під час написання коду."
    },
    {
        id: "dQw4w9WgXcQ",
        thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        title: "Rick Astley - Never Gonna Give You Up",
        channelName: "Rick Astley",
        views: 1400000000,
        postedAt: "14 років тому",
        category: "Music",
        description: "Офіційний музичний кліп. Відкритий для вбудовування через iframe."
    },
    {
        id: "jNQXAC9IVRw",
        thumbnailUrl: "https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg",
        title: "Me at the zoo",
        channelName: "jawed",
        views: 310000000,
        postedAt: "18 років тому",
        category: "Entertainment",
        description: "Перше відео, завантажене на YouTube. Історичний артефакт платформи."
    },
    {
        id: "LXb3EKWsInQ",
        thumbnailUrl: "https://img.youtube.com/vi/LXb3EKWsInQ/hqdefault.jpg",
        title: "COSTA RICA IN 4K 60fps HDR (ULTRA HD)",
        channelName: "Jacob + Katie Schwarz",
        views: 145000000,
        postedAt: "8 років тому",
        category: "Cinematic",
        description: "Популярне відео для перевірки якості 4K та HDR. Автори дозволяють вбудовування."
    },
    {
        id: "M7lc1UVf-VE",
        thumbnailUrl: "https://img.youtube.com/vi/M7lc1UVf-VE/hqdefault.jpg",
        title: "YouTube Developers Live: Embedded Web Player",
        channelName: "Google Developers",
        views: 1500000,
        postedAt: "10 років тому",
        category: "Development",
        description: "Офіційне тестове відео від команди YouTube. Створене для перевірки роботи iframe та API плеєра."
    },
    {
        id: "HXV3zeQKqGY",
        thumbnailUrl: "https://img.youtube.com/vi/HXV3zeQKqGY/hqdefault.jpg",
        title: "SQL Tutorial - Full Database Course for Beginners",
        channelName: "freeCodeCamp.org",
        views: 9500000,
        postedAt: "5 років тому",
        category: "Development",
        description: "Курс з реляційних баз даних та синтаксису SQL (CRUD операції, таблиці, ключі)."
    }
];