const AppError = require("../../utils/AppError");
const jwt = require("jsonwebtoken");
const model = require("../models/userModel");

module.exports = function (req, res, next) {
  // 1. Correctly target the ACCESS token
  const accessToken = req.cookies.accessToken;

  // 2. If no token, send 401 so the frontend interceptor knows to try /refresh
  if (!accessToken) {
    return next(new AppError("Access token missing", 401));
  }

  // 3. Verify the token
  jwt.verify(accessToken, process.env.ACCESS_SECRET, (err, decoded) => {
    if (err) {
      // If expired or invalid, send 401 to trigger the refresh loop!
      return next(new AppError("Access token expired or invalid", 401));
    }

    // 4. DB Check
    model.authIdCheck(decoded.id, (err, results) => {
      if (err) return next(new AppError("Internal Server Error", 500));

      if (!results || results.length === 0) {
        return next(new AppError("User no longer exists", 401));
      }

      // Attach user to the request so routes can use it (e.g., req.user.id)
      req.user = results[0];
      req.userId = results[0].id; // Also set userId for backward compatibility
      return next();
    });
  });
};
