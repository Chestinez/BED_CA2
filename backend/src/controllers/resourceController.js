const resourceModel = require("../models/resourceModel.js");
const AppError = require("../../utils/AppError.js");

module.exports = {
  getallpartsinshop(req, res, next) {
    // get all parts in shop
    const userId = req.userId;

    resourceModel.getallshopitems(userId, (err, results) => {
      // get all parts in ship_parts table
      if (err) {
        return next(new AppError("Internal Server Error", 500));
      }

      const ownedparts = results.filter((part) => part.inventory_id !== null); // seperates owned and unowned parts
      const unownedparts = results.filter((part) => part.inventory_id === null);

      res.status(200).json({
        results: {
          owned: ownedparts,
          unowned: unownedparts,
        }, // return results
      });
    });
  },
  purchasePart(req, res, next) {
    // purchase part
    const userId = req.userId;
    const partId = parseInt(req.params.partId); // Convert to integer

    const data = { userId, partId };
    resourceModel.purchasePart(data, (err, results) => {
      if (
        (err && err.message === "Insufficient credits") || // error messages, where on certain conditions within the model transaction fails
        (err && err.message === "Part not found") ||
        (err && err.message === "Part already owned")
      ) {
        return next(new AppError(err.message, 400));
      } else if (err) {
        return next(new AppError("Internal Server Error", 500));
      }
      res.status(201).json({
        message: "Part purchased successfully", // return results
        results,
      });
    });
  },
  getAllPartsOwnedbyUser(req, res, next) {
    // get all parts owned by user
    const userId = req.userId;
    resourceModel.getAllPartsOwnedbyUser(userId, (err, results) => {
      if (err) {
        return next(new AppError("Internal Server Error", 500));
      }
      res.status(200).json({
        results: results, // return results
      });
    });
  },
  getAllPartsequipped(req, res, next) {
    // get all parts equipped within inventory
    const userId = req.userId;
    resourceModel.getAllequippedParts(userId, (err, results) => {
      if (err) {
        return next(new AppError("Internal Server Error", 500));
      }
      res.status(200).json({
        results: results, // return results
      });
    });
  },
  equipPart(req, res, next) {
    // equip part
    const userId = req.userId;
    const partId = req.params.partId;

    const data = { userId, partId };
    resourceModel.equipPart(data, (err, results) => {
      if (err) {
        return next(
          new AppError(err.message, 400) || // error messages, to return err 400 for when a model transaction fails and sends a new Error
            new AppError("Internal Server Error", 500),
        );
      }

      return res.status(200).json({
        message: "Part equipped successfully",
        results, // return results
      });
    });
  },
  removePart(req, res, next) {
    // remove part
    const userId = req.userId;
    const inventoryId = req.params.inventoryId;

    resourceModel.removepart({ userId, inventoryId }, (err, results) => {
      if (err) {
        return next(new AppError("Internal Server Error", 500)); // error messages, depending on what result from model is returned
      } else if (results.affectedRows === 0) {
        return next(new AppError("Part not found", 404));
      } else if (results.changedRows === 0) {
        return next(new AppError("Part already unequipped", 400));
      }
      res.status(200).json({
        message: "Part removed successfully", // return results
        results,
      });
    });
  },

  // getUserShip
  // get user's ship based on rank with equipped parts info
  getUserShip(req, res, next) {
    const userId = req.userId;

    resourceModel.getUserShipByRank(userId, (err, results) => {
      if (err) {
        return next(new AppError("Failed to get user ship", 500));
      }

      res.status(200).json({
        message: "User ship retrieved successfully",
        results: results,
      });
    });
  },
};
