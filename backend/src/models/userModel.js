const pool = require("../services/db.js");

module.exports = {
  //authIdCheck
  // check if user id exists and is valid
  // this model is used by the auth middleware
  authIdCheck(userId, callback) {
    const sql = "SELECT id, username, role FROM user WHERE id = ?";
    pool.query(sql, [userId], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },

  //getpasswordviaemail
  // get password via email or username
  // this model is used by the /login endpoint
  getpasswordviaemail(username, email, callback) {
    const sql =
      "SELECT password, id, username, role FROM user WHERE email = ? OR username = ?";
    pool.query(sql, [email, username], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },

  //checkAdminRoleofUser
  // check if user has admin role
  // this model is used by the admin middleware
  getUserRoleviaUserId(userId, callback) {
    const sql = "SELECT role FROM user WHERE id = ?";
    pool.query(sql, [userId], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },

  //selectAll
  // this model is used to get all users
  // this model is used by the /selectAll endpoint
  selectAll(callback) {
    const sql = `SELECT * FROM user`;

    pool.query(sql, (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },

  //selectById
  // this model is used to get a user by id
  // this model is used by the /selectById/:id endpoint
  selectById(userId, callback) {
    const sql = "SELECT * FROM user WHERE id = ?";
    pool.query(sql, [userId], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },
  //getpublicProfileLogbyUsername
  // this model is used to get a user by username, where user data is public and non vulnerable like password
  // this model is used by the /profile/:username endpoint
  getpublicProfileLogbyUsername(username, callback) {
    const sql = "SELECT id FROM user WHERE username = ?";
    pool.query(sql, [username], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) {
        return callback(null, []);
      }
      const userId = results[0].id;
      const sql = `
    SELECT
    u.username,
    u.points,
    u.credits,
    u.created_at AS account_age,
  (SELECT COUNT(*) FROM user_completions ui WHERE ui.user_id = ? AND ui.status = 'completed') AS missions_completed,
  (SELECT COUNT(*) FROM user_completions ui WHERE ui.user_id = ? AND ui.status = 'pending') AS missions_pending,
  (SELECT COUNT(*) FROM user_completions ui WHERE ui.user_id = ? ) AS missions_total,
    r.id AS rank_id,
    r.name AS \`rank\`,
    r.min_points
    FROM user u
    JOIN \`rank\` r ON u.points >= r.min_points
    WHERE u.id = ?
    ORDER BY r.min_points DESC
    LIMIT 1;
    `;
      pool.query(sql, [userId, userId, userId, userId], (err, results) => {
        if (err) return callback(err);
        return callback(null, results);
      });
    });
  },

  //getProfilerankinclusiveByUserId
  // this model is used to get a user by id, where user data is public and non vulnerable like password
  // this model is used by the /profile/me endpoint
  getProfilerankinclusiveByUserId(userId, callback) {
    const sql = `
    SELECT
    u.username,
    u.points,
    u.credits,
    u.created_at AS account_age,
  (SELECT COUNT(*) FROM user_completions ui WHERE ui.user_id = ? AND ui.status = 'completed') AS missions_completed,
  (SELECT COUNT(*) FROM user_completions ui WHERE ui.user_id = ? AND ui.status = 'pending') AS missions_pending,
  (SELECT COUNT(*) FROM user_completions ui WHERE ui.user_id = ? ) AS missions_total,
    r.id AS rank_id,
    r.name AS \`rank\`,
    r.min_points
    FROM user u
    JOIN \`rank\` r ON u.points >= r.min_points
    WHERE u.id = ?
    ORDER BY r.min_points DESC
    LIMIT 1;
    `;
    pool.query(sql, [userId, userId, userId, userId], (err, results) => {
      if (err) return callback(err);
      const profileresults = results[0];
      const nextranksql = `SELECT min_points AS next_rank_minpoints FROM \`rank\` WHERE min_points > ? ORDER BY min_points ASC LIMIT 1`;
      pool.query(
        nextranksql,
        [profileresults.min_points],
        (err, nextRankResults) => {
          if (err) return callback(err);
          if (nextRankResults.length > 0) {
            profileresults.next_rank_minpoints =
              nextRankResults[0].next_rank_minpoints;
          }
          const nextRankPoints =
            profileresults.points !== null &&
            profileresults.next_rank_minpoints !== undefined
              ? profileresults.next_rank_minpoints - profileresults.points
              : null;
          
          // Calculate percentage correctly
          const nextRankPercentage = (() => {
            if (nextRankPoints === null || profileresults.next_rank_minpoints === undefined) {
              return null; // No next rank (max rank reached)
            }
            
            // Total points needed from current rank to next rank
            const totalPointsForNextRank = profileresults.next_rank_minpoints - profileresults.min_points;
            
            // Points already earned towards next rank
            const pointsEarnedTowardsNext = profileresults.points - profileresults.min_points;
            
            // Calculate percentage (0-100%)
            if (totalPointsForNextRank <= 0) {
              return 100; // Edge case: same rank requirements
            }
            
            const percentage = Math.min(100, Math.max(0, (pointsEarnedTowardsNext / totalPointsForNextRank) * 100));
            console.log('Calculated percentage:', percentage);
            return percentage;
          })();
          const profileData = {
            ...profileresults,
            next_rank_points: nextRankPoints,
            next_rank_percentage: nextRankPercentage,
          };
          return callback(null, [profileData]);
        },
      );
    });
  },
  //createUser
  // this model is used to create a user
  // this model is used by the /register endpoint
  createUser(data, callback) {
    const sql = `INSERT INTO user (username, password, email, description) VALUES (?, ?, ?, ?)`;
    pool.query(
      sql,
      [data.username, data.password, data.email, data.description],
      (err, results) => {
        if (err) return callback(err);
        return callback(null, results);
      },
    );
  },

  //updateUser
  // this model is used to update a user
  // this model is used by the /update endpoint
  updateUser(id, data, callback) {
    const sql = "UPDATE user SET ? WHERE id = ?";
    pool.query(sql, [data, id], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },

  //deleteUser
  // this model is used to delete a user
  // this model is used by the /delete endpoint
  deleteUser(id, callback) {
    const sql = "DELETE FROM user WHERE id = ?";
    pool.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },

  //getleaderboard
  // this model is used to get the leaderboard, with a optional filter, with top 10 being default
  // this model is used by the /leaderboard endpoint
  getleaderboard(filter, callback) {
    const sql = `
    SELECT 
      u.id,
      u.username,
      u.points,
      u.credits,
      r.name AS \`rank\`
    FROM user u
    LEFT JOIN \`rank\` r ON u.points >= r.min_points
    WHERE r.min_points = (
      SELECT MAX(r2.min_points) 
      FROM \`rank\` r2 
      WHERE u.points >= r2.min_points
    )
    ORDER BY u.points DESC, u.credits DESC
    LIMIT ?`;

    pool.query(sql, [parseInt(filter)], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },
  //getleaderboardPositionbyId
  // this model is used to get the leaderboard position of a user by userid
  // this model is used by the /leaderboard/position endpoint
  getleaderboardPositionbyId(userId, callback) {
    const sql = `SELECT COUNT(*) + 1 AS position FROM user u WHERE u.points > (SELECT points FROM user WHERE id = ?) OR (u.points = (SELECT points FROM user WHERE id = ?) AND u.credits > (SELECT credits FROM user WHERE id = ?));`;
    pool.query(sql, [userId, userId, userId], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },
  //getLeaderboardPositionbyUsername
  // this model is used to get the leaderboard position of a user by username
  // this model is used by the /leaderboard/position/username/:username endpoint
  getLeaderboardPositionbyUsername(username, callback) {
    const usernamesql = "SELECT username FROM user WHERE username = ?";
    pool.query(usernamesql, [username], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) {
        return callback(null, null);
      }
      const sql = `SELECT COUNT(*) + 1 AS position FROM user u WHERE u.points > (SELECT points FROM user WHERE username = ?) OR (u.points = (SELECT points FROM user WHERE username = ?) AND u.credits > (SELECT credits FROM user WHERE username = ?));`;
      pool.query(sql, [username, username, username], (err, results) => {
        if (err) return callback(err);
        return callback(null, results);
      });
    });
  },
};
