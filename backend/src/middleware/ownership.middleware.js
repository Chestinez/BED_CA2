const AppError = require("../../utils/AppError");
const model = require("../models/challengesModel");

//ownership middleware
// this middleware is used to check if the user is the creator of the challenge, by checking creator_id
// where if not certain actions like updating or deleting a challenge is not allowed
module.exports = function ownershipChecker(req, res, next) {
  const userId = parseInt(req.userId);
  const challengeId = req.params.id;
  model.getCreatorByChallengeId(challengeId, (err, results) => {
    if (err) {
      return next(new AppError("Internal Server Error", 500));
    } else if (results.length === 0) {
      return next(new AppError("Challenge not found", 404));
    }

    //check if user is the creator
    // by comparing userId from auth middleware with creator_id from challenges table, using challengeId
    if (results[0].creator_id !== userId) {
      return next(
        new AppError("You are not the creator of this challenge", 403)
      );
    }
    next();
  });
};
