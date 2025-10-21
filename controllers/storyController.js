const path = require('path');

const storyController = {
    getIndex: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'index.html'));
    },
    createChapter : (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'New_chapter.html'));
    },
    getLibrary: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'Library.html'));
    },
    getDetailStory(req, res) {
        res.sendFile(path.join(__dirname, '../views/public/html', 'Detail_story.html'));
    },
    getNewStory: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'New_story.html'));
    },
    getEditStory : (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'Edit_story.html'));
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
        res.sendFile(path.join(__dirname, '../views/public/html', 'Edit_chapter.html'));
    },
    getSearch: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'Search_result.html'));
    },
    getCategory: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/public/html', 'Category.html'));
    },


};

module.exports = storyController;