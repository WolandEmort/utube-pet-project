import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 8080;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    ssl: {
        rejectUnauthorized: false
    }
});


app.use(cors());
app.use(express.json());

// Middleware для автентифікації за допомогою JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Формат "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ error: 'Сесія закінчилась. Будь ласка, авторизуйтесь знову.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'Сесія закінчилась. Будь ласка, авторизуйтесь знову.' });
        }
        req.user = user; // Зберігаємо payload токена у об'єкті запиту
        next();
    });
};

// Middleware для перевірки прав адміністратора (Role-Based Access Control)
const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ заборонено. Потрібні права адміністратора.' });
    }
    next();
};

// --- МАРШРУТИ ДЛЯ ВІДЕО ---

app.get('/', async (req, res) => {
    const { q } = req.query;
    try {
        let result;
        if (q) {
            result = await pool.query(
                'SELECT * FROM videos WHERE title ILIKE $1 ORDER BY posted_at DESC',
                [`%${q}%`]
            );
        } else {
            result = await pool.query('SELECT * FROM videos ORDER BY posted_at DESC');
        }
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- МАРШРУТИ АВТОРИЗАЦІЇ ---

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
            [username, email, hashedPassword]
        );
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Невірний email або пароль' });
        }

        const payload = {
            sub: user.id,
            email: user.email,
            name: user.username,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- МАРШРУТИ ІСТОРІЇ ПЕРЕГЛЯДІВ ---

app.post('/history', authenticateToken, async (req, res) => {
    const { video_id } = req.body;
    const user_id = req.user.sub; // Беремо ID користувача з JWT
    try {
        await pool.query(
            'INSERT INTO view_history (user_id, video_id) VALUES ($1, $2)',
            [user_id, video_id]
        );
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/history', authenticateToken, async (req, res) => {
    const user_id = req.user.sub;
    try {
        const result = await pool.query(
            `SELECT v.*, h.viewed_at 
             FROM view_history h 
             JOIN videos v ON h.video_id = v.id 
             WHERE h.user_id = $1 
             ORDER BY h.viewed_at DESC`,
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- АДМІНІСТРАТИВНІ МАРШРУТИ (CRUD дЛЯ ВІДЕО) ---

app.post('/videos', authenticateToken, isAdmin, async (req, res) => {
    const { id, title, description, url, category } = req.body;
    try {
        await pool.query(
            'INSERT INTO videos (id, title, description, url, category) VALUES ($1, $2, $3, $4, $5)',
            [id, title, description, url, category]
        );
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/videos/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { title, description, url, category } = req.body;
    try {
        await pool.query(
            'UPDATE videos SET title = $1, description = $2, url = $3, category = $4 WHERE id = $5',
            [title, description, url, category, id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/videos/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM videos WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Express API запущено на порту ${port}`);
    });
}

export default app;