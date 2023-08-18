const AppError = require('../utils/appError');
const Error = require('../models/error.model');

const handleCastError22001 = () =>
  new AppError('the number of characteres is greater than expected', 400);

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const handleCastError22P02 = () => new AppError('Invalid data type in database', 400);

const handleCastError22305 = () => new AppError('Duplicate field value: please use another value', 400);

const sendErrorDev = (err, res,) => {
  Error.create({
    status: err.status,
    message: err.message,
    stack: err.stack,
  })
  console.log(err);
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  console.log(err);
  // Operational,  Error de confianza: enviar mensaje al cliente
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programación u otro error desconocido: no filtre detalles del error
    return res.status(500).json({
      status: 'error',
      message: 'something went very wrong!',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
  if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (err.parent?.code === '22001') error = handleCastError22001();
    if (err.parent?.code === '22P02') error = handleCastError22P02();
    if (err.parent?.code === '23505') error = handleCastError22305();
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
