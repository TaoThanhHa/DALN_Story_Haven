const db = require("../configs/mysqlConnect");

const Follow = {
  toggleFollow: (userId, storyId, callback) => {
    const checkSql = "SELECT * FROM follow WHERE user_id = ? AND story_id = ?";
    db.query(checkSql, [userId, storyId], (err, results) => {
      if (err) return callback(err);

      if (results.length > 0) {
        const delSql = "DELETE FROM follow WHERE user_id = ? AND story_id = ?";
        db.query(delSql, [userId, storyId], (err2) => {
          if (err2) return callback(err2);
          callback(null, { followed: false });
        });
      } else {
        const insertSql = "INSERT INTO follow (user_id, story_id) VALUES (?, ?)";
        db.query(insertSql, [userId, storyId], (err3) => {
          if (err3) return callback(err3);
          callback(null, { followed: true });
        });
      }
    });
  },

  getUserFollows: (userId, callback) => {
    const sql = `
      SELECT s.* 
      FROM stories s
      JOIN follow f ON s.id = f.story_id
      WHERE f.user_id = ?`;
    db.query(sql, [userId], callback);
  }
};

module.exports = Follow;
