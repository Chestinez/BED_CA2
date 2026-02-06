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
    // createChallenge - COMPREHENSIVE validation for new challenges
    const {
      title,
      description,
      points_rewarded,
      credits_rewarded,
      duration_days,
      difficulty_id,
      is_active,
    } = req.body; // destructure body
    const creator_id = req.userId;

    if (
      !title ||
      points_rewarded === undefined ||
      credits_rewarded === undefined ||
      !difficulty_id
    ) {
      return next(new AppError("missing required input", 400));
    }

    const points = parseInt(points_rewarded) || 0;
    const credits = parseInt(credits_rewarded) || 0;
    const totalValue = points + credits;

    // Validation 1: Individual limits (existing logic)
    if (points >= 90) {
      return next(new AppError("Points cannot exceed 90", 400));
    }
    if (credits >= 60) {
      return next(new AppError("Credits cannot exceed 60", 400));
    }
    if (duration_days < 1) {
      return next(new AppError("Duration must be at least 1 day", 400));
    } else if (duration_days > 365) {
      return next(new AppError("Duration cannot exceed a year", 400));
    }

    // Validation 2: Difficulty requirements
    let minRequired = 0;
    let maxAllowed = Infinity;
    let difficultyName = "Unknown";

    if (difficulty_id == 1) {
      // Easy
      minRequired = 0;
      maxAllowed = 50;
      difficultyName = "Easy";
    } else if (difficulty_id == 2) {
      // Medium
      minRequired = 51;
      maxAllowed = 100;
      difficultyName = "Medium";
    } else if (difficulty_id == 3) {
      // Hard
      minRequired = 101;
      maxAllowed = 200; // No upper limit for Hard
      difficultyName = "Hard";
    }

    if (totalValue < minRequired) {
      return next(
        new AppError(
          `${difficultyName} difficulty requires a minimum of ${minRequired} total points + credits. Current total: ${totalValue}`,
          400,
        ),
      );
    }

    if (totalValue > maxAllowed) {
      return next(
        new AppError(
          `${difficultyName} difficulty allows a maximum of ${maxAllowed} total points + credits. Current total: ${totalValue}. Consider using a higher difficulty.`,
          400,
        ),
      );
    }

    const data = {
      // data with required fields and defaults
      title,
      description: description || null,
      points_rewarded: points,
      credits_rewarded: credits,
      creator_id,
      difficulty_id: difficulty_id,
      duration_days: duration_days || 1,
      is_active: is_active || "1",
    };

    challengeModels.createChallenge(difficulty_id, data, (err, results) => {
      // create challenge
      if (err) {
        return next(new AppError(err.message || "Internal Server Error", 500));
      }

      // Safely access insertId
      const insertId =
        results && results.results && results.results.insertId
          ? results.results.insertId
          : null;

      return res.status(201).json({
        message: "new challenge created",
        resultsId: insertId,
        difficulty: results.difficultyresults,
      });
    });
  },
  updateChallenge(req, res, next) {
    // updateChallenge - FLEXIBLE validation for editing existing challenges
    const challengeId = req.params.id;
    const userId = req.userId;
    const {
      title,
      description,
      points_rewarded,
      credits_rewarded,
      duration_days,
      difficulty_id,
      is_active,
    } = req.body; // destructure body

    if (!is_active || !title || !difficulty_id) {
      return next(new AppError("Missing Required Data", 400)); // check for missing required input
    }

    // FLEXIBLE validation for editing - allow existing challenges to be updated
    // even if they don't meet current difficulty requirements

    const points = parseInt(points_rewarded) || 0;
    const credits = parseInt(credits_rewarded) || 0;
    const totalValue = points + credits;

    // Only check individual limits for editing (more flexible)
    if (points >= 90) {
      return next(new AppError("Points cannot exceed 90", 400));
    }
    if (credits >= 60) {
      return next(new AppError("Credits cannot exceed 60", 400));
    }
    if (duration_days < 1) {
      return next(new AppError("Duration must be at least 1 day", 400));
    } else if (duration_days > 365) {
      return next(new AppError("Duration cannot exceed a year", 400));
    }

    // Check difficulty maximum limits (but allow flexibility)
    let maxAllowed = Infinity;
    if (difficulty_id == 1) {
      // Easy
      maxAllowed = 50;
    } else if (difficulty_id == 2) {
      // Medium
      maxAllowed = 100;
    } else if (difficulty_id == 3) {
      // Hard
      maxAllowed = Infinity; // No upper limit for Hard
    }

    if (totalValue > maxAllowed) {
      return next(
        new AppError(
          `Total rewards (${totalValue}) exceed the maximum allowed for this difficulty (${maxAllowed}). Consider using a higher difficulty.`,
          400,
        ),
      );
    }

    const data = {
      // data with required fields and defaults
      title,
      description: description || null,
      points_rewarded: points,
      credits_rewarded: credits,
      duration_days: duration_days || 1,
      difficulty_id: difficulty_id, // Use the difficulty_id from frontend
      is_active: is_active.toString() || "1", // convert to string as is_active is enum
    };

    challengeModels.updateChallenge(
      // update challenge
      difficulty_id, // Use the difficulty_id from frontend
      userId,
      challengeId,
      data,
      (err, results) => {
        if (err) {
          return next(
            new AppError(err.message || "Internal Server Error", 500),
          );
        }

        // Safely access affectedRows
        const affectedRows =
          results &&
          results.results &&
          results.results.affectedRows !== undefined
            ? results.results.affectedRows
            : 0;

        if (affectedRows === 0) {
          return next(new AppError("challenge not found", 404)); // if no affected results, challenge not found
        }

        return res.status(200).json({
          message: "challenge updated",
          challengeId,
          affectedRows: affectedRows,
          difficulty: results.difficultyresults, // return results
        });
      },
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

        // Safely access insertId
        const insertId = results && results.insertId ? results.insertId : null;

        return res.status(201).json({
          message: `Challenge ${challengeId} Started!`,
          completionId: insertId,
        });
      },
    );
  },
  completeChallenge(req, res, next) {
    // completeChallenge
    const challengeId = req.params.id;
    const notes = req.body.notes;
    const userId = req.userId;

    // Require completion notes
    if (!notes || !notes.trim()) {
      return next(
        new AppError(
          "Please provide completion notes describing what you accomplished",
          400,
        ),
      );
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
          new AppError("Challenge already completed or not started", 400),
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
              500,
            ),
          );
        } else if (!results || results.length === 0) {
          return next(
            new AppError("No completions found for this challenge", 404), // if no results, no completions found
          );
        }

        res.status(200).json(results); // return results
      },
    );
  },

  abandonChallenge(req, res, next) {
    // abandonChallenge - Cancel/abandon a pending challenge
    const challengeId = req.params.id;
    const userId = req.userId;

    challengeModels.abandonChallenge(userId, challengeId, (err, results) => {
      if (err) {
        return next(new AppError("Error abandoning challenge", 500));
      } else if (results.affectedRows === 0) {
        return next(new AppError("No pending challenge found to abandon", 404));
      }

      res.status(200).json({
        message: `Challenge ${challengeId} abandoned successfully`,
      });
    });
  },
};
