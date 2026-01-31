const pool = require("../services/db.js");

module.exports = {
  // getUserMissions
  // this model is used to get all challenges attempted by a user
  // this model is used by the /missions endpoint
  getUserMissions(userId, callback) {
    const sql = `
    SELECT 
    uc.id AS completions_id,
    c.title As mission_name,
    c.points_rewarded,
    uc.status,
    uc.created_at AS started_on
    FROM user_completions uc
    INNER JOIN challenges c
    ON uc.challenge_id = c.id
    WHERE uc.user_id = ?`;

    pool.query(sql, [userId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  // getMissionUserAttemptedLog
  // this model is used to get all users who have attempted a challenge
  // this model is used by the /users/:id endpoint
  getMissionUserAttemptedLog(challengeId, callback) {
    const sql = `SELECT u.username, uc.user_id, uc.notes, uc.status, uc.created_at FROM user_completions uc JOIN user u ON uc.user_id = u.id WHERE uc.challenge_id = ?`;
    pool.query(sql, [challengeId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
};
