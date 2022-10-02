const express = require('express');
const morgan = require('morgan');
const { restart } = require('nodemon');
const userRoute = require('./src/routes/userRouter');
const CustomErr = require('./src/utils/customErr');
const globalCustomErr = require('./src/controllers/errController');

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Route
app.use('/api/v1/user', userRoute);
app.all('*', (req, res, next) => {
  return next(new CustomErr('Rs not found', 404));
});

// final middleware error
app.use(globalCustomErr);
module.exports = app;
