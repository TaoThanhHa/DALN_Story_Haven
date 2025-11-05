// controllers/adminController.js
const connection = require('../configs/mysqlConnect'); // Sử dụng kết nối MySQL của bạn

// Hàm lấy danh sách người dùng
const getUsers = (req, res) => {
    const { page = 1, limit = 10, search = '', role = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
        SELECT id, username, email, role, status, created_at,
               (SELECT COUNT(*) FROM stories WHERE user_id = u.id) as total_stories
        FROM users u
        WHERE 1=1
    `;
    const params = [];

    if (search) {
        sql += ` AND (username LIKE ? OR email LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }
    if (role) {
        sql += ` AND role = ?`;
        params.push(role);
    }
    if (status) {
        sql += ` AND status = ?`;
        params.push(status);
    }

    // Đếm tổng số người dùng cho phân trang
    let countSql = `SELECT COUNT(*) as total FROM users u WHERE 1=1`;
    const countParams = [...params]; // params giống với truy vấn chính

    connection.query(countSql, countParams, (err, countResults) => {
        if (err) {
            console.error('Error getting user count:', err);
            return res.status(500).json({ error: 'Database error when counting users.' });
        }
        const totalUsers = countResults[0].total;
        const totalPages = Math.ceil(totalUsers / limit);

        sql += ` ORDER BY created_at DESC LIMIT ?, ?`;
        params.push(parseInt(offset), parseInt(limit));

        connection.query(sql, params, (err, results) => {
            if (err) {
                console.error('Error getting users:', err);
                return res.status(500).json({ error: 'Database error when fetching users.' });
            }
            res.json({
                users: results,
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalUsers: totalUsers
            });
        });
    });
};

// Hàm lấy chi tiết người dùng theo ID
const getUserById = (req, res) => {
    const userId = req.params.id;
    console.log('Fetching user with ID:', userId);
    const sql = `
        SELECT id, username, email, role, status, created_at,
               (SELECT COUNT(*) FROM stories WHERE user_id = u.id) as total_stories
        FROM users u
        WHERE id = ?
    `;
    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error getting user by ID:', err);
            return res.status(500).json({ error: 'Database error when fetching user.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(results[0]);
    });
};

// Hàm cập nhật vai trò và/hoặc trạng thái người dùng
const updateUser = (req, res) => {
    const userId = req.params.id;
    const { role, status } = req.body;
    let updateFields = [];
    let params = [];

    if (role) {
        updateFields.push('role = ?');
        params.push(role);
    }
    if (status) {
        updateFields.push('status = ?');
        params.push(status);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    params.push(userId);

    connection.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ error: 'Database error when updating user.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or no changes made.' });
        }
        res.json({ message: 'User updated successfully.' });
    });
};

