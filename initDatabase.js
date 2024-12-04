const db = require('./database.js');

// Добавьте тестового пользователя
db.run(`INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)`, ['admin@example.com', 'admin123', 'admin'], function(err) {
    if (err) {
        return console.error(err.message);
    }
    console.log(`Администратор добавлен с ID ${this.lastID}`);
});

// Закрываем соединение
db.close();
