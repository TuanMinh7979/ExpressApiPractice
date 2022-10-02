// npm run start:prod

const CustomErr = require('../utils/customErr');

// final middleware error
const hdlCastDBError = error => {
  const message = `Invalid ${error.path}: ${error.value} `;
  return new CustomErr(message, 400);
};
const hdlDuplicateDBError = error => {
  const message = `Duplicate field: ${JSON.stringify(error.keyValue)}`;
  return new CustomErr(message, 400);
};
const hdlValidationDBDError = error => {
  const allFailedFieldMes = Object.values(error.errors).map(el => el.message);

  const message = `Invalid input data. ${allFailedFieldMes.join(', ')}`;
  return new CustomErr(message, 400);
};

const sendErrProd = (err, res) => {
  if (err.isOperational) {

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something wrong'
    });
  }
};

const sendErrDev = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      errors: err
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something wrong',
      stack: err.stack,
      errors: err
    });
  }
};

module.exports = (err, req, res, next) => {


  // eslint-disable-next-line no-param-reassign
  // if (!err.statusCode) err.statusCode = 500;
  // // eslint-disable-next-line no-param-reassign
  // if (!err.status) err.status = 'error';

  if (process.env.NODE_ENV.trim() === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV.trim() === 'prod') {
    let error = { ...err, name: err.name };


    if (error.name === 'CastError') {
      error = hdlCastDBError(error);
    }
    if (error.code && error.code === 11000) error = hdlDuplicateDBError(error);

    if (error.name === 'ValidationError') error = hdlValidationDBDError(error);
    sendErrProd(error, res);
  }
};
