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
router.post('/story/new', authMiddleware, upload.single('thumbnail'), apiController.createStory);
router.put('/story/:id/thumbnail', upload.single('thumbnail'), apiController.updateThumnail);
router.post('/chapter/new', authMiddleware, apiController.createChapter);
router.get('/chapter/:id', apiController.getChapter);
router.get('/chapters/max', apiController.getMaxPageChapter);
router.get('/user/account-info', authMiddleware, apiController.getAccountInfo);
router.put('/chapter/:id', authMiddleware, apiController.updateChapter);
router.delete('/chapter/:id', authMiddleware, apiController.deleteChapter);
router.get('/stories/search', apiController.getStoryByTitle);
router.get('/stories/category', apiController.getStoriesByCategory);
// View
router.post('/chapter/view', apiController.addChapterView);
router.get('/story/:storyId/views', apiController.getStoryViews);

// Vote
router.post('/chapter/vote', apiController.toggleVote);
router.get('/chapter/:chapterId/votes', apiController.getChapterVotes);

// Follow
router.post('/story/follow', apiController.toggleFollow);
router.get('/user/follows', apiController.getUserFollows);

// User routes
router.post('/register', apiController.register);
router.post('/login', apiController.login);
router.post('/logout', authMiddleware, apiController.logout);

module.exports = router;