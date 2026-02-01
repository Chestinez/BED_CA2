const bcrypt = require("bcrypt"); // bcrypt to encrypt passwords and increase security
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel.js");
const AppError = require("../../utils/AppError.js");

module.exports = {
  login(req, res, next) {
    // login
    const { username, email, password } = req.body; // destructuring req.body
    if (!username || !email || !password) {
      return next(new AppError("missing required input", 404)); // check for missing required input
    }

    userModel.getpasswordviaemail(username, email, (err, results) => {
      if (err) {
        return next(new AppError("Internal Server Error", 500));
      }
      if (!results || results.length === 0) {
        return next(new AppError("user not found", 404)); // when no results, user not found
      }
      // obtained password from db using username and email
      const passwordviaemail = results[0].password;

      bcrypt.compare(password, passwordviaemail, (err, isMatch) => {
        // comparing whether both inputed password and stored hashed password match
        if (err) {
          return next(new AppError("Internal Server Error, Bcrypt", 500));
        }
        if (isMatch) {
          const userId = results[0].id;
          const user = {
            id: userId,
            username: results[0].username,
            role: results[0].role,
          }; // creating user object to be used in jwt token
          const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET, {
            expiresIn: process.env.REFRESH_LIFETIME,
          }); // creating jwt token
          const accessToken = jwt.sign(user, process.env.ACCESS_SECRET, {
            expiresIn: process.env.ACCESS_LIFETIME,
          }); // creating jwt token

          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
          });

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          return res.status(200).json({
            message: "login successful, here is your user-Id", // if match return user id
            user,
          });
        } else {
          return next(new AppError("Invalid password", 401));
        }
      });
    });
  },
  refresh(req, res, next) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return next(
        new AppError(
          "Refresh Token not found, please re-login or re-register",
          403,
        ),
      );
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err)
        return next(new AppError("Invalid Token, verfication failed", 403));
      const user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      };
      const accessToken = jwt.sign(user, process.env.ACCESS_SECRET, {
        expiresIn: process.env.ACCESS_LIFETIME,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });

      res.status(200).json({
        message: "refresh successful",
        user,
      });
    });
  },

  selectAll(_, res, next) {
    // selectAll
    userModel.selectAll((err, results) => {
      // select everything from user table
      if (err) {
        return next(new AppError("Internal Server Error", 500));
      }
      return res.status(200).json({ message: "success", results: results }); // return results
    });
  },
  selectById(req, res, next) {
    // selectById
    const selectingid = req.params.id; // obtaining user id from params(user id to select)

    userModel.selectById(selectingid, (err, results) => {
      // select user by id
      if (err) {
        return next(new AppError("Internal Server Error", 500));
      } else if (!results || results.length === 0) {
        return next(new AppError("user not found", 404)); // if no results, user not found
      }
      return res.status(200).json({ message: "success", results: results }); // return results
    });
  },
  getpublicProfileLogbyUsername(req, res, next) {
    // getpublicProfileLogbyUsername
    const username = req.params.username; // obtaining username from params

    userModel.getpublicProfileLogbyUsername(username, (err, results) => {
      // select public valid user data by username
      if (err) {
        return next(new AppError("Internal Server Error", 500));
      } else if (!results || results.length === 0) {
        return next(new AppError("user not found", 404)); // if no results, user not found
      }
      return res.status(200).json({ message: "success", results }); // return results
    });
  },

  getSelfProfileLog(req, res, next) {
    // getSelfProfileLog
    const userId = req.userId; // obtaining user id from auth middleware

    userModel.getProfilerankinclusiveByUserId(userId, (err, results) => {
      // select public valid user data by user id
      if (err) {
        return next(new AppError("Internal Server Error", 500));
      }
      return res.status(200).json({ message: "success", results }); // return results
    });
  },
  createUser(req, res, next) {
    // create user
    const { username, password, email } = req.body;
    const description = req.body.description || null;
    if (!username || !password || !email) {
      return next(new AppError("Missing Required Fields", 404)); // check for missing required input
    }

    bcrypt.hash(password, 10, (err, hash) => {
      // bcrypt to encrypt password and increase security
      if (err) {
        return next(new AppError("Internal Server Error, Bcrypt", 500));
      }
      const password_hash = hash;
      const data = { username, password: password_hash, email, description }; // replacing password with hashed password
      userModel.createUser(data, (err, results) => {
        if (err) {
          return next(new AppError("Internal Server Error", 500));
        }
        const user = { id: results.insertId, username, email, role: "user" };
        const accessToken = jwt.sign(user, process.env.ACCESS_SECRET, {
          expiresIn: "15m",
        });
        const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET, {
          expiresIn: "7d",
        });

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 15 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({ message: "new user created", user }); // return results
      });
    });
  },
  updateUser(req, res, next) {
    // update user
    const userId = req.userId;
    if (!req.body) {
      return next(new AppError("No data fields to update", 400));
    } else if (req.body.points || req.body.credits) {
      // cannot update points or credits
      return next(new AppError("Cannot update points or credits", 400));
    }

    updateFunction = (data) => {
      // update function, since there are 2 instances where the same update model is called, when there is password to encrypt and when there isnt
      userModel.updateUser(userId, data, (err, results) => {
        if (err) {
          return next(new AppError("Internal Server Error", 500));
        } else if (results.affectedRows === 0) {
          return next(new AppError("user not found", 404));
        } else {
          return res.status(200).json({ message: "user updated" }); // return results
        }
      });
    };

    if (req.body.password) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        // bcrypt to encrypt password and increase security
        if (err) {
          return next(new AppError("Internal Server Error, Bcrypt", 500));
        }
        req.body.password = hash;
        updateFunction(req.body);
      });
    } else {
      updateFunction(req.body);
    }
  },
  deleteUser(req, res, next) {
    // delete user
    const userId = req.userId;

    userModel.deleteUser(userId, (err, results) => {
      if (err) return next(new AppError("Internal Server Error", 500));
      else if (results.affectedRows === 0) {
        return next(new AppError("user not found", 404)); // if no results, user not found
      }
      return res.status(200).json({ message: "user deleted", results }); // return results
    });
  },

  getLeaderboard(req, res, next) {
    // get leaderboard
    if (!req.query) {
      req.query = {}; // if no body, set body to empty
    }

    let filterCount = req.query.filterCount; //filterCount to filter how many users the leaderboard will show starting from highest points

    if (!filterCount || isNaN(filterCount) || filterCount <= 0) {
      filterCount = 10;
    }
    // this model shows leaderboard where points are counted first, if there is an instance where points are the same, then credits are counted
    userModel.getleaderboard(filterCount, (err, results) => {
      if (err) {
        return next(new AppError("Internal Server Error", 500));
      }

      res.status(200).json({
        status: "success", results: results, // return results
      });
    });
  },

  getLeaderboardPositionbyId(req, res, next) {
    // get leaderboard by user id
    const userId = req.userId;
    // this model is used to get the leaderboard position of a user by userid
    userModel.getleaderboardPositionbyId(userId, (err, results) => {
      if (err) {
        return next(new AppError("Internal Server Error", 500));
      }
      res.status(200).json({
        position: results[0].position, // return results
      });
    });
  },
  getLeaderboardPositionbyUsername(req, res, next) {
    // get leaderboard by username
    const username = req.params.username;
    // this model is used to get the leaderboard position of a user by username
    userModel.getLeaderboardPositionbyUsername(username, (err, results) => {
      if (err) {
        return next(new AppError("Internal Server Error", 500));
      } else if (!results || results.length === 0) {
        return next(new AppError("user not found", 404));
      }
      return res.status(200).json({ message: "success", results }); // return results
    });
  },

  logout(req, res, next) {
    // logout - clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "logout successful" });
  },
};
