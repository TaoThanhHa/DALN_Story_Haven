const express = require('express');
const session = require('express-session');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser'); // Thêm body-parser
const htmlRoutes = require('./routers/htmlRoutes');
const apiRoutes = require('./routers/apiRoutes');

app.use(express.static('views/public'));
app.use(bodyParser.json()); // Parse JSON body
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded body
// Cấu hình session
app.use(session({
    secret: 'your-session-secret', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Đặt true nếu dùng HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 giờ
    }
}));

app.use('/', htmlRoutes);
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});