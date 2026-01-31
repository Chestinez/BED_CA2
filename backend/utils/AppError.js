// used for custom Errors like throw new AppError('no', 404) for better error handling and reusability
class AppError extends Error { //error class OOP, extending from the Error class (new Error())
  constructor(message, statusCode) {
    super(message); // call parent constructor
    this.statusCode = statusCode; // status code
    this.status = this.statuscodeDelegation(statusCode); // status from statusDelegation function, which is either fail, error or unknown depending on statuscode
    this.isOperational = true; // isOperational is set to true in AppError, hence if AppError isnt thrown then this will not run

    Error.captureStackTrace(this, this.constructor);// stack trace is basically the list of functions called before the error
    // this basically captures that history of functions
  }

  statuscodeDelegation(code) {
    if (String(code).startsWith("4")) {
      return "fail";
    } else if (String(code).startsWith("5")) {
      return "error";
    } else {
      return "unknown-status";
    }
  }
}

module.exports = AppError;
