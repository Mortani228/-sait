const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('./database.js'); // Соединение с базой данных

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your_jwt_secret';

app.use(cors());
app.use(bodyParser.json());

// Регистрация
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedPassword], function(err) {
        if (err) {
            return res.status(400).send("Ошибка регистрации");
        }
        res.status(201).send("Пользователь зарегистрирован!");
    });
});

// Логин
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (!user) return res.status(400).send("Неправильный email или пароль");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send("Неправильный email или пароль");

        const token = jwt.sign({ userId: user._id, role: user.role, email: user.email }, JWT_SECRET);
        res.json({ token, role: user.role });
    });
});

// Middleware для проверки токена
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) return res.status(403).send("Требуется авторизация");

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send("Неправильный токен");
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    });
};

// Получить все посты
app.get('/forum', verifyToken, (req, res) => {
    db.all(`SELECT * FROM posts ORDER BY createdAt DESC`, [], (err, posts) => {
        if (err) {
            return res.status(500).send("Ошибка получения постов");
        }
        res.json(posts);
    });
});

// Создать новый пост
app.post('/forum', verifyToken, (req, res) => {
    const { username, content } = req.body;

    db.run(`INSERT INTO posts (username, content) VALUES (?, ?)`, [username, content], function(err) {
        if (err) {
            return res.status(400).send("Ошибка создания поста");
        }
        res.status(201).send("Пост создан!");
    });
});

// Обновить пост
app.put('/forum/:id', verifyToken, (req, res) => {
    if (req.role !== 'admin') return res.status(403).send("Запрещено");

    const { id } = req.params;
    const { username, content } = req.body;

    db.run(`UPDATE posts SET username = ?, content = ? WHERE id = ?`, [username, content, id], function(err) {
        if (err) {
            return res.status(400).send("Ошибка обновления поста");
        }
        res.send("Пост обновлен!");
    });
});

// Удалить пост
app.delete('/forum/:id', verifyToken, (req, res) => {
    if (req.role !== 'admin') return res.status(403).send("Запрещено");

    const { id } = req.params;

    db.run(`DELETE FROM posts WHERE id = ?`, [id], function(err) {
        if (err) {
            return res.status(400).send("Ошибка удаления поста");
        }
        res.send("Пост удален!");
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
