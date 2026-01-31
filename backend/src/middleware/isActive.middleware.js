const AppError = require("../../utils/AppError");
const model = require("../models/challengesModel");

//isActive middleware
// this middleware is used to check if the challenge is active
// where if not certain actions like starting a challenge is not allowed
module.exports = function (req, res, next) {
  const challengeId = req.params.id;

  model.activeCheck(challengeId, (err, results) => {
    if (err) {
      return next(new AppError("Internal Server Error", 500));
    }
    if (!results || results.length === 0) {
      return next(new AppError("User not found", 404));
    }
    //check if challenge is is_active enum value is '1' or not
    // which is why we use .toString() 
    if ((results[0].is_active).toString() !== '1') {
      return next(new AppError("Challenge is not active", 404));
    }
    return next();
  });
};
