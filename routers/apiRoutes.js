const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const multer = require('multer');
const connection = require('../configs/mysqlConnect');

// Cấu hình multer
const storage = multer.diskStorage({
    destination: './views/public/images/',
    filename: (req, file, cb) => {
        cb(null, 'story-' + Date.now() + require('path').extname(file.originalname));
    }
});
const upload = multer({ storage });

const authMiddleware = (req, res, next) => {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
    next();
};

// Story routes
router.get('/stories', apiController.getStories);
router.get('/storiesbyuser', authMiddleware, apiController.getAllStoryByUserId);
router.get('/story/:id', apiController.getStory);
router.put('/story/:id', apiController.updateStory);
router.delete('/story/:id', apiController.deleteStory);
router.get('/stories/search', apiController.getStoryByTitle);
router.post('/story/new', authMiddleware, upload.single('thumbnail'), apiController.createStory);
router.put('/story/:id/thumbnail', upload.single('thumbnail'), apiController.updateThumnail);
router.post('/chapter/new', authMiddleware, apiController.createChapter);
router.get('/chapter/:id', apiController.getChapter);
router.get('/chapters/max', apiController.getMaxPageChapter);
router.get('/user/account-info', authMiddleware, apiController.getAccountInfo);
router.put('/chapter/:id', authMiddleware, apiController.updateChapter);
router.delete('/chapter/:id', authMiddleware, apiController.deleteChapter);

// User routes
router.post('/register', apiController.register);
router.post('/login', apiController.login);
router.post('/logout', authMiddleware, apiController.logout);


router.get('/stories', (req, res) => {
    connection.query('SELECT * FROM stories', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

router.get('/stories', (req, res) => {
    const page = parseInt(req.query.page) || 1;  // Trang hiện tại (mặc định là 1)
    const limit = parseInt(req.query.limit) || 5; // Số truyện mỗi trang (mặc định 5)
    const offset = (page - 1) * limit;

    const query = `SELECT * FROM stories LIMIT ? OFFSET ?`; 
    connection.query(query, [limit, offset], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        connection.query(`SELECT COUNT(*) AS total FROM stories`, (err, countResult) => {
            if (err) return res.status(500).json({ error: err.message });

            const totalStories = countResult[0].total;
            const totalPages = Math.ceil(totalStories / limit);

            res.json({
                stories: results,
                currentPage: page,
                totalPages: totalPages
            });
        });
    });
});

module.exports = router;