// Hàm cập nhật trạng thái người dùng (khóa/mở khóa)
const updateUserStatus = (req, res) => {
    const userId = req.params.id;
    const { status } = req.body; // 'active' hoặc 'blocked'

    if (!['active', 'blocked'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided. Must be "active" or "blocked".' });
    }

    // Ngăn admin tự khóa tài khoản của chính mình
    if (req.session.user.id == userId && status === 'blocked') {
        return res.status(403).json({ message: 'Admin không thể tự khóa tài khoản của mình.' });
    }

    const sql = `UPDATE users SET status = ? WHERE id = ?`;
    connection.query(sql, [status, userId], (err, results) => {
        if (err) {
            console.error('Error updating user status:', err);
            return res.status(500).json({ error: 'Database error when updating user status.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or status already set.' });
        }
        res.json({ message: `User status changed to ${status} successfully.` });
    });
};

// Hàm xóa người dùng
const deleteUser = (req, res) => {
    const userId = req.params.id;

    // Ngăn admin tự xóa tài khoản của chính mình
    if (req.session.user.id == userId) {
        return res.status(403).json({ message: 'Admin không thể tự xóa tài khoản của mình.' });
    }

    // Bắt đầu một transaction để đảm bảo tính toàn vẹn dữ liệu
    connection.beginTransaction(err => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ error: 'Database error starting transaction.' });
        }

        // Bước 1: Xóa các chương liên quan đến truyện của người dùng
        // Giả sử có bảng 'chapters' và 'stories'
        const deleteChaptersSql = `
            DELETE c FROM chapters c
            JOIN stories s ON c.story_id = s.story_id
            WHERE s.id = ?;
        `;
        connection.query(deleteChaptersSql, [userId], (err, chapterResults) => {
            if (err) {
                console.error('Error deleting chapters for user:', err);
                return connection.rollback(() => {
                    res.status(500).json({ error: 'Database error deleting chapters.' });
                });
            }

            // Bước 2: Xóa tất cả truyện của người dùng
            const deleteStoriesSql = `DELETE FROM stories WHERE id = ?`;
            connection.query(deleteStoriesSql, [userId], (err, storyResults) => {
                if (err) {
                    console.error('Error deleting stories for user:', err);
                    return connection.rollback(() => {
                        res.status(500).json({ error: 'Database error deleting stories.' });
                    });
                }

                // Bước 3: Xóa người dùng
                const deleteUserSql = `DELETE FROM users WHERE id = ?`;
                connection.query(deleteUserSql, [userId], (err, userResults) => {
                    if (err) {
                        console.error('Error deleting user:', err);
                        return connection.rollback(() => {
                            res.status(500).json({ error: 'Database error deleting user.' });
                        });
                    }

                    if (userResults.affectedRows === 0) {
                        return connection.rollback(() => {
                            res.status(404).json({ message: 'User not found.' });
                        });
                    }

                    // Commit transaction nếu mọi thứ thành công
                    connection.commit(commitErr => {
                        if (commitErr) {
                            console.error('Error committing transaction:', commitErr);
                            return connection.rollback(() => {
                                res.status(500).json({ error: 'Database error committing transaction.' });
                            });
                        }
                        res.json({ message: 'User and all associated data deleted successfully.' });
                    });
                });
            });
        });
    });
};

// =======================================================
// === CÁC HÀM XỬ LÝ CHO QUẢN LÝ TRUYỆN (STORIES) ===
// =======================================================

// Hàm lấy danh sách truyện
const getStories = (req, res) => {
    const { page = 1, limit = 10, search = '', status = '', category = '' } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
        SELECT s.id, s.title, s.thumbnail, s.status, s.created_at, u.username as author_username,
               (SELECT COUNT(*) FROM chapters c WHERE c.story_id = s.id) as total_chapters
        FROM stories s
        JOIN users u ON s.user_id = u.id
        WHERE 1=1
    `;
    const params = [];

    if (search) {
        sql += ` AND (s.title LIKE ? OR s.description LIKE ? OR u.username LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status) {
        sql += ` AND s.status = ?`;
        params.push(status);
    }
    if (category) {
        sql += ` AND s.category = ?`;
        params.push(category);
    }

    // Đếm tổng số truyện cho phân trang
    let countSql = `
        SELECT COUNT(*) as total
        FROM stories s
        JOIN users u ON s.user_id = u.id
        WHERE 1=1
    `;
    const countParams = [...params]; // params giống với truy vấn chính (không có LIMIT, OFFSET)

    connection.query(countSql, countParams, (err, countResults) => {
        if (err) {
            console.error('Error getting story count:', err);
            return res.status(500).json({ error: 'Database error when counting stories.' });
        }
        const totalStories = countResults[0].total;
        const totalPages = Math.ceil(totalStories / limit);

        sql += ` ORDER BY s.created_at DESC LIMIT ?, ?`;
        params.push(parseInt(offset), parseInt(limit));

        connection.query(sql, params, (err, results) => {
            if (err) {
                console.error('Error getting stories:', err);
                return res.status(500).json({ error: 'Database error when fetching stories.' });
            }
            res.json({
                stories: results,
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalStories: totalStories
            });
        });
    });
};

