

// final middleware error
module.exports=((err, req, res, next) => {
  console.log(err.stack);
  const errCp = { ...err };
  if (!errCp.statusCode) errCp.statusCode = 500;
  if (!errCp.status) errCp.status = 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});
