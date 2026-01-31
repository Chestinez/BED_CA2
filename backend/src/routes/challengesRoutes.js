const express = require("express");
const router = express.Router();
const controllers = require("../controllers/challengesController.js");
const auth = require("../middleware/auth.middleware.js"); // import auth middleware
const ownership = require("../middleware/ownership.middleware.js"); // import ownership middleware
const isActive = require("../middleware/isActive.middleware.js"); // import isActive middleware
const AppError = require("../../utils/AppError.js");

// since alot of /challenges endpoints require challenge id params in the url, a function is created
// to be reused for each params error check endpoint
const MissingChallengeIdError = (req, res, next) => {
  return next(new AppError("Missing required challengeId in URL", 400)); // this endpoint is used for when no required params is left empty 
}

// get requests
router.get("/selectAll", controllers.selectAll);
router.get("/selectById/:id", controllers.selectById);
router.get("/selectById/", MissingChallengeIdError);
router.get("/:id/users", controllers.getUserwhocompletedChallengeId);
router.get("/users", MissingChallengeIdError);
router.get("/selectAllByCreatorId", auth, controllers.selectByCreatorId);
//post requests
router.post("/create", auth, controllers.createChallenge);
router.post("/:id/start", auth, isActive, controllers.startChallenge);
router.post("/start", MissingChallengeIdError);
router.post("/:id/complete", auth, isActive, controllers.completeChallenge);
router.post("/complete", MissingChallengeIdError);
//put requests
router.put("/update/:id", auth, ownership, controllers.updateChallenge);
router.put("/update/", MissingChallengeIdError);
//delete requests
router.delete("/delete/:id", auth, ownership, controllers.deleteChallenge);
router.delete("/delete/", MissingChallengeIdError);
module.exports = router;