// Hàm lấy chi tiết một truyện và các chương của nó
const getStoryById = (req, res) => {
    const storyId = req.params.id;
    console.log('Fetching story with ID:', storyId);

    // Truy vấn để lấy thông tin chi tiết truyện
    const storySql = `
        SELECT s.id, s.user_id, s.title, s.description, s.thumbnail, s.category, s.status, s.created_at,
               u.username as author_username, u.email as author_email
        FROM stories s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = ?
    `;

    connection.query(storySql, [storyId], (err, storyResults) => {
        if (err) {
            console.error('Error getting story by ID:', err);
            return res.status(500).json({ error: 'Database error when fetching story.' });
        }
        if (storyResults.length === 0) {
            return res.status(404).json({ message: 'Story not found.' });
        }

        const story = storyResults[0];

        // Truy vấn để lấy danh sách các chương của truyện
        const chaptersSql = `
            SELECT id, story_id, title, chapter_number, created_at
            FROM chapters
            WHERE story_id = ?
            ORDER BY chapter_number ASC
        `;
        connection.query(chaptersSql, [storyId], (err, chapterResults) => {
            if (err) {
                console.error('Error getting chapters for story:', err);
                return res.status(500).json({ error: 'Database error when fetching chapters for story.' });
            }

            story.chapters = chapterResults;
            res.json(story);
        });
    });
};

// Hàm cập nhật trạng thái của truyện (ví dụ: complete/writing, hoặc khóa/mở khóa)
// Bạn có thể giữ lại hàm này hoặc bỏ nó đi và dùng hàm updateStory chung bên dưới
const updateStoryStatus = (req, res) => {
    const storyId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['complete', 'writing', 'blocked', 'approved'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const sql = `UPDATE stories SET status = ? WHERE id = ?`;
    connection.query(sql, [status, storyId], (err, results) => {
        if (err) {
            console.error('Error updating story status:', err);
            return res.status(500).json({ error: 'Database error when updating story status.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Story not found or status already set.' });
        }
        res.json({ message: `Story status updated to ${status} successfully.` });
    });
};

// HÀM MỚI (hoặc sửa đổi hàm updateStoryStatus thành hàm này)
const updateStory = (req, res) => {
    const storyId = req.params.id;
    const { category, status } = req.body; // Có thể nhận thêm các trường khác như title, description, thumbnail nếu bạn muốn sửa

    let updateFields = [];
    let params = [];
    const validStatuses = ['complete', 'writing', 'blocked', 'approved'];

    if (category !== undefined) { // Kiểm tra nếu category được cung cấp
        updateFields.push('category = ?');
        params.push(category);
    }
    if (status !== undefined && validStatuses.includes(status)) { // Kiểm tra nếu status được cung cấp và hợp lệ
        updateFields.push('status = ?');
        params.push(status);
    }
    // Bạn có thể thêm các trường khác ở đây
    // if (title) { updateFields.push('title = ?'); params.push(title); }
    // if (description) { updateFields.push('description = ?'); params.push(description); }
    // if (thumbnail) { updateFields.push('thumbnail = ?'); params.push(thumbnail); }

    if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No valid fields provided for update.' });
    }

    const sql = `UPDATE stories SET ${updateFields.join(', ')} WHERE id = ?`;
    params.push(storyId);

    connection.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error updating story:', err);
            return res.status(500).json({ error: 'Database error when updating story.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Story not found or no changes made.' });
        }
        res.json({ message: 'Story updated successfully.' });
    });
};

// Hàm xóa truyện và các chương liên quan
const deleteStory = (req, res) => {
    const storyId = req.params.id;

    connection.beginTransaction(err => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ error: 'Database error starting transaction.' });
        }

        // Bước 1: Xóa tất cả các chương của truyện
        const deleteChaptersSql = `DELETE FROM chapters WHERE story_id = ?`;
        connection.query(deleteChaptersSql, [storyId], (err, chapterResults) => {
            if (err) {
                console.error('Error deleting chapters for story:', err);
                return connection.rollback(() => {
                    res.status(500).json({ error: 'Database error deleting chapters.' });
                });
            }

            // Bước 2: Xóa truyện
            const deleteStorySql = `DELETE FROM stories WHERE id = ?`;
            connection.query(deleteStorySql, [storyId], (err, storyResults) => {
                if (err) {
                    console.error('Error deleting story:', err);
                    return connection.rollback(() => {
                        res.status(500).json({ error: 'Database error deleting story.' });
                    });
                }

                if (storyResults.affectedRows === 0) {
                    return connection.rollback(() => {
                        res.status(404).json({ message: 'Story not found.' });
                    });
                }

                connection.commit(commitErr => {
                    if (commitErr) {
                        console.error('Error committing transaction:', commitErr);
                        return connection.rollback(() => {
                            res.status(500).json({ error: 'Database error committing transaction.' });
                        });
                    }
                    res.json({ message: 'Story and all associated chapters deleted successfully.' });
                });
            });
        });
    });
};

