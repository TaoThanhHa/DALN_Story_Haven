const path = require('path');

const storyController = {
    getIndex: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'index.html'));
    },
    createChapter : (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'create-chapter.html'));
    },
    getLibrary: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'Library.html'));
    },
    getDetailStory(req, res) {
        res.sendFile(path.join(__dirname, '../views/public/html', 'detail-story.html'));
    },
    getNewStory: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'new-story.html'));
    },
    getEditStory : (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'edit-story.html'));
    },
    getChapter: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'Chapter.html'));
    },
    getMyStory: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'My_story.html'));
    },
    getLogin: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'login.html'));
    },
    getRegister: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'register.html'));
    },
    getAccount: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'Account.html'));
    },
    getEditChapter: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'editchapter.html'));
    },
};

module.exports = storyController;