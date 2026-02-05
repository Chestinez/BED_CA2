const difficultyModel = require("../models/difficultyModel.js");
const AppError = require("../../utils/AppError.js");

module.exports = {
  getAllDifficulties(req, res, next) {
    difficultyModel.getAllDifficulties((err, results) => {
      if (err) {
        return next(new AppError("Internal Server Error", 500));
      }
      return res.status(200).json({ 
        message: "success", 
        results: results 
      });
    });
  },

  getDifficultyById(req, res, next) {
    const difficultyId = req.params.id;
    
    difficultyModel.getDifficultyById(difficultyId, (err, results) => {
      if (err) {
        return next(new AppError("Internal Server Error", 500));
      }
      if (!results || results.length === 0) {
        return next(new AppError("Difficulty not found", 404));
      }
      return res.status(200).json({ 
        message: "success", 
        results: results[0] 
      });
    });
  }
};