// Hàm lấy danh sách các thể loại độc đáo từ bảng stories
const getUniqueStoryCategories = (req, res) => {
    const sql = `SELECT DISTINCT category FROM stories WHERE category IS NOT NULL AND category != '' ORDER BY category ASC`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error getting unique story categories:', err);
            return res.status(500).json({ error: 'Database error when fetching unique categories.' });
        }
        res.json(results.map(row => row.category));
    });
};

// =======================================================
// === CÁC HÀM XỬ LÝ CHO QUẢN LÝ BÌNH LUẬN (COMMENTS) ===
// =======================================================

// Hàm lấy danh sách các bình luận bị báo cáo
const getReportedComments = (req, res) => {
    const { page = 1, limit = 10, search = '', status = 'pending', reason = '' } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
        SELECT
            rc.id AS report_id,
            rc.comment_id,
            rc.report_reason,
            rc.reported_at,
            rc.status AS report_status,
            rc.admin_id,
            rc.action_taken,
            rc.processed_at,
            c.content AS comment_content,
            c.status AS comment_status,
            u.id AS user_id,
            u.username AS comment_author,
            rpu.username AS reporter_username,
            CASE
                WHEN c.chapter_id IS NOT NULL THEN 'Chapter Comment'
                WHEN c.target_user_id IS NOT NULL THEN 'Profile Comment'
                ELSE 'Unknown'
            END AS comment_type,
            COALESCE(s.title, 'N/A') AS story_title,
            COALESCE(ch.title, 'N/A') AS chapter_title,
            COALESCE(tu.username, 'N/A') AS target_user_profile
        FROM reported_comments rc
        JOIN comments c ON rc.comment_id = c.id
        JOIN users u ON c.user_id = u.id
        JOIN users rpu ON rc.reporter_user_id = rpu.id
        LEFT JOIN chapters ch ON c.chapter_id = ch.id
        LEFT JOIN stories s ON ch.story_id = s.id
        LEFT JOIN users tu ON c.target_user_id = tu.id
        WHERE 1=1
    `;
    const params = [];

    if (search) {
        sql += ` AND (c.content LIKE ? OR u.username LIKE ? OR rpu.username LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status) {
        sql += ` AND rc.status = ?`;
        params.push(status);
    }
    if (reason) {
        sql += ` AND rc.report_reason = ?`;
        params.push(reason);
    }

    // Đếm tổng số báo cáo cho phân trang
    let countSql = `
        SELECT COUNT(*) as total
        FROM reported_comments rc
        JOIN comments c ON rc.comment_id = c.id
        JOIN users u ON c.user_id = u.id
        JOIN users rpu ON rc.reporter_user_id = rpu.id
        LEFT JOIN chapters ch ON c.chapter_id = ch.id
        LEFT JOIN stories s ON ch.story_id = s.id
        LEFT JOIN users tu ON c.target_user_id = tu.id
        WHERE 1=1
    `;
    const countParams = [...params];

    connection.query(countSql, countParams, (err, countResults) => {
        if (err) {
            console.error('Error getting reported comments count:', err);
            return res.status(500).json({ error: 'Database error when counting reported comments.' });
        }
        const totalReports = countResults[0].total;
        const totalPages = Math.ceil(totalReports / limit);

        sql += ` ORDER BY rc.reported_at DESC LIMIT ?, ?`;
        params.push(parseInt(offset), parseInt(limit));

        connection.query(sql, params, (err, results) => {
            if (err) {
                console.error('Error getting reported comments:', err);
                return res.status(500).json({ error: 'Database error when fetching reported comments.' });
            }
            res.json({
                reportedComments: results,
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalReports: totalReports
            });
        });
    });
};

