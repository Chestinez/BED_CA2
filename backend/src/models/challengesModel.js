const pool = require("../services/db.js");

module.exports = {
  //activeCheck
  // this model is used to check if the challenge is active
  // this model is used by the isActive middleware
  activeCheck(challengeId, callback) {
    const sql = "SELECT is_active FROM challenges WHERE id = ?";
    pool.query(sql, [challengeId], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },

  //getCreatorByChallengeId
  // this model is used to get the creator_id of a challengeId
  // this model is used by the ownershipChecker middleware
  getCreatorByChallengeId(challengeId, callback) {
    const sql = "SELECT creator_id FROM challenges WHERE id = ?";
    pool.query(sql, [challengeId], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },

  //selectAll
  // this model is used to get all challenges and their respective data
  // this model is used by the /selectAll endpoint
  selectAll(callback) {
    const sql = `
    SELECT 
      challenges.*, 
      difficulty.name AS difficultyName, 
      user.username AS creatorName
    FROM challenges
    LEFT JOIN difficulty ON challenges.difficulty_id = difficulty.id
    LEFT JOIN user ON challenges.creator_id = user.id
  `;
    pool.query(sql, (err, results) => {
      if (err) return callback(err);

      return callback(null, results);
    });
  },

  //selectById
  // this model is used to get a challenge and all its data by id
  // this model is used by the /selectById endpoint
  selectById(id, callback) {
    const sql = "SELECT * FROM challenges WHERE id = ?";
    pool.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },

  //selectByCreatorId, used to get all challenges created by a user
  // this model is used by the /selectAllByCreatorId endpoint
  selectByCreatorId(userId, callback) {
    const sql = "SELECT * FROM challenges WHERE creator_id = ?";
    pool.query(sql, [userId], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },

  //createChallenge
  // this model is used to create a challenge
  // this model is used by the /create endpoint
  // this model uses 2 queries within
  // to first create a record, and the other to dynamically get the name and id of the difficulty
  createChallenge(difficultyId, data, callback) {
    const sql = "INSERT INTO challenges SET ?";
    if (data.points_rewarded >= 90 || data.credits_rewarded >= 60) {
      // restrictions are applied to prevent overloading on points and credits on a single challenge
      return callback(null, {
        message:
          "Points and Credits cannot be more than 90 and 60 respectively",
      });
    }
    pool.query(sql, data, (err, results) => {
      if (err) return callback(err);
      const sql = "SELECT id, name FROM difficulty WHERE id = ?";
      pool.query(sql, [difficultyId], (err, difficultyresults) => {
        if (err) return callback(err);
        return callback(null, { results, difficultyresults });
      });
    });
  },

  //updateChallenge
  // this model is used to update a challenge
  // this model is used by the /update endpoint
  // this model uses 2 queries within
  // to first update a record, and the other to dynamically get the name and id of the difficulty
  updateChallenge(difficultyId, userId, id, data, callback) {
    const sql = `UPDATE challenges SET ? WHERE id = ? AND creator_id = ?`;
    if (data.points_rewarded >= 90 || data.credits_rewarded >= 60) {
      // restrictions are applied to prevent overloading on points and credits on a single challenge
      return callback(null, {
        message:
          "Points and Credits cannot be more than 90 and 60 respectively",
      });
    }
    const values = [data, id, userId];
    pool.query(sql, values, (err, results) => {
      if (err) return callback(err);
      const sql = "SELECT id, name FROM difficulty WHERE id = ?";
      pool.query(sql, [difficultyId], (err, difficultyresults) => {
        if (err) return callback(err);
        return callback(null, { results, difficultyresults });
      });
    });
  },

  //deleteChallenge
  // this model is used to delete a challenge
  // this model is used by the /delete endpoint
  deleteChallenge(userId, id, callback) {
    const sql = `DELETE FROM challenges WHERE id = ? AND creator_id = ?`;
    pool.query(sql, [id, userId], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },

  //startChallenge
  // this model is used to start a challenge, by insering a record into user_completions
  // this model is used by the /:id/start endpoint
  // this model uses 2 queries within
  // to first check if the challenge is already started, and the other to insert the record
  startChallenge(userId, challengeId, notes, callback) {
    const checksql = `SELECT status FROM user_completions WHERE user_id = ? AND challenge_id = ?`;
    pool.query(checksql, [userId, challengeId], (err, results) => {
      if (err) return callback(err);
      if (results.length > 0 && results) {
        // if the challenge is already started
        return callback(null, {
          message: `Challenge already ${results[0].status}`,
          status: results[0].status,
        });
      }

      const insertsql = `INSERT INTO user_completions (user_id, challenge_id, status, notes) VALUES (?, ?, 'pending', ?)`;
      pool.query(insertsql, [userId, challengeId, notes], (err, results) => {
        if (err) return callback(err);
        return callback(null, results);
      });
    });
  },

  //completechallenge
  // this model is used to complete a challenge, by updating the status of the record in user_completions to be completed
  // this model is used by the /:id/complete endpoint
  // this model is a full getconnection transaction
  completechallenge(data, callback) {
    pool.getConnection((err, connection) => {
      if (err) return callback(err);

      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return callback(err);
        }

        // update user_completions
        // if notes is null, use the existing notes
        const sql = `UPDATE user_completions SET status = 'completed', notes = IFNULL(?, notes) WHERE user_id = ? AND challenge_id = ? AND status = 'pending'`;
        connection.query(
          sql,
          [data.completionNotes, data.userId, data.challengeId],
          (err, updateResults) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                callback(err);
              });
            } else if (updateResults.affectedRows === 0) {
              // check if the update was successful, if not, rollback
              return connection.rollback(() => {
                connection.release();
                return callback(null, { affectedRows: 0 });
              });
            }

            // update user, points and credits depending on the challenge
            // subqueries are used to obtain the challenge points_rewarded and credits_rewarded
            const updatepointssql = `UPDATE user SET points = points + (SELECT points_rewarded FROM challenges WHERE id = ?), credits = credits + (SELECT credits_rewarded FROM challenges WHERE id = ?) WHERE id = ?`;
            connection.query(
              updatepointssql,
              [data.challengeId, data.challengeId, data.userId],
              (err) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    callback(err);
                  });
                }

                // get the new points and credits
                const getpointandcreditssql = `SELECT points, credits FROM user WHERE id = ?`;
                connection.query(
                  getpointandcreditssql,
                  [data.userId],
                  (err, userResults) => {
                    if (err) {
                      return connection.rollback(() => {
                        connection.release();
                        callback(err);
                      });
                    }

                    connection.commit((err) => {
                      if (err) {
                        return connection.rollback(() => {
                          connection.release();
                          callback(err);
                        });
                      }

                      connection.release();
                      return callback(null, {
                        newPoints: userResults[0].points,
                        newCredits: userResults[0].credits,
                      });
                    });
                  },
                );
              },
            );
          },
        );
      });
    });
  },

  //getusersbycompletedchallenge
  // this model is used to get the users who have completed a challengeId
  // this model is used by the /:id/users endpoint
  getusersbycompletedchallenge(challengeId, callback) {
    const sql = `
    SELECT 
    u.id AS user_id,
    u.username,
    uc.notes AS completion_details,
    uc.created_at AS completed_at
    FROM user_completions uc INNER JOIN user u
    ON uc.user_id = u.id
    WHERE uc.challenge_id = ? AND uc.status = 'completed'`;

    pool.query(sql, [challengeId], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },
};
