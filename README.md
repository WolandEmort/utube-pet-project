https://utube-project-ruby.vercel.app — розміщено тут.

# Електронний каталог відеоконтенту (YouTube Clone)
 
Fullstack-застосунок для зберігання, каталогізації та перегляду відеоконтенту: Single Page Application на React та REST API на Node.js/Express з базою PostgreSQL. Pet-проєкт для демонстрації навичок fullstack-розробки.
 
**Live demo:** https://utube-project-ruby.vercel.app
 
## Основний функціонал
 
- **Каталог відео** з миттєвою фільтрацією за категоріями на стороні клієнта
- **Пошук** (`/search`) за назвою відео без урахування регістру (`ILIKE`)
- **Автентифікація:** реєстрація і вхід, stateless JWT (24 години), паролі хешуються через bcrypt
- **Історія переглядів** для авторизованих користувачів
- **Панель адміністратора:** створення, редагування та видалення відео. Рольовий доступ (RBAC): на клієнті через `ProtectedRoute`, на сервері через middleware `isAdmin` (відповідь 403)
## Технологічний стек
 
**Frontend**
- React 19, TypeScript, Vite
- Tailwind CSS 4
- React Router 7
- Context API для стану авторизації (`AuthContext`, хук `useAuth`)
- Власний хук `useApi`: обгортка над `fetch` (підстановка токена, обробка 401, розбір помилок)
**Backend**
- Node.js, Express 5
- `pg` (PostgreSQL), запити з параметрами (`$1`, `$2`)
- `jsonwebtoken` (JWT), `bcryptjs` (хешування паролів)
- `cors`, `dotenv`
**Розгортання:** Vercel (frontend як SPA з rewrite на `index.html`, backend через `@vercel/node`).
 
## Архітектура
 
```
Сторінка → useApi (request) → useAuth (токен, logout) → REST API (Express) → PostgreSQL
```
 
- **`AuthContext`** тримає користувача й JWT, зберігає їх у `localStorage`, надає `login`, `register`, `logout`.
- **`useApi`** повертає функцію `request(endpoint, options)`: додає заголовок `Authorization: Bearer <token>`, ставить `Content-Type: application/json` для рядкових тіл, парсить JSON і кидає `Error` з повідомленням бекенду, якщо відповідь не успішна. На 401 виконує вихід з акаунту й перенаправляє на `/login`. Функція мемоізована через `useCallback`, бо потрапляє в залежності `useEffect` на сторінках.
- Вхід і реєстрація йдуть напряму через `fetch`, а не через `useApi`: для них 401 означає «невірні дані», а не «сесія закінчилась». До того ж `AuthProvider` стоїть над роутером, а `useApi` потребує `useNavigate`.
- **`ProtectedRoute`** захищає `/history` (авторизований користувач) та `/admin/*` (роль `admin`). Це зручність інтерфейсу, реальна перевірка ролі виконується на сервері.
- Короткі Tech Doc: [`useApi`](frontend/src/hooks/README.md) та [`AuthContext`](frontend/src/context/README.md).
### Маршрути клієнта
 
| Шлях | Опис | Доступ |
| --- | --- | --- |
| `/` | Каталог з фільтром за категоріями | усі |
| `/watch/:id` | Перегляд відео | усі |
| `/search` | Пошук | усі |
| `/login`, `/register` | Вхід і реєстрація | усі |
| `/history` | Історія переглядів | авторизовані |
| `/admin`, `/admin/create`, `/admin/edit/:id` | Керування відео | `admin` |
 
## API
 
| Метод | Маршрут | Доступ | Опис |
| --- | --- | --- | --- |
| GET | `/` (`?q=`) | усі | Список відео, опційно пошук за назвою |
| POST | `/register` | усі | Реєстрація |
| POST | `/login` | усі | Вхід, повертає `token` і `user` |
| GET | `/history` | JWT | Історія переглядів користувача |
| POST | `/history` | JWT | Записати перегляд (`video_id`) |
| POST | `/videos` | `admin` | Створити відео |
| PUT | `/videos/:id` | `admin` | Оновити відео |
| DELETE | `/videos/:id` | `admin` | Видалити відео |
 
Помилки повертаються у вигляді `{ "error": "..." }`. Токен має payload `sub`, `email`, `name`, `role` і діє 24 години.
 
## Локальний запуск
 
Потрібні Node.js 20+ та PostgreSQL.
 
### Backend
```bash
cd backend
npm install
```
Створіть `backend/.env`:
```env
PORT=8080
DB_USER=postgres
DB_HOST=localhost
DB_NAME=utube
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_secret_key
```
Створіть базу й виконайте `backend/database/init.sql`, потім:
```bash
npm run dev      # http://localhost:8080
```
Примітка: підключення до БД використовує SSL (див. «Відомі обмеження»); для локального Postgres без SSL це місце потрібно змінити в `backend/index.js`.
 
### Frontend
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8080" > .env
npm run dev      # http://localhost:5173
npm run lint
npm run build    # tsc -b && vite build
```
Адреса в `VITE_API_URL` має починатися з `http://`, інакше браузер сприйме її як відносний шлях.
 
## Безпека
 
- Усі запити до БД параметризовані (захист від SQL-ін'єкцій)
- Паролі хешуються bcrypt (10 раундів)
- Підпис і термін дії JWT перевіряються middleware `authenticateToken`, роль адміністратора middleware `isAdmin`
## Відомі обмеження
 
- **`backend/database/init.sql` не синхронізований із запитами в `backend/index.js`:** код використовує поля `username` та `url`, а в дампі таблиці мають `name`, `channel_name`, `thumbnail_url`. Схему потрібно привести до одного вигляду.
- CORS відкритий для всіх origin (`cors()` без обмежень), варто обмежити адресою фронтенду
- З'єднання з БД використовує SSL із `rejectUnauthorized: false` (перевірка сертифіката вимкнена)
- Текст помилок БД повертається клієнту (`err.message`), а реєстрація не валідує вхідні дані
- JWT зберігається в `localStorage` (ризик XSS), альтернатива httpOnly-cookie
- Списки відео без пагінації
- Тест компонента `VideoCard` (Vitest + Testing Library) написаний, але залежності та скрипт `test` ще не додані до `package.json`
