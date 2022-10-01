class CustomErr extends Error {
  constructor(message, statusCode) {
    // class use for operatino err(we can predict and catch like checked exception in java and must catch)

    super(message);
    this.statusCode = statusCode;

    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomErr;
