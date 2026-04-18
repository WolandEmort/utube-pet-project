export interface Video {
    id: string;
    thumbnailUrl: string;
    title: string;
    channelName: string;
    views: number;
    postedAt: string;
}

export const MOCK_VIDEOS: Video[] = [
    {
        id: "SqcY0GlETPk",
        thumbnailUrl: "https://img.youtube.com/vi/SqcY0GlETPk/maxresdefault.jpg",
        title: "React Tutorial for Beginners",
        channelName: "Programming with Mosh",
        views: 1500000,
        postedAt: "2 роки тому"
    },
    {
        id: "KCrXgy8qtjM",
        thumbnailUrl: "https://img.youtube.com/vi/KCrXgy8qtjM/maxresdefault.jpg",
        title: "Vite in 100 Seconds",
        channelName: "Fireship",
        views: 420000,
        postedAt: "1 рік тому"
    },
    {
        id: "dGcsHMXbSOA",
        thumbnailUrl: "https://img.youtube.com/vi/dGcsHMXbSOA/maxresdefault.jpg",
        title: "Tailwind CSS Full Course",
        channelName: "FreeCodeCamp",
        views: 890000,
        postedAt: "8 місяців тому"
    },
    {
        id: "oUPgaOcmHOU",
        thumbnailUrl: "https://img.youtube.com/vi/oUPgaOcmHOU/maxresdefault.jpg",
        title: "React Router DOM v6 Tutorial",
        channelName: "Net Ninja",
        views: 320000,
        postedAt: "1 рік тому"
    }
];