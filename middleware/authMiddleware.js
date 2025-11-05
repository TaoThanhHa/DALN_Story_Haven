// middleware/authMiddleware.js

// Middleware để kiểm tra xem người dùng đã đăng nhập chưa
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next(); // Đã đăng nhập, cho phép đi tiếp
    } else {
        // Nếu chưa đăng nhập, trả về lỗi 401 hoặc chuyển hướng về trang login
        if (req.originalUrl.startsWith('/api')) { // Nếu là API request
            return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
        }
        // Nếu là HTML page request, chuyển hướng đến trang login
        req.session.returnTo = req.originalUrl; // Lưu URL muốn truy cập sau khi login
        return res.redirect('/login'); // Giả định bạn có một route '/login'
    }
};

// Middleware để kiểm tra và phân quyền Admin
const isAdmin = (req, res, next) => {
    // Đầu tiên, kiểm tra xem người dùng đã đăng nhập chưa
    if (!req.session.user) {
        if (req.originalUrl.startsWith('/admin/api')) {
            return res.status(401).json({ error: 'Unauthorized: Admin access required.' });
        }
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }

    // Sau đó, kiểm tra vai trò (role) của người dùng
    if (req.session.user.role === 'admin') {
        next(); // Là admin, cho phép đi tiếp
    } else {
        // Nếu không phải admin, trả về lỗi 403 (Forbidden) hoặc chuyển hướng
        if (req.originalUrl.startsWith('/admin/api')) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
        }
        // Chuyển hướng đến một trang thông báo lỗi quyền hoặc trang chủ
        return res.status(403).render('error_page', { message: 'Bạn không có quyền truy cập trang này.' }); // Giả định bạn có một error_page.ejs
    }
};

// Middleware để kiểm tra xem người dùng có phải là tác giả (author) hay không
const isAuthor = (req, res, next) => {
    if (!req.session.user) {
        if (req.originalUrl.startsWith('/api')) {
            return res.status(401).json({ error: 'Unauthorized: Author access required.' });
        }
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }

    if (req.session.user.role === 'author' || req.session.user.role === 'admin') { // Admin cũng có quyền của tác giả
        next();
    } else {
        if (req.originalUrl.startsWith('/api')) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions (Author role required).' });
        }
        return res.status(403).render('error_page', { message: 'Bạn không có quyền thực hiện hành động này (Yêu cầu vai trò Tác giả).' });
    }
};

module.exports = {
    isAuthenticated,
    isAdmin,
    isAuthor
};