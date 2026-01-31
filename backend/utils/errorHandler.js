//global error handler
module.exports = function errHandler(err, req, res, next) {
  console.error(`Global Error Handling: ${err}`); // logs error if error is triggered
  let message;
  if (err.isOperational) { // isOperational is set to true in AppError, hence if AppError isnt thrown then this will not run
    message = err.message;
  } else {
    message =
      "Something besides your backend connectivity is wrong(check syntax errors etc...)"; // default err message, if not operational
  }

  res.status(err.statusCode).json({ // this is the error response, compiled with data from AppError
    statusCode: err.statusCode,
    status: err.status,
    message,
  });
};
