const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware'); // <=== Đảm bảo dòng này đã có

// === Áp dụng middleware isAdmin cho tất cả các route trong adminRoutes ===
// Điều này đảm bảo chỉ admin mới có thể truy cập bất kỳ route nào bắt đầu bằng /admin
router.use(authMiddleware.isAdmin);

// === ROUTES HIỂN THỊ TRANG ADMIN (HTML/EJS) ===
router.get('/dashboard', (req, res) => {
    res.render('admin/admin_dashboard', {
        layout: 'admin/admin_layout',
        pageTitle: 'Dashboard Admin',
        pageCss: 'admin_dashboard.css',
        pageJs: 'admin_dashboard.js'
    });
});

router.get('/users', (req, res) => {
    res.render('admin/admin_users', {
        layout: 'admin/admin_layout',
        pageTitle: 'Quản lý Người dùng',
        pageCss: 'admin_users.css',
        pageJs: 'admin_users.js'
    });
});

router.get('/stories', (req, res) => {
    res.render('admin/admin_stories', {
        layout: 'admin/admin_layout',
        pageTitle: 'Quản lý Truyện',
        pageCss: 'admin_stories.css',
        pageJs: 'admin_stories.js'
    });
});

router.get('/categories', (req, res) => {
    res.render('admin/admin_categories', {
        layout: 'admin/admin_layout',
        pageTitle: 'Quản lý Thể loại',
        pageCss: 'admin_categories.css',
        pageJs: 'admin_categories.js'
    });
});

router.get('/comments', (req, res) => {
    res.render('admin/admin_comments', {
        layout: 'admin/admin_layout',
        pageTitle: 'Quản lý Bình luận',
        pageCss: 'admin_comments.css',
        pageJs: 'admin_comments.js'
    });
});

// === API ROUTES CHO ADMIN (sử dụng /admin/api/...) ===
router.get('/api/dashboard/stats', adminController.getDashboardStats); // <=== THÊM DÒNG NÀY

router.get('/api/users', adminController.getUsers);


// === API ROUTES CHO ADMIN (sử dụng /admin/api/...) ===
router.get('/api/users', adminController.getUsers);
router.get('/api/users/:id', adminController.getUserById);
router.put('/api/users/:id', adminController.updateUser);
router.put('/api/users/:id/status', adminController.updateUserStatus);
router.delete('/api/users/:id', adminController.deleteUser);

// === API ROUTES CHO ADMIN - STORIES ===
router.get('/api/stories', adminController.getStories);         // Lấy danh sách truyện (có phân trang, tìm kiếm)
router.get('/api/stories/:id', adminController.getStoryById);   // Lấy chi tiết một truyện và các chương của nó
router.put('/api/stories/:id/status', adminController.updateStoryStatus); // Cập nhật trạng thái của truyện (ví dụ: complete/writing, hoặc khóa/mở khóa)
router.put('/api/stories/:id', adminController.updateStory);
router.delete('/api/stories/:id', adminController.deleteStory); // Xóa truyện và các chương liên quan

// API để lấy danh sách các thể loại độc đáo từ các truyện
router.get('/api/story-categories', adminController.getUniqueStoryCategories);

// === API ROUTES CHO ADMIN - COMMENTS ===
router.get('/api/reported-comments', adminController.getReportedComments); // Lấy danh sách bình luận bị báo cáo
router.get('/api/reported-comments/:id', adminController.getReportedCommentById); // Lấy chi tiết một báo cáo bình luận
router.put('/api/reported-comments/:id/status', adminController.updateReportedCommentStatus); // Cập nhật trạng thái xử lý báo cáo
router.put('/api/comments/:id/status', adminController.updateCommentStatus); // Cập nhật trạng thái của bình luận gốc (ẩn/hiển thị)
router.delete('/api/comments/:id', adminController.deleteComment); // Xóa bình luận gốc và các báo cáo liên quan
router.delete('/api/reported-comments/:id', adminController.deleteReportedComment); // Xóa một báo cáo cụ thể

// ... Các API khác cho stories, categories, comments sẽ được thêm vào đây ...


module.exports = router;