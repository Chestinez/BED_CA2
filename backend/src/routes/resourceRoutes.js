const express = require("express");
const router = express.Router();
const controllers = require("../controllers/resourceController.js");
const auth = require("../middleware/auth.middleware.js"); // import auth middleware
const AppError = require("../../utils/AppError.js");

// get requests
router.get("/shop", auth, controllers.getallpartsinshop);
router.get("/inventory/equipped", auth, controllers.getAllPartsequipped);
router.get("/inventory", auth, controllers.getAllPartsOwnedbyUser);
router.get("/partTypes", controllers.getAllPartTypes);
// put requests
router.put("/equip/:partId", auth, controllers.equipPart);
router.put("/equip/", (req, res, next) => {
  return next(new AppError("Missing required partId in URL", 400)); // this endpoint is used for when no required params is left empty 
});
router.put("/unequip/:inventoryId", auth, controllers.removePart);
router.put("/unequip/", (req, res, next) => {
  return next(new AppError("Missing required inventoryId in URL", 400)); // this endpoint is used for when no required params is left empty 
});

// post requests
router.post("/purchase/:partId", auth, controllers.purchasePart);
router.post("/purchase/", (req, res, next) => {
  return next(new AppError("Missing required partId in URL", 400)); // this endpoint is used for when no required params is left empty 
})

// get user's ship based on rank
router.get("/ship", auth, controllers.getUserShip);

module.exports = router;
