const db = require('../configs/mysqlConnect');
const bcrypt = require('bcrypt');

const User = {
    getAll: (callback) => {
        const sql = 'SELECT id, username, email, created_at, phonenumber FROM users';
        db.query(sql, callback);
    },
    getById: (id, callback) => {
        const sql = 'SELECT id, username, email, created_at, phonenumber FROM users WHERE id = ?';
        db.query(sql, [id], callback);
    },
    create: (userData, callback) => {
        bcrypt.hash(userData.password, 10, (err, hash) => {
            if (err) return callback(err);
            const sql = 'INSERT INTO users (username, email, password, phonenumber) VALUES (?, ?, ?, ?)';
            db.query(sql, [userData.username, userData.email, hash, userData.phone], callback);
        });
    },
    update: (id, userData, callback) => {
        const sql = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
        db.query(sql, [userData.username, userData.email, id], callback);
    },
    delete: (id, callback) => {
        const sql = 'DELETE FROM users WHERE id = ?';
        db.query(sql, [id], callback);
    },
    findByEmail: (email, callback) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], callback);
    }
};

module.exports = User;