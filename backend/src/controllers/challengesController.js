const challengeModels = require("../models/challengesModel.js");
const AppError = require("../../utils/AppError.js");

module.exports = {
  selectByCreatorId(req, res, next) {
    // selectByCreatorId
    const userId = req.userId;

    challengeModels.selectByCreatorId(userId, (err, results) => {
      // this model is used to get all challenges created by a user
      if (err) {
        return next(new AppError("Internal Service Error", 500));
      } else if (!results || results.length === 0) {
        return next(new AppError("challenge(s) not found", 404)); // if no results, no challenges found
      }
      return res.status(200).json({ message: "success", results: results }); // return results
    });
  },

  selectAll(_, res, next) {
    // selectAll
    challengeModels.selectAll((err, results) => {
      // select everything from challenge table
      if (err) {
        return next(new AppError("Internal Service Error", 500));
      } else if (!results || results.length === 0) {
        return next(new AppError("challenges not found", 404)); // if no results, no challenges found
      }
      return res.status(200).json({ message: "success", results: results }); // return results
    });
  },
  selectById(req, res, next) {
    // selectById
    const id = req.params.id;

    challengeModels.selectById(id, (err, results) => {
      // select challenge by id
      if (err) {
        return next(new AppError("Internal Service Error", 500));
      } else if (!results || results.length === 0) {
        return next(new AppError("challenge not found", 404)); // if no results, challenge not found
      }
      return res.status(200).json({ message: "success", results: results }); // return results
    });
  },
  createChallenge(req, res, next) {
    // createChallenge
    const {
      title,
      description,
      points_rewarded,
      credits_rewarded,
      duration_days,
    } = req.body; // destructure body
    const creator_id = req.userId;
    if (
      !title ||
      points_rewarded === undefined ||
      credits_rewarded === undefined
    ) {
      return next(new AppError("missing required input", 404));
    }
    const totalValue = points_rewarded + credits_rewarded; // total points and credits
    let difficultyId = 1; // default difficulty
    if (totalValue > 100) {
      // based off total points and credits, difficulty ids are assigned
      difficultyId = 3;
    } else if (totalValue > 50) {
      difficultyId = 2;
    }
    const data = {
      // data with required fields and defaults
      title,
      description: description || null,
      points_rewarded: points_rewarded || 0,
      credits_rewarded: credits_rewarded || 0,
      creator_id,
      difficulty_id: difficultyId,
      duration_days: duration_days || 1,
      is_active: "1",
    };
    challengeModels.createChallenge(difficultyId, data, (err, results) => {
      // create challenge
      if (err) {
        return next(new AppError("Internal Server Error", 503));
      }
      return res.status(201).json({
        message: "new challenge created",
        resultsId: results.results.insertId,
        difficulty: results.difficultyresults, // return results
      });
    });
  },
  updateChallenge(req, res, next) {
    // updateChallenge
    const challengeId = req.params.id;
    const userId = req.userId;
    const {
      title,
      description,
      points_rewarded,
      credits_rewarded,
      duration_days,
      is_active,
    } = req.body; // destructure body

    if (!is_active || !title) {
      return next(new AppError("Missing Required Data", 404)); // check for missing required input
    }

    const totalValue = points_rewarded + credits_rewarded; // total points and credits
    let difficultyId = 1; // default difficulty
    if (totalValue > 100) {
      // based off total points and credits, difficulty ids are assigned
      difficultyId = 3;
    } else if (totalValue > 50) {
      difficultyId = 2;
    }
    const data = {
      // data with required fields and defaults
      title,
      description: description || null,
      points_rewarded: points_rewarded || 0,
      credits_rewarded: credits_rewarded || 0,
      duration_days: duration_days || 1,
      is_active: is_active.toString() || "1", // convert to string as is_active is enum
    };

    challengeModels.updateChallenge(
      // update challenge
      difficultyId,
      userId,
      challengeId,
      data,
      (err, results) => {
        if (err) return next(new AppError("Internal Server Error", 503));
        else if (results.affectedRows === 0) {
          return next(new AppError("challenge not found", 404)); // if no affected results, challenge not found
        }
        return res.status(200).json({
          message: "challenge updated",
          challengeId,
          affectedRows: results.affectedRows,
          difficulty: results.difficultyresults, // return results
        });
      }
    );
  },
  deleteChallenge(req, res, next) {
    // deleteChallenge
    const challengeId = req.params.id;
    const userId = req.userId;

    challengeModels.deleteChallenge(userId, challengeId, (err, results) => {
      if (err) {
        return next(new AppError("Internal Server Error", 503));
      } else if (results.affectedRows === 0) {
        return next(new AppError("challenge not found", 404)); // if no affected results, challenge not found
      }
      return res.status(200).json({ message: "challenge deleted", results }); // return results
    });
  },
  startChallenge(req, res, next) {
    // startChallenge
    const challengeId = req.params.id;
    const userId = req.userId;
    const notes = req.body.notes || null; // notes are optional when starting

    challengeModels.startChallenge(
      userId,
      challengeId,
      notes,
      (err, results) => {
        if (err) {
          return next(new AppError("Error starting challenge", 500));
        } else if (results.status) {
          return res.status(400).json(results);
        }

        return res.status(201).json({
          message: `Challenge ${challengeId} Started!`,
          completionId: results.insertId,
        });
      }
    );
  },
  completeChallenge(req, res, next) {
    // completeChallenge
    const challengeId = req.params.id;
    const notes = req.body.notes;
    const userId = req.userId;

    // Require completion notes
    if (!notes || !notes.trim()) {
      return next(new AppError("Please provide completion notes describing what you accomplished", 400));
    }

    const data = {
      userId,
      challengeId,
      completionNotes: notes.trim(),
    };

    challengeModels.completechallenge(data, (err, results) => {
      if (err) {
        return next(new AppError("Error completing challenge", 500));
      } else if (!results || results.affectedRows === 0) {
        return next(
          new AppError("Challenge already completed or not started", 400)
        );
      }

      res.status(201).json({
        message: `Challenge ${challengeId} Completed!`,
        newTotalPoints: results.newPoints,
        newTotalCredits: results.newCredits,
      });
    });
  },

  getUserwhocompletedChallengeId(req, res, next) {
    // getUserwhocompletedChallengeId
    const challengeId = req.params.id;

    challengeModels.getusersbycompletedchallenge(
      // this model is used to get the users who have completed a challengeId
      challengeId,
      (err, results) => {
        if (err) {
          return next(
            new AppError(
              "Error retrieving completed challenge log and users",
              500
            )
          );
        } else if (!results || results.length === 0) {
          return next(
            new AppError("No completions found for this challenge", 404) // if no results, no completions found
          );
        }

        res.status(200).json(results); // return results
      }
    );
  },
};
