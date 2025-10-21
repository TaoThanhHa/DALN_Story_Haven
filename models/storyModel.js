const db = require('../configs/mysqlConnect');

const Story = {
    getPublicStories: (callback) => {
        const sql = `
            SELECT s.*
            FROM stories s
            WHERE s.control = '1'
            ORDER BY s.id DESC
        `;
        db.query(sql, callback);
    },
    getById: (id, callback) => {
        const sql = `
            SELECT s.*, u.username 
            FROM stories s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.id = ?
        `;
        db.query(sql, [id], callback);
    },
    getAllByUserId: (userId, callback) => {
        console.log(userId);
        const sql = `
            SELECT s.*, u.username 
            FROM stories s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.user_id = ?
        `;
        db.query(sql, [userId], callback);
    },
    getByTitle: (title, callback) => {
        const sql = `
            SELECT s.*, u.username 
            FROM stories s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.title LIKE ?
        `;
        db.query(sql, [`%${title}%`], callback);
    },
        // Tìm kiếm truyện theo tiêu đề, chỉ lấy truyện công khai
    searchByTitle: (title, callback) => {
        const sql = `
            SELECT *
            FROM stories
            WHERE control = '1' AND title LIKE ?
            ORDER BY id DESC
        `;
        db.query(sql, [`%${title}%`], callback);
    },

    // Lấy truyện theo thể loại, chỉ lấy truyện công khai
    getByCategory: (category, callback) => {
        const sql = `
            SELECT id, title, thumbnail, category
            FROM stories
            WHERE category LIKE ? AND control = 1
            ORDER BY created_at DESC
        `;
        db.query(sql, [`%${category}%`], callback);
    },


    create: (storyData, callback) => {
        const sql = `
            INSERT INTO stories (user_id, title, description, thumbnail, category, status, control) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(sql, [
            storyData.user_id, 
            storyData.title, 
            storyData.description, 
            storyData.thumbnail, 
            storyData.category, 
            storyData.status,
            storyData.control
        ], (err, result) => {
            if (err) {
                callback(err); // Nếu có lỗi, chỉ truyền lỗi
            } else {
                callback(null, result.insertId); // Nếu thành công, truyền null (không lỗi) và insertId
            }
        });
    },
    update: (id, storyData, callback) => {
        const sql = `
            UPDATE stories 
            SET title = ?, description = ?, category = ?, status = ? 
            WHERE id = ?
        `;
        db.query(sql, [
            storyData.title, 
            storyData.description, 
            storyData.category, 
            storyData.status, 
            id
        ], callback);
    },
    delete: (id, callback) => {
        const sql = `
            DELETE FROM stories 
            WHERE id = ?
        `;
        db.query(sql, [id], callback);
    },
    updateThumbnail: (id, storyData, callback) => {
        const sql = `
            UPDATE stories 
            SET thumbnail = ? 
            WHERE id = ?
        `;
        db.query(sql, [
            storyData.thumbnail, 
            id
        ], callback);
    },
};

module.exports = Story; 
