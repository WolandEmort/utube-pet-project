export const uiLabels = {
    header: {
        logo: "YouTube Clone",
        searchPlaceholder: "Введіть запит",
        history: "Історія перегляду",
        loginBtn: "Увійти",
        logoutBtn: "Вийти"
    },
    footer: {
        copyright: "© 2026 YouTube Pet Project",
        githubLink: "Мій GitHub"
    },
    videoCard: {
        views: (count: number) => `${count.toLocaleString('uk-UA')} переглядів`
    },
    home: {
        categoryAll: "Всі",
        noVideosInCategory: "Відео в цій категорії не знайдено."
    },
    auth: {
        loginTitle: "Авторизація",
        emailLabel: "Email",
        emailPlaceholder: "admin@test.com або alina@test.com",
        passwordLabel: "Пароль",
        passwordPlaceholder: "admin або user",
        submitBtn: "Увійти",
        noAccountText: "Немає акаунту?",
        registerLink: "Зареєструватися",
        errorInvalidData: "Невірний email або пароль",
        toastAuthRequired: "Щоб переглянути відео, необхідно авторизуватися"
    },

    search: {
        resultsFor: "Результати за запитом:",
        queryTrimmed: (limit: number) => `(запит обрізано до ${limit} символів)`,
        noResults: "За вашим запитом нічого не знайдено."
    },

    videoPage: {
        subscribeBtn: "Підписатися",
        subscribers: (count: string) => `${count} підписників`,
        viewsInfo: (count: number, date: string) => `${count.toLocaleString('uk-UA')} переглядів • ${date}`,
        similarVideos: "Схожі відео",
        videoNotFound: "Відео не знайдено"
    },
} as const;