// Hàm lấy chi tiết một bình luận bị báo cáo theo ID báo cáo
const getReportedCommentById = (req, res) => {
    const reportId = req.params.id;

    const sql = `
        SELECT
            rc.id AS report_id,
            rc.comment_id,
            rc.report_reason,
            rc.reported_at,
            rc.status AS report_status,
            rc.admin_id,
            rc.action_taken,
            rc.processed_at,
            c.content AS comment_content,
            c.created_at AS comment_created_at,
            c.status AS comment_status,
            c.parent_comment_id,
            u.id AS user_id,
            u.username AS comment_author,
            u.email AS comment_author_email,
            rpu.id AS reporter_user_id,
            rpu.username AS reporter_username,
            rpu.email AS reporter_email,
            CASE
                WHEN c.chapter_id IS NOT NULL THEN 'Chapter Comment'
                WHEN c.target_user_id IS NOT NULL THEN 'Profile Comment'
                ELSE 'Unknown'
            END AS comment_type,
            COALESCE(s.title, 'N/A') AS story_title,
            COALESCE(ch.title, 'N/A') AS chapter_title,
            COALESCE(tu.username, 'N/A') AS target_user_profile,
            adm.username AS admin_username
        FROM reported_comments rc
        JOIN comments c ON rc.comment_id = c.id
        JOIN users u ON c.user_id = u.id
        JOIN users rpu ON rc.reporter_user_id = rpu.id
        LEFT JOIN chapters ch ON c.chapter_id = ch.id
        LEFT JOIN stories s ON ch.story_id = s.id
        LEFT JOIN users tu ON c.target_user_id = tu.id
        LEFT JOIN users adm ON rc.admin_id = adm.id
        WHERE rc.id = ?
    `;

    connection.query(sql, [reportId], (err, results) => {
        if (err) {
            console.error('Error getting reported comment by ID:', err);
            return res.status(500).json({ error: 'Database error when fetching reported comment.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Reported comment not found.' });
        }
        res.json(results[0]);
    });
};

