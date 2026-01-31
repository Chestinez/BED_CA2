const express = require("express");
const router = express.Router();

// routes imported
const users = require("./usersRoutes");
const challenges = require("./challengesRoutes");
const completions = require("./completionsRoutes");
const resources = require("./resourceRoutes");

// main routes
router.use("/users", users);
router.use("/challenges", challenges);
router.use("/completions", completions);
router.use("/resources", resources);

module.exports = router;
