const Story = require('../models/storyModel');
const Chapter = require('../models/chapterModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const apiController = {
    // Story APIs
    getStories: (req, res) => {
        Story.getAll((err, stories) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(200).json(stories);
        });
    },
    updateThumnail : (req, res) => {
        const storyId = req.params.id;  
        const thumbnail = req.file ? `/images/${req.file.filename}` : null;
        Story.updateThumbnail(storyId, { thumbnail }, (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(200).json({ success: true });
        });
    },
    deleteStory: (req, res) => {
        const storyId = req.params.id;
        Story.delete(storyId, (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(200).json({ success: true });
        });
    },
    getStory: (req, res) => {
        const storyId = req.params.id;
        Story.getById(storyId, (err, storyResult) => {
            if (err || !storyResult[0]) return res.status(404).json({ error: 'Story not found' });
            Chapter.getByStoryId(storyId, (err, chapters) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                console.log(chapters);

                res.status(200).json({ story: storyResult[0], chapters });
            });
        });
    },
    updateStory: (req, res) => {
        const storyId = req.params.id;
        const { title, description, category, status } = req.body;
        Story.update(storyId, { title, description, category, status }, (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(200).json({ success: true });
        });
    },
    getAllStoryByUserId: (req, res) => {
        if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
        const userId = req.session.user.id;
        Story.getAllByUserId(userId, (err, stories) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(200).json(stories);
        });
    },
    getStoryByTitle: (req, res) => {
        const title = req.query.title;
        if (!title) return res.status(400).json({ error: 'Title is required' });
        Story.getByTitle(title, (err, stories) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(200).json(stories);
        });
    },
    createStory: (req, res) => {
        if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
        const { title, description, category, status } = req.body;
        const thumbnail = req.file ? `/images/${req.file.filename}` : null;
        const userId = req.session.user.id;
        console.log('Create story:', { title, description, category, status, thumbnail, userId });

        const storyData = { user_id: userId, title, description, thumbnail, category, status: status || 'writing' };
        Story.create(storyData, (err, insertId) => {
            if (err) return res.status(500).json({ error: `Database error : ${err}` });
            res.status(200).json({ success: true, storyId: insertId });
        });
    },
    updateChapter: async (req, res) => {
        try {
            const chapterId = req.params.id;
            const { title, content, chapter_number } = req.body;
    
            console.log('updateChapter:', { chapterId, title, content, chapter_number }); // Log giá trị
    
            Chapter.update(chapterId, { title, content, chapter_number }, (err, result) => {
                if (err) {
                    console.error('Error updating chapter:', err);
                    return res.status(500).json({ error: 'Lỗi server: ' + err.message }); // Thêm chi tiết lỗi
                }
    
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Không tìm thấy chương để cập nhật' });
                }
    
                res.status(200).json({ success: true, message: 'Chương đã được cập nhật!' });
            });
    
        } catch (error) {
            console.error('Error updating chapter:', error);
            res.status(500).json({ error: 'Lỗi server: ' + error.message }); 
        }
    },
    
    deleteChapter: (req, res) => {
        const chapterId = req.params.id;
    
        console.log('deleteChapter:', { chapterId }); 
    
        const sql = 'DELETE FROM chapters WHERE id = ?';
    
        db.query(sql, [chapterId], (err, result) => {
            if (err) {
                console.error("Error deleting chapter:", err);
                return res.status(500).json({ error: "Lỗi server: " + err.message });
            }
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Không tìm thấy chương để xóa' });
            }
    
            console.log("Chapter deleted successfully");
            res.status(200).json({ success: true, message: "Chương đã được xóa thành công!" });
        });
    },
    createChapter: (req, res) => {
        if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
        const { title, content, chapter_number } = req.body;
        const storyId = parseInt(req.query.storyId, 10);
        console.log('Create chapter:', { storyId, title, content, chapter_number });
        const chapterData = { storyId, title, content, chapter_number: parseInt(chapter_number) };
        Chapter.create(chapterData, (err) => {
            if (err) return res.status(500).json({ error: `Database error : ${err}` });
            res.status(200).json({ success: true });
        });
    },
    getChapter: (req, res) => {
        const chapterId = req.params.id;
        Chapter.getById(chapterId, (err, chapterResult) => {
            if (err || !chapterResult[0]) {
                return res.status(404).end();  // Không trả về gì cả (body rỗng)
            }
            res.status(200).json(chapterResult[0]);
        });
    },
    getMaxPageChapter: (req, res) => {
        const storyId = req.query.storyId;
        Chapter.getChapterNumber(storyId, (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(200).json(result[0]);
        });
    },

    register: async (req, res) => {
        try {
            const { username, email, password, phone } = req.body;
            console.log('Register:', req.body);

            if (!username || !email || !password) {
                return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
            }

            // Kiểm tra email đã tồn tại chưa
            const existingUser = await new Promise((resolve, reject) => {
                User.findByEmail(email, (err, users) => {
                    if (err) reject(err);
                    else resolve(users.length > 0 ? users[0] : null);
                });
            });

            if (existingUser) {
                return res.status(409).json({ error: 'Email đã được sử dụng' });
            }

            const newUser = await new Promise((resolve, reject) => {
                User.create({ username, email, password: password, phone }, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });

            res.status(201).json({
                success: true,
                userId: newUser.insertId,
                message: 'Đăng ký thành công'
            });

        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log('Login input:', { email, password, length: password.length });
            const users = await new Promise((resolve, reject) => {
                User.findByEmail(email, (err, users) => {
                    if (err) reject(err);
                    else resolve(users);
                });
            });
            if (!users[0]) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const user = users[0];
            bcrypt.compare(password, user.password, (err, match) => {
                if (err) {
                    console.log('Error comparing passwords:', err);
                    return res.status(500).json({ error: 'Server error' });
                }
                if (!match) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }
                req.session.user = { id: user.id, email: user.email, username: user.username };
                res.status(200).json({ success: true });
            });
        } catch (err) {
            console.log('Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    },
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) return res.status(500).json({ error: 'Logout failed' });
            res.status(200).json({ success: true });
        });
    },
    getAccountInfo : (req, res) => {
        if (!req.session.user) {
            return res.status(401).json({ error: "Bạn chưa đăng nhập" });
        }
    
        const userId = req.session.user.id; // Lấy ID từ session
    
        User.getById(userId, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Lỗi server" });
            }
            if (result.length === 0) {
                return res.status(404).json({ error: "Không tìm thấy người dùng" });
            }
            res.json(result[0]); // Gửi dữ liệu về frontend
        });
    },
    
    
    
    getUsers: (req, res) => { /* ... */ },
    getUser: (req, res) => { /* ... */ },
    updateUser: (req, res) => { /* ... */ },
    deleteUser: (req, res) => { /* ... */ }
};

module.exports = apiController;