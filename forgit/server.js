const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'green_neon_secret';

app.use(express.json());
app.use(cors());

// 1. ПОДКЛЮЧЕНИЕ БД
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error("Ошибка открытия БД:", err.message);
    else console.log("База данных SQLite подключена.");
});

// 2. СОЗДАНИЕ ТАБЛИЦ
db.serialize(() => {
    // Таблица пользователей
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        email TEXT,
        verification_code TEXT,
        is_verified BOOLEAN DEFAULT 0
    )`);

    // Таблица проектов для сохранения сайтов
    db.run(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT,
        blocks TEXT DEFAULT '[]',
        preview_url TEXT,
        access_level TEXT DEFAULT 'author', -- 'all' (все), 'auth' (только авторизованные), 'author' (только автор)
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    console.log("Таблицы БД готовы.");
});

// 3. НАСТРОЙКА ЯНДЕКС.ПОЧТЫ
const YANDEX_USER = 'mr-fort205@yandex.ru'; 
const YANDEX_PASS = 'bwzymdcaiskutiux'; 

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true, 
    border: true,
    auth: {
        user: YANDEX_USER,
        pass: YANDEX_PASS
    }
});

transporter.verify((error) => {
    if (error) console.error("ОШИБКА ПОЧТЫ:", error.message);
    else console.log("Яндекс.Почта готова к отправке писем.");
});

// --- МИДЛВАР: ПРОВЕРКА АВТОРИЗАЦИИ (JWT) ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: "Нет доступа (токен отсутствует)" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Токен недействителен или устарел" });
        req.user = user;
        next();
    });
};

// 4. РОУТ: РЕГИСТРАЦИЯ
app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;
    console.log(`Попытка регистрации: ${username} (${email})`);

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(
            "INSERT INTO users (username, password, email, verification_code) VALUES (?, ?, ?, ?)",
            [username, hashedPassword, email, code],
            async function(err) {
                if (err) {
                    console.error("Ошибка БД:", err.message);
                    return res.status(400).json({ error: "Этот никнейм уже занят." });
                }

                try {
                    await transporter.sendMail({
                        from: `"GreenBuild" <${YANDEX_USER}>`,
                        to: email,
                        subject: "Благодарим за регистрацию на GreenBuild",
                        html: `
                            <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1a202c; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
                                <div style="background-color: #059669; padding: 25px; text-align: center;">
                                    <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: -1px;">GreenBuild</h1>
                                </div>
                                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #edf2f7;">
                                    <img src="cid:welcome-image" alt="Welcome to GreenBuild" style="width: 100%; max-width: 500px; border-radius: 10px;" />
                                </div>
                                <div style="padding: 30px; text-align: center;">
                                    <h2 style="color: #064e3b; margin-top: 0;">Добрый день!</h2>
                                    <p style="font-size: 16px; color: #4a5568;">Благодарим вас за регистрацию на нашем сайте. Мы рады видеть вас в сообществе!</p>
                                    
                                    <div style="background-color: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 20px; margin: 25px 0;">
                                        <p style="margin: 0; color: #065f46; font-size: 13px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Ваш код подтверждения</p>
                                        <h2 style="font-size: 42px; color: #047857; margin: 10px 0; letter-spacing: 6px;">${code}</h2>
                                    </div>

                                    <p style="color: #718096; font-size: 14px; font-style: italic;">Если это были не вы, просто проигнорируйте данное письмо.</p>
                                </div>
                                <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                                    <p style="font-size: 12px; color: #94a3b8; margin: 0;">© 2026 GreenBuild. Экологичная разработка сайтов.</p>
                                </div>
                            </div>
                        `,
                        attachments: [{
                            filename: '1.png',
                            path: './1.png',
                            cid: 'welcome-image' 
                        }]
                    });
                    console.log(`Письмо успешно отправлено на ${email}`);
                    res.status(201).json({ message: "Код отправлен на почту" });
                } catch (mailErr) {
                    console.error("ЯНДЕКС ОШИБКА:", mailErr.message);
                    res.status(500).json({ error: "Ошибка при отправке письма." });
                }
            }
        );
    } catch (e) {
        res.status(500).json({ error: "Ошибка на стороне сервера." });
    }
});

// 5. РОУТ: ПОДТВЕРЖДЕНИЕ
app.post('/api/verify', (req, res) => {
    const { username, code } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND verification_code = ?", [username, code], (err, user) => {
        if (err || !user) return res.status(400).json({ error: "Неверный код" });

        db.run("UPDATE users SET is_verified = 1, verification_code = NULL WHERE id = ?", [user.id], (updErr) => {
            if (updErr) return res.status(500).json({ error: "Ошибка БД" });
            res.json({ message: "Аккаунт подтвержден!" });
        });
    });
});

// 6. РОУТ: ЛОГИН
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err || !user) return res.status(401).json({ error: "Пользователь не найден" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Неверный пароль" });

        if (!user.is_verified) {
            return res.status(403).json({ error: "Пожалуйста, подтвердите аккаунт!" });
        }

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token, username: user.username });
    });
});

// 7. РОУТ: ВОССТАНОВЛЕНИЕ ПАРОЛЯ
app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: "Пользователь с таким email не найден." });
        }

        const tempPassword = Math.random().toString(36).slice(-8);
        
        try {
            const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

            db.run("UPDATE users SET password = ? WHERE id = ?", [hashedTempPassword, user.id], async (updErr) => {
                if (updErr) return res.status(500).json({ error: "Ошибка при обновлении пароля." });

                try {
                    await transporter.sendMail({
                        from: `"GreenBuild Support" <${YANDEX_USER}>`,
                        to: email,
                        subject: "Восстановление доступа к GreenBuild",
                        html: `
                            <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1a202c; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
                                <div style="background-color: #064e3b; padding: 25px; text-align: center;">
                                    <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">GreenBuild</h1>
                                </div>
                                
                                <div style="padding: 40px; text-align: center;">
                                    <div style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
                                        <p style="color: #9a3412; font-size: 14px; margin: 0;">Запрос на восстановление пароля</p>
                                    </div>
                                    
                                    <h2 style="color: #064e3b; margin-top: 0;">Ваш временный пароль</h2>
                                    <p style="font-size: 16px; color: #4a5568;">Мы сбросили ваш старый пароль. Используйте этот код для входа в систему:</p>
                                    
                                    <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; margin: 25px 0;">
                                        <h2 style="font-size: 32px; color: #1e293b; margin: 0; font-family: monospace; letter-spacing: 2px;">${tempPassword}</h2>
                                    </div>
                                    <p style="color: #ef4444; font-size: 13px; font-weight: bold;">ВАЖНО: После входа обязательно измените пароль в настройках профиля!</p>
                                </div>
                                <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                                    <p style="font-size: 12px; color: #94a3b8; margin: 0;">Если вы не запрашивали восстановление, немедленно свяжитесь с поддержкой.</p>
                                </div>
                            </div>
                        `
                    });
                    console.log(`Временный пароль отправлен на ${email}`);
                    res.json({ message: "Новый пароль отправлен на вашу почту." });
                } catch (mailErr) {
                    console.error("Ошибка отправки пароля:", mailErr.message);
                    res.status(500).json({ error: "Не удалось отправить письмо." });
                }
            });
        } catch (e) {
            res.status(500).json({ error: "Ошибка сервера." });
        }
    });
});

// 8. РОУТ: ПОЛУЧИТЬ ВСЕ ПРОЕКТЫ ПОЛЬЗОВАТЕЛЯ
app.get('/api/projects', authenticateToken, (req, res) => {
    db.all("SELECT id, name, blocks, preview_url, created_at FROM projects WHERE user_id = ? ORDER BY created_at DESC", [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: "Ошибка БД при получении проектов" });
        res.json(rows || []);
    });
});

// 9. РОУТ: ПОЛУЧИТЬ ДАННЫЕ ОДНОГО ПРОЕКТА (ДЛЯ РЕДАКТОРА)
app.get('/api/projects/:id', authenticateToken, (req, res) => {
    db.get("SELECT * FROM projects WHERE id = ? AND user_id = ?", [req.params.id, req.user.id], (err, project) => {
        if (err) return res.status(500).json({ error: "Ошибка базы данных" });
        if (!project) return res.status(404).json({ error: "Проект не найден" });

        res.json({
            id: project.id,
            name: project.name,
            blocks: JSON.parse(project.blocks || '[]')
        });
    });
});

// 10. РОУТ: СОЗДАНИЕ НОВОГО ПРОЕКТА (С ПОДДЕРЖКОЙ ШАБЛОНОВ)
app.post('/api/projects', authenticateToken, (req, res) => {
    const { name, blocks } = req.body;
    if (!name) return res.status(400).json({ error: "Название проекта обязательно" });

    const blocksStr = blocks ? JSON.stringify(blocks) : JSON.stringify([]);

    db.run(
        "INSERT INTO projects (user_id, name, blocks) VALUES (?, ?, ?)",
        [req.user.id, name, blocksStr],
        function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: "Не удалось создать проект в БД" });
            }
            res.status(201).json({ id: this.lastID, name: name });
        }
    );
});

// 11. РОУТ: СОХРАНИТЬ ИЗМЕНЕНИЯ ПРОЕКТА
app.put('/api/projects/:id', authenticateToken, (req, res) => {
    const { blocks, name } = req.body;
    const blocksStr = JSON.stringify(blocks || []);

    db.run(
        "UPDATE projects SET blocks = ?, name = ? WHERE id = ? AND user_id = ?",
        [blocksStr, name, req.params.id, req.user.id],
        function (err) {
            if (err) return res.status(500).json({ error: "Ошибка сохранения в базу данных" });
            if (this.changes === 0) return res.status(404).json({ error: "Проект не найден или отказано в доступе" });

            res.json({ message: "Проект успешно сохранен!" });
        }
    );
});

// 12. РОУТ: ИЗМЕНЕНИЕ ПУБЛИЧНОСТИ/ПУБЛИКАЦИЯ ПРОЕКТА
app.put('/api/projects/:id/publish', authenticateToken, (req, res) => {
    const { access_level } = req.body;
    
    if (!['all', 'auth', 'author'].includes(access_level)) {
        return res.status(400).json({ error: "Некорректный уровень доступа" });
    }

    db.run(
        "UPDATE projects SET access_level = ? WHERE id = ? AND user_id = ?",
        [access_level, req.params.id, req.user.id],
        function (err) {
            if (err) return res.status(500).json({ error: "Ошибка базы данных при публикации" });
            if (this.changes === 0) return res.status(404).json({ error: "Проект не найден или вы не автор" });
            
            res.json({ message: "Статус публикации успешно обновлен!", access_level });
        }
    );
});

// 13. РОУТ: ПРОСМОТР ОПУБЛИКОВАННОГО САЙТА
app.get('/api/projects/:id/view', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    let viewingUserId = null;

    const processRequest = () => {
        db.get("SELECT * FROM projects WHERE id = ?", [req.params.id], (err, project) => {
            if (err || !project) return res.status(404).json({ error: "Сайт не найден" });

            const isAuthor = viewingUserId === project.user_id;

            if (project.access_level === 'author' && !isAuthor) {
                return res.status(403).json({ error: "Доступ запрещен. Этот сайт видит только его создатель." });
            }

            if (project.access_level === 'auth' && !viewingUserId) {
                return res.status(401).json({ error: "Доступ запрещен. Для просмотра необходимо авторизоваться." });
            }

            res.json({ name: project.name, blocks: JSON.parse(project.blocks || '[]') });
        });
    };

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (!err) viewingUserId = user.id;
            processRequest();
        });
    } else {
        processRequest();
    }
});

// 14. РОУТ: УДАЛЕНИЕ ПРОЕКТА (Добавлено для работы Dashboard.jsx)
app.delete('/api/projects/:id', authenticateToken, (req, res) => {
    db.run("DELETE FROM projects WHERE id = ? AND user_id = ?", [req.params.id, req.user.id], function (err) {
        if (err) return res.status(500).json({ error: "Ошибка при удалении проекта" });
        if (this.changes === 0) return res.status(404).json({ error: "Проект не найден или нет прав на удаление" });
        res.json({ message: "Проект успешно удален" });
    });
});

// ЗАПУСК
app.listen(PORT, () => {
    console.log(`-------------------------------------------`);
    console.log(`СЕРВЕР ЗАПУЩЕН НА ПОРТУ ${PORT}`);
    console.log(`-------------------------------------------`);
});