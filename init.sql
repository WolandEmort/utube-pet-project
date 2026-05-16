--
-- PostgreSQL database dump
--

\restrict 2ihegm0zPOp4ZfxjPNEzqdULETkZcV5qFEhYh1RSrVmgqxAOkFNJqTUNLFJ29TL

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-05-16 20:20:41

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 17368)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16958)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) CONSTRAINT users_password_not_null NOT NULL,
    name character varying(100) NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['user'::character varying, 'admin'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16973)
-- Name: videos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.videos (
    id character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    channel_name character varying(100) NOT NULL,
    views integer DEFAULT 0,
    thumbnail_url character varying(255) NOT NULL,
    category character varying(50) NOT NULL,
    posted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.videos OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16987)
-- Name: view_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.view_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    video_id character varying(50),
    viewed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.view_history OWNER TO postgres;

--
-- TOC entry 5044 (class 0 OID 16958)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, name, role, created_at) FROM stdin;
934f669d-8fe1-4cc9-8e4c-b45153e4a158	test@test.com	$2y$12$GnmSbtSv169C7E2HshR3degmG6gI6UhNAARSrQ7i8SMdZR3jQefSm	Test User	user	2026-05-11 12:43:15.741529
d76190d7-ba25-4e22-a666-b91959441447	3@test.com	$2y$12$9.pUTRMAxYMEn28Y/nKqNeZyHVGEpyYHc9e24g7XCh7s3Sg7Ea/A2	Іван Іванченко	user	2026-05-11 16:10:54.932423
80bca0c9-b9ed-4d89-b73e-1b53c8a1d359	admin@dev.com	$2y$12$HZ3R3t674XlaWjOKlbDePutB/8OBRaWzJsNJFvsIEKyBfrY8Dsnja	admin	admin	2026-05-11 16:35:47.334927
\.


--
-- TOC entry 5045 (class 0 OID 16973)
-- Dependencies: 221
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.videos (id, title, description, channel_name, views, thumbnail_url, category, posted_at) FROM stdin;
dQw4w9WgXcQ	Rick Astley - Never Gonna Give You Up	The official video for Never Gonna Give You Up by Rick Astley	Rick Astley	0	https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg	Music	2026-05-02 19:29:28.073809
bMknfKXIFA8	React Course - Beginner's Tutorial for React 18	Повний курс з React 18. Включає створення проєктів з нуля, роботу зі станом (useState), побічними ефектами (useEffect) та формами.	freeCodeCamp.org	3200000	https://img.youtube.com/vi/bMknfKXIFA8/hqdefault.jpg	Development	2024-05-02 16:53:25.188353
zQnBQ4tB3ZA	TypeScript in 100 Seconds	Швидкий вступ до TypeScript. Пояснюється статична типізація, робота з інтерфейсами та компіляція в JavaScript.	Fireship	1100000	https://img.youtube.com/vi/zQnBQ4tB3ZA/hqdefault.jpg	Development	2023-05-02 16:53:25.188353
Tn6-PIqc4UM	React in 100 Seconds	Огляд React. Розглядаються базові концепції, хуки та алгоритм роботи Virtual DOM.	Fireship	1500000	https://img.youtube.com/vi/Tn6-PIqc4UM/hqdefault.jpg	Development	2024-05-02 16:53:25.188353
dGcsHMXbSOA	Tailwind CSS Full Course	Посібник з використання utility-first фреймворку Tailwind CSS. Створення адаптивних лейаутів та оптимізація білда.	freeCodeCamp.org	890000	https://img.youtube.com/vi/dGcsHMXbSOA/hqdefault.jpg	Development	2025-09-02 16:53:25.188353
k5E2AVpwsko	Angular in 100 Seconds	Пояснення компонентної архітектури Angular, dependency injection та використання TypeScript у фреймворку.	Fireship	850000	https://img.youtube.com/vi/k5E2AVpwsko/hqdefault.jpg	Development	2025-05-02 16:53:25.188353
yfoY53QXEnI	CSS Crash Course For Absolute Beginners	Основи CSS: селектори, блокова модель, позиціонування та базові стилі для веб-сторінок.	Traversy Media	3400000	https://img.youtube.com/vi/yfoY53QXEnI/hqdefault.jpg	Development	2020-05-02 16:53:25.188353
UB1O30fR-EE	HTML Crash Course For Absolute Beginners	Основи HTML: структура документа, теги, семантична розмітка та форми.	Traversy Media	4500000	https://img.youtube.com/vi/UB1O30fR-EE/hqdefault.jpg	Development	2020-05-02 16:53:25.188353
RGOj5yH7evk	Git and GitHub for Beginners	Системи контролю версій. Робота з репозиторіями, коміти, гілки та злиття (merge) у Git.	freeCodeCamp.org	2100000	https://img.youtube.com/vi/RGOj5yH7evk/hqdefault.jpg	Development	2023-05-02 16:53:25.188353
mr15Xzb1Ook	Tailwind CSS in 100 Seconds	Як працює utility-first CSS. Швидке створення адаптивних інтерфейсів.	Fireship	1300000	https://img.youtube.com/vi/mr15Xzb1Ook/hqdefault.jpg	Development	2024-05-02 16:53:25.188353
rfscVS0vtbw	Learn Python - Full Course for Beginners	Базовий синтаксис Python, структури даних та алгоритми для бекенд-розробки.	freeCodeCamp.org	41000000	https://img.youtube.com/vi/rfscVS0vtbw/hqdefault.jpg	Development	2021-05-02 16:53:25.188353
aqz-KE-bpKQ	Big Buck Bunny 4K (Official Blender Foundation)	Відкритий короткометражний анімаційний фільм від Blender Foundation. Використовується для тестування відеоплеєрів.	Blender	12000000	https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg	Entertainment	2011-05-02 16:53:25.188353
jfKfPfyJRdk	lofi hip hop radio - beats to relax/study to	Музична трансляція з лоу-фай хіп-хопом. Відмінно підходить для фону під час написання коду.	Lofi Girl	75000000	https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg	Music	2025-05-02 16:53:25.188353
jNQXAC9IVRw	Me at the zoo	Перше відео, завантажене на YouTube. Історичний артефакт платформи.	jawed	310000000	https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg	Entertainment	2008-05-02 16:53:25.188353
LXb3EKWsInQ	COSTA RICA IN 4K 60fps HDR (ULTRA HD)	Популярне відео для перевірки якості 4K та HDR. Автори дозволяють вбудовування.	Jacob + Katie Schwarz	145000000	https://img.youtube.com/vi/LXb3EKWsInQ/hqdefault.jpg	Cinematic	2018-05-02 16:53:25.188353
M7lc1UVf-VE	YouTube Developers Live: Embedded Web Player	Офіційне тестове відео від команди YouTube. Створене для перевірки роботи iframe та API плеєра.	Google Developers	1500000	https://img.youtube.com/vi/M7lc1UVf-VE/hqdefault.jpg	Development	2016-05-02 16:53:25.188353
HXV3zeQKqGY	SQL Tutorial - Full Database Course for Beginners	Курс з реляційних баз даних та синтаксису SQL (CRUD операції, таблиці, ключі).	freeCodeCamp.org	9500000	https://img.youtube.com/vi/HXV3zeQKqGY/hqdefault.jpg	Development	2021-05-02 16:53:25.188353
\.


