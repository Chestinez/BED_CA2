const completionsModel = require("../models/completionsModel.js");
const AppError = require("../../utils/AppError.js");

module.exports = {
  getMissionsLog(req, res, next) {
    // getMissionsLog
    const userId = req.userId;

    completionsModel.getUserMissions(userId, (err, results) => {
      // this model is used to get all challenges attempted by a user
      if (err) return next(new AppError("Internal Server Error", 500));

      res.status(200).json({
        userId: userId,
        missions: results,
        missionCount: results.length, // return results
      });
    });
  },
  getUsersWhoDidChallengeId(req, res, next) {
    // getUsersWhoDidChallengeId
    const challengeId = req.params.id;

    completionsModel.getMissionUserAttemptedLog(challengeId, (err, results) => {
      // this model is used to get all users who have attempted a challenge
      if (err) return next(new AppError("Internal Server Error", 500));
      if (results.length === 0)
        return next(new AppError("No users completed this challenge", 404)); // if no results, user not found
      res.status(200).json(results); // return results
    });
  },

  getPendingMissions(req, res, next) {
    // getPendingMissions
    const userId = req.userId;

    completionsModel.getUserPendingMissions(userId, (err, results) => {
      // this model is used to get all pending challenges for a user
      if (err) return next(new AppError("Internal Server Error", 500));

      res.status(200).json({
        userId: userId,
        results: results,
        count: results.length,
      });
    });
  },
};
