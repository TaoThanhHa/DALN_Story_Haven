const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',   // nếu bạn không đặt mật khẩu cho root trong XAMPP thì để trống
    database: 'story_haven',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL (XAMPP)');
});

module.exports = connection;