--
-- TOC entry 5046 (class 0 OID 16987)
-- Dependencies: 222
-- Data for Name: view_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.view_history (id, user_id, video_id, viewed_at) FROM stdin;
9eb9023d-abeb-4f47-8a84-32a34ca2fa46	d76190d7-ba25-4e22-a666-b91959441447	Tn6-PIqc4UM	2026-05-13 19:45:09.6274
8ceb008f-bda0-4c60-944c-db8d50630efa	d76190d7-ba25-4e22-a666-b91959441447	dQw4w9WgXcQ	2026-05-13 19:45:15.114351
f3db5f0a-8189-4a94-9732-99d1ac394d23	d76190d7-ba25-4e22-a666-b91959441447	zQnBQ4tB3ZA	2026-05-13 19:45:23.897113
\.


--
-- TOC entry 4890 (class 2606 OID 17381)
-- Name: view_history unique_user_video; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.view_history
    ADD CONSTRAINT unique_user_video UNIQUE (user_id, video_id);


--
-- TOC entry 4884 (class 2606 OID 16972)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4886 (class 2606 OID 16970)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4888 (class 2606 OID 16986)
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- TOC entry 4892 (class 2606 OID 16994)
-- Name: view_history view_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.view_history
    ADD CONSTRAINT view_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4894 (class 2606 OID 16996)
-- Name: view_history view_history_user_id_video_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.view_history
    ADD CONSTRAINT view_history_user_id_video_id_key UNIQUE (user_id, video_id);


--
-- TOC entry 4882 (class 1259 OID 17379)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 4895 (class 2606 OID 16997)
-- Name: view_history view_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.view_history
    ADD CONSTRAINT view_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4896 (class 2606 OID 17002)
-- Name: view_history view_history_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.view_history
    ADD CONSTRAINT view_history_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE;


-- Completed on 2026-05-16 20:20:42

--
-- PostgreSQL database dump complete
--

\unrestrict 2ihegm0zPOp4ZfxjPNEzqdULETkZcV5qFEhYh1RSrVmgqxAOkFNJqTUNLFJ29TL

