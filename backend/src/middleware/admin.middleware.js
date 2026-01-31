const AppError = require("../../utils/AppError");
const model = require("../models/userModel.js");

//admin middleware
// checks if userId is admin, inorder to use certain endpoints that exposes vulnerable details
// like users and their passwords even if bcrypt is used
module.exports = function ownershipChecker(req, res, next) {
  const userId = req.userId; //get user id

  //model to check if user is admin
  model.getUserRoleviaUserId(userId, (err, results) => {
    if (err) {
      return next(new AppError("Internal Server Error", 500));
    } else if (results.length === 0) {
      return next(new AppError("User not found", 404));
    }
    
    //check if user is admin
    if (results[0].role === 'admin') {
      return next(); // if yes then proceed
    }
    
    //if not admin, error
    return next(new AppError("You are not an admin", 403));
  });
};
