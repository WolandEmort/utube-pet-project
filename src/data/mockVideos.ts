// Описуємо тип нашого об'єкта відео
export interface Video {
    id: string;
    thumbnailUrl: string;
    title: string;
    channelName: string;
    views: number;
    postedAt: string;
}

// Експортуємо масив даних
export const MOCK_VIDEOS: Video[] = [
    {
        id: "1",
        thumbnailUrl: "https://picsum.photos/seed/1/640/360",
        title: "React TypeScript Tutorial for Beginners",
        channelName: "Tech Channel",
        views: 150000,
        postedAt: "2 дні тому"
    },
    {
        id: "2",
        thumbnailUrl: "https://picsum.photos/seed/2/640/360",
        title: "Understanding Vite and Tailwind CSS Architecture",
        channelName: "Frontend Master",
        views: 42000,
        postedAt: "5 годин тому"
    },
    {
        id: "3",
        thumbnailUrl: "https://picsum.photos/seed/3/640/360",
        title: "How to build a YouTube Clone",
        channelName: "Code Academy",
        views: 890000,
        postedAt: "1 місяць тому"
    },
    {
        id: "4",
        thumbnailUrl: "https://picsum.photos/seed/4/640/360",
        title: "Advanced React Router DOM setup",
        channelName: "Web Dev Simplified",
        views: 12000,
        postedAt: "10 хвилин тому"
    }
];