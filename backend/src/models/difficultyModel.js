const pool = require("../services/db.js");

module.exports = {
  // Get all difficulties
  getAllDifficulties(callback) {
    const sql = "SELECT id, name, min_value FROM difficulty ORDER BY min_value ASC";
    pool.query(sql, (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },

  // Get difficulty by ID
  getDifficultyById(id, callback) {
    const sql = "SELECT id, name, min_value FROM difficulty WHERE id = ?";
    pool.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  }
};