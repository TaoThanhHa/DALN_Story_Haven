const Story = require('../models/storyModel');
const Chapter = require('../models/chapterModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const db = require('../configs/mysqlConnect');
const Follow = require("../models/followModel");
console.log(">>> Follow model loaded:", Follow);


const apiController = {
    // Story APIs
    getStories: (req, res) => {
        Story.getPublicStories((err, stories) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: 'Database error' });
            }
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
    updateStoryControl: (req, res) => { 
        const { id } = req.params;
        const { control } = req.body;

        if (control === undefined) {
            return res.status(400).json({ success: false, error: "Thiếu control" });
        }

        const sql = `UPDATE stories SET control = ? WHERE id = ?`;
        db.query(sql, [Number(control), Number(id)], (err, result) => {  // 👈 ép kiểu ở đây
            if (err) {
                console.error("Lỗi khi cập nhật control:", err);
                return res.status(500).json({ success: false, error: "Lỗi máy chủ" });
            }

            console.log("✅ Cập nhật control thành công:", result);
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

    createStory: (req, res) => {
        if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });

        // Lấy dữ liệu từ form
        const { title, description, category, status, control } = req.body;
        const thumbnail = req.file ? `/images/${req.file.filename}` : null;
        const userId = req.session.user.id;

        // Log để kiểm tra dữ liệu gửi lên
        console.log('Create story:', { title, description, category, status, control, thumbnail, userId });

        // Nếu frontend không gửi, mặc định control = '0' (bản thảo)
        const storyData = { 
            user_id: userId,
            title,
            description,
            thumbnail,
            category,
            status: status || 'writing',
            control: control || '0'
        };

        Story.create(storyData, (err, insertId) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: `Database error: ${err.message}` });
            }
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

        // Tìm kiếm truyện theo tiêu đề
    searchStories: (req, res) => {
        const { title } = req.query;
        if (!title) return res.status(400).json({ error: "Thiếu từ khóa tìm kiếm" });

        Story.searchByTitle(title, (err, stories) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(200).json(stories);
        });
    },

    // Lọc truyện theo thể loại
    getStoriesByCategory: (req, res) => {
        const { category } = req.query;
        console.log("Category:", category);

        if (!category) {
            return res.status(400).json({ success: false, error: "Thiếu category" });
        }

        Story.getByCategory(category, (err, results) => {
            if (err) {
                console.error("Lỗi khi lấy truyện theo thể loại:", err);
                return res.status(500).json({ success: false, error: "Lỗi máy chủ" });
            }
            res.json(results);
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
            console.log('Login input:', { email, password });

            // Tìm user theo email
            const users = await new Promise((resolve, reject) => {
                User.findByEmail(email, (err, users) => {
                    if (err) reject(err);
                    else resolve(users);
                });
            });

            if (!users || users.length === 0) {
                return res.status(401).json({ success: false, error: 'Invalid credentials' });
            }

            const user = users[0];
            console.log('User found:', user);

            // So sánh mật khẩu (hỗ trợ cả hash và plaintext)
            const isMatch = await new Promise((resolve) => {
                if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
                    bcrypt.compare(password, user.password, (err, match) => {
                        resolve(!err && match);
                    });
                } else {
                    resolve(password === user.password);
                }
            });

            if (!isMatch) {
                return res.status(401).json({ success: false, error: 'Invalid credentials' });
            }

            // Lưu thông tin user vào session
            req.session.user = {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role || 'user'
            };

            console.log(`✅ Login success: ${user.username} (${req.session.user.role})`);

            // ✅ Gửi về frontend role + đường dẫn tương ứng
            let redirectUrl = '/';
            if (req.session.user.role === 'admin') {
                redirectUrl = '/html/admin_users.html';
            } else {
                redirectUrl = '/html/home.html';
            }

            const loginResponse = { // Tạo đối tượng phản hồi
                success: true,
                message: 'Login successful',
                role: req.session.user.role,
                redirectUrl // 👈 gửi luôn URL về frontend
            };

            console.log("✅ Sending login response:", loginResponse);

            // <<<<<<<<<<<< THÊM DÒNG NÀY VÀO ĐÂY >>>>>>>>>>
            return res.json(loginResponse); // Gửi phản hồi JSON về client

        } catch (err) {
            console.error('Error during login:', err.message);
            console.error(err.stack);
            res.status(500).json({ success: false, error: 'Server error: ' + err.message });
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
    
getStoryByTitle: (req, res) => {
    const { title } = req.query;
    if (!title) {
        return res.status(400).json({ message: "Thiếu tham số 'title' để tìm kiếm" });
    }

    const sql = `
        SELECT id, title, thumbnail, created_at 
        FROM stories
        WHERE title LIKE ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [`%${title}%`], (err, results) => {
        if (err) {
            console.error("Lỗi khi tìm kiếm truyện:", err);
            return res.status(500).json({ error: "Lỗi máy chủ" });
        }

        console.log("Kết quả tìm kiếm:", results); // 👈 log để bạn xem trên terminal
        res.status(200).json(results);
    });
},
// -------------------- VIEW --------------------
addChapterView: (req, res) => {
  const { chapterId } = req.body;
  const userId = req.session.user ? req.session.user.id : 0; // đổi null thành 0

  const sql = `
    INSERT IGNORE INTO chapter_views (chapter_id, user_id)
    VALUES (?, ?)
  `;
  db.query(sql, [chapterId, userId], (err) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    res.status(200).json({ success: true });
  });
},


getStoryViews: (req, res) => {
  const { storyId } = req.params;
  const sql = `
    SELECT COUNT(*) AS total_views
    FROM chapter_views v
    JOIN chapters c ON v.chapter_id = c.id
    WHERE c.story_id = ?
  `;
  db.query(sql, [storyId], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    res.status(200).json(result[0]);
  });
},

// -------------------- VOTE --------------------
toggleVote: (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Bạn cần đăng nhập" });
  const { chapterId } = req.body;
  const userId = req.session.user.id;

  const checkSql = `SELECT * FROM chapter_votes WHERE chapter_id = ? AND user_id = ?`;
  db.query(checkSql, [chapterId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    if (results.length > 0) {
      // Đã bình chọn → hủy
      const delSql = `DELETE FROM chapter_votes WHERE chapter_id = ? AND user_id = ?`;
      db.query(delSql, [chapterId, userId], (err2) => {
        if (err2) return res.status(500).json({ error: "Lỗi khi hủy bình chọn" });
        res.status(200).json({ voted: false });
      });
    } else {
      // Bình chọn mới
      const insertSql = `INSERT INTO chapter_votes (chapter_id, user_id) VALUES (?, ?)`;
      db.query(insertSql, [chapterId, userId], (err3) => {
        if (err3) return res.status(500).json({ error: "Lỗi khi bình chọn" });
        res.status(200).json({ voted: true });
      });
    }
  });
},

getChapterVotes: (req, res) => {
  const { chapterId } = req.params;
  const sql = `SELECT COUNT(*) AS total_votes FROM chapter_votes WHERE chapter_id = ?`;
  db.query(sql, [chapterId], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    res.status(200).json(result[0]);
  });
},

toggleFollow: (req, res) => {
    const { storyId } = req.body;
    const userId = req.session.user?.id; // Lấy userId từ session đăng nhập

    if (!userId) {
      return res.status(401).json({ error: "Bạn cần đăng nhập trước" });
    }

    Follow.toggleFollow(userId, storyId, (err, result) => {
      if (err) {
        console.error("Lỗi theo dõi:", err);
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      res.json(result);
    });
  },

  getLibraryStories: (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ error: "Bạn cần đăng nhập" });

    Follow.getUserFollows(userId, (err, stories) => {
      if (err) {
        console.error("Lỗi khi lấy truyện theo dõi:", err);
        return res.status(500).json({ error: "Lỗi máy chủ" });
      }
      res.json(stories);
    });
  },
  getFollowStatus: (req, res) => {
  const userId = req.session.user?.id;
  const { storyId } = req.params;
  if (!userId) return res.json({ followed: false });

  const sql = "SELECT * FROM follow WHERE user_id = ? AND story_id = ?";
  db.query(sql, [userId, storyId], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi máy chủ" });
    res.json({ followed: results.length > 0 });
  });
},


    
    getUsers: (req, res) => { /* ... */ },
    getUser: (req, res) => { /* ... */ },
    updateUser: (req, res) => { /* ... */ },
    deleteUser: (req, res) => { /* ... */ }
};

module.exports = apiController;