// Hàm cập nhật trạng thái của báo cáo bình luận
const updateReportedCommentStatus = (req, res) => {
    const reportId = req.params.id;
    const { status, action_taken } = req.body; // status: 'pending', 'reviewed', 'dismissed', 'action_taken'
    const adminId = req.session.user.id; // Lấy ID admin từ session

    const validStatuses = ['pending', 'reviewed', 'dismissed', 'action_taken'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const sql = `
        UPDATE reported_comments
        SET status = ?, action_taken = ?, admin_id = ?, processed_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    connection.query(sql, [status, action_taken, adminId, reportId], (err, results) => {
        if (err) {
            console.error('Error updating reported comment status:', err);
            return res.status(500).json({ error: 'Database error when updating reported comment status.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Reported comment not found or status already set.' });
        }
        res.json({ message: 'Reported comment status updated successfully.' });
    });
};

// Hàm cập nhật trạng thái của bình luận gốc (ẩn/hiển thị/xóa logic)
const updateCommentStatus = (req, res) => {
    const commentId = req.params.id;
    const { status } = req.body; // 'active', 'hidden', 'deleted'

    const validStatuses = ['active', 'hidden', 'deleted'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid comment status provided. Must be "active", "hidden", or "deleted".' });
    }

    const sql = `UPDATE comments SET status = ? WHERE id = ?`;
    connection.query(sql, [status, commentId], (err, results) => {
        if (err) {
            console.error('Error updating comment status:', err);
            return res.status(500).json({ error: 'Database error when updating comment status.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Comment not found or status already set.' });
        }
        res.json({ message: `Comment status changed to ${status} successfully.` });
    });
};

// Hàm xóa bình luận gốc (và các báo cáo liên quan sẽ tự động xóa nhờ CASCADE)
const deleteComment = (req, res) => {
    const commentId = req.params.id;

    const sql = `DELETE FROM comments WHERE id = ?`;
    connection.query(sql, [commentId], (err, results) => {
        if (err) {
            console.error('Error deleting comment:', err);
            return res.status(500).json({ error: 'Database error when deleting comment.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Comment not found.' });
        }
        res.json({ message: 'Comment and all associated reports deleted successfully.' });
    });
};

// Hàm xóa một báo cáo cụ thể (giữ nguyên bình luận gốc)
const deleteReportedComment = (req, res) => {
    const reportId = req.params.id;

    const sql = `DELETE FROM reported_comments WHERE id = ?`;
    connection.query(sql, [reportId], (err, results) => {
        if (err) {
            console.error('Error deleting reported comment:', err);
            return res.status(500).json({ error: 'Database error when deleting reported comment.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Reported comment not found.' });
        }
        res.json({ message: 'Reported comment deleted successfully.' });
    });
};

// =======================================================
// === CÁC HÀM XỬ LÝ CHO DASHBOARD (THỐNG KÊ) ===
// =======================================================

const getDashboardStats = (req, res) => {
    // Sử dụng Promise.all để chạy nhiều truy vấn cùng lúc và chờ kết quả
    Promise.all([
        // Tổng số người dùng
        new Promise((resolve, reject) => {
            connection.query('SELECT COUNT(*) as totalUsers FROM users', (err, results) => {
                if (err) return reject(err);
                resolve(results[0].totalUsers);
            });
        }),
        // Tổng số truyện
        new Promise((resolve, reject) => {
            connection.query('SELECT COUNT(*) as totalStories FROM stories', (err, results) => {
                if (err) return reject(err);
                resolve(results[0].totalStories);
            });
        }),
        // Tổng số bình luận
        new Promise((resolve, reject) => {
            connection.query('SELECT COUNT(*) as totalComments FROM comments', (err, results) => {
                if (err) return reject(err);
                resolve(results[0].totalComments);
            });
        }),
        // Số truyện đang chờ duyệt (nếu có trạng thái 'pending' hoặc 'draft' và cần admin duyệt)
        new Promise((resolve, reject) => {
            connection.query("SELECT COUNT(*) as pendingStories FROM stories WHERE status = 'pending'", (err, results) => {
                if (err) return reject(err);
                resolve(results[0].pendingStories);
            });
        }),
        // Số bình luận bị báo cáo đang chờ xử lý
        new Promise((resolve, reject) => {
            connection.query("SELECT COUNT(*) as pendingReports FROM reported_comments WHERE status = 'pending'", (err, results) => {
                if (err) return reject(err);
                resolve(results[0].pendingReports);
            });
        }),
        // Truyền mới trong 7 ngày qua (ví dụ)
        new Promise((resolve, reject) => {
            connection.query("SELECT DATE(created_at) as date, COUNT(*) as count FROM stories WHERE created_at >= CURDATE() - INTERVAL 6 DAY GROUP BY DATE(created_at) ORDER BY date ASC", (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        }),
        // Thống kê thể loại truyện
        new Promise((resolve, reject) => {
            connection.query("SELECT category, COUNT(*) as count FROM stories WHERE category IS NOT NULL AND category != '' GROUP BY category ORDER BY count DESC LIMIT 5", (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        }),
        // Hoạt động gần đây của admin (Cần bảng `admin_logs` hoặc tương tự, tạm bỏ qua nếu chưa có)
        // new Promise((resolve, reject) => {
        //     connection.query("SELECT * FROM admin_logs ORDER BY timestamp DESC LIMIT 5", (err, results) => {
        //         if (err) return reject(err);
        //         resolve(results);
        //     });
        // })

    ])
    .then(([totalUsers, totalStories, totalComments, pendingStories, pendingReports, newStoriesLast7Days, storyCategories]) => {
        res.json({
            totalUsers,
            totalStories,
            totalComments,
            pendingStories,
            pendingReports,
            newStoriesLast7Days,
            storyCategories,
            // adminActivities: [], // Tạm thời để trống nếu chưa có bảng log
        });
    })
    .catch(err => {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ error: 'Database error when fetching dashboard statistics.' });
    });
};


// === EXPORT CÁC HÀM ===
module.exports = {
    // Cho người dùng
    getUsers,
    getUserById,
    updateUser,
    updateUserStatus,
    deleteUser,

    // Cho truyện
    getStories,
    getStoryById,
    updateStoryStatus,
    updateStory,  
    deleteStory,

    // Cho thể loại
    getUniqueStoryCategories,

    // === Thêm các hàm mới cho Comments ===
    getReportedComments,
    getReportedCommentById,
    updateReportedCommentStatus,
    updateCommentStatus,
    deleteComment,
    deleteReportedComment,

    // Thêm hàm dashboard mới vào đây
    getDashboardStats, 
};

