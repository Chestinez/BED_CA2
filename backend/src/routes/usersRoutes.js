const express = require("express");
const router = express.Router();
const controllers = require("../controllers/userController.js");
const auth = require("../middleware/auth.middleware.js"); // import auth middleware
const adminCheck = require("../middleware/admin.middleware.js"); // import admin middleware
const AppError = require("../../utils/AppError.js");
// get requests
router.get(
  "/leaderboard/position/username/:username",
  controllers.getLeaderboardPositionbyUsername,
);
router.get("/leaderboard/position/username/", (req, res, next) => {
  return next(new AppError("Missing required username in URL", 400)); // this endpoint is used for when no required params is left empty
});
router.get(
  "/leaderboard/position",
  auth,
  controllers.getLeaderboardPositionbyId,
);
router.get("/leaderboard", controllers.getLeaderboard);
router.get("/profile/me", auth, controllers.getSelfProfileLog);
router.get("/profile/:username", controllers.getpublicProfileLogbyUsername);
router.get("/profile/", (req, res, next) => {
  return next(new AppError("Missing required username in URL", 400)); // this endpoint is used for when no required params is left empty
});
router.get("/selectAll", auth, adminCheck, controllers.selectAll);
router.post("/login", controllers.login);
router.get("/logout", controllers.logout);
router.get("/refresh", controllers.refresh);
router.get("/selectById/:id", auth, adminCheck, controllers.selectById);
router.get("/selectById/", (req, res, next) => {
  return next(new AppError("Missing required userId in URL", 400)); // this endpoint is used for when no required params is left empty
});
// post requests
router.post("/register", controllers.createUser);
// put requests
router.put("/update", auth, controllers.updateUser);
// delete requests
router.delete("/delete", auth, controllers.deleteUser);

module.exports = router;
