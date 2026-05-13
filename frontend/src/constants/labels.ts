export const uiLabels = {
    header: {
        logo: "YouTube Clone",
        searchPlaceholder: "Введіть запит",
        history: "Історія перегляду",
        loginBtn: "Увійти",
        logoutBtn: "Вийти",
        adminPanel: 'Адмін-панель',
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

    register: {
        title: 'Реєстрація',
        nameLabel: 'Ім\'я',
        namePlaceholder: 'Іван Іванов',
        submitBtn: 'Зареєструватися',
        loadingBtn: 'Створення акаунта...',
        haveAccountText: 'Вже маєте акаунт?',
        loginLink: 'Увійти',
        errorUnknown: 'Сталася невідома помилка під час реєстрації',
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
        videoNotFound: "Відео не знайдено",
        loading: 'Завантаження відео...',
        errorPrefix: 'Помилка:',
        errorUnknown: 'Невідома помилка при отриманні даних',
        likeBtn: 'Лайк',
        dislikeBtn: 'Дизлайк',
        mockLikesCount: '126 тис.',
        mockSubscribersCount: '1.2 млн',
    },

    history: {
        title: 'Історія переглядів',
        emptyText: 'Ви ще не переглянули жодного відео.',
        loading: 'Завантаження історії...',
        errorLoad: 'Помилка завантаження історії',
        errorUnknown: 'Невідома помилка',
        viewedAt: 'Переглянуто:',
    },

    admin: {
        title: 'Панель керування контентом',
        tableTitle: 'Назва відео',
        tableCategory: 'Категорія',
        tableDate: 'Дата завантаження',
        tableActions: 'Дії',
        deleteBtn: 'Видалити',
        confirmDelete: 'Ви впевнені, що хочете видалити це відео?',
        emptyText: 'Відео поки що немає',
        errorDelete: 'Помилка при видаленні',
    }

} as const;