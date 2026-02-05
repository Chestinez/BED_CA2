//global error handler
module.exports = function errHandler(err, req, res, next) {
  console.error(`Global Error Handling: ${err}`); // logs error if error is triggered
  
  let message;
  let statusCode;
  let status;
  
  // Handle AppError instances (operational errors)
  if (err.isOperational) {
    statusCode = err.statusCode || 500;
    status = err.status || "error";
    message = err.message;
  } else {
    // Handle other errors (programming errors, database errors, etc.)
    statusCode = 500;
    status = "error";
    message = err.message || "Something besides your backend connectivity is wrong(check syntax errors etc...)";
  }

  // Ensure statusCode is a valid number
  if (typeof statusCode !== 'number' || statusCode < 100 || statusCode > 599) {
    statusCode = 500;
  }

  res.status(statusCode).json({ // this is the error response, compiled with data from AppError
    statusCode: statusCode,
    status: status,
    message,
  });
};
