const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');


const authMiddleware = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
};
router.get('/', storyController.getIndex);
router.get('/library', storyController.getLibrary);
router.get('/story/new', authMiddleware, storyController.getNewStory);
router.get('/story/edit', authMiddleware, storyController.getEditStory);
router.get('/story/:id/chapter/:chapterId', storyController.getChapter);
router.get('/create-chapter',authMiddleware ,storyController.createChapter);
router.get('/story/:id', storyController.getDetailStory);
router.get('/my-story', authMiddleware, storyController.getMyStory);
router.get('/login', storyController.getLogin);
router.get('/register', storyController.getRegister);
router.get('/account', storyController.getAccount);
router.get('/editchapter', authMiddleware, storyController.getEditChapter);

module.exports = router;