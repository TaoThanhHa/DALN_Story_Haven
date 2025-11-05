const express = require('express');
const session = require('express-session');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts'); // Thêm dòng này

// === IMPORTS ROUTES ===
const htmlRoutes = require('./routers/htmlRoutes');
const apiRoutes = require('./routers/apiRoutes');
const adminRoutes = require('./routers/adminRoutes'); // <=== THÊM DÒNG NÀY

// === CẤU HÌNH VIEW ENGINE (EJS) ===
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Đặt thư mục views là 'views'

// === CẤU HÌNH STATIC FILES ===
app.use(express.static(path.join(__dirname, 'views', 'public')));

// === CẤU HÌNH BODY PARSER ===
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// === CẤU HÌNH SESSION ===
app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Đặt true nếu dùng HTTPS trong môi trường production
        maxAge: 24 * 60 * 60 * 1000 // 24 giờ
    }
}));

// === SỬ DỤNG express-ejs-layouts ===
// Lưu ý: Không đặt layout mặc định ở đây. Chúng ta sẽ chỉ định layout trong từng res.render()
// để linh hoạt giữa các layout khác nhau (ví dụ: layout cho người dùng và layout cho admin).
app.use(expressLayouts);


// === SỬ DỤNG CÁC ROUTES ===
app.use('/', htmlRoutes); // Các routes HTML (trang chủ, đăng nhập, v.v.)
app.use('/api', apiRoutes); // Các API cho phía người dùng
app.use('/admin', adminRoutes); // <=== THÊM DÒNG NÀY cho Admin Panel

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});