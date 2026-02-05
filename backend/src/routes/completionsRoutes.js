const express = require("express");
const router = express.Router();
const controllers = require("../controllers/completionsController.js");
const auth = require("../middleware/auth.middleware.js"); // import auth middleware
const AppError = require("../../utils/AppError.js");

router.get("/missions", auth, controllers.getMissionsLog);
router.get("/pending", auth, controllers.getPendingMissions);
router.get("/users/:id", controllers.getUsersWhoDidChallengeId);
router.get("/users/", (req, res, next) => {
  return next(new AppError("Missing required challengeId in URL", 400)); // this endpoint is used for when no required params is left empty
});
module.exports = router;
