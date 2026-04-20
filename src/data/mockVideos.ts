export interface Video {
    id: string;
    thumbnailUrl: string;
    title: string;
    channelName: string;
    views: number;
    postedAt: string;
    category: string;
}

export const MOCK_VIDEOS: Video[] = [
    // --- DEVELOPMENT ---
    {
        id: "SqcY0GlETPk",
        thumbnailUrl: "https://img.youtube.com/vi/SqcY0GlETPk/maxresdefault.jpg",
        title: "React Tutorial for Beginners",
        channelName: "Programming with Mosh",
        views: 1500000,
        postedAt: "2 роки тому",
        category: "Development"
    },
    {
        id: "KCrXgy8qtjM",
        thumbnailUrl: "https://img.youtube.com/vi/KCrXgy8qtjM/maxresdefault.jpg",
        title: "Vite in 100 Seconds",
        channelName: "Fireship",
        views: 420000,
        postedAt: "1 рік тому",
        category: "Development"
    },
    {
        id: "dGcsHMXbSOA",
        thumbnailUrl: "https://img.youtube.com/vi/dGcsHMXbSOA/maxresdefault.jpg",
        title: "Tailwind CSS Full Course",
        channelName: "FreeCodeCamp",
        views: 890000,
        postedAt: "8 місяців тому",
        category: "Development"
    },
    {
        id: "wm5gMKuwSYk",
        thumbnailUrl: "https://img.youtube.com/vi/wm5gMKuwSYk/maxresdefault.jpg",
        title: "Next.js App Router Crash Course",
        channelName: "Traversy Media",
        views: 550000,
        postedAt: "5 місяців тому",
        category: "Development"
    },
    {
        id: "d56mG7DezGs",
        thumbnailUrl: "https://img.youtube.com/vi/d56mG7DezGs/maxresdefault.jpg",
        title: "TypeScript Course for Beginners",
        channelName: "Codevolution",
        views: 310000,
        postedAt: "1 рік тому",
        category: "Development"
    },

    // --- GAMING ---
    {
        id: "_xMZFqYYRfQ",
        thumbnailUrl: "https://img.youtube.com/vi/_xMZFqYYRfQ/maxresdefault.jpg",
        title: "Лучший симулятор выживания - Обзор Project Zomboid",
        channelName: "Survival Gaming",
        views: 840000,
        postedAt: "1 рік тому",
        category: "Gaming"
    },
    {
        id: "K_WDz4Eevno",
        thumbnailUrl: "https://img.youtube.com/vi/K_WDz4Eevno/maxresdefault.jpg",
        title: "Project Zomboid - Огляд Гри",
        channelName: "UA Gaming",
        views: 120000,
        postedAt: "3 роки тому",
        category: "Gaming"
    },
    {
        id: "j8T4r-Y3e3E",
        thumbnailUrl: "https://img.youtube.com/vi/j8T4r-Y3e3E/maxresdefault.jpg",
        title: "Valheim - Ashlands Gameplay Trailer",
        channelName: "Iron Gate",
        views: 2100000,
        postedAt: "1 рік тому",
        category: "Gaming"
    },
    {
        id: "Fz-2sL6aYy8",
        thumbnailUrl: "https://img.youtube.com/vi/Fz-2sL6aYy8/maxresdefault.jpg",
        title: "Terraria 1.4.4 Labor of Love Trailer",
        channelName: "Re-Logic",
        views: 3400000,
        postedAt: "2 роки тому",
        category: "Gaming"
    },
    {
        id: "0aH09E71I4s",
        thumbnailUrl: "https://img.youtube.com/vi/0aH09E71I4s/maxresdefault.jpg",
        title: "Minecraft - 1.21 Update Showcase",
        channelName: "Minecraft",
        views: 5600000,
        postedAt: "4 місяці тому",
        category: "Gaming"
    },

    // --- MUSIC ---
    {
        id: "sEKOczkt0tU",
        thumbnailUrl: "https://img.youtube.com/vi/sEKOczkt0tU/maxresdefault.jpg",
        title: "Crystal Castles - Crimewave (Official Video)",
        channelName: "Crystal Castles",
        views: 416000,
        postedAt: "14 років тому",
        category: "Music"
    },
    {
        id: "PBPO--012zw",
        thumbnailUrl: "https://img.youtube.com/vi/PBPO--012zw/maxresdefault.jpg",
        title: "WITCH HOUSE MIX | Dark Ambient / Hardwave",
        channelName: "Aim To Head Mix",
        views: 89000,
        postedAt: "1 місяць тому",
        category: "Music"
    },
    {
        id: "1G_qA7pU194",
        thumbnailUrl: "https://img.youtube.com/vi/1G_qA7pU194/hqdefault.jpg",
        title: "Pastel Ghost - Dark Beach",
        channelName: "Pastel Ghost",
        views: 12000000,
        postedAt: "8 років тому",
        category: "Music"
    },
    {
        id: "x2Jg7Mh115w",
        thumbnailUrl: "https://img.youtube.com/vi/x2Jg7Mh115w/maxresdefault.jpg",
        title: "The Agnes Circle - Monument",
        channelName: "Post-Punk Daily",
        views: 45000,
        postedAt: "3 роки тому",
        category: "Music"
    },
    {
        id: "k-fS-U4XQxE",
        thumbnailUrl: "https://img.youtube.com/vi/k-fS-U4XQxE/maxresdefault.jpg",
        title: "Glitchcore / Hyperpop Mix",
        channelName: "Underground Sounds",
        views: 230000,
        postedAt: "1 рік тому",
        category: "Music"
    }
];