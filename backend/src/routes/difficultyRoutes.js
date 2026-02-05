const express = require("express");
const router = express.Router();
const controllers = require("../controllers/difficultyController.js");

// GET routes
router.get("/", controllers.getAllDifficulties);
router.get("/:id", controllers.getDifficultyById);

module.